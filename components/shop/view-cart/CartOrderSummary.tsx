"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useAuth } from "@/context/AuthProvider";
import { formatDepositAmount, formatPrice } from "@/utils/formatPrice";

import OffersSection from "./OffersSection";
import type { BillingMode } from "./CartBillingToggle";
import { CART_CONTROL, CART_PANEL } from "./cartStyles";

type ShipOption = "free" | "local" | "flat";

const SHIP_PRICES: Record<ShipOption, number> = {
  free: 0,
  local: 35,
  flat: 35,
};

type CartOrderSummaryProps = {
  itemCount: number;
  totalPrice: number;
  totalDeposit: number;
  discount: number;
  shippingCost: number;
  orderTotal: number;
  cityShieldEnabled: boolean;
  cityShieldPrice: number;
  billingMode: BillingMode;
  shipOption: ShipOption;
  onShipOptionChange: (option: ShipOption) => void;
  agreeChecked: boolean;
  onAgreeChange: (checked: boolean) => void;
  onApplyDiscount: (e: React.FormEvent<HTMLFormElement>) => void;
  checkoutLoading?: boolean;
};

export default function CartOrderSummary({
  totalDeposit,
  discount,
  orderTotal,
  cityShieldEnabled,
  cityShieldPrice,
  billingMode,
  shipOption,
  onShipOptionChange,
  agreeChecked,
  onAgreeChange,
  onApplyDiscount,
  checkoutLoading = false,
}: CartOrderSummaryProps) {
  const { isAuthenticated } = useAuth();
  const [showDelivery, setShowDelivery] = useState(false);

  const firstMonthRent = useMemo(() => {
    const addons = cityShieldEnabled ? cityShieldPrice : 0;
    return orderTotal + addons;
  }, [cityShieldEnabled, cityShieldPrice, orderTotal]);

  const ctaHref = isAuthenticated ? "/checkout" : "/login?redirect=/view-cart";
  const ctaLabel = isAuthenticated ? "Proceed to checkout" : "Login to proceed";

  return (
    <div className="grid gap-[16px]">
      <OffersSection onApplyDiscount={onApplyDiscount} variant="sidebar" />

      {billingMode === "monthly" ? (
        <div
          className={`flex items-center gap-[12px] ${CART_CONTROL} border border-[#fde68a] bg-[#fffbeb] px-[16px] py-[12px]`}
        >
          <span
            className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center ${CART_CONTROL} bg-[#fef3c7] text-[16px] leading-none text-[#d97706]`}
          >
            <i className="icon icon-Handbag" aria-hidden />
          </span>
          <p className="mb-0 text-[13px] leading-[1.5] cl-text-2">
            Pay <strong className="font-semibold text-[var(--text)]">Upfront</strong>{" "}
            &amp; save up to{" "}
            <strong className="font-semibold text-[#15803d]">₹9,000</strong> on your
            order
          </p>
        </div>
      ) : null}

      <div className={`${CART_PANEL} overflow-hidden`}>
        <div className="border-b border-[var(--line)] px-[16px] py-[14px] md:px-[20px] md:py-[16px]">
          <div className="flex items-start justify-between gap-[10px]">
            <p className="mb-0 text-[14px] font-medium leading-[1.4] cl-text-2">
              First Month Rent
              <span className="font-normal"> (Excl GST)</span>
            </p>
            <button
              type="button"
              aria-label="Rent breakdown info"
              className={`m-0 inline-flex h-[20px] w-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-transparent p-0 text-[11px] font-medium leading-none cl-text-2 shadow-none outline-none`}
            >
              i
            </button>
          </div>
          <p className="mb-0 mt-[8px] text-[24px] font-semibold leading-none text-[var(--text)]">
            {formatDepositAmount(firstMonthRent)}
          </p>
        </div>

        <div className="px-[16px] py-[14px] md:px-[20px] md:py-[16px]">
          {cityShieldEnabled ? (
            <p className="mb-[10px] flex items-center justify-between text-[14px] cl-text-2">
              <span>CityShield</span>
              <span className="font-medium text-[var(--text)]">
                {formatPrice(cityShieldPrice)}
              </span>
            </p>
          ) : null}

          {discount > 0 ? (
            <p className="mb-[10px] flex items-center justify-between text-[14px] text-[#15803d]">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </p>
          ) : null}

          <div className={`${CART_CONTROL} bg-[#eff6ff] px-[14px] py-[12px] text-center`}>
            <p className="mb-0 text-[14px] font-medium leading-[1.4] text-[#1d4ed8]">
              100% Refundable Deposit{" "}
              <span className="font-semibold text-[var(--text)]">
                {formatDepositAmount(totalDeposit)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDelivery((v) => !v)}
            className="mt-[14px] flex w-full cursor-pointer items-center justify-between border-0 border-t border-[var(--line)] bg-transparent px-0 pb-0 pt-[14px] text-[14px] font-medium cl-text-2 shadow-none outline-none hover:text-[var(--text)]"
          >
            <span>Delivery options</span>
            <i
              className={`icon icon-CaretDown text-[14px] leading-none transition-transform ${showDelivery ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          {showDelivery ? (
            <div className="mt-[10px] grid gap-[8px]">
              {(
                [
                  { id: "free" as const, label: "Free delivery", price: 0 },
                  { id: "local" as const, label: "Local delivery", price: 35 },
                  { id: "flat" as const, label: "Flat rate", price: 35 },
                ] as const
              ).map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between ${CART_CONTROL} px-[12px] py-[10px] text-[14px] ${
                    shipOption === option.id ? "bg-[var(--bg)]" : ""
                  }`}
                >
                  <span className="flex items-center gap-[10px]">
                    <input
                      type="radio"
                      name="ship-check"
                      className="accent-[var(--primary)]"
                      checked={shipOption === option.id}
                      onChange={() => onShipOptionChange(option.id)}
                    />
                    {option.label}
                  </span>
                  <span className="font-medium">{formatPrice(option.price)}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-[10px]">
        <input
          type="checkbox"
          name="agree"
          className="mt-[3px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[var(--primary)]"
          id="checkOutAgree"
          checked={agreeChecked}
          onChange={(e) => onAgreeChange(e.target.checked)}
        />
        <span className="text-[13px] leading-[1.5] cl-text-2">
          I agree with the{" "}
          <Link
            href="/term-and-condition"
            className="font-medium text-[var(--text)] underline underline-offset-2"
          >
            terms and conditions
          </Link>
        </span>
      </label>

      <Link
        href={ctaHref}
        id="checkout-btn"
        aria-busy={checkoutLoading}
        className={`tf-btn group box-border flex h-[48px] w-full items-center justify-center gap-[8px] ${CART_CONTROL} !border-0 bg-[#facc15] px-[24px] text-[15px] font-semibold leading-none !text-[var(--text)] no-underline shadow-none transition-all hover:!bg-[#fbbf24] active:scale-[0.99] ${checkoutLoading ? "pointer-events-none opacity-70" : ""}`}
      >
        {checkoutLoading ? (
          <span className="inline-block h-[18px] w-[18px] animate-spin rounded-full border-2 border-[var(--text)]/20 border-t-[var(--text)]" />
        ) : null}
        {ctaLabel}
        <i
          className="icon icon-ArrowRight text-[16px] leading-none transition-transform group-hover:translate-x-[2px]"
          aria-hidden
        />
      </Link>
    </div>
  );
}

export { SHIP_PRICES };
export type { ShipOption };
