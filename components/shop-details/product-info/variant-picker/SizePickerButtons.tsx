"use client";

import Image from "next/image";

import { VariantSizeLabel } from "./VariantSizeLabel";
import { cx } from "./cx";
import type { SizePickerProps } from "./types";

export function SizePickerButtons({
  sizes,
  currentSize,
  setCurrentSize,
}: SizePickerProps) {
  const hasThumbnails = sizes.some((s) => Boolean(s.thumbnail));

  return (
    <div
      className={cx(
        "variant-picker-item variant-size",
        hasThumbnails && "variant-size-thumbnails",
      )}
    >
      <VariantSizeLabel currentSize={currentSize} />
      <div className="variant-picker-values">
        {sizes.map((size) => {
          const active = currentSize === size.value;
          if (size.thumbnail) {
            return (
              <div
                key={size.value}
                role="button"
                tabIndex={0}
                className={cx(
                  "hover-tooltip tooltip-bot size-btn style-image",
                  active && "active",
                )}
                onClick={() => setCurrentSize(size.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCurrentSize(size.value);
                  }
                }}
              >
                <div className="img">
                  <Image
                    loading="lazy"
                    width={60}
                    height={60}
                    src={size.thumbnail}
                    alt={size.value}
                  />
                </div>
                <span className="tooltip text-capitalize">{size.value}</span>
              </div>
            );
          }

          return (
            <span
              key={size.value}
              className={cx("size-btn", active && "active")}
              onClick={() => setCurrentSize(size.value)}
            >
              {size.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}