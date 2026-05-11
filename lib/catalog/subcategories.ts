export type Subcategory = {
  label: string;
  slug: string;
  imageSrc?: string;
  imageAlt?: string;
};

export const locationOptions = [
  { label: "Delhi", slug: "delhi" },
  { label: "Gurugram", slug: "gurugram" },
  { label: "Noida", slug: "noida" },
] as const;

export type LocationSlug = (typeof locationOptions)[number]["slug"];

const ALL_SUBCATEGORY: Subcategory = {
  label: "All",
  slug: "all",
};

const baseSubcategories = {
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
} as const satisfies Record<string, readonly Subcategory[]>;

export type CategorySlug = keyof typeof baseSubcategories;

const gurugramSubcategories: Record<CategorySlug, readonly Subcategory[]> = {
  appliances: [
    ...baseSubcategories.appliances,
    {
      label: "Microwaves",
      slug: "microwaves",
      imageSrc: "/assets/images/category/electric/cate-7.jpg",
      imageAlt: "Microwaves",
    },
  ],
  combos: [
    ...baseSubcategories.combos,
    {
      label: "Studio setup",
      slug: "studio-setup",
      imageSrc: "/assets/images/collection/furniture/cls-2.jpg",
      imageAlt: "Studio setup combo",
    },
  ],
  "home-furniture": [
    ...baseSubcategories["home-furniture"],
    {
      label: "Study tables",
      slug: "study-tables",
      imageSrc: "/assets/images/category/furniture/cate-4.jpg",
      imageAlt: "Study tables",
    },
  ],
  "office-furniture": [
    { label: "All", slug: "all" },
    { label: "Office desks", slug: "office-desks" },
    { label: "Ergonomic chairs", slug: "ergonomic-chairs" },
    { label: "Storage units", slug: "storage-units" },
  ],
};

const noidaSubcategories: Record<CategorySlug, readonly Subcategory[]> = {
  appliances: [
    ...baseSubcategories.appliances,
    {
      label: "Air Purifiers",
      slug: "air-purifiers",
      imageSrc: "/assets/images/category/electric/cate-3.jpg",
      imageAlt: "Air purifiers",
    },
  ],
  combos: [
    ...baseSubcategories.combos,
    {
      label: "Student room",
      slug: "student-room",
      imageSrc: "/assets/images/collection/furniture/cls-1.jpg",
      imageAlt: "Student room combo",
    },
  ],
  "home-furniture": [
    ...baseSubcategories["home-furniture"],
    {
      label: "TV units",
      slug: "tv-units",
      imageSrc: "/assets/images/collection/furniture/cls-2.jpg",
      imageAlt: "TV units",
    },
    {
      label: "Study tables",
      slug: "study-tables",
      imageSrc: "/assets/images/category/furniture/cate-4.jpg",
      imageAlt: "Study tables",
    },
  ],
  "office-furniture": [
    { label: "All", slug: "all" },
    { label: "Workstations", slug: "workstations" },
    { label: "Meeting tables", slug: "meeting-tables" },
    { label: "Office chairs", slug: "office-chairs" },
  ],
};

const subcategoriesByLocation: Record<
  LocationSlug,
  Record<CategorySlug, readonly Subcategory[]>
> = {
  delhi: baseSubcategories,
  gurugram: gurugramSubcategories,
  noida: noidaSubcategories,
};

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

export function getLocationLabel(locationSlug: LocationSlug): string {
  return (
    locationOptions.find((location) => location.slug === locationSlug)?.label ??
    locationOptions[0].label
  );
}

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(baseSubcategories, value);
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

export function getCategoryMenuItems(
  locationSlug: LocationSlug,
  category: CategorySlug,
) {
  return getLocationCategoryFilters(locationSlug, category).map((subcategory) => ({
    ...subcategory,
    href: getSubcategoryPath(locationSlug, category, subcategory.slug),
  }));
}

export function getLocationSubcategories(
  locationSlug: LocationSlug,
  category: CategorySlug,
): readonly Subcategory[] {
  return subcategoriesByLocation[locationSlug][category];
}

export function getLocationCategoryFilters(
  locationSlug: LocationSlug,
  category: CategorySlug,
): readonly Subcategory[] {
  const subcategories = getLocationSubcategories(locationSlug, category);
  const allItem =
    subcategories.find(({ slug }) => slug === ALL_SUBCATEGORY.slug) ??
    ALL_SUBCATEGORY;

  return [
    allItem,
    ...subcategories.filter(({ slug }) => slug !== ALL_SUBCATEGORY.slug),
  ];
}

export function getLocationSubcategoryLabel(
  locationSlug: LocationSlug,
  category: CategorySlug,
  subcategorySlug: string,
): string | null {
  return (
    getLocationSubcategories(locationSlug, category).find(
      ({ slug }) => slug === subcategorySlug,
    )?.label ?? null
  );
}

export function getLocationSubcategoryParams(
  locationSlug: LocationSlug,
  category: CategorySlug,
) {
  return getLocationSubcategories(locationSlug, category).map(({ slug }) => ({
    subcategory: slug,
  }));
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

  return getLocationSubcategoryLabel(locationSlug, category, subcategory) != null
    ? getSubcategoryPath(locationSlug, category, subcategory)
    : getCategoryPath(locationSlug, category);
}

export function getAllLocationCategoryParams() {
  return locationOptions.flatMap(({ slug: location }) =>
    (Object.keys(subcategoriesByLocation[location]) as CategorySlug[]).map(
      (category) => ({
        location,
        category,
      }),
    ),
  );
}

export function getAllLocationCategorySubcategoryParams() {
  return locationOptions.flatMap(({ slug: location }) =>
    (Object.keys(subcategoriesByLocation[location]) as CategorySlug[]).flatMap(
      (category) =>
        getLocationSubcategoryParams(location, category).map(({ subcategory }) => ({
          location,
          category,
          subcategory,
        })),
    ),
  );
}
