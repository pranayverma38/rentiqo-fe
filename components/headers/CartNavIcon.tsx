"use client";

import Link from "next/link";

import CartIconCount from "./CartIconCount";

type CartNavIconProps = {
  className?: string;
};

/**
 * Mobile (below xl): navigate to full cart page.
 * Desktop: open cart offcanvas drawer.
 */
export default function CartNavIcon({
  className = "nav-icon-item link shop-cart",
}: CartNavIconProps) {
  return (
    <>
      <Link href="/view-cart" className={`${className} d-xl-none`} aria-label="Cart">
        <i className="icon icon-Handbag" />
        <CartIconCount />
      </Link>
      <a
        href="#shoppingCart"
        data-bs-toggle="offcanvas"
        className={`${className} d-none d-xl-inline-flex`}
        aria-label="Open cart"
        suppressHydrationWarning
      >
        <i className="icon icon-Handbag" />
        <CartIconCount />
      </a>
    </>
  );
}
