import type { ReactNode } from "react";

import CategoryShopListing from "@/components/catalog/CategoryShopListing";
import type {
  CategorySlug,
  LocationSlug,
} from "@/lib/catalog/subcategories";
import type { ShopProduct } from "@/types/shopFilter";

type CategorySubcategoryPageProps = {
  locationSlug: LocationSlug;
  categoryPath: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  subcategoryLabel: string;
  activeSubcategorySlug: string;
  description?: ReactNode;
  catalogProducts: ShopProduct[];
};

export default function CategorySubcategoryPage({
  locationSlug,
  categoryPath,
  categorySlug,
  categoryLabel,
  subcategoryLabel,
  activeSubcategorySlug,
  description,
  catalogProducts,
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
      catalogProducts={catalogProducts}
    />
  );
}
