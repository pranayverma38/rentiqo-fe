"use client";

import { useProductOptional } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductPrice({ product }: { product: ProductCardItem }) {
  const ctx = useProductOptional();
  const price = ctx?.selectedVariant?.price ?? product.price;
  const priceOld = ctx?.selectedVariant?.priceOld ?? product.priceOld;

  return (
    <div className="product-infor-price mb-12">
      <h4 className="price-on-sale">{formatInr(price)}</h4>
      {priceOld != null && priceOld > price && (
        <>
          <div className="br-line type-vertical" />
          <p className="cl-text-3 text-decoration-line-through">
            {formatInr(priceOld)}
          </p>
          <span className="badge-sale text-white fw-semibold text-caption-02">
            -{Math.round(((priceOld - price) / priceOld) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
