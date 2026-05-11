import type { ReactNode } from "react";

import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import { slugToLabel } from "@/lib/delhi/slugToLabel";

type DelhiCategorySubcategoryPageProps = {
  categoryPath: string;
  categoryLabel: string;
  subSlug: string;
  /** Optional hero line; defaults to a generic line using the subcategory label */
  description?: ReactNode;
};

export default function DelhiCategorySubcategoryPage({
  categoryPath,
  categoryLabel,
  subSlug,
  description,
}: DelhiCategorySubcategoryPageProps) {
  const label = slugToLabel(subSlug);
  const desc =
    description ??
    `Browse ${label} in our ${categoryLabel.toLowerCase()} collection.`;

  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { href: categoryPath, label: categoryLabel },
        { label },
      ]}
      title={label}
      description={desc}
    />
  );
}
