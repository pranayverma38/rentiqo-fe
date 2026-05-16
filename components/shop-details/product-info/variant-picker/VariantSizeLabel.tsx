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
        {label}:
        <span className="variant-picker-label-value value-currentSize text-capitalize fw-medium">
          {" "}
          {currentSize}
        </span>
      </div>
      <a
        href="#findSize"
        data-bs-toggle="modal"
        className="tf-btn-line-2 style-primary text-caption-01 fw-semibold"
      >
        Size Guide
      </a>
    </div>
  );
}
