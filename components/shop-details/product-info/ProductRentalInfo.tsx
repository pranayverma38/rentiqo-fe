"use client";

import ResponsiveOffcanvas, {
  responsiveOffcanvasTriggerProps,
} from "@/components/ui/ResponsiveOffcanvas";

const CANCELLATION_RETURNS_ID = "rentalCancellationReturns";
const AUTO_EXTENSION_ID = "rentalAutoExtension";

const rentalInfoLinkClass =
  "flex w-full items-center gap-[12px] rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-[16px] py-[14px] text-left transition-colors hover:border-[var(--primary)] hover:bg-[#fff]";

const rentalInfoIconClass =
  "flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#fff] text-[20px] text-[var(--primary)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]";

const rentalInfoTitleClass =
  "mb-0 text-[15px] font-semibold leading-[1.35] text-[var(--black)]";

const rentalInfoBodyClass = "grid gap-[20px] text-[14px] leading-[1.6] text-[var(--text-2)]";

const rentalOffcanvasPanelClass = "md:!w-[520px]";

function CancellationReturnsContent() {
  return (
    <div className={rentalInfoBodyClass}>
      <p className="mb-0">
        You can cancel or return the product at any time. However, please note
        the following terms:
      </p>

      <div>
        <h6 className="mb-[8px] text-[15px] font-semibold text-[var(--black)]">
          1. Cancellation Before Delivery
        </h6>
        <ul className="mb-0 grid list-disc gap-[6px] pl-[20px]">
          <li>
            If you cancel your order before the product is delivered, no
            additional charges will apply.
          </li>
          <li>You can request cancellation through our chat support.</li>
        </ul>
      </div>

      <div>
        <h6 className="mb-[8px] text-[15px] font-semibold text-[var(--black)]">
          2. Return After Delivery (Early Closure)
        </h6>
        <ul className="mb-0 grid list-disc gap-[6px] pl-[20px]">
          <li>
            If you return the product before your rental tenure ends, an early
            closure fee will be charged.
          </li>
          <li>
            The early closure fee will be equivalent to one month&apos;s rent
            for that product.
          </li>
          <li>
            In case you have paid advance rent for a product, you will not be
            eligible for a refund if you return early.
          </li>
        </ul>
      </div>
    </div>
  );
}

function AutoExtensionContent() {
  return (
    <div className={rentalInfoBodyClass}>
      <p className="mb-0">
        You can choose any rental tenure without worrying about whether
        you&apos;ll need the product after its tenure is over.
      </p>
      <p className="mb-0">
        Once your selected tenure is over, we will automatically extend it every
        month so you can keep using the product hassle-free.
      </p>
      <p className="mb-0">
        If you no longer need the product, you can request a return at any time.
      </p>
    </div>
  );
}

export function ProductRentalInfo() {
  return (
    <>
      <section
        className="mb-[20px] grid gap-[10px]"
        aria-label="Rental policy information"
      >
        <a
          {...responsiveOffcanvasTriggerProps(CANCELLATION_RETURNS_ID)}
          className={rentalInfoLinkClass}
          suppressHydrationWarning
        >
          <span className={rentalInfoIconClass} aria-hidden>
            <i className="icon icon-ArrowUDownLeft" />
          </span>
          <span className={rentalInfoTitleClass}>Cancellation &amp; Returns</span>
        </a>

        <a
          {...responsiveOffcanvasTriggerProps(AUTO_EXTENSION_ID)}
          className={rentalInfoLinkClass}
          suppressHydrationWarning
        >
          <span className={rentalInfoIconClass} aria-hidden>
            <i className="icon icon-ArrowsLeftRight" />
          </span>
          <span className={rentalInfoTitleClass}>Auto-Extension of Tenure</span>
        </a>
      </section>

      <ResponsiveOffcanvas
        id={CANCELLATION_RETURNS_ID}
        title="Cancellation & Returns"
        panelClassName={rentalOffcanvasPanelClass}
      >
        <CancellationReturnsContent />
      </ResponsiveOffcanvas>

      <ResponsiveOffcanvas
        id={AUTO_EXTENSION_ID}
        title="Auto-Extension of Tenure"
        panelClassName={rentalOffcanvasPanelClass}
      >
        <AutoExtensionContent />
      </ResponsiveOffcanvas>
    </>
  );
}