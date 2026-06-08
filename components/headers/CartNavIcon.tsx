"use client";

import Link from "next/link";

import CartIconCount from "./CartIconCount";

type CartNavIconProps = {
  className?: string;
};

/** Header cart icon — always opens the full cart page. */
export default function CartNavIcon({
  className = "nav-icon-item link shop-cart",
}: CartNavIconProps) {
  return (
    <Link href="/view-cart"
              className={className} aria-label="Cart">
      <i className="icon icon-Handbag" />
      <CartIconCount />
    </Link>
  );
}