"use client";

import { CART_CONTROL, CART_PANEL } from "./cartStyles";

const CITYSHIELD_PRICE = 199;
const COVERAGE_AMOUNT = "₹50,000";

type CityShieldCardProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export default function CityShieldCard({
  enabled,
  onChange,
}: CityShieldCardProps) {
  return (
    <div
      className={`${CART_PANEL} p-[16px] transition-colors md:p-[20px] ${
        enabled ? "border-[#c4b5fd] bg-[#fafaff]" : ""
      }`}
    >
      <div className="flex items-start gap-[14px]">
        <div
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center ${CART_CONTROL} bg-[#dcfce7] text-[22px] leading-none text-[#16a34a]`}
        >
          <i className="icon icon-ShieldCheck" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-[10px] flex items-center justify-between gap-[12px]">
            <p className="mb-0 text-[14px] font-bold tracking-[0.05em] text-[#16a34a]">
              CITYSHIELD
            </p>
            <input
              type="checkbox"
              className="h-[20px] w-[20px] shrink-0 cursor-pointer accent-[var(--primary)]"
              checked={enabled}
              onChange={(e) => onChange(e.target.checked)}
              aria-label="Add CityShield protection"
            />
          </div>

          <p className="mb-[12px] text-[14px] font-medium leading-[1.5] text-[var(--text)]">
            Coffee stains? Spills? Don&apos;t stress — we&apos;ve got you covered.
          </p>

          <ul className="mb-[12px] grid gap-[8px]">
            <li className="flex items-start gap-[8px] text-[13px] leading-[1.45] cl-text-2">
              <i
                className="icon icon-Check mt-[2px] shrink-0 text-[13px] leading-none text-[#16a34a]"
                aria-hidden
              />
              <span>
                <strong className="font-semibold text-[var(--text)]">
                  ₹{CITYSHIELD_PRICE}/mo
                </strong>{" "}
                — damage protection plan
              </span>
            </li>
            <li className="flex items-start gap-[8px] text-[13px] leading-[1.45] cl-text-2">
              <i
                className="icon icon-Check mt-[2px] shrink-0 text-[13px] leading-none text-[#16a34a]"
                aria-hidden
              />
              <span>
                Damage waiver up to{" "}
                <strong className="font-semibold text-[var(--text)]">
                  {COVERAGE_AMOUNT}
                </strong>
              </span>
            </li>
          </ul>

          <button
            type="button"
            className="m-0 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-[var(--primary)] shadow-none outline-none hover:underline"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

export { CITYSHIELD_PRICE };
