import type { ProductCardItem } from "@/types/productCard";

const DEFAULT_SHORT_DESCRIPTION =
  "Quality rental furniture and appliances. Flexible plans for your home.";

export function ProductShortDescription({
  product,
}: {
  product?: ProductCardItem;
}) {
  const text =
    (typeof product?.subtitle === "string" && product.subtitle.trim().length > 0
      ? product.subtitle
      : typeof product?.description === "string" &&
          product.description.trim().length > 0
        ? product.description
        : DEFAULT_SHORT_DESCRIPTION) ?? DEFAULT_SHORT_DESCRIPTION;

  return <p className="product-infor-desc cl-text-2 mb-12">{text}</p>;
}