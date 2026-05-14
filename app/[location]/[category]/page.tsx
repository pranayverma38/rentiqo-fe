import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryShopListing from "@/components/catalog/CategoryShopListing";
import { fetchCatalogProducts } from "@/lib/catalog/fetchCatalogProducts";
import {
  categoryDescriptions,
  getAllLocationCategoryParams,
  getCategoryPath,
  getCategoryLabel,
  getLocationLabel,
  isCategorySlug,
  isLocationSlug,
} from "@/lib/catalog/subcategories";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLocationCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; category: string }>;
}): Promise<Metadata> {
  const { location, category } = await params;
  if (!isLocationSlug(location) || !isCategorySlug(category)) {
    notFound();
  }

  return shopRouteMetadata(
    `${getCategoryLabel(category)} in ${getLocationLabel(location)}`,
    categoryDescriptions[category],
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string; category: string }>;
}) {
  const { location, category } = await params;
  if (!isLocationSlug(location) || !isCategorySlug(category)) {
    notFound();
  }

  const categoryLabel = getCategoryLabel(category);

  const catalogProducts = await fetchCatalogProducts({
    location,
    category,
    subcategorySlug: null,
  });

  return (
    <CategoryShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { label: categoryLabel },
      ]}
      locationSlug={location}
      categoryPath={getCategoryPath(location, category)}
      categorySlug={category}
      title={categoryLabel}
      description={categoryDescriptions[category]}
      catalogProducts={catalogProducts}
    />
  );
}
