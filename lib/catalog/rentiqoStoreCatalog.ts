import { getMedusaListingStoreContext } from "@/lib/catalog/medusaListingByLocation";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import type { ProductColorSwatch } from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const DEFAULT_REVALIDATE_SECONDS = 60;
const PRODUCTS_PAGE_SIZE = 50;

const PRODUCT_LISTING_FIELDS = "*variants.calculated_price";
/** Same as manual jq on `.products[].categories[1]?.handle` for regional availability. */
const SUBCATEGORY_NAV_PRODUCT_FIELDS = "*categories,*variants.calculated_price";

type MedusaCategoryChild = {
  id: string;
  handle?: string | null;
  name?: string | null;
  rank?: number | null;
  is_active?: boolean | null;
};

type MedusaProductCategory = {
  id: string;
  handle?: string | null;
  category_children?: MedusaCategoryChild[] | null;
};

type MedusaCalculatedPrice = {
  calculated_amount?: number | null;
  original_amount?: number | null;
} | null;

type MedusaVariant = {
  calculated_price?: MedusaCalculatedPrice;
};

type MedusaProductImage = {
  url?: string | null;
  rank?: number | null;
};

type MedusaProductTag = {
  value?: string | null;
  name?: string | null;
};

type MedusaProductCategoryRow = {
  id?: string;
  handle?: string | null;
  name?: string | null;
};

export type MedusaStoreProduct = {
  id: string;
  handle?: string | null;
  title?: string | null;
  thumbnail?: string | null;
  images?: MedusaProductImage[] | null;
  tags?: MedusaProductTag[] | null;
  metadata?: unknown;
  variants?: MedusaVariant[] | null;
  categories?: MedusaProductCategoryRow[] | null;
};

function storeBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.trim();
  return raw && raw.length > 0 ? raw.replace(/\/+$/, "") : null;
}

