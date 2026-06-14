"use client";

import type { BillingMode } from "./CartBillingToggle";
import CartTenureSelector from "./CartTenureSelector";
import { CART_CONTROL, CART_CONTROL_HEIGHT } from "./cartStyles";
import type { CartTenureMonths } from "@/lib/cart/cartTenure";

type CartTopControlsProps = {
  selectedTenureMonths: CartTenureMonths;
  tenureChanging?: boolean;
  onTenureChange: (months: CartTenureMonths) => void;
  billingMode: BillingMode;
  onBillingChange: (mode: BillingMode) => void;
};

export default function CartTopControls({
  selectedTenureMonths,
  tenureChanging = false,
  onTenureChange,
  billingMode,
  onBillingChange,
}: CartTopControlsProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-[12px]">
      <CartTenureSelector
        selectedMonths={selectedTenureMonths}
        onSelect={onTenureChange}
        disabled={tenureChanging}
      />

      <div
        className={`flex shrink-0 gap-[6px] overflow-hidden sm:max-w-[220px] ${CART_CONTROL_HEIGHT} ${CART_CONTROL} border border-[var(--line)] bg-[var(--bg)] p-[4px]`}
        role="tablist"
        aria-label="Billing mode"
      >
        {(["monthly", "upfront"] as const).map((mode) => {
          const isActive = billingMode === mode;
          return (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onBillingChange(mode)}
              className={`m-0 box-border inline-flex min-h-0 min-w-0 flex-1 cursor-pointer items-center justify-center self-stretch border-0 px-[18px] font-[inherit] text-[14px] font-medium capitalize leading-none shadow-none outline-none transition-all duration-200 sm:min-w-[96px] sm:flex-none !rounded-[6px] ${
                isActive
                  ? "!border-0 !bg-[#e56942]/85 !text-[#ffffff] hover:!bg-[#e56942]/85 hover:!text-[#ffffff]"
                  : "!border-0 !bg-transparent !text-[var(--text-2)] hover:!bg-transparent hover:!text-[var(--text)]"
              }`}
            >
              {mode}
            </button>
          );
        })}
      </div>
    </div>
  );
}
