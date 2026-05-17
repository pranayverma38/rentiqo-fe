import type { Product } from "@/context/store";
import { useStore } from "@/context/store";
import { medusaApi } from "@/lib/api";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { getStoredAuthToken } from "@/lib/auth/storage";
import {
  MedusaCustomer,
  WISHLIST_METADATA_KEY,
} from "@/lib/api/types/medusa";
import { hydrateWishlistProducts } from "@/lib/wishlist/hydrateWishlistProducts";

const PLACEHOLDER_IMG = "/assets/images/product/square/product-1.jpg";

function parseWishlistIds(metadata: Record<string, unknown> | null | undefined): string[] {
  const raw = metadata?.[WISHLIST_METADATA_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === "string");
}

function placeholderProduct(id: string): Product {
  return {
    id,
    name: "Saved item",
    img: PLACEHOLDER_IMG,
    price: 0,
  };
}

/** Build wishlist rows from server ids only (never append unrelated localStorage items). */
function buildWishlistFromIds(
  ids: string[],
  knownProducts: Product[] = [],
): Product[] {
  const knownById = new Map<string, Product>();
  for (const item of knownProducts) {
    knownById.set(String(item.id), item);
  }

  const seen = new Set<string>();
  const result: Product[] = [];

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(knownById.get(id) ?? placeholderProduct(id));
  }

  return result;
}

export function clearLocalWishlist(): void {
  useStore.setState({ wishList: [] });
}

export async function persistWishlistToCustomer(
  customer: MedusaCustomer,
  wishList: Product[],
): Promise<MedusaCustomer> {
  if (!hasMedusaApiBaseUrl) return customer;

  const ids = wishList.map((item) => String(item.id));
  const { customer: fresh } = await medusaApi.customers.retrieve();
  const metadata = {
    ...(fresh.metadata ?? {}),
    [WISHLIST_METADATA_KEY]: ids,
  };

  const { customer: updated } = await medusaApi.customers.update({ metadata });
  return updated;
}

export type LoadWishlistOptions = {
  /** Guest items to merge once when logging in (same browser, was not logged in). */
  mergeGuestItems?: Product[];
};

/**
 * Load wishlist for the logged-in customer from Medusa metadata (source of truth).
 * Does not merge stale wishlist from localStorage (fixes cross-account leakage).
 */
export async function loadWishlistFromCustomer(
  customer: MedusaCustomer,
  options?: LoadWishlistOptions,
): Promise<void> {
  const remoteIds = parseWishlistIds(customer.metadata ?? undefined);
  const guestItems = options?.mergeGuestItems ?? [];
  const guestIds = guestItems.map((item) => String(item.id));
  const allIds = [...new Set([...remoteIds, ...guestIds])];

  const draft = buildWishlistFromIds(allIds, guestItems);
  const hydrated = await hydrateWishlistProducts(draft);
  useStore.setState({ wishList: hydrated });

  const hasNewGuestIds = guestIds.some((id) => !remoteIds.includes(id));
  if (hasNewGuestIds || hydrated.length !== remoteIds.length) {
    await persistWishlistToCustomer(customer, hydrated);
  }
}

/** Re-fetch catalog fields for placeholder wishlist rows (e.g. on /wishlist page). */
export async function refreshWishlistProductDetails(): Promise<void> {
  const { wishList, selectedLocation } = useStore.getState();
  const hydrated = await hydrateWishlistProducts(wishList, selectedLocation);
  useStore.setState({ wishList: hydrated });

  await syncWishlistIfAuthenticated();
}

export function getWishlistIds(wishList: Product[]): string[] {
  return wishList.map((item) => String(item.id));
}

/** Persist current Zustand wishlist to Medusa customer metadata when logged in. */
export async function syncWishlistIfAuthenticated(): Promise<void> {
  if (!hasMedusaApiBaseUrl) return;
  if (!getStoredAuthToken()) return;

  const wishList = useStore.getState().wishList;

  try {
    const { customer } = await medusaApi.customers.retrieve();
    await persistWishlistToCustomer(customer, wishList);
  } catch (error) {
    console.error("Wishlist sync to account failed:", error);
  }
}
