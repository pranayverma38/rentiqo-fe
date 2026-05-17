import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategorySubcategoryPage from "@/components/catalog/CategorySubcategoryPage";
import {
  getCategoryLabel,
  getCategoryPath,
  getLocationLabel,
  isCategorySlug,
  isLocationSlug,
  type CategorySlug,
} from "@/lib/catalog/catalogRoutes";
import { fetchCatalogProducts } from "@/lib/catalog/fetchCatalogProducts";
import {
  fetchMedusaCategoryNavChildren,
  isRentiqoStoreCatalogConfigured,
  resolveMedusaSubcategoryDisplayName,
} from "@/lib/catalog/rentiqoStoreCatalog";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

function humanizeSubcategorySlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function resolveSubcategoryLabel(
  category: CategorySlug,
  subcategory: string,
): Promise<string> {
  if (subcategory === "all") {
    return "All";
  }

  const storeConfigured = isRentiqoStoreCatalogConfigured();
  if (storeConfigured) {
    const fromMedusa = await resolveMedusaSubcategoryDisplayName(
      category,
      subcategory,
    );
    if (fromMedusa == null) {
      notFound();
    }
    return fromMedusa;
  }

  return humanizeSubcategorySlug(subcategory);
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

  const subcategoryLabel = await resolveSubcategoryLabel(category, subcategory);

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

  const subcategoryLabel = await resolveSubcategoryLabel(category, subcategory);

  const storeConfigured = isRentiqoStoreCatalogConfigured();
  const [catalogProducts, medusaNav] = await Promise.all([
    fetchCatalogProducts({
      location,
      category,
      subcategorySlug: subcategory,
    }),
    storeConfigured
      ? fetchMedusaCategoryNavChildren(category, location)
      : Promise.resolve([]),
  ]);

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
      subcategoryNavSource={storeConfigured ? "medusa" : "static"}
      medusaSubcategoryNav={storeConfigured ? medusaNav : undefined}
    />
  );
}
