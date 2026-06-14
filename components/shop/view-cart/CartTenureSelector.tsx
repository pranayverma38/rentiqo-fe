"use client";

import { useEffect, useRef, useState } from "react";

import ResponsiveOffcanvas from "@/components/ui/ResponsiveOffcanvas";
import {
  CART_TENURE_MONTHS,
  CART_TENURE_OFFCANVAS_ID,
  type CartTenureMonths,
  tenureLabelForMonths,
} from "@/lib/cart/cartTenure";

import { CART_CONTROL_HEIGHT } from "./cartStyles";

type CartTenureSelectorProps = {
  selectedMonths: CartTenureMonths;
  onSelect: (months: CartTenureMonths) => void;
  disabled?: boolean;
};

const MOBILE_OFFCANVAS_QUERY = "(max-width: 767px)";

const pillClass = [
  CART_CONTROL_HEIGHT,
  "m-0 box-border inline-flex w-auto shrink-0 cursor-pointer items-center justify-start gap-[8px]",
  "rounded-full border-0 bg-[#f1f5f9] px-[16px] font-[inherit] text-[14px] font-medium leading-none",
  "text-[var(--text)] shadow-none outline-none transition-colors hover:bg-[#e8edf3]",
  "disabled:cursor-not-allowed disabled:opacity-60 min-w-[168px]",
].join(" ");

function TenureOptionButton({
  months,
  selectedMonths,
  onSelect,
  dismissOffcanvas = false,
}: {
  months: CartTenureMonths;
  selectedMonths: CartTenureMonths;
  onSelect: (months: CartTenureMonths) => void;
  dismissOffcanvas?: boolean;
}) {
  const isActive = months === selectedMonths;

  return (
    <button
      type="button"
      onClick={() => onSelect(months)}
      {...(dismissOffcanvas ? { "data-bs-dismiss": "offcanvas" } : {})}
      className={`m-0 flex w-full cursor-pointer items-center border-0 px-[14px] py-[12px] text-left font-[inherit] text-[15px] font-medium leading-none shadow-none outline-none transition-colors !rounded-[6px] ${
        isActive
          ? "!bg-[#e56942]/85 !text-[#ffffff] hover:!bg-[#e56942]/85 hover:!text-[#ffffff]"
          : "!bg-transparent !text-[var(--text)] hover:!bg-[#f1f5f9] hover:!text-[var(--text)]"
      }`}
    >
      {tenureLabelForMonths(months)}
    </button>
  );
}

function TenureOptionsList({
  selectedMonths,
  onSelect,
  dismissOffcanvas = false,
}: {
  selectedMonths: CartTenureMonths;
  onSelect: (months: CartTenureMonths) => void;
  dismissOffcanvas?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--white)] p-[4px]">
      {CART_TENURE_MONTHS.map((months) => (
        <TenureOptionButton
          key={months}
          months={months}
          selectedMonths={selectedMonths}
          onSelect={onSelect}
          dismissOffcanvas={dismissOffcanvas}
        />
      ))}
    </div>
  );
}

async function openTenureOffcanvas(): Promise<void> {
  const panel = document.getElementById(CART_TENURE_OFFCANVAS_ID);
  if (panel == null) {
    return;
  }

  const bootstrapModule = (await import("bootstrap")) as {
    Offcanvas: {
      getOrCreateInstance(element: HTMLElement): { show(): void };
    };
  };
  bootstrapModule.Offcanvas.getOrCreateInstance(panel).show();
}

export default function CartTenureSelector({
  selectedMonths,
  onSelect,
  disabled = false,
}: CartTenureSelectorProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = tenureLabelForMonths(selectedMonths);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSelect = (months: CartTenureMonths) => {
    setMenuOpen(false);
    if (months !== selectedMonths) {
      onSelect(months);
    }
  };

  const handleTriggerClick = () => {
    if (disabled) {
      return;
    }

    if (window.matchMedia(MOBILE_OFFCANVAS_QUERY).matches) {
      void openTenureOffcanvas();
      return;
    }

    setMenuOpen((open) => !open);
  };

  return (
    <>
      <div ref={rootRef} className="relative w-auto shrink-0">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          aria-label={`Rental duration: ${label}`}
          onClick={handleTriggerClick}
          className={pillClass}
        >
          <i
            className="icon icon-CalendarBlank shrink-0 text-[16px] leading-none"
            aria-hidden
          />
          <span className="whitespace-nowrap">{label}</span>
          <i
            className="icon icon-CaretDown shrink-0 text-[12px] leading-none"
            aria-hidden
          />
        </button>

        {menuOpen ? (
          <div
            role="listbox"
            aria-label="Select rental duration"
            className="absolute left-0 top-[calc(100%+8px)] z-[20] hidden min-w-full shadow-[0_8px_24px_rgba(16,16,16,0.1)] md:block"
          >
            <TenureOptionsList
              selectedMonths={selectedMonths}
              onSelect={handleSelect}
            />
          </div>
        ) : null}
      </div>

      <ResponsiveOffcanvas
        id={CART_TENURE_OFFCANVAS_ID}
        title="Select rental duration"
        panelClassName="md:!w-[420px]"
      >
        <TenureOptionsList
          selectedMonths={selectedMonths}
          onSelect={handleSelect}
          dismissOffcanvas
        />
      </ResponsiveOffcanvas>
    </>
  );
}
