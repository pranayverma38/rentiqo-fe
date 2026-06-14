import { getMedusaListingStoreContext } from "@/lib/catalog/medusaListingByLocation";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import type {
  ProductCardItem,
  ProductColorSwatch,
  ProductSingleImage,
} from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const DEFAULT_REVALIDATE_SECONDS = 60;
const PRODUCTS_PAGE_SIZE = 50;

/** Keep `*variants.calculated_price` (required for regional pricing). Add `+variants.id` for quick-add. */
const PRODUCT_LISTING_FIELDS =
  "*variants.calculated_price,+variants.id,+metadata";
/** Same as manual jq on `.products[].categories[1]?.handle` for regional availability. */
const SUBCATEGORY_NAV_PRODUCT_FIELDS = "*categories,*variants.calculated_price";
const PRODUCT_DETAIL_FIELDS =
  "*categories,*variants.calculated_price,*variants.options,*variants.thumbnail,*images,+metadata";

const PDP_DEFAULT_CATEGORY = "Furniture";
const PDP_DEFAULT_REVIEWS_TEXT = "(0 reviews)";
const PDP_DEFAULT_SKU = "53453412";
const PDP_DEFAULT_SHORT_DESCRIPTION =
  "Quality rental furniture and appliances. Flexible plans for your home.";

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

type MedusaVariantOption = {
  value?: string | null;
  option?: { title?: string | null } | null;
};

type MedusaVariant = {
  id?: string;
  title?: string | null;
  sku?: string | null;
  thumbnail?: string | null;
  variant_rank?: number | null;
  calculated_price?: MedusaCalculatedPrice;
  options?: MedusaVariantOption[] | null;
};

type MedusaProductOption = {
  title?: string | null;
  values?: { value?: string | null }[] | null;
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
  parent_category_id?: string | null;
  parent_category?: MedusaProductCategoryRow | null;
};

export type ProductCategoryNav = {
  parentHandle?: string;
  parentName?: string;
  leafHandle?: string;
  leafName?: string;
};

export type MedusaStoreProduct = {
  id: string;
  handle?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  images?: MedusaProductImage[] | null;
  tags?: MedusaProductTag[] | null;
  metadata?: unknown;
  variants?: MedusaVariant[] | null;
  options?: MedusaProductOption[] | null;
  categories?: MedusaProductCategoryRow[] | null;
};

/** Medusa option values on one variant row (keys are normalized). */
export type ProductDetailOptionValues = {
  duration?: string;
  color?: string;
  size?: string;
};

/** One Medusa variant row for PDP option selection. */
export type ProductDetailVariant = {
  id: string;
  /** Primary display key (legacy); prefer `optionValues`. */
  label: string;
  optionValues: ProductDetailOptionValues;
  price: number;
  priceOld?: number;
  /** Medusa variant `thumbnail` (hero image for this option). */
  thumbnail?: string;
  galleryImages: ProductSingleImage[];
  sku?: string;
};

