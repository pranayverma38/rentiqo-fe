import type { ReactNode } from "react";

import CategoryShopListing from "@/components/catalog/CategoryShopListing";
import type {
  CategorySlug,
  LocationSlug,
} from "@/lib/catalog/subcategories";

type CategorySubcategoryPageProps = {
  locationSlug: LocationSlug;
  categoryPath: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  subcategoryLabel: string;
  activeSubcategorySlug: string;
  description?: ReactNode;
};

export default function CategorySubcategoryPage({
  locationSlug,
  categoryPath,
  categorySlug,
  categoryLabel,
  subcategoryLabel,
  activeSubcategorySlug,
  description,
}: CategorySubcategoryPageProps) {
  const desc =
    description ??
    `Browse ${subcategoryLabel} in our ${categoryLabel.toLowerCase()} collection.`;

  return (
    <CategoryShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { href: categoryPath, label: categoryLabel },
        { label: subcategoryLabel },
      ]}
      locationSlug={locationSlug}
      categoryPath={categoryPath}
      categorySlug={categorySlug}
      activeSubcategorySlug={activeSubcategorySlug}
      title={subcategoryLabel}
      description={desc}
    />
  );
}
