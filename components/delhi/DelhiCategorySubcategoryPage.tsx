import type { ReactNode } from "react";

import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import type { DelhiCategorySlug } from "@/lib/delhi/subcategories";

type DelhiCategorySubcategoryPageProps = {
  categoryPath: string;
  categorySlug: DelhiCategorySlug;
  categoryLabel: string;
  subcategoryLabel: string;
  activeSubcategorySlug: string;
  /** Optional hero line; defaults to a generic line using the subcategory label */
  description?: ReactNode;
};

export default function DelhiCategorySubcategoryPage({
  categoryPath,
  categorySlug,
  categoryLabel,
  subcategoryLabel,
  activeSubcategorySlug,
  description,
}: DelhiCategorySubcategoryPageProps) {
  const desc =
    description ??
    `Browse ${subcategoryLabel} in our ${categoryLabel.toLowerCase()} collection.`;

  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { href: categoryPath, label: categoryLabel },
        { label: subcategoryLabel },
      ]}
      categoryPath={categoryPath}
      categorySlug={categorySlug}
      activeSubcategorySlug={activeSubcategorySlug}
      title={subcategoryLabel}
      description={desc}
    />
  );
}
