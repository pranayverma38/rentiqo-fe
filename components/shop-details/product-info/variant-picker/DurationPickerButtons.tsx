"use client";

import { useProduct } from "@/context/ProductContext";
import { DurationVariantLabel } from "./DurationVariantLabel";
import { cx } from "./cx";

/** Text pill selector for Medusa `Duration` rental term (no images). */
export function DurationPickerButtons() {
  const { durationOptions, currentDuration, setCurrentDuration } = useProduct();

  if (durationOptions.length === 0) {
    return null;
  }

  return (
    <div className="variant-picker-item variant-duration">
      <DurationVariantLabel currentDuration={currentDuration} />
      <div className="variant-picker-values">
        {durationOptions.map((option) => {
          const active =
            currentDuration.toLowerCase() === option.value.toLowerCase();
          return (
            <button
              key={option.value}
              type="button"
              className={cx("duration-btn", active && "active")}
              onClick={() => setCurrentDuration(option.value)}
            >
              {option.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}