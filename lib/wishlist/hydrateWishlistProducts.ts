import type { Product } from "@/context/store";
import { useStore } from "@/context/store";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import {
  fetchRentiqoStoreProductByIdOrHandle,
  mapMedusaStoreProductToShopProduct,
} from "@/lib/catalog/rentiqoStoreCatalog";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";

const PLACEHOLDER_NAME = "Saved item";

export function isWishlistItemPlaceholder(item: Product): boolean {
  return (
    item.name === PLACEHOLDER_NAME ||
    item.price === 0 ||
    !item.img ||
    item.img === "/assets/images/product/square/product-1.jpg"
  );
}

/**
 * Fetches Medusa catalog data for wishlist rows that only have an id (e.g. after login on a new device).
 */
export async function hydrateWishlistProducts(
  items: Product[],
  location?: LocationSlug,
): Promise<Product[]> {
  if (!hasMedusaApiBaseUrl || items.length === 0) {
    return items;
  }

  const resolvedLocation = location ?? useStore.getState().selectedLocation;

  const hydrated = await Promise.all(
    items.map(async (item) => {
      if (!isWishlistItemPlaceholder(item)) {
        return item;
      }

      const lookupKey = String(item.medusaProductId ?? item.id);
      try {
        const medusaProduct = await fetchRentiqoStoreProductByIdOrHandle(
          lookupKey,
          resolvedLocation,
        );
        if (!medusaProduct) {
          return item;
        }
        return mapMedusaStoreProductToShopProduct(medusaProduct);
      } catch {
        return item;
      }
    }),
  );

  return hydrated;
}
