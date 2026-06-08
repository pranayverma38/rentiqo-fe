"use client";

import { useProductOptional } from "@/context/ProductContext";

function formatOptionTitle(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return "Size";
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function VariantSizeLabel({ currentSize }: { currentSize: string }) {
  const ctx = useProductOptional();
  const label = formatOptionTitle(ctx?.optionTitle ?? "Size");

  return (
    <div className="variant-picker-label">
      <div>
        <span className="fw-semibold">{label}:</span>
        <span className="variant-picker-label-value value-currentSize text-capitalize fw-medium">
          {" "}
          {currentSize}
        </span>
      </div>
    </div>
  );
}