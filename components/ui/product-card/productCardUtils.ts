import type { ProductCardGridVariant } from "./productCardTypes";

/** Layout flags for shop grid hover variants (02–04 toolbar, 03/04 style classes). */
export function shopHoverBarFlags(variant: ProductCardGridVariant) {
  const isShopGridHoverBar =
    variant === "shopGridHover02" ||
    variant === "shopGridHover03" ||
    variant === "shopGridHover04";

  const shopHoverActionClass =
    variant === "shopGridHover02"
      ? "hover-tooltip tooltip-left box-icon"
      : "hover-tooltip box-icon";

  const shopGridStyleClass =
    variant === "shopGridHover03"
      ? " style-2"
      : variant === "shopGridHover04"
        ? " style-4"
        : "";

  return { isShopGridHoverBar, shopHoverActionClass, shopGridStyleClass };
}

export function badgeClassFromBadge(badge: string | undefined): string {
  return badge?.toUpperCase() === "NEW" ? "new" : "sale";
}

/** Theme demo and Medusa listings use `-25%`-style sale labels on `badge`. */
export function isDiscountPercentBadge(badge: string | undefined): boolean {
  return badge != null && /^-\d+%$/.test(badge.trim());
}

/** Sale badge from compare-at pricing (`original_amount` > `calculated_amount`). */
export function resolveDiscountPercentBadge(
  price: number,
  priceOld?: number,
): string | undefined {
  if (
    priceOld == null ||
    !Number.isFinite(price) ||
    !Number.isFinite(priceOld) ||
    priceOld <= price ||
    priceOld <= 0
  ) {
    return undefined;
  }

  const pct = Math.round(((priceOld - price) / priceOld) * 100);
  return pct > 0 ? `-${pct}%` : undefined;
}

export function resolveProductCardBadges(product: {
  badge?: string;
  badgeTrend?: string;
  price: number;
  priceOld?: number;
}): {
  metaBadge?: string;
  discountBadge?: string;
  trendBadge?: string;
} {
  const computedDiscount = resolveDiscountPercentBadge(
    product.price,
    product.priceOld,
  );
  const legacyDiscount =
    product.badge != null && isDiscountPercentBadge(product.badge)
      ? product.badge
      : undefined;
  const metaBadge =
    product.badge != null && legacyDiscount == null ? product.badge : undefined;

  return {
    metaBadge,
    discountBadge: computedDiscount ?? legacyDiscount,
    trendBadge: product.badgeTrend,
  };
}

export const STAR_COUNT = 5;
