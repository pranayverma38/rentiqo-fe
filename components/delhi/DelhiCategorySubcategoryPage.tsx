import type { ReactNode } from "react";

import DelhiShopListing from "@/components/delhi/DelhiShopListing";

type DelhiCategorySubcategoryPageProps = {
  categoryPath: string;
  categoryLabel: string;
  subcategoryLabel: string;
  /** Optional hero line; defaults to a generic line using the subcategory label */
  description?: ReactNode;
};

export default function DelhiCategorySubcategoryPage({
  categoryPath,
  categoryLabel,
  subcategoryLabel,
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
      title={subcategoryLabel}
      description={desc}
    />
  );
}
