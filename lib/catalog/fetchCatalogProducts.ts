import { shopDefaultProducts } from "@/data/products/products";
import {
  fetchRentiqoCatalogShopProducts,
  isRentiqoStoreCatalogConfigured,
} from "@/lib/catalog/rentiqoStoreCatalog";
import type { CategorySlug, LocationSlug } from "@/lib/catalog/subcategories";
import type { ShopProduct } from "@/types/shopFilter";

/**
 * Route context for catalog listing APIs (Medusa store on Rentiqo backend).
 */
export type CatalogProductRouteParams = {
  location: LocationSlug;
  category: CategorySlug;
  /** Category index (`/delhi/home-furniture`): use `null`. Subcategory (`/.../beds`): slug. Use `"all"` for combined listing same as index. */
  subcategorySlug: string | null;
};

/**
 * Load products for `[location]/[category]` and `[location]/[category]/[subcategory]`.
 *
 * When `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` are set,
 * loads from Rentiqo Medusa store (`/store/product-categories` + `/store/products`).
 * Otherwise returns static theme data so other shop pages stay unchanged.
 */
export async function fetchCatalogProducts(
  params: CatalogProductRouteParams,
): Promise<ShopProduct[]> {
  if (!isRentiqoStoreCatalogConfigured()) {
    return shopDefaultProducts;
  }

  try {
    const fromApi = await fetchRentiqoCatalogShopProducts(
      params.category,
      params.subcategorySlug,
      params.location,
    );
    return fromApi.filter((p) => p.name.length > 0 && p.img.length > 0);
  } catch (err) {
    console.error("[fetchCatalogProducts] Rentiqo store error:", err);
    return shopDefaultProducts;
  }
}
