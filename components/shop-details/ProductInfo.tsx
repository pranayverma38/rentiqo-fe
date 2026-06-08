"use client";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductDeposit,
  ProductShortDescription,
  ProductViews,
  ProductVariantPicker,
  ProductQuantityBuy,
  ProductDelivery,
  ProductRentalInfo,
} from "./product-info";

export default function ProductInfo({ product }: { product: ProductCardItem }) {
  const { registerPane } = useProduct();

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative mt-md-0 sticky-top">
        <div ref={registerPane} className="tf-zoom-main sticky-top" />
        <div className="tf-product-info-list other-image-zoom">
          <div className="tf-product-info-heading">
            <ProductTitle product={product} />
            <ProductPrice product={product} />
            <ProductDeposit product={product} />
            <ProductShortDescription product={product} />
            <ProductViews />
          </div>
          <div className="br-line" />

          <div className="tf-product-variant">
            <ProductVariantPicker />
            <ProductQuantityBuy product={product} />
          </div>


          <div className="br-line" />

          <ProductRentalInfo />
          <ProductDelivery />
        </div>
      </div>
    </div>
  );
}
