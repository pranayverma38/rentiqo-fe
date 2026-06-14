"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

import { formatDepositAmount } from "@/utils/formatPrice";

import { CART_CONTROL } from "./cartStyles";

type CartMobileCheckoutBarProps = {
  payableToday: number;
  itemCount: number;
};

export default function CartMobileCheckoutBar({
  payableToday,
  itemCount,
}: CartMobileCheckoutBarProps) {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/checkout" : "/login?redirect=/view-cart";
  const ctaLabel = isAuthenticated ? "Checkout" : "Login";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] border-t border-[var(--line)] bg-[var(--white)] py-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="container">
        <div className="flex items-center gap-[16px]">
          <div className="min-w-0 flex-1">
            <p className="mb-0 text-[11px] font-medium uppercase tracking-[0.04em] cl-text-2">
              Total payable
            </p>
            <p className="mb-0 text-[20px] font-semibold text-[var(--text)]">
              {formatDepositAmount(payableToday)}
            </p>
            <p className="mb-0 text-[11px] cl-text-2">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href={ctaHref}
            className={`tf-btn shrink-0 ${CART_CONTROL} !border-0 !bg-[#facc15] px-[24px] py-[14px] text-[15px] font-semibold !text-[var(--text)] shadow-none hover:!bg-[#fbbf24]`}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
