import { NextRequest, NextResponse } from "next/server";

import { isLocationSlug } from "@/lib/catalog/catalogRoutes";
import { fetchProductDetailForPage } from "@/lib/catalog/fetchProductDetail";
import { isRentiqoStoreCatalogConfigured } from "@/lib/catalog/rentiqoStoreCatalog";

/**
 * PDP refetch when the user changes city in the header.
 * GET /api/catalog/product-detail?id=bed1&location=gurugram
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const location = request.nextUrl.searchParams.get("location");

  if (id == null || id.trim().length === 0) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (location == null || !isLocationSlug(location)) {
    return NextResponse.json({ error: "Invalid location" }, { status: 400 });
  }

  if (!isRentiqoStoreCatalogConfigured()) {
    return NextResponse.json({ product: null });
  }

  try {
    const product = await fetchProductDetailForPage(id.trim(), location);
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[api/catalog/product-detail]", err);
    return NextResponse.json({ product: null });
  }
}
