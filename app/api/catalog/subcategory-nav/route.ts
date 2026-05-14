import { NextRequest, NextResponse } from "next/server";

import {
  getCategoryPath,
  getSubcategoryPath,
  isCategorySlug,
  isLocationSlug,
} from "@/lib/catalog/catalogRoutes";
import {
  fetchMedusaCategoryNavChildren,
  isRentiqoStoreCatalogConfigured,
} from "@/lib/catalog/rentiqoStoreCatalog";

export type CatalogNavApiItem = {
  label: string;
  href: string;
};

/**
 * Mega-menu links for a top-level category, aligned with `CategoryFilter` (Medusa + region).
 */
export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");
  const category = request.nextUrl.searchParams.get("category");

  if (
    location == null ||
    category == null ||
    !isLocationSlug(location) ||
    !isCategorySlug(category)
  ) {
    return NextResponse.json(
      { error: "Invalid location or category" },
      { status: 400 },
    );
  }

  if (!isRentiqoStoreCatalogConfigured()) {
    return NextResponse.json({ items: [] satisfies CatalogNavApiItem[] });
  }

  try {
    const nav = await fetchMedusaCategoryNavChildren(category, location);
    const items: CatalogNavApiItem[] = [
      { label: "All", href: getCategoryPath(location, category) },
      ...nav.map((row) => ({
        label: row.name,
        href: getSubcategoryPath(location, category, row.handle),
      })),
    ];
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[api/catalog/subcategory-nav]", err);
    return NextResponse.json({ items: [] satisfies CatalogNavApiItem[] });
  }
}
