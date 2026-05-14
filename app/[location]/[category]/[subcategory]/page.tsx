import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategorySubcategoryPage from "@/components/catalog/CategorySubcategoryPage";
import { fetchCatalogProducts } from "@/lib/catalog/fetchCatalogProducts";
import {
  getAllLocationCategorySubcategoryParams,
  getCategoryPath,
  getCategoryLabel,
  getLocationLabel,
  getLocationSubcategoryLabel,
  isCategorySlug,
  isLocationSlug,
} from "@/lib/catalog/subcategories";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLocationCategorySubcategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { location, category, subcategory } = await params;
  if (!isLocationSlug(location) || !isCategorySlug(category)) {
    notFound();
  }

  const subcategoryLabel = getLocationSubcategoryLabel(
    location,
    category,
    subcategory,
  );
  if (subcategoryLabel == null) {
    notFound();
  }

  return shopRouteMetadata(
    `${subcategoryLabel} — ${getCategoryLabel(category)} in ${getLocationLabel(
      location,
    )}`,
    `Browse ${subcategoryLabel} in ${getLocationLabel(location)} with filters, sorting, and grid or list view.`,
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string; category: string; subcategory: string }>;
}) {
  const { location, category, subcategory } = await params;
  if (!isLocationSlug(location) || !isCategorySlug(category)) {
    notFound();
  }

  const subcategoryLabel = getLocationSubcategoryLabel(
    location,
    category,
    subcategory,
  );
  if (subcategoryLabel == null) {
    notFound();
  }

  const catalogProducts = await fetchCatalogProducts({
    location,
    category,
    subcategorySlug: subcategory,
  });

  return (
    <CategorySubcategoryPage
      locationSlug={location}
      categoryPath={getCategoryPath(location, category)}
      categorySlug={category}
      categoryLabel={getCategoryLabel(category)}
      subcategoryLabel={subcategoryLabel}
      activeSubcategorySlug={subcategory}
      description={`Browse ${subcategoryLabel} in ${getLocationLabel(location)} from our ${getCategoryLabel(
        category,
      ).toLowerCase()} collection.`}
      catalogProducts={catalogProducts}
    />
  );
}
