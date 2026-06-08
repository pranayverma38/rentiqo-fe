import { ProductCardItem } from "@/types/productCard";

import { ProductRatingStars } from "@/components/common/ProductRatingStars";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  const category =
    typeof product.category === "string" && product.category.length > 0
      ? product.category
      : "Furniture";
  const reviewsText =
    typeof product.reviewsText === "string" && product.reviewsText.length > 0
      ? product.reviewsText
      : "(0 reviews)";
  const rating =
    typeof product.rating === "number" && Number.isFinite(product.rating)
      ? product.rating
      : 0;
  // const sku =
  //   typeof product.sku === "string" && product.sku.length > 0
  //     ? product.sku
  //     : "53453412";

  return (
    <>
      <p className="product-infor-cate text-caption-01 mb-4 text-capitalize">
        {category}
      </p>

      <h3 className="product-infor-name mb-12 text-capitalize">
        {product.name}
      </h3>
      <div className="product-infor-meta mb-20">
        <div className="meta_rate">
          <ProductRatingStars rating={rating} />
          <span className="text-caption-01 cl-text-2">{reviewsText}</span>
        </div>
        <div className="br-line type-vertical" />
        <div className="meta_sold">
          <i className="icon icon-Lightning text-primary" />
          <span className="text-caption-01 cl-text-2">
            18&nbsp;sold in last&nbsp;32&nbsp;hours
          </span>
        </div>
        {/* <div className="br-line type-vertical" />
        <div className="meta_prd_code text-caption-01">
          <span className="cl-text-2">SKU:</span>
          <span>{sku}</span>
        </div> */}
      </div>
    </>
  );
}