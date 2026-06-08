"use client";

export function DurationVariantLabel({ currentDuration }: { currentDuration: string }) {
  return (
    <div className="variant-picker-label">
      <div>
        <span className="fw-semibold">Duration:</span>
        <span className="variant-picker-label-value duration-value fw-medium">
          {" "}
          {currentDuration}
        </span>
      </div>
    </div>
  );
}