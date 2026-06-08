"use client";

import { useMemo, useState } from "react";

import BillingInvoiceActions from "@/components/account/account-billing-payments/BillingInvoiceActions";
import BillingInvoiceMobileList from "@/components/account/account-billing-payments/BillingInvoiceMobileList";
import {
  MOCK_BILLING_INVOICES,
  PAGE_SIZE,
  formatInr,
  getTotalAmountDue,
  getVisibleInvoices,
  type BillingInvoice,
} from "@/components/account/account-billing-payments/billingPaymentsData";

export default function AccountBillingPayments() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleInvoices = useMemo(
    () => getVisibleInvoices(MOCK_BILLING_INVOICES, visibleCount),
    [visibleCount],
  );

  const totalDue = useMemo(
    () => getTotalAmountDue(MOCK_BILLING_INVOICES),
    [],
  );

  const hasMore = visibleCount < MOCK_BILLING_INVOICES.length;

  return (
    <div className="account-billing-payments w-full min-w-0">
      <p className="cl-text-2 mb-20">
        View and pay individual invoices or choose the convenience of &apos;Pay
        All&apos; to clear your entire outstanding balance at once.
      </p>

      <div className="account-billing-payments__toolbar mb-20">
        <button type="button" className="tf-btn btn-stroke small">
          Download statement
        </button>
        <div className="account-billing-payments__total-row">
          <p className="h6 fw-medium mb-0">
            Total Amount Due:{" "}
            <span className="fw-semibold">{formatInr(totalDue)}</span>
          </p>
          <button
            type="button"
            className="tf-btn animate-btn small"
            disabled={totalDue <= 0}
          >
            Pay all
          </button>
        </div>
      </div>

      <div className="account-my_address account-billing-payments__panel">
        <div className="account-billing-payments__table-wrap hidden md:block">
          <table className="account-billing-payments__table w-full border-collapse text-left">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice #</th>
                <th>Order #</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.map((invoice) => (
                <InvoiceTableRow key={invoice.id} invoice={invoice} />
              ))}
            </tbody>
          </table>
        </div>

        <BillingInvoiceMobileList invoices={visibleInvoices} />
      </div>

      {hasMore ? (
        <button
          type="button"
          className="account-billing-payments__see-more mt-20"
          onClick={() =>
            setVisibleCount((n) =>
              Math.min(n + PAGE_SIZE, MOCK_BILLING_INVOICES.length),
            )
          }
        >
          See More
          <i className="icon icon-CaretDown" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function InvoiceTableRow({ invoice }: { invoice: BillingInvoice }) {
  const isPaid = invoice.status === "paid";

  return (
    <tr>
      <td>{invoice.invoiceDate}</td>
      <td className="account-billing-payments__cell-invoice fw-medium">
        {invoice.invoiceNumber}
      </td>
      <td>{invoice.orderNumber}</td>
      <td>{formatInr(invoice.invoiceAmount)}</td>
      <td>{formatInr(invoice.amountDue)}</td>
      <td>
        <span
          className={
            isPaid ? "fw-medium text-[#16a34a]" : "fw-medium text-[#dc2626]"
          }
        >
          {isPaid ? "Paid" : "Due"}
        </span>
      </td>
      <td>
        <BillingInvoiceActions isPaid={isPaid} align="end" />
      </td>
    </tr>
  );
}