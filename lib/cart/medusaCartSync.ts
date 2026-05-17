import type { CartProduct, Product } from "@/context/store";
import { useStore } from "@/context/store";
import { medusaApi } from "@/lib/api";
import { assertMedusaApiConfigured } from "@/lib/api/client";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import {
  CART_ID_METADATA_KEY,
  MedusaCustomer,
} from "@/lib/api/types/medusa";
import {
  clearStoredCartId,
  getStoredAuthToken,
  getStoredCartId,
  setStoredCartId,
} from "@/lib/auth/storage";
import { getMedusaListingStoreContext } from "@/lib/catalog/medusaListingByLocation";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import {
  fetchRentiqoStoreProductByIdOrHandle,
  resolveDefaultMedusaVariantId,
} from "@/lib/catalog/rentiqoStoreCatalog";
import {
  mapMedusaCartToCartProducts,
  resolveCartTotal,
} from "@/lib/cart/mapMedusaCart";
import type { MedusaCart } from "@/lib/api/types/medusa";

function applyCartToStore(cartProducts: CartProduct[], totalPrice: number): void {
  useStore.setState({ cartProducts, totalPrice });
}

export function clearLocalCart(): void {
  clearStoredCartId();
  applyCartToStore([], 0);
}

function getCartIdFromCustomer(customer: MedusaCustomer): string | null {
  const raw = customer.metadata?.[CART_ID_METADATA_KEY];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

async function persistCartIdToCustomer(cartId: string): Promise<void> {
  if (!hasMedusaApiBaseUrl || !getStoredAuthToken()) return;

  try {
    const { customer } = await medusaApi.customers.retrieve();
    const metadata = {
      ...(customer.metadata ?? {}),
      [CART_ID_METADATA_KEY]: cartId,
    };
    await medusaApi.customers.update({ metadata });
  } catch (error) {
    console.error("Failed to persist cart id to customer:", error);
  }
}

async function applyCartResponse(cart: MedusaCart): Promise<void> {
  setStoredCartId(cart.id);
  const cartProducts = mapMedusaCartToCartProducts(cart);
  applyCartToStore(cartProducts, resolveCartTotal(cart, cartProducts));
  await persistCartIdToCustomer(cart.id);
}

/** Line-item mutations often omit expanded `items`; always re-fetch before updating UI. */
async function reloadCartFromServer(
  cartId: string,
  customer: MedusaCustomer | null = null,
): Promise<void> {
  const cart = await fetchCartIfAccessible(cartId, customer);
  if (cart) {
    await applyCartResponse(cart);
  }
}

async function createCustomerCart(location: LocationSlug): Promise<string> {
  assertMedusaApiConfigured();
  const { regionId, salesChannelId } = getMedusaListingStoreContext(location);
  const { cart } = await medusaApi.carts.create({
    region_id: regionId,
    sales_channel_id: salesChannelId,
  });
  setStoredCartId(cart.id);
  const cartProducts = mapMedusaCartToCartProducts(cart);
  applyCartToStore(cartProducts, resolveCartTotal(cart, cartProducts));
  await persistCartIdToCustomer(cart.id);
  await linkCartToCustomerIfNeeded(cart.id);
  return cart.id;
}

function cartLineCount(cart: MedusaCart): number {
  return (cart.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

async function fetchCartIfAccessible(
  cartId: string,
  customer: MedusaCustomer | null,
): Promise<MedusaCart | null> {
  try {
    const { cart } = await medusaApi.carts.retrieve(cartId);

    if (
      customer?.id &&
      cart.customer_id &&
      cart.customer_id !== customer.id
    ) {
      return null;
    }

    return cart;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

async function retrieveAndApplyCart(
  cartId: string,
  customer: MedusaCustomer | null,
): Promise<boolean> {
  const cart = await fetchCartIfAccessible(cartId, customer);
  if (!cart) return false;
  await applyCartResponse(cart);
  return true;
}

/** Link guest cart to the logged-in customer (cross-device via customer metadata). */
async function linkCartToCustomerIfNeeded(cartId: string): Promise<void> {
  if (!getStoredAuthToken()) return;

  try {
    await medusaApi.carts.transferToCustomer(cartId);
  } catch (error) {
    console.error("Failed to link cart to customer:", error);
  }

  const { customer } = await medusaApi.customers.retrieve();
  await reloadCartFromServer(cartId, customer);
}

async function resolveBestCustomerCart(
  customer: MedusaCustomer,
): Promise<MedusaCart | null> {
  const metadataCartId = getCartIdFromCustomer(customer);
  const localCartId = getStoredCartId();
  const candidateIds = [...new Set([localCartId, metadataCartId].filter(Boolean))] as string[];

  let best: MedusaCart | null = null;

  for (const cartId of candidateIds) {
    const cart = await fetchCartIfAccessible(cartId, customer);
    if (!cart) continue;
    if (!best || cartLineCount(cart) > cartLineCount(best)) {
      best = cart;
    }
  }

  return best;
}

export type LoadCartOptions = {
  /** Guest cart id to merge when logging in (same browser, was not logged in). */
  guestCartId?: string | null;
};

/**
 * Load cart for the current session.
 * - Logged in: customer metadata `active_cart_id` is source of truth (not another account's localStorage).
 * - Guest: uses local `rentiqo_cart_id` only.
 */
export async function loadCartForCustomer(
  customer: MedusaCustomer | null,
  options?: LoadCartOptions,
): Promise<void> {
  if (!hasMedusaApiBaseUrl) return;

  const location = useStore.getState().selectedLocation;
  const isAuthenticated = Boolean(customer?.id && getStoredAuthToken());

  if (!isAuthenticated) {
    await refreshCartFromMedusa();
    return;
  }

  if (options?.guestCartId) {
    setStoredCartId(options.guestCartId);
    try {
      const { cart } = await medusaApi.carts.transferToCustomer(options.guestCartId);
      await applyCartResponse(cart);
      return;
    } catch (error) {
      console.error("Guest cart transfer failed:", error);
      clearStoredCartId();
    }
  }

  const bestCart = await resolveBestCustomerCart(customer!);
  if (bestCart) {
    await applyCartResponse(bestCart);
    await linkCartToCustomerIfNeeded(bestCart.id);
    return;
  }

  clearStoredCartId();
  applyCartToStore([], 0);
}

/** Guest sessions: refresh from local cart id only. */
function waitForStoreHydration(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    if (useStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

/** Reload cart from Medusa after navigation or hard refresh (guest or logged-in). */
export async function syncCartFromMedusaSession(): Promise<void> {
  if (!hasMedusaApiBaseUrl) return;

  await waitForStoreHydration();

  const token = getStoredAuthToken();
  if (token) {
    try {
      const { customer } = await medusaApi.customers.retrieve();
      await loadCartForCustomer(customer);
      return;
    } catch (error) {
      console.error("Failed to sync cart for customer:", error);
    }
  }

  await refreshCartFromMedusa();
}

export async function refreshCartFromMedusa(): Promise<void> {
  if (!hasMedusaApiBaseUrl) return;
  if (getStoredAuthToken()) return;

  const cartId = getStoredCartId();
  if (!cartId) return;

  try {
    const { cart } = await medusaApi.carts.retrieve(cartId);
    const cartProducts = mapMedusaCartToCartProducts(cart);
    applyCartToStore(cartProducts, resolveCartTotal(cart, cartProducts));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      clearStoredCartId();
      applyCartToStore([], 0);
    }
  }
}

async function ensureMedusaCart(location: LocationSlug): Promise<string> {
  assertMedusaApiConfigured();

  if (getStoredAuthToken()) {
    const { customer } = await medusaApi.customers.retrieve();
    const bestCart = await resolveBestCustomerCart(customer);
    if (bestCart) {
      await applyCartResponse(bestCart);
      await linkCartToCustomerIfNeeded(bestCart.id);
      return bestCart.id;
    }

    clearStoredCartId();
    return createCustomerCart(location);
  }

  const existingId = getStoredCartId();
  if (existingId) {
    try {
      await medusaApi.carts.retrieve(existingId);
      return existingId;
    } catch (error) {
      if (!(error instanceof ApiError) || error.statusCode !== 404) {
        throw error;
      }
      clearStoredCartId();
    }
  }

  const { regionId, salesChannelId } = getMedusaListingStoreContext(location);
  const { cart } = await medusaApi.carts.create({
    region_id: regionId,
    sales_channel_id: salesChannelId,
  });
  setStoredCartId(cart.id);
  return cart.id;
}

async function resolveMedusaVariantId(
  item: Product,
  location: LocationSlug,
): Promise<string | undefined> {
  if (item.medusaVariantId) {
    return item.medusaVariantId;
  }

  const lookupId = item.medusaProductId ?? String(item.id);
  const medusaProduct = await fetchRentiqoStoreProductByIdOrHandle(
    lookupId,
    location,
  );
  return medusaProduct
    ? resolveDefaultMedusaVariantId(medusaProduct)
    : undefined;
}

export async function addProductToMedusaCart(
  item: Product,
  quantity: number,
  location: LocationSlug,
): Promise<void> {
  if (!hasMedusaApiBaseUrl) return;

  const variantId = await resolveMedusaVariantId(item, location);
  if (!variantId) {
    console.error(
      "Cannot add to Medusa cart: no variant for",
      item.medusaProductId ?? item.id,
    );
    return;
  }

  const cartId = await ensureMedusaCart(location);
  const customer = getStoredAuthToken()
    ? (await medusaApi.customers.retrieve()).customer
    : null;

  await medusaApi.carts.addLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  await reloadCartFromServer(cartId, customer);
  await linkCartToCustomerIfNeeded(cartId);
}

export async function updateMedusaCartLineQuantity(
  cartProduct: CartProduct,
  quantity: number,
  location: LocationSlug,
): Promise<void> {
  if (!hasMedusaApiBaseUrl || !cartProduct.medusaLineItemId) return;

  const cartId = getStoredCartId() ?? (await ensureMedusaCart(location));
  const customer = getStoredAuthToken()
    ? (await medusaApi.customers.retrieve()).customer
    : null;

  await medusaApi.carts.updateLineItem(cartId, cartProduct.medusaLineItemId, {
    quantity,
  });
  await reloadCartFromServer(cartId, customer);
}

export async function removeMedusaCartLine(
  cartProduct: CartProduct,
  location: LocationSlug,
): Promise<void> {
  if (!hasMedusaApiBaseUrl || !cartProduct.medusaLineItemId) return;

  const cartId = getStoredCartId() ?? (await ensureMedusaCart(location));
  const customer = getStoredAuthToken()
    ? (await medusaApi.customers.retrieve()).customer
    : null;

  await medusaApi.carts.removeLineItem(cartId, cartProduct.medusaLineItemId);
  await reloadCartFromServer(cartId, customer);
}

export async function clearMedusaCart(): Promise<void> {
  clearLocalCart();
}
