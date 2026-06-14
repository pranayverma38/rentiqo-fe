"use client";

import { useProductOptional } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import { formatDepositAmount, getDepositAmount } from "@/utils/formatPrice";

export function ProductDeposit({ product }: { product: ProductCardItem }) {
  const ctx = useProductOptional();
  const price = ctx?.selectedVariant?.price ?? product.price;
  const deposit = getDepositAmount(price);

  return (
    <div className="product-infor-deposit mb-12">
      <p className="deposit-label text-caption-01 cl-text-2 mb-4">Deposit amount</p>
      <p className="deposit-amount fw-semibold mb-0">{formatDepositAmount(deposit)}</p>
    </div>
  );
}