function publishableKey(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function storeHeaders(): HeadersInit {
  const key = publishableKey();
  if (key == null) {
    return {};
  }
  return { "x-publishable-api-key": key };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      ...storeHeaders(),
      Accept: "application/json",
    },
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Rentiqo store ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

function readMetadataRecord(metadata: unknown): Record<string, unknown> {
  if (metadata == null) {
    return {};
  }
  if (typeof metadata === "string") {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      return typeof parsed === "object" && parsed != null && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  if (typeof metadata === "object" && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((v): v is string => typeof v === "string");
}

function readColorSwatches(value: unknown): ProductColorSwatch[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const out: ProductColorSwatch[] = [];
  for (const item of value) {
    if (item == null || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    const label = typeof o.label === "string" ? o.label : "";
    const swatchClass = typeof o.swatchClass === "string" ? o.swatchClass : "";
    const img = typeof o.img === "string" ? o.img : "";
    if (label && swatchClass && img) {
      out.push({ label, swatchClass, img });
    }
  }
  return out;
}

function readOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return fallback;
}

function tagValues(tags: MedusaProductTag[] | null | undefined): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }
  const out: string[] = [];
  for (const t of tags) {
    if (t == null) {
      continue;
    }
    const v = t.value ?? t.name;
    if (typeof v === "string" && v.length > 0) {
      out.push(v);
    }
  }
  return out;
}

function sortedImages(images: MedusaProductImage[] | null | undefined): MedusaProductImage[] {
  if (!Array.isArray(images)) {
    return [];
  }
  return [...images].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}

export function mapMedusaStoreProductToShopProduct(
  product: MedusaStoreProduct,
): ShopProduct {
  const meta = readMetadataRecord(product.metadata);
  const variant0 = product.variants?.[0];
  const cp = variant0?.calculated_price ?? null;
  const calculated = cp?.calculated_amount ?? 0;
  const original = cp?.original_amount ?? calculated;
  const price =
    typeof calculated === "number" && Number.isFinite(calculated) ? calculated : 0;
  const priceOld =
    typeof original === "number" &&
    Number.isFinite(original) &&
    original > calculated
      ? original
      : undefined;

  const images = sortedImages(product.images ?? undefined);
  const img =
    (typeof product.thumbnail === "string" && product.thumbnail.length > 0
      ? product.thumbnail
      : images[0]?.url) ?? "";
  const imgHover = images[1]?.url ?? undefined;

  const colors = readColorSwatches(meta.colors);
  const sizes = readStringArray(meta.sizes);
  const cardVariantRaw = meta.cardVariant;
  const cardVariant =
    cardVariantRaw === "square" ? "square" : "";

  const id =
    typeof product.handle === "string" && product.handle.length > 0
      ? product.handle
      : product.id;

  return {
    id,
    name: typeof product.title === "string" ? product.title : "",
    price,
    priceOld,
    img,
    imgHover,
    badge: typeof meta.badge === "string" ? meta.badge : undefined,
    badgeTrend: typeof meta.badgeTrend === "string" ? meta.badgeTrend : undefined,
    marquee: typeof meta.marquee === "string" ? meta.marquee : undefined,
    countdown: readOptionalNumber(meta.countdown),
    colors: colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    cardVariant,
    filterBrands: readStringArray(meta.filterBrands),
    filterCategory: readStringArray(meta.filterCategory),
    filterColor: readStringArray(meta.filterColor),
    filterSizes: readStringArray(meta.filterSizes),
    tags: tagValues(product.tags ?? undefined),
    rating: readOptionalNumber(meta.rating) ?? 0,
    inStock: readBoolean(meta.inStock, true),
    isStockOut: readBoolean(meta.isStockOut, false),
    services: readStringArray(meta.services),
  };
}

type CategoriesListResponse = {
  product_categories?: MedusaProductCategory[] | null;
};

type ProductsListResponse = {
  products?: MedusaStoreProduct[] | null;
  count?: number | null;
};

export async function fetchProductCategoriesByHandle(
  handle: string,
): Promise<MedusaProductCategory | null> {
  const base = storeBaseUrl();
  if (base == null || publishableKey() == null) {
    return null;
  }
  const url = `${base}/store/product-categories?handle=${encodeURIComponent(handle)}`;
  const json = await fetchJson<CategoriesListResponse>(url);
  const first = json.product_categories?.[0];
  return first ?? null;
}

/** Display name for breadcrumb/metadata; uses Medusa category tree only. */
export async function resolveMedusaSubcategoryDisplayName(
  categoryHandle: string,
  subcategorySlug: string,
): Promise<string | null> {
  if (subcategorySlug === "all") {
    return "All";
  }

  try {
    const root = await fetchProductCategoriesByHandle(categoryHandle);
    if (root == null) {
      return null;
    }
    const match = root.category_children?.find((c) => c.handle === subcategorySlug);
    if (match == null) {
      return null;
    }
    return typeof match.name === "string" && match.name.length > 0
      ? match.name
      : subcategorySlug;
  } catch {
    return null;
  }
}

/** One row for the category filter strip (Medusa child category). */
export type MedusaSubcategoryNavItem = {
  handle: string;
  name: string;
};

function collectCategoryIdsForListing(
  root: MedusaProductCategory,
  subcategorySlug: string | null,
): string[] {
  const children = root.category_children ?? [];
  const childIds = children.map((c) => c.id).filter(Boolean);

  if (subcategorySlug == null || subcategorySlug === "all") {
    return [root.id, ...childIds];
  }

  const match = children.find((c) => c.handle === subcategorySlug);
  if (match != null) {
    return [match.id];
  }

  return [];
}

function buildProductsUrl(
  categoryIds: string[],
  offset: number,
  limit: number,
  listing: { regionId: string; salesChannelId: string },
  fields: string,
): string {
  const base = storeBaseUrl();
  if (base == null) {
    throw new Error("Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL");
  }
  const params = new URLSearchParams();
  params.set("fields", fields);
  params.set("region_id", listing.regionId);
  params.set("sales_channel_id", listing.salesChannelId);
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  params.append("category_id[]", categoryIds.join(","));
  return `${base}/store/products?${params.toString()}`;
}

async function fetchAllProductsForCategoryIds(
  categoryIds: string[],
  location: LocationSlug,
  options?: { fields?: string },
): Promise<MedusaStoreProduct[]> {
  if (categoryIds.length === 0) {
    return [];
  }

  const fields = options?.fields ?? PRODUCT_LISTING_FIELDS;
  const listing = getMedusaListingStoreContext(location);
  const all: MedusaStoreProduct[] = [];
  let offset = 0;
  let total: number | null = null;

  for (let guard = 0; guard < 40; guard += 1) {
    const url = buildProductsUrl(
      categoryIds,
      offset,
      PRODUCTS_PAGE_SIZE,
      listing,
      fields,
    );
    const json = await fetchJson<ProductsListResponse>(url);
    const batch = json.products ?? [];
    all.push(...batch);
    total = typeof json.count === "number" ? json.count : all.length;
    offset += PRODUCTS_PAGE_SIZE;
    if (batch.length === 0 || all.length >= total) {
      break;
    }
  }

  return all;
}

/**
 * Filter-strip subcategories that have ≥1 product in the active region/sales channel.
 * Uses `GET /store/products` with parent + all child category ids and
 * `fields=*categories,*variants.calculated_price`, then keeps Medusa children whose
 * `handle` appears as `product.categories[1].handle` (leaf row, same as `jq`).
 */
export async function fetchMedusaCategoryNavChildren(
  categoryHandle: string,
  location: LocationSlug,
): Promise<MedusaSubcategoryNavItem[]> {
  if (!isRentiqoStoreCatalogConfigured()) {
    return [];
  }

  try {
    const root = await fetchProductCategoriesByHandle(categoryHandle);
    if (root == null) {
      return [];
    }

    const children = root.category_children ?? [];
    const categoryIds = collectCategoryIdsForListing(root, null);
    if (categoryIds.length === 0) {
      return [];
    }

    const products = await fetchAllProductsForCategoryIds(
      categoryIds,
      location,
      { fields: SUBCATEGORY_NAV_PRODUCT_FIELDS },
    );

    const handlesWithProducts = new Set<string>();
    for (const p of products) {
      const cats = p.categories;
      if (!Array.isArray(cats) || cats.length < 2) {
        continue;
      }
      const h = cats[1]?.handle;
      if (typeof h === "string" && h.trim().length > 0) {
        handlesWithProducts.add(h.trim());
      }
    }

    return children
      .filter(
        (c) =>
          typeof c.handle === "string" &&
          c.handle.length > 0 &&
          c.is_active !== false &&
          handlesWithProducts.has(c.handle),
      )
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
      .map((c) => ({
        handle: c.handle as string,
        name:
          typeof c.name === "string" && c.name.length > 0
            ? c.name
            : (c.handle as string),
      }));
  } catch (err) {
    console.error("[fetchMedusaCategoryNavChildren]", err);
    return [];
  }
}

export function isRentiqoStoreCatalogConfigured(): boolean {
  return storeBaseUrl() != null && publishableKey() != null;
}

/**
 * Loads Medusa store products for a category handle (matches site `CategorySlug`) and optional subcategory slug.
 */
export async function fetchRentiqoCatalogShopProducts(
  categoryHandle: string,
  subcategorySlug: string | null,
  location: LocationSlug,
): Promise<ShopProduct[]> {
  if (!isRentiqoStoreCatalogConfigured()) {
    return [];
  }

  const root = await fetchProductCategoriesByHandle(categoryHandle);
  if (root == null) {
    return [];
  }

  const categoryIds = collectCategoryIdsForListing(root, subcategorySlug);
  if (categoryIds.length === 0) {
    return [];
  }

  const products = await fetchAllProductsForCategoryIds(categoryIds, location);
  return products.map(mapMedusaStoreProductToShopProduct);
}
