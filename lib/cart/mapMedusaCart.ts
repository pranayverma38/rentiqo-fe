import type { CartProduct } from "@/context/store";
import type {
  MedusaCart,
  MedusaCartLineItem,
  MedusaCartMutationResponse,
} from "@/lib/api/types/medusa";

/** Medusa returns `cart` or `parent` depending on the route (see Store API). */
export function unwrapMedusaCartResponse(
  response: MedusaCartMutationResponse,
): MedusaCart {
  const cart = response.cart ?? response.parent;
  if (!cart?.id) {
    throw new Error("Medusa cart response missing cart data.");
  }
  return cart;
}

const PLACEHOLDER_IMG = "/assets/images/product/square/product-1.jpg";

function lineItemPrice(item: MedusaCartLineItem): number {
  if (typeof item.unit_price === "number" && Number.isFinite(item.unit_price)) {
    return item.unit_price;
  }
  if (typeof item.subtotal === "number" && item.quantity > 0) {
    return item.subtotal / item.quantity;
  }
  return 0;
}

function mapLineItem(item: MedusaCartLineItem): CartProduct {
  const variantId = item.variant_id ?? item.id;
  const price = lineItemPrice(item);
  return {
    id: variantId,
    medusaLineItemId: item.id,
    medusaVariantId: item.variant_id ?? undefined,
    medusaProductId: item.product_id ?? undefined,
    name: item.title ?? item.product_title ?? "Product",
    img: item.thumbnail ?? PLACEHOLDER_IMG,
    price,
    depositAmount: price,
    quantity: item.quantity ?? 1,
  };
}

export function mapMedusaCartToCartProducts(cart: MedusaCart): CartProduct[] {
  return (cart.items ?? []).map(mapLineItem);
}

export function resolveCartTotal(
  cart: MedusaCart,
  cartProducts: CartProduct[],
  options?: { preferLineItems?: boolean },
): number {
  if (!options?.preferLineItems && typeof cart.total === "number" && Number.isFinite(cart.total)) {
    return cart.total;
  }
  return cartProducts.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0,
  );
}
