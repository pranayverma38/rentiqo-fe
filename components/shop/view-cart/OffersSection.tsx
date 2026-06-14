"use client";

import { CART_CONTROL, CART_PANEL_SOFT } from "./cartStyles";

type OffersSectionProps = {
  onApplyDiscount: (e: React.FormEvent<HTMLFormElement>) => void;
  variant?: "sidebar" | "full";
};

export default function OffersSection({
  onApplyDiscount,
  variant = "sidebar",
}: OffersSectionProps) {
  if (variant === "sidebar") {
    return (
      <div className="grid gap-[12px]">
        <button
          type="button"
          className={`group m-0 box-border flex w-full cursor-pointer items-center justify-between ${CART_PANEL_SOFT} px-[16px] py-[14px] text-left shadow-none outline-none transition-all hover:border-[#8684d4] hover:bg-[#fafaff]`}
        >
          <span className="flex items-center gap-[12px]">
            <span
              className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center ${CART_CONTROL} bg-[var(--white)] text-[18px] leading-none text-[var(--text)]`}
            >
              <i className="icon icon-Tag" aria-hidden />
            </span>
            <span className="text-[15px] font-medium text-[var(--text)]">Offers</span>
          </span>
          <span className="text-[14px] font-medium text-[var(--text)]">
            View All &gt;
          </span>
        </button>

        <form
          onSubmit={onApplyDiscount}
          className={`flex items-center gap-[10px] ${CART_PANEL_SOFT} p-[12px]`}
        >
          <label htmlFor="cart-discount-code" className="sr-only">
            Discount code
          </label>
          <input
            id="cart-discount-code"
            type="text"
            placeholder="Coupon code"
            className={`box-border h-[44px] min-w-0 flex-1 ${CART_CONTROL} border border-[var(--line)] bg-[var(--white)] px-[14px] text-[14px] leading-normal text-[var(--text)] outline-none placeholder:cl-text-2 focus:border-[#8684d4]`}
          />
          <button
            type="submit"
            className={`box-border h-[44px] shrink-0 cursor-pointer ${CART_CONTROL} border border-[var(--line)] bg-[var(--white)] px-[16px] text-[14px] font-medium leading-none text-[var(--text)] shadow-none outline-none transition-colors hover:bg-[var(--bg)]`}
          >
            Apply
          </button>
        </form>
      </div>
    );
  }

  return null;
}
