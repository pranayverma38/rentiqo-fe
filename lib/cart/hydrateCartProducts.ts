import type { CartProduct } from "@/context/store";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import {
  buildMedusaProductDetailVariants,
  fetchRentiqoStoreProductByIdOrHandle,
  resolveVariantRegionalPrice,
} from "@/lib/catalog/rentiqoStoreCatalog";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { getDepositAmount } from "@/utils/formatPrice";

function resolveLineVariantId(item: CartProduct): string {
  return String(item.medusaVariantId ?? item.id);
}

function resolveLineProductLookupId(item: CartProduct): string {
  return String(item.medusaProductId ?? item.id);
}

/**
 * Re-applies regional `calculated_amount` pricing to cart lines (same source as PDP).
 */
export async function hydrateCartProductPrices(
  items: CartProduct[],
  location: LocationSlug,
): Promise<CartProduct[]> {
  if (!hasMedusaApiBaseUrl || items.length === 0) {
    return items;
  }

  const productCache = new Map<string, Awaited<ReturnType<typeof fetchRentiqoStoreProductByIdOrHandle>>>();

  const hydrated = await Promise.all(
    items.map(async (item) => {
      const variantId = resolveLineVariantId(item);
      const productLookupId = resolveLineProductLookupId(item);

      try {
        let medusaProduct = productCache.get(productLookupId);
        if (medusaProduct === undefined) {
          medusaProduct = await fetchRentiqoStoreProductByIdOrHandle(
            productLookupId,
            location,
          );
          productCache.set(productLookupId, medusaProduct);
        }

        if (medusaProduct == null) {
          return item;
        }

        const variant = medusaProduct.variants?.find((v) => v.id === variantId);
        if (variant == null) {
          return item;
        }

        const regionalPrice = resolveVariantRegionalPrice(variant);
        if (regionalPrice == null) {
          return item;
        }

        const detailVariants = buildMedusaProductDetailVariants(medusaProduct);
        const detailVariant = detailVariants.find((row) => row.id === variantId);

        return {
          ...item,
          price: regionalPrice,
          depositAmount: getDepositAmount(regionalPrice),
          selectedSize:
            detailVariant?.optionValues.duration ?? item.selectedSize,
          selectedColor:
            detailVariant?.optionValues.color ?? item.selectedColor,
        };
      } catch {
        return item;
      }
    }),
  );

  return hydrated;
}

export function computeCartTotalFromLines(items: CartProduct[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
