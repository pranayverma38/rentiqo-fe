import { headers } from "next/headers";

import {
  getLocationSlugFromPathname,
  isLocationSlug,
  type LocationSlug,
} from "@/lib/catalog/catalogRoutes";
import {
  fetchRentiqoStoreProductByIdOrHandle,
  isRentiqoStoreCatalogConfigured,
  mapMedusaStoreProductToProductDetail,
  type ProductDetailItem,
} from "@/lib/catalog/rentiqoStoreCatalog";
import type { ProductCardItem } from "@/types/productCard";
import { products as themeProducts } from "@/data/products/products";

/** Resolves storefront location for PDP (query → Referer path → default). */
export async function resolveProductDetailLocation(
  searchParams?: { location?: string },
): Promise<LocationSlug> {
  const fromQuery = searchParams?.location;
  if (fromQuery != null && isLocationSlug(fromQuery)) {
    return fromQuery;
  }

  const referer = (await headers()).get("referer");
  if (referer != null) {
    try {
      const fromReferer = getLocationSlugFromPathname(new URL(referer).pathname);
      if (fromReferer != null) {
        return fromReferer;
      }
    } catch {
      // ignore invalid referer
    }
  }

  return "delhi";
}

function fallbackThemeProduct(id: string): ProductCardItem {
  const numeric = Number(id);
  if (Number.isFinite(numeric)) {
    const match = themeProducts.find((p) => p.id === numeric);
    if (match != null) {
      return match;
    }
  }
  const byHandle = themeProducts.find((p) => String(p.id) === id);
  return byHandle ?? themeProducts[0];
}

/**
 * Loads a single product for `/product-detail/[id]` from Medusa when configured.
 * `id` may be a Medusa `prod_…` id or a product `handle` (catalog card links).
 */
export async function fetchProductDetailForPage(
  idOrHandle: string,
  location: LocationSlug,
): Promise<ProductDetailItem | null> {
  if (!isRentiqoStoreCatalogConfigured()) {
    return null;
  }

  try {
    const medusaProduct = await fetchRentiqoStoreProductByIdOrHandle(
      idOrHandle,
      location,
    );
    if (medusaProduct == null) {
      return null;
    }
    return mapMedusaStoreProductToProductDetail(medusaProduct);
  } catch (err) {
    console.error("[fetchProductDetailForPage]", err);
    return null;
  }
}

export async function loadProductDetailPageProduct(
  idOrHandle: string,
  location: LocationSlug,
): Promise<ProductDetailItem | null> {
  const fromMedusa = await fetchProductDetailForPage(idOrHandle, location);
  if (fromMedusa != null) {
    return fromMedusa;
  }

  if (isRentiqoStoreCatalogConfigured()) {
    return null;
  }

  const fallback = fallbackThemeProduct(idOrHandle);
  return mapMedusaStoreProductToProductDetail({
    id: String(fallback.id),
    handle: String(fallback.id),
    title: fallback.name,
    thumbnail: fallback.img,
    images: [{ url: fallback.img, rank: 0 }],
    description: fallback.description ?? undefined,
    metadata: {},
    variants: [
      {
        calculated_price: {
          calculated_amount: fallback.price,
          original_amount: fallback.priceOld ?? fallback.price,
        },
      },
    ],
  });
}
