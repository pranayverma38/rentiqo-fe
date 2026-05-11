export type DelhiSubcategory = {
  label: string;
  slug: string;
  imageSrc?: string;
  imageAlt?: string;
};

const ALL_SUBCATEGORY: DelhiSubcategory = {
  label: "All",
  slug: "all",
};

export const delhiSubcategories = {
  appliances: [
    {
      label: "Air Conditioners",
      slug: "air-conditioners",
      imageSrc: "/assets/images/category/electric/cate-6.jpg",
      imageAlt: "Air conditioners",
    },
    {
      label: "Refrigerators",
      slug: "refrigerators",
      imageSrc: "/assets/images/category/electric/cate-8.jpg",
      imageAlt: "Refrigerators",
    },
    {
      label: "TV's",
      slug: "tvs",
      imageSrc: "/assets/images/category/electric/cate-4.jpg",
      imageAlt: "Televisions",
    },
    {
      label: "Washing Machines",
      slug: "washing-machines",
      imageSrc: "/assets/images/category/electric/cate-5.jpg",
      imageAlt: "Washing machines",
    },
  ],
  combos: [
    { label: "All", slug: "all" },
    {
      label: "Bedroom",
      slug: "bedroom",
      imageSrc: "/assets/images/collection/furniture/cls-1.jpg",
      imageAlt: "Bedroom combo",
    },
    {
      label: "Living room",
      slug: "living-room",
      imageSrc: "/assets/images/collection/furniture/cls-2.jpg",
      imageAlt: "Living room combo",
    },
    {
      label: "Dining room",
      slug: "dining-room",
      imageSrc: "/assets/images/collection/furniture/cls-3.jpg",
      imageAlt: "Dining room combo",
    },
  ],
  "home-furniture": [
    {
      label: "Beds",
      slug: "beds",
      imageSrc: "/assets/images/category/furniture/cate-5.jpg",
      imageAlt: "Beds",
    },
    {
      label: "Tables",
      slug: "tables",
      imageSrc: "/assets/images/category/furniture/cate-4.jpg",
      imageAlt: "Tables",
    },
    {
      label: "Mattresses",
      slug: "mattresses",
      imageSrc: "/assets/images/category/furniture/cate-1.jpg",
      imageAlt: "Mattresses",
    },
    {
      label: "Wardrobes",
      slug: "wardrobes",
      imageSrc: "/assets/images/category/furniture/cate-6.jpg",
      imageAlt: "Wardrobes",
    },
    {
      label: "Chairs",
      slug: "chairs",
      imageSrc: "/assets/images/category/furniture/cate-3.jpg",
      imageAlt: "Chairs",
    },
    {
      label: "Sofas",
      slug: "sofas",
      imageSrc: "/assets/images/category/furniture/cate-2.jpg",
      imageAlt: "Sofas",
    },
    {
      label: "Dining",
      slug: "dining",
      imageSrc: "/assets/images/collection/furniture/cls-3.jpg",
      imageAlt: "Dining furniture",
    },
    {
      label: "Dressers",
      slug: "dressers",
      imageSrc: "/assets/images/collection/furniture/cls-2.jpg",
      imageAlt: "Dressers",
    },
  ],
  "office-furniture": [{ label: "All", slug: "all" }],
} as const satisfies Record<string, readonly DelhiSubcategory[]>;

export type DelhiCategorySlug = keyof typeof delhiSubcategories;

export function getDelhiSubcategories(
  category: DelhiCategorySlug,
): readonly DelhiSubcategory[] {
  return delhiSubcategories[category];
}

export function getDelhiCategoryFilters(
  category: DelhiCategorySlug,
): readonly DelhiSubcategory[] {
  const subcategories = delhiSubcategories[category];
  const allItem =
    subcategories.find(({ slug }) => slug === ALL_SUBCATEGORY.slug) ??
    ALL_SUBCATEGORY;

  return [
    allItem,
    ...subcategories.filter(({ slug }) => slug !== ALL_SUBCATEGORY.slug),
  ];
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
