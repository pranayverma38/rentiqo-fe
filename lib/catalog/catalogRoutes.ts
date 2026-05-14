/** Top-level catalog segments under `/[location]/[category]/…`. */
export const CATEGORY_SLUGS = [
  "appliances",
  "combos",
  "home-furniture",
  "office-furniture",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const locationOptions = [
  { label: "Delhi", slug: "delhi" },
  { label: "Gurugram", slug: "gurugram" },
  { label: "Noida", slug: "noida" },
] as const;

export type LocationSlug = (typeof locationOptions)[number]["slug"];

export const categoryLabels: Record<CategorySlug, string> = {
  appliances: "Appliances",
  combos: "Combos",
  "home-furniture": "Home furniture",
  "office-furniture": "Office furniture",
};

export const categoryDescriptions: Record<CategorySlug, string> = {
  appliances:
    "Rent the appliances you need without long-term commitment. Filter by type, brand, and availability.",
  combos:
    "Bundle essentials in one package and choose a combo that fits your move, budget, and duration.",
  "home-furniture":
    "Furnish your space with pieces you can swap when life changes. Use filters to narrow by room, style, and more.",
  "office-furniture":
    "Set up a productive workspace with desks, seating, and storage, then refine results by size, finish, and more.",
};

export function isLocationSlug(value: string): value is LocationSlug {
  return locationOptions.some((location) => location.slug === value);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function getLocationLabel(locationSlug: LocationSlug): string {
  return (
    locationOptions.find((location) => location.slug === locationSlug)?.label ??
    locationOptions[0].label
  );
}

export function getCategoryLabel(category: CategorySlug): string {
  return categoryLabels[category];
}

export function getCategoryPath(
  locationSlug: LocationSlug,
  category: CategorySlug,
): string {
  return `/${locationSlug}/${category}`;
}

export function getSubcategoryPath(
  locationSlug: LocationSlug,
  category: CategorySlug,
  subcategorySlug?: string | null,
): string {
  if (subcategorySlug == null || subcategorySlug === "all") {
    return getCategoryPath(locationSlug, category);
  }

  return `${getCategoryPath(locationSlug, category)}/${subcategorySlug}`;
}

export function getLocationSlugFromPathname(
  pathname: string | null | undefined,
): LocationSlug | null {
  if (pathname == null) {
    return null;
  }

  const [firstSegment] = pathname.split("/").filter(Boolean);
  return firstSegment != null && isLocationSlug(firstSegment) ? firstSegment : null;
}

/**
 * When switching storefront location, rewrite `/[loc]/[cat](/[sub])?` to the new location.
 * Subcategory slug is preserved (validated at render time via Medusa, not static lists).
 */
export function getEquivalentLocationPath(
  pathname: string | null | undefined,
  locationSlug: LocationSlug,
): string | null {
  if (pathname == null) {
    return null;
  }

  const [currentLocation, category, subcategory, ...rest] = pathname
    .split("/")
    .filter(Boolean);

  if (
    !isLocationSlug(currentLocation) ||
    !isCategorySlug(category) ||
    rest.length > 0
  ) {
    return null;
  }

  if (subcategory == null || subcategory === "all") {
    return getCategoryPath(locationSlug, category);
  }

  return getSubcategoryPath(locationSlug, category, subcategory);
}

export function getAllLocationCategoryParams() {
  return locationOptions.flatMap(({ slug: location }) =>
    CATEGORY_SLUGS.map((category) => ({
      location,
      category,
    })),
  );
}
