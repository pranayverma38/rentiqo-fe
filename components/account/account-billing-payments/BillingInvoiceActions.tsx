type BillingInvoiceActionsProps = {
  isPaid: boolean;
  align?: "start" | "end";
};

export default function BillingInvoiceActions({
  isPaid,
  align = "end",
}: BillingInvoiceActionsProps) {
  return (
    <div
      className={`account-billing-payments__actions flex flex-nowrap items-center gap-2${align === "start" ? " justify-content-start" : " justify-content-end"}`}
    >
      <button
        type="button"
        className="account-billing-payments__icon-action"
        aria-label="Download invoice"
      >
        <DownloadIcon />
      </button>
      {!isPaid ? (
        <button
          type="button"
          className="tf-btn small account-billing-payments__pay-btn"
        >
          Pay
        </button>
      ) : null}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="account-billing-payments__download-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}