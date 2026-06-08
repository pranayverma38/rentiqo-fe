import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailView from "@/components/catalog/ProductDetailView";
import ProductBenefits from "@/components/shop-details/ProductBenefits";
import {
  loadProductDetailPageProduct,
  resolveProductDetailLocation,
} from "@/lib/catalog/fetchProductDetail";
import { isRentiqoStoreCatalogConfigured } from "@/lib/catalog/rentiqoStoreCatalog";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";
import type { ProductDetailItem } from "@/lib/catalog/rentiqoStoreCatalog";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ location?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const location = await resolveProductDetailLocation(sp);
  const product = await loadProductDetailPageProduct(id, location);

  if (product == null) {
    return { title: `Product not found | ${AMERCE_SITE_TITLE}` };
  }

  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${AMERCE_DEFAULT_DESCRIPTION}`;

  return {
    title: `${product.name} | Product detail | ${AMERCE_SITE_TITLE}`,
    description: rawDesc.slice(0, 160),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ location?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const location = await resolveProductDetailLocation(sp);
  const product = await loadProductDetailPageProduct(id, location);

  if (product == null && isRentiqoStoreCatalogConfigured()) {
    notFound();
  }

  if (product == null) {
    notFound();
  }

  return (
    <>
      <ProductDetailView
        productIdOrHandle={id}
        initialProduct={product}
        initialLocation={location}
      />
      <ProductBenefits />
    </>
  );
}
