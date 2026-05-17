import type { ReactNode } from "react";

import CategoryShopListing from "@/components/catalog/CategoryShopListing";
import type { MedusaSubcategoryNavItem } from "@/lib/catalog/rentiqoStoreCatalog";
import type {
  CategorySlug,
  LocationSlug,
} from "@/lib/catalog/catalogRoutes";
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
  subcategoryNavSource?: "static" | "medusa";
  medusaSubcategoryNav?: MedusaSubcategoryNavItem[];
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
  subcategoryNavSource = "static",
  medusaSubcategoryNav,
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
      subcategoryNavSource={subcategoryNavSource}
      medusaSubcategoryNav={medusaSubcategoryNav}
    />
  );
}