/** PDP-ready product (Medusa-mapped + theme fallbacks). */
export type ProductDetailItem = ProductCardItem & {
  medusaProductId: string;
  galleryImages: ProductSingleImage[];
  /** Medusa parent + leaf category for PDP breadcrumbs. */
  categoryNav?: ProductCategoryNav;
  /** Medusa variants with regional prices (when product has options). */
  medusaVariants?: ProductDetailVariant[];
  /** Size option title from Medusa (e.g. `size`). */
  optionTitle?: string;
  /** Rental duration values when product has a `Duration` option. */
  durationOptions?: string[];
  /** Size option values (separate from duration). */
  sizeOptions?: string[];
  hasDurationOption?: boolean;
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

function medusaImagesToGallery(
  product: MedusaStoreProduct,
): ProductSingleImage[] {
  const sorted = sortedImages(product.images ?? undefined);
  const urls: string[] = [];
  if (typeof product.thumbnail === "string" && product.thumbnail.length > 0) {
    urls.push(product.thumbnail);
  }
  for (const img of sorted) {
    if (typeof img.url === "string" && img.url.length > 0 && !urls.includes(img.url)) {
      urls.push(img.url);
    }
  }
  if (urls.length === 0) {
    return [{ src: "/assets/images/product/single/detail-1.jpg" }];
  }
  return urls.map((src) => ({ src }));
}

function isColorOptionTitle(title: string | null | undefined): boolean {
  return (title?.toLowerCase() ?? "").includes("color");
}

export function isDurationOptionTitle(title: string | null | undefined): boolean {
  return (title?.trim().toLowerCase() ?? "") === "duration";
}

export function durationMedusaOption(
  product: MedusaStoreProduct,
): MedusaProductOption | undefined {
  return product.options?.find((o) => isDurationOptionTitle(o.title));
}

export function isMedusaDurationProduct(product: MedusaStoreProduct): boolean {
  return durationMedusaOption(product) != null;
}

function durationSortKey(value: string): number {
  const match = value.match(/(\d+)/);
  return match != null ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function isSizeOptionTitle(title: string | null | undefined): boolean {
  const t = title?.trim().toLowerCase() ?? "";
  return t === "size" || (t.includes("size") && !isDurationOptionTitle(title));
}

export function sizeMedusaOption(
  product: MedusaStoreProduct,
): MedusaProductOption | undefined {
  return product.options?.find((o) => isSizeOptionTitle(o.title));
}

export function colorMedusaOption(
  product: MedusaStoreProduct,
): MedusaProductOption | undefined {
  return product.options?.find((o) => isColorOptionTitle(o.title));
}

function primaryMedusaOption(
  product: MedusaStoreProduct,
): MedusaProductOption | undefined {
  const size = sizeMedusaOption(product);
  if (size != null) {
    return size;
  }
  const options = product.options ?? [];
  return (
    options.find(
      (o) => !isColorOptionTitle(o.title) && !isDurationOptionTitle(o.title),
    ) ??
    options[0] ??
    undefined
  );
}

function primaryOptionTitleFromMedusa(product: MedusaStoreProduct): string {
  const title = sizeMedusaOption(product)?.title?.trim();
  if (title && title.length > 0) {
    return title;
  }
  const titleFallback = primaryMedusaOption(product)?.title?.trim();
  return titleFallback && titleFallback.length > 0 ? titleFallback : "Size";
}

function optionValuesFromMedusaOption(
  opt: MedusaProductOption | undefined,
  sortDuration = false,
): string[] {
  if (opt == null) {
    return [];
  }
  const values = (opt.values ?? [])
    .map((v) => (typeof v.value === "string" ? v.value.trim() : ""))
    .filter((v) => v.length > 0);
  if (sortDuration && isDurationOptionTitle(opt.title)) {
    return [...values].sort((a, b) => durationSortKey(a) - durationSortKey(b));
  }
  return values;
}

export function durationOptionValuesFromMedusa(
  product: MedusaStoreProduct,
): string[] {
  return optionValuesFromMedusaOption(durationMedusaOption(product), true);
}

export function sizeOptionValuesFromMedusa(product: MedusaStoreProduct): string[] {
  return optionValuesFromMedusaOption(sizeMedusaOption(product));
}

function variantOptionValuesMap(variant: MedusaVariant): ProductDetailOptionValues {
  const out: ProductDetailOptionValues = {};
  for (const row of variant.options ?? []) {
    const title = row.option?.title?.trim().toLowerCase() ?? "";
    const value = typeof row.value === "string" ? row.value.trim() : "";
    if (value.length === 0) {
      continue;
    }
    if (isDurationOptionTitle(title)) {
      out.duration = value;
    } else if (isColorOptionTitle(title)) {
      out.color = value;
    } else if (isSizeOptionTitle(title)) {
      out.size = value;
    }
  }
  return out;
}

function variantLabelFromOptionValues(
  values: ProductDetailOptionValues,
): string {
  const parts = [values.duration, values.color, values.size].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  return parts.length > 0 ? parts.join(" / ") : "";
}

function isValidPdpVariant(
  variant: MedusaVariant,
  product: MedusaStoreProduct,
): boolean {
  const map = variantOptionValuesMap(variant);
  const hasDuration = durationMedusaOption(product) != null;
  const hasSize = sizeMedusaOption(product) != null;
  const hasColor = colorMedusaOption(product) != null;

  if ((variant.options ?? []).length === 0) {
    return !hasDuration && !hasSize && !hasColor;
  }

  if (hasDuration && map.duration == null) {
    return false;
  }

  if (hasSize && hasColor && (map.size == null || map.color == null)) {
    return false;
  }

  return map.duration != null || map.size != null || map.color != null;
}

export function findMedusaVariantByOptions(
  variants: ProductDetailVariant[],
  selection: ProductDetailOptionValues,
): ProductDetailVariant | null {
  if (variants.length === 0) {
    return null;
  }

  const exact = variants.find((v) => variantMatchesSelection(v, selection));
  if (exact != null) {
    return exact;
  }

  let best: ProductDetailVariant | null = null;
  let bestScore = -1;
  for (const v of variants) {
    const ov = v.optionValues;
    let score = 0;
    if (
      selection.duration != null &&
      selection.duration.length > 0 &&
      (ov.duration?.toLowerCase() ?? "") === selection.duration.toLowerCase()
    ) {
      score += 4;
    }
    if (
      selection.color != null &&
      selection.color.length > 0 &&
      (ov.color?.toLowerCase() ?? "") === selection.color.toLowerCase()
    ) {
      score += 2;
    }
    if (
      selection.size != null &&
      selection.size.length > 0 &&
      (ov.size?.toLowerCase() ?? "") === selection.size.toLowerCase()
    ) {
      score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }

  return best ?? variants[0] ?? null;
}

export function variantMatchesSelection(
  variant: ProductDetailVariant,
  selection: ProductDetailOptionValues,
): boolean {
  const ov = variant.optionValues;
  if (
    selection.duration != null &&
    selection.duration.length > 0 &&
    (ov.duration?.toLowerCase() ?? "") !== selection.duration.toLowerCase()
  ) {
    return false;
  }
  if (
    selection.color != null &&
    selection.color.length > 0 &&
    (ov.color?.toLowerCase() ?? "") !== selection.color.toLowerCase()
  ) {
    return false;
  }
  if (
    selection.size != null &&
    selection.size.length > 0 &&
    (ov.size?.toLowerCase() ?? "") !== selection.size.toLowerCase()
  ) {
    return false;
  }
  return true;
}

function colorOptionsFromMedusa(
  product: MedusaStoreProduct,
  meta: Record<string, unknown>,
): ProductColorSwatch[] {
  const fromMeta = readColorSwatches(meta.colors);
  if (fromMeta.length > 0) {
    return fromMeta;
  }

  const colorOpt = colorMedusaOption(product);
  if (colorOpt == null) {
    return [];
  }

  const fallbackImg =
    (typeof product.thumbnail === "string" && product.thumbnail.length > 0
      ? product.thumbnail
      : sortedImages(product.images ?? undefined)[0]?.url) ?? "";

  return (colorOpt.values ?? [])
    .map((v) => {
      const value = typeof v.value === "string" ? v.value.trim() : "";
      if (value.length === 0) {
        return null;
      }
      return {
        label: value,
        swatchClass: `bg-${value.replace(/\s+/g, "-")}`,
        img: fallbackImg,
      };
    })
    .filter((c): c is ProductColorSwatch => c != null);
}

function variantPricesFromCalculated(
  cp: MedusaCalculatedPrice,
): { price: number; priceOld?: number } {
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
  return { price, priceOld };
}

/** Regional monthly rent from a Medusa variant row (same as PDP). */
export function resolveVariantRegionalPrice(variant: MedusaVariant): number | null {
  const cp = variant.calculated_price;
  if (cp == null) {
    return null;
  }
  const amount = cp.calculated_amount;
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return null;
  }
  return variantPricesFromCalculated(cp).price;
}

/**
 * Catalog card price: lowest variant `calculated_amount` with its `original_amount`
 * for strike-through when on sale (price list / compare-at).
 */
export function resolveListingPricesFromVariants(
  product: MedusaStoreProduct,
): { price: number; priceOld?: number } {
  const variants = product.variants ?? [];
  let bestPrice = Number.POSITIVE_INFINITY;
  let bestPriceOld: number | undefined;
  let bestDiscount = -1;

  for (const variant of variants) {
    const cp = variant.calculated_price;
    if (cp == null) {
      continue;
    }
    const { price, priceOld } = variantPricesFromCalculated(cp);
    if (!Number.isFinite(price)) {
      continue;
    }

    const discount =
      priceOld != null && priceOld > price ? priceOld - price : 0;

    if (
      price < bestPrice ||
      (price === bestPrice && discount > bestDiscount)
    ) {
      bestPrice = price;
      bestPriceOld = priceOld;
      bestDiscount = discount;
    }
  }

  if (!Number.isFinite(bestPrice) || bestPrice === Number.POSITIVE_INFINITY) {
    return { price: 0, priceOld: undefined };
  }

  return { price: bestPrice, priceOld: bestPriceOld };
}

/** Default variant for listing quick-add (matches `resolveListingPricesFromVariants`). */
export function resolveDefaultMedusaVariantId(
  product: MedusaStoreProduct,
): string | undefined {
  const variants = product.variants ?? [];
  let bestPrice = Number.POSITIVE_INFINITY;
  let bestDiscount = -1;
  let bestVariantId: string | undefined;

  for (const variant of variants) {
    if (typeof variant.id !== "string" || variant.id.length === 0) {
      continue;
    }
    const cp = variant.calculated_price;
    if (cp == null) {
      continue;
    }
    const { price, priceOld } = variantPricesFromCalculated(cp);
    if (!Number.isFinite(price)) {
      continue;
    }

    const discount =
      priceOld != null && priceOld > price ? priceOld - price : 0;

    if (
      price < bestPrice ||
      (price === bestPrice && discount > bestDiscount)
    ) {
      bestPrice = price;
      bestDiscount = discount;
      bestVariantId = variant.id;
    }
  }

  if (bestVariantId != null) {
    return bestVariantId;
  }

  const fallback = variants.find(
    (v) => typeof v.id === "string" && v.id.length > 0,
  );
  return fallback?.id;
}

function variantOptionLabel(
  variant: MedusaVariant,
  optionTitle: string,
): string {
  const normalizedTitle = optionTitle.toLowerCase();
  const opts = variant.options ?? [];
  const match = opts.find(
    (o) => (o.option?.title?.toLowerCase() ?? "") === normalizedTitle,
  );
  if (typeof match?.value === "string" && match.value.trim().length > 0) {
    return match.value.trim();
  }
  const firstNonColor = opts.find((o) => !isColorOptionTitle(o.option?.title));
  if (typeof firstNonColor?.value === "string" && firstNonColor.value.trim().length > 0) {
    return firstNonColor.value.trim();
  }
  if (typeof variant.title === "string" && variant.title.trim().length > 0) {
    return variant.title.trim();
  }
  return "";
}

function variantGalleryImages(
  product: MedusaStoreProduct,
  variant: MedusaVariant,
  label: string,
): ProductSingleImage[] {
  const urls: string[] = [];
  const variantThumb =
    typeof variant.thumbnail === "string" && variant.thumbnail.length > 0
      ? variant.thumbnail
      : null;

  if (variantThumb != null) {
    urls.push(variantThumb);
  }

  for (const img of medusaImagesToGallery(product)) {
    if (!urls.includes(img.src)) {
      urls.push(img.src);
    }
  }

  if (urls.length === 0) {
    return [{ src: "/assets/images/product/single/detail-1.jpg", dataSize: label }];
  }
  return urls.map((src) => ({ src, dataSize: label }));
}

/** Build PDP variants with full option axes (duration, color, size). */
export function buildMedusaProductDetailVariants(
  product: MedusaStoreProduct,
): ProductDetailVariant[] {
  const variants = product.variants ?? [];
  if (variants.length === 0) {
    return [];
  }

  const rows: ProductDetailVariant[] = [];
  for (const variant of variants) {
    if (typeof variant.id !== "string" || variant.id.length === 0) {
      continue;
    }
    const cp = variant.calculated_price;
    const amount = cp?.calculated_amount;
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      continue;
    }

    if (!isValidPdpVariant(variant, product)) {
      continue;
    }

    const optionValues = variantOptionValuesMap(variant);
    const label = variantLabelFromOptionValues(optionValues);
    if (label.length === 0) {
      continue;
    }

    const { price, priceOld } = variantPricesFromCalculated(cp);
    const sku =
      typeof variant.sku === "string" && variant.sku.length > 0
        ? variant.sku
        : undefined;

    const thumbnail =
      typeof variant.thumbnail === "string" && variant.thumbnail.length > 0
        ? variant.thumbnail
        : undefined;

    rows.push({
      id: variant.id,
      label,
      optionValues,
      price,
      priceOld,
      thumbnail,
      galleryImages: variantGalleryImages(product, variant, label),
      sku,
    });
  }

  rows.sort((a, b) => {
    const ad = a.optionValues.duration
      ? durationSortKey(a.optionValues.duration)
      : Number.MAX_SAFE_INTEGER;
    const bd = b.optionValues.duration
      ? durationSortKey(b.optionValues.duration)
      : Number.MAX_SAFE_INTEGER;
    if (ad !== bd) {
      return ad - bd;
    }
    return a.label.localeCompare(b.label);
  });

  return rows;
}

function readCategoryName(row: MedusaProductCategoryRow | null | undefined): string | null {
  if (row == null) {
    return null;
  }
  return typeof row.name === "string" && row.name.trim().length > 0
    ? row.name.trim()
    : null;
}

function readCategoryHandle(
  row: MedusaProductCategoryRow | null | undefined,
): string | null {
  if (row == null) {
    return null;
  }
  return typeof row.handle === "string" && row.handle.trim().length > 0
    ? row.handle.trim()
    : null;
}

/** Leaf subcategory + parent from Medusa `categories` (same shape as listing `categories[1]`). */
export function resolveProductCategoryNavFromMedusa(
  product: MedusaStoreProduct,
): ProductCategoryNav {
  const cats = product.categories ?? [];
  if (cats.length === 0) {
    return {};
  }

  const withParent = cats.find(
    (c) =>
      c.parent_category_id != null ||
      c.parent_category != null,
  );
  const leaf = withParent ?? (cats.length >= 2 ? cats[1] : undefined);
  const parentFromLeaf = leaf?.parent_category ?? undefined;
  const parentRoot =
    cats.find((c) => c.parent_category_id == null && c.id !== leaf?.id) ??
    parentFromLeaf ??
    (leaf == null ? cats[0] : undefined);

  const leafName = readCategoryName(leaf);
  const leafHandle = readCategoryHandle(leaf);
  const parentName = readCategoryName(parentRoot) ?? readCategoryName(parentFromLeaf);
  const parentHandle =
    readCategoryHandle(parentRoot) ?? readCategoryHandle(parentFromLeaf);

  if (leafName == null && parentName == null) {
    return {};
  }

  return {
    parentHandle: parentHandle ?? undefined,
    parentName: parentName ?? undefined,
    leafHandle: leafHandle ?? undefined,
    leafName: leafName ?? undefined,
  };
}

export function resolvePdpRating(meta: Record<string, unknown>): number {
  const value = readOptionalNumber(meta.rating);
  if (value == null) {
    return 0;
  }
  return Math.min(5, Math.max(0, value));
}

function resolvePdpReviewCountText(meta: Record<string, unknown>): string {
  const count = readOptionalNumber(meta.review_count);
  if (count == null) {
    const legacy = meta.reviewsText;
    if (typeof legacy === "string" && legacy.trim().length > 0) {
      return legacy.trim();
    }
    return PDP_DEFAULT_REVIEWS_TEXT;
  }

  const n = Math.floor(count);
  if (n <= 0) {
    return "(0 reviews)";
  }
  return `(${n} review${n === 1 ? "" : "s"})`;
}

function categoryLabelFromMedusa(
  product: MedusaStoreProduct,
  meta: Record<string, unknown>,
  categoryNav: ProductCategoryNav,
): string {
  const fromMeta = meta.category;
  if (typeof fromMeta === "string" && fromMeta.length > 0) {
    return fromMeta;
  }
  if (categoryNav.leafName != null) {
    return categoryNav.leafName;
  }
  if (categoryNav.parentName != null) {
    return categoryNav.parentName;
  }
  return PDP_DEFAULT_CATEGORY;
}

export function mapMedusaStoreProductToProductDetail(
  product: MedusaStoreProduct,
): ProductDetailItem {
  const base = mapMedusaStoreProductToShopProduct(product);
  const meta = readMetadataRecord(product.metadata);
  const medusaVariants = buildMedusaProductDetailVariants(product);
  const defaultVariant = medusaVariants[0];
  const variant0 = product.variants?.[0];
  const durationOptions = durationOptionValuesFromMedusa(product);
  const sizeOptions = sizeOptionValuesFromMedusa(product);
  const medusaColors = colorOptionsFromMedusa(product, meta);
  const galleryImages =
    defaultVariant != null && defaultVariant.galleryImages.length > 0
      ? defaultVariant.galleryImages
      : medusaImagesToGallery(product);
  const sizes =
    sizeOptions.length > 0
      ? sizeOptions
      : medusaVariants.length > 0 && durationOptions.length === 0
        ? [...new Set(medusaVariants.map((v) => v.label))]
        : base.sizes && base.sizes.length > 0
          ? base.sizes
          : undefined;

  const reviewCount = readOptionalNumber(meta.review_count);
  const reviewsText = resolvePdpReviewCountText(meta);
  const rating = resolvePdpRating(meta);

  const skuFromVariant =
    typeof variant0?.sku === "string" && variant0.sku.length > 0
      ? variant0.sku
      : undefined;
  const skuFromMeta = meta.sku;
  const sku =
    skuFromVariant ??
    (typeof skuFromMeta === "string" && skuFromMeta.length > 0
      ? skuFromMeta
      : PDP_DEFAULT_SKU);

  const description =
    typeof product.description === "string" && product.description.trim().length > 0
      ? product.description.trim()
      : PDP_DEFAULT_SHORT_DESCRIPTION;

  const subtitle =
    typeof product.subtitle === "string" && product.subtitle.trim().length > 0
      ? product.subtitle.trim()
      : undefined;

  const availableInLocation = isMedusaProductAvailableInLocation(product);
  const categoryNav = resolveProductCategoryNavFromMedusa(product);

  const price = defaultVariant?.price ?? base.price;
  const priceOld = defaultVariant?.priceOld ?? base.priceOld;

  return {
    ...base,
    medusaProductId: product.id,
    medusaVariants: medusaVariants.length > 0 ? medusaVariants : undefined,
    optionTitle:
      sizeOptions.length > 0 ? primaryOptionTitleFromMedusa(product) : undefined,
    hasDurationOption: durationOptions.length > 0,
    durationOptions: durationOptions.length > 0 ? durationOptions : undefined,
    sizeOptions: sizeOptions.length > 0 ? sizeOptions : undefined,
    colors: medusaColors.length > 0 ? medusaColors : base.colors,
    galleryImages,
    images: galleryImages,
    img: galleryImages[0]?.src ?? base.img,
    imgHover: galleryImages[1]?.src ?? base.imgHover,
    description,
    subtitle,
    categoryNav,
    category: categoryLabelFromMedusa(product, meta, categoryNav),
    reviewsText,
    reviewCount,
    sku: defaultVariant?.sku ?? sku,
    sizes,
    price,
    priceOld,
    rating,
    inStock: availableInLocation,
    isStockOut: !availableInLocation,
  };
}

export function mapMedusaStoreProductToShopProduct(
  product: MedusaStoreProduct,
): ShopProduct {
  const meta = readMetadataRecord(product.metadata);
  const { price, priceOld } = resolveListingPricesFromVariants(product);

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

  const metaBadge =
    typeof meta.badge === "string" && meta.badge.trim().length > 0
      ? meta.badge.trim()
      : undefined;

  const medusaVariantId = resolveDefaultMedusaVariantId(product);

  return {
    id,
    medusaProductId: product.id,
    medusaVariantId,
    name: typeof product.title === "string" ? product.title : "",
    price,
    priceOld,
    img,
    imgHover,
    badge: metaBadge,
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
    rating: resolvePdpRating(meta),
    reviewCount: readOptionalNumber(meta.review_count),
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

type ProductByIdResponse = {
  product?: MedusaStoreProduct | null;
};

/** True when at least one variant has a regional calculated price (in channel + region). */
export function isMedusaProductAvailableInLocation(
  product: MedusaStoreProduct,
): boolean {
  const variants = product.variants ?? [];
  if (variants.length === 0) {
    return false;
  }
  return variants.some((v) => {
    const amount = v.calculated_price?.calculated_amount;
    return typeof amount === "number" && Number.isFinite(amount);
  });
}

function buildProductDetailUrl(
  productId: string,
  location: LocationSlug,
): string {
  const base = storeBaseUrl();
  if (base == null) {
    throw new Error("Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL");
  }
  const { regionId, salesChannelId } = getMedusaListingStoreContext(location);
  const params = new URLSearchParams();
  params.set("fields", PRODUCT_DETAIL_FIELDS);
  params.set("region_id", regionId);
  params.set("sales_channel_id", salesChannelId);
  return `${base}/store/products/${encodeURIComponent(productId)}?${params.toString()}`;
}

function buildProductByHandleUrl(
  handle: string,
  location: LocationSlug,
): string {
  const base = storeBaseUrl();
  if (base == null) {
    throw new Error("Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL");
  }
  const { regionId, salesChannelId } = getMedusaListingStoreContext(location);
  const params = new URLSearchParams();
  params.set("handle", handle);
  params.set("fields", PRODUCT_DETAIL_FIELDS);
  params.set("region_id", regionId);
  params.set("sales_channel_id", salesChannelId);
  params.set("limit", "1");
  return `${base}/store/products?${params.toString()}`;
}

/**
 * `GET /store/products/:id` or `?handle=` when the route segment is a handle.
 */
export async function fetchRentiqoStoreProductByIdOrHandle(
  idOrHandle: string,
  location: LocationSlug,
): Promise<MedusaStoreProduct | null> {
  if (storeBaseUrl() == null || publishableKey() == null) {
    return null;
  }

  const trimmed = idOrHandle.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith("prod_")) {
    const url = buildProductDetailUrl(trimmed, location);
    const json = await fetchJson<ProductByIdResponse>(url);
    return json.product ?? null;
  }

  const byHandleUrl = buildProductByHandleUrl(trimmed, location);
  const listJson = await fetchJson<ProductsListResponse>(byHandleUrl);
  const fromList = listJson.products?.[0];
  if (fromList != null) {
    return fromList;
  }

  return null;
}

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
