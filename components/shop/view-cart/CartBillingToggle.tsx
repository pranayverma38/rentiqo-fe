"use client";

export type BillingMode = "monthly" | "upfront";

type CartBillingToggleProps = {
  value: BillingMode;
  onChange: (mode: BillingMode) => void;
};

const UPFRONT_SAVINGS_LABEL = "Save up to 8%";

export default function CartBillingToggle({
  value,
  onChange,
}: CartBillingToggleProps) {
  return (
    <div className="rounded-[16px] border border-[#ebebeb] bg-white p-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="mb-[14px] flex flex-col gap-[4px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-0 text-[16px] font-semibold text-[#111827]">
            Billing preference
          </h2>
          <p className="mb-0 mt-[4px] text-[13px] text-[#6b7280]">
            Choose how you&apos;d like to pay for your rental
          </p>
        </div>
        {value === "upfront" ? (
          <span className="inline-flex w-fit items-center rounded-full bg-[#ecfdf5] px-[12px] py-[4px] text-[12px] font-semibold text-[#059669]">
            {UPFRONT_SAVINGS_LABEL}
          </span>
        ) : null}
      </div>

      <div
        className="relative grid grid-cols-2 rounded-[12px] bg-[#f3f4f6] p-[4px]"
        role="tablist"
        aria-label="Billing mode"
      >
        <span
          aria-hidden
          className={`absolute bottom-[4px] top-[4px] w-[calc(50%-4px)] rounded-[10px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
            value === "upfront" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          role="tab"
          aria-selected={value === "monthly"}
          onClick={() => onChange("monthly")}
          className={`relative z-[1] rounded-[10px] px-[16px] py-[12px] text-[14px] font-semibold transition-colors ${
            value === "monthly"
              ? "text-[#111827]"
              : "text-[#6b7280] hover:text-[#374151]"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === "upfront"}
          onClick={() => onChange("upfront")}
          className={`relative z-[1] rounded-[10px] px-[16px] py-[12px] text-[14px] font-semibold transition-colors ${
            value === "upfront"
              ? "text-[#111827]"
              : "text-[#6b7280] hover:text-[#374151]"
          }`}
        >
          Upfront
        </button>
      </div>

      <p className="mb-0 mt-[12px] text-[12px] leading-[1.5] text-[#9ca3af]">
        {value === "monthly"
          ? "Pay month-to-month with flexibility to return anytime."
          : "Pay upfront for the tenure and enjoy lower effective rent. Zero deposit option may apply."}
      </p>
    </div>
  );
}
