"use client";

import { ProductCardItem } from "@/types/productCard";

export function ProductExtraActions({
  product: _product,
}: {
  product?: ProductCardItem;
}) {
  void _product;
  return (
    <div className="tf-product-extra-link">
      <a href="#ask" data-bs-toggle="modal" className="product-extra-icon link">
        <i className="icon icon-Question" />
        Ask A Question
      </a>
      <a
        href="#findSize"
        data-bs-toggle="modal"
        className="product-extra-icon link"
      >
        <i className="icon icon-Ruler" />
        Size Guide
      </a>
      <a
        href="#share"
        data-bs-toggle="modal"
        className="product-extra-icon link"
      >
        <i className="icon icon-ShareNetwork" />
        Share
      </a>
    </div>
  );
}
