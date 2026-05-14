import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryShopListing from "@/components/catalog/CategoryShopListing";
import { fetchCatalogProducts } from "@/lib/catalog/fetchCatalogProducts";
import {
  fetchMedusaCategoryNavChildren,
  isRentiqoStoreCatalogConfigured,
} from "@/lib/catalog/rentiqoStoreCatalog";
import {
  categoryDescriptions,
  getAllLocationCategoryParams,
  getCategoryPath,
  getCategoryLabel,
  getLocationLabel,
  isCategorySlug,
  isLocationSlug,
} from "@/lib/catalog/catalogRoutes";
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

  const storeConfigured = isRentiqoStoreCatalogConfigured();
  const [catalogProducts, medusaNav] = await Promise.all([
    fetchCatalogProducts({
      location,
      category,
      subcategorySlug: null,
    }),
    storeConfigured
      ? fetchMedusaCategoryNavChildren(category, location)
      : Promise.resolve([]),
  ]);

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
      subcategoryNavSource={storeConfigured ? "medusa" : "static"}
      medusaSubcategoryNav={storeConfigured ? medusaNav : undefined}
    />
  );
}
