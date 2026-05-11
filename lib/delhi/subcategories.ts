export type DelhiSubcategory = {
  label: string;
  slug: string;
};

export const delhiSubcategories = {
  appliances: [
    { label: "Air Conditioners", slug: "air-conditioners" },
    { label: "Refrigerators", slug: "refrigerators" },
    { label: "TV's", slug: "tvs" },
    { label: "Washing Machines", slug: "washing-machines" },
  ],
  combos: [
    { label: "All", slug: "all" },
    { label: "Bedroom", slug: "bedroom" },
    { label: "Living room", slug: "living-room" },
    { label: "Dining room", slug: "dining-room" },
  ],
  "home-furniture": [
    { label: "Beds", slug: "beds" },
    { label: "Tables", slug: "tables" },
    { label: "Mattresses", slug: "mattresses" },
    { label: "Wardrobes", slug: "wardrobes" },
    { label: "Chairs", slug: "chairs" },
    { label: "Sofas", slug: "sofas" },
    { label: "Dining", slug: "dining" },
    { label: "Dressers", slug: "dressers" },
  ],
  "office-furniture": [{ label: "All", slug: "all" }],
} as const satisfies Record<string, readonly DelhiSubcategory[]>;

export type DelhiCategorySlug = keyof typeof delhiSubcategories;

export function getDelhiSubcategories(
  category: DelhiCategorySlug,
): readonly DelhiSubcategory[] {
  return delhiSubcategories[category];
}

export function getDelhiSubcategoryLabel(
  category: DelhiCategorySlug,
  subcategorySlug: string,
): string | null {
  return (
    delhiSubcategories[category].find(
      ({ slug }) => slug === subcategorySlug,
    )?.label ?? null
  );
}

export function getDelhiSubcategoryParams(category: DelhiCategorySlug) {
  return delhiSubcategories[category].map(({ slug }) => ({
    subcategory: slug,
  }));
}
