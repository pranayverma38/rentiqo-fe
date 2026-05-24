"use client";

import { useEffect, useRef, useState } from "react";

import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductSection from "@/components/shop-details/ProductSection";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import type { ProductDetailItem } from "@/lib/catalog/rentiqoStoreCatalog";
import type { SizeOption } from "@/context/ProductContext";
import { useStore } from "@/context/store";

function galleryExtras(product: ProductDetailItem) {
  const images = product.galleryImages;
  if ((product.medusaVariants?.length ?? 0) > 0) {
    return images;
  }
  if (images.length <= 1) {
    return images;
  }
  return images.slice(1);
}

function toSizeOptions(values: string[] | undefined): SizeOption[] {
  return (values ?? []).map((value) => ({ value }));
}

function medusaSizeOptions(product: ProductDetailItem): SizeOption[] {
  if ((product.sizeOptions?.length ?? 0) > 0) {
    return toSizeOptions(product.sizeOptions);
  }
  const variants = product.medusaVariants ?? [];
  if (variants.length === 0) {
    return (product.sizes ?? []).map((value) => ({ value }));
  }
  if (product.hasDurationOption) {
    return [];
  }
  return variants.map((v) => ({
    value: v.label,
    variantId: v.id,
    price: String(v.price),
    thumbnail: v.thumbnail,
  }));
}

function initialSelections(product: ProductDetailItem) {
  const defaultVariant = product.medusaVariants?.[0];
  const ov = defaultVariant?.optionValues;

  return {
    initialDuration:
      ov?.duration ?? product.durationOptions?.[0] ?? "",
    initialColor:
      ov?.color?.toLowerCase() ??
      product.colors?.[0]?.label.toLowerCase() ??
      "",
    initialSize: ov?.size ?? product.sizeOptions?.[0] ?? product.sizes?.[0] ?? "",
  };
}

function markUnavailable(product: ProductDetailItem): ProductDetailItem {
  return {
    ...product,
    inStock: false,
    isStockOut: true,
  };
}

type ProductDetailViewProps = {
  productIdOrHandle: string;
  initialProduct: ProductDetailItem;
  initialLocation: LocationSlug;
};

export default function ProductDetailView({
  productIdOrHandle,
  initialProduct,
  initialLocation,
}: ProductDetailViewProps) {
  const selectedLocation = useStore((state) => state.selectedLocation);
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (selectedLocation === initialLocation) {
        return;
      }
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          id: productIdOrHandle,
          location: selectedLocation,
        });
        const res = await fetch(`/api/catalog/product-detail?${params.toString()}`);
        if (!res.ok || cancelled) {
          return;
        }
        const data = (await res.json()) as { product?: ProductDetailItem | null };
        if (cancelled) {
          return;
        }
        if (data.product != null) {
          setProduct(data.product);
          return;
        }
        setProduct((prev) => markUnavailable(prev));
      } catch {
        if (!cancelled) {
          setProduct((prev) => markUnavailable(prev));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedLocation, productIdOrHandle]);

  const layout = product.isStockOut ? "out-of-stock" : "default";
  const sizes = medusaSizeOptions(product);
  const colors = product.colors ?? [];
  const durationOptions = toSizeOptions(product.durationOptions);
  const medusaVariants = product.medusaVariants ?? [];
  const variantKey = medusaVariants.map((v) => v.id).join(",");
  const { initialDuration, initialColor, initialSize } = initialSelections(product);

  return (
    <>
      <Breadcrumb product={product} />
      <div className={loading ? "opacity-70 transition-opacity" : undefined}>
        <ProductSection
          key={`${selectedLocation}-${layout}-${variantKey}`}
          product={product}
          layout={layout}
          extraImages={galleryExtras(product)}
          sizes={sizes}
          durationOptions={durationOptions}
          colors={colors}
          medusaVariants={medusaVariants}
          optionTitle={product.optionTitle}
          hasDurationOption={product.hasDurationOption ?? false}
          initialDuration={initialDuration}
          initialColor={initialColor}
          initialSize={initialSize}
        />
      </div>
    </>
  );
}
