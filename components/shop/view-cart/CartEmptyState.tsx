import Link from "next/link";

import { CART_CONTROL, CART_PANEL_SOFT } from "./cartStyles";

export default function CartEmptyState() {
  return (
    <div
      className={`flex min-h-[360px] flex-col items-center justify-center ${CART_PANEL_SOFT} border-dashed px-[24px] py-[48px] text-center`}
    >
      <div
        className={`mb-[20px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--white)] text-[32px] cl-text-2`}
      >
        <i className="icon icon-Handbag" aria-hidden />
      </div>
      <h2 className="mb-[8px] text-[20px] font-medium text-[var(--text)]">
        Your cart is empty
      </h2>
      <p className="mb-[28px] max-w-[400px] text-[15px] leading-[1.5] cl-text-2">
        Looks like you haven&apos;t added anything yet. Browse our collection and
        start renting today.
      </p>
      <div className="flex flex-col gap-[12px] sm:flex-row">
        <Link href="/shop-default" className={`tf-btn animate-btn ${CART_CONTROL}`}>
          Start shopping
        </Link>
        <Link href="/" className={`tf-btn btn-stroke ${CART_CONTROL}`}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
