import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DelhiCategorySubcategoryPage from "@/components/delhi/DelhiCategorySubcategoryPage";
import {
  getDelhiSubcategoryLabel,
  getDelhiSubcategoryParams,
} from "@/lib/delhi/subcategories";
import { shopRouteMetadata } from "@/lib/metadata/shop";

const CATEGORY_PATH = "/delhi/appliances";
const CATEGORY_LABEL = "Appliances";
const CATEGORY_SLUG = "appliances";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDelhiSubcategoryParams(CATEGORY_SLUG);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}): Promise<Metadata> {
  const { subcategory } = await params;
  const label = getDelhiSubcategoryLabel(CATEGORY_SLUG, subcategory);
  if (label == null) {
    notFound();
  }
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
  const label = getDelhiSubcategoryLabel(CATEGORY_SLUG, subcategory);
  if (label == null) {
    notFound();
  }
  return (
    <DelhiCategorySubcategoryPage
      categoryPath={CATEGORY_PATH}
      categoryLabel={CATEGORY_LABEL}
      subcategoryLabel={label}
    />
  );
}
