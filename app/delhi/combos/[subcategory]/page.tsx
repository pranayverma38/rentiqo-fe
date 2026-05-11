import type { Metadata } from "next";

import DelhiCategorySubcategoryPage from "@/components/delhi/DelhiCategorySubcategoryPage";
import { slugToLabel } from "@/lib/delhi/slugToLabel";
import { shopRouteMetadata } from "@/lib/metadata/shop";

const CATEGORY_PATH = "/delhi/combos";
const CATEGORY_LABEL = "Combos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}): Promise<Metadata> {
  const { subcategory } = await params;
  const label = slugToLabel(subcategory);
  return shopRouteMetadata(
    `${label} — ${CATEGORY_LABEL}`,
    `Browse ${label} with filters, sorting, and grid or list view.`,
  );
}

export default async function page({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory } = await params;
  return (
    <DelhiCategorySubcategoryPage
      categoryPath={CATEGORY_PATH}
      categoryLabel={CATEGORY_LABEL}
      subSlug={subcategory}
    />
  );
}
