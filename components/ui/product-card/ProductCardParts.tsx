"use client";

import Image from "next/image";
import Link from "next/link";

import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";
import CountdownTimer from "@/components/common/Countdown";
import { ProductRatingStars } from "@/components/common/ProductRatingStars";
import {
  badgeClassFromBadge,
  resolveProductCardBadges,
} from "./productCardUtils";
import React from "react";

export function ProductCardDualImageLink({
  productId,
  activeImage,
  hoverImage,
  alt,
  width,
  height,
}: {
  productId: number | string;
  activeImage: string;
  hoverImage: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Link href={`/product-detail/${productId}`} className="product-img">
      <Image
        className="img-product"
        src={activeImage}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
      <Image
        className="img-hover"
        src={hoverImage}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </Link>
  );
}

export function ProductCardBadgeList({
  product,
}: {
  product: Pick<
    ProductCardItem,
    "badge" | "badgeTrend" | "price" | "priceOld"
  >;
}) {
  const { metaBadge, discountBadge, trendBadge } =
    resolveProductCardBadges(product);

  if (metaBadge == null && discountBadge == null && trendBadge == null) {
    return null;
  }

  return (
    <ul className="product-badge_list">
      {metaBadge != null && (
        <li
          className={`product-badge_item text-caption-01 ${badgeClassFromBadge(metaBadge)}`}
        >
          {metaBadge}
        </li>
      )}
      {discountBadge != null && (
        <li className="product-badge_item text-caption-01 sale">
          {discountBadge}
        </li>
      )}
      {trendBadge != null && (
        <li className="product-badge_item text-caption-01 trend">
          {trendBadge}
        </li>
      )}
    </ul>
  );
}

export function ProductCardMarquee({ text }: { text: string }) {
  return (
    <div className="product-marquee_sale">
      <div className="marquee-wrapper">
        <div className="initial-child-container">
          {[1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div className="marquee-child-item">{text}</div>
              <i className="icon icon-Star2" aria-hidden />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductCardPriceWrap({
  price,
  priceOld,
}: Pick<ProductCardItem, "price" | "priceOld">) {
  return (
    <div className="price-wrap">
      <span className="price-new text-primary fw-semibold">
        {formatPrice(price)}
      </span>
      {priceOld != null && priceOld > price && (
        <span className="price-old text-caption-01 cl-text-3">
          {formatPrice(priceOld)}
        </span>
      )}
    </div>
  );
}

export function ProductCardStars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <ProductRatingStars
      rating={rating}
      className={`star-wrap normal d-flex align-items-center ${className}`.trim()}
    />
  );
}

export function ProductCardColorSwatches({
  colors,
  activeImage,
  onHoverColor,
}: {
  colors: NonNullable<ProductCardItem["colors"]>;
  activeImage: string;
  onHoverColor: (img: string) => void;
}) {
  return (
    <ul className="product-color_list">
      {colors.map((color, i) => (
        <li
          key={`${color.label}-${i}`}
          onMouseEnter={() => onHoverColor(color.img)}
          className={`product-color-item color-swatch hover-tooltip tooltip-bot ${activeImage === color.img ? "active" : ""}`}
        >
          <span className="tooltip color-filter">{color.label}</span>
          <span className={`swatch-value ${color.swatchClass}`} />
          <Image src={color.img} alt={color.label} width={660} height={880} />
        </li>
      ))}
    </ul>
  );
}

export function ProductCardSizeList({
  sizes,
  className = "",
}: {
  sizes: string[];
  className?: string;
}) {
  return (
    <ul className={`product-size_list ${className}`.trim()}>
      {sizes.map((size) => (
        <li key={size} className="size-item text-caption-01">
          {size}
        </li>
      ))}
    </ul>
  );
}

export function ProductCardCountdown() {
  return (
    <div className="product-countdown">
      <div className="js-countdown cd-has-zero">
        <CountdownTimer style={1} />
      </div>
    </div>
  );
}
