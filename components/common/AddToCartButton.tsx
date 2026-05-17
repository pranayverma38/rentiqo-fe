"use client";

import Link from "next/link";
import { useContextElement, Product } from "@/context/Context";

interface AddToCartButtonProps {
  product?: Product;
  quantity?: number;
  href?: string;
  dataToggle?: "modal" | "offcanvas";
  className?: string;
  label?: string;
  variant?: "default" | "icon" | "tooltip";
  /** Add default variant to cart on click (no modal). Shows "Go to Cart" when already in cart. */
  directAdd?: boolean;
  goToCartHref?: string;
}

function resolveCartLookupId(product: Product): string | number {
  return product.medusaVariantId ?? product.medusaProductId ?? product.id;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  href = "#shoppingCart",
  dataToggle = "offcanvas",
  className,
  label = "Add to Cart",
  variant = "default",
  directAdd = false,
  goToCartHref = "/view-cart",
}: AddToCartButtonProps) {
  const { addProductToCart, isAddedToCartProducts, setQuickAddItem } =
    useContextElement();
  const cartLookupId = product ? resolveCartLookupId(product) : null;
  const isAdded =
    cartLookupId != null ? isAddedToCartProducts(cartLookupId) : false;
  const isQuickAddTrigger = !directAdd && href === "#quickAdd";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    if (isQuickAddTrigger) {
      setQuickAddItem(product.id);
      return;
    }

    addProductToCart(product, quantity);
  };

  const displayLabel = (() => {
    if (directAdd && isAdded) return "Go to Cart";
    if (!isQuickAddTrigger && isAdded) {
      if (variant === "default") return "Added to Cart";
      return "Added";
    }
    return label;
  })();

  const activeClass = (!isQuickAddTrigger && isAdded) || (directAdd && isAdded)
    ? "added"
    : "";

  const defaultClass =
    variant === "tooltip"
      ? "hover-tooltip tooltip-left btn-action"
      : variant === "icon"
        ? "btn-action"
        : "tf-btn btn-white small w-100";

  const buttonClass =
    `tf-btn-reset ${className || defaultClass} ${activeClass}`.trim();

  if (directAdd && isAdded) {
    if (variant === "tooltip") {
      return (
        <Link
          href={goToCartHref}
          className={buttonClass}
          onClick={(e) => e.stopPropagation()}
        >
          <i className="icon icon-Handbag" aria-hidden />
          <span className="tooltip" suppressHydrationWarning>
            {displayLabel}
          </span>
        </Link>
      );
    }

    if (variant === "icon") {
      return (
        <Link
          href={goToCartHref}
          className={buttonClass}
          onClick={(e) => e.stopPropagation()}
        >
          <i className="icon icon-Handbag" aria-hidden />
          <span className="text fw-semibold ml-1" suppressHydrationWarning>
            {displayLabel}
          </span>
        </Link>
      );
    }

    return (
      <Link
        href={goToCartHref}
        className={buttonClass}
        onClick={(e) => e.stopPropagation()}
      >
        {displayLabel}
      </Link>
    );
  }

  const bsTarget =
    !directAdd && href.startsWith("#") && href.length > 1 ? href : undefined;

  if (variant === "tooltip") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={directAdd ? undefined : dataToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={buttonClass}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="tooltip" suppressHydrationWarning>
          {displayLabel}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={directAdd ? undefined : dataToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={buttonClass}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="text fw-semibold ml-1" suppressHydrationWarning>
          {displayLabel}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-bs-toggle={directAdd ? undefined : dataToggle}
      data-bs-target={bsTarget}
      suppressHydrationWarning
      className={buttonClass}
    >
      {displayLabel}
    </button>
  );
}
