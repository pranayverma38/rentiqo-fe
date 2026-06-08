"use client";

import { useState } from "react";

import BillingInvoiceActions from "@/components/account/account-billing-payments/BillingInvoiceActions";
import {
  formatInr,
  type BillingInvoice,
} from "@/components/account/account-billing-payments/billingPaymentsData";

type BillingInvoiceMobileListProps = {
  invoices: BillingInvoice[];
};

export default function BillingInvoiceMobileList({
  invoices,
}: BillingInvoiceMobileListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="account-billing-payments__accordion md:hidden">
      {invoices.map((invoice) => {
        const isExpanded = expandedIds.has(invoice.id);
        const isPaid = invoice.status === "paid";

        return (
          <div
            key={invoice.id}
            className={`account-billing-payments__accordion-item${isExpanded ? " is-open" : ""}`}
          >
            <button
              type="button"
              className="account-billing-payments__accordion-trigger"
              aria-expanded={isExpanded}
              onClick={() => toggle(invoice.id)}
            >
              <span className="fw-medium">
                Invoice Number: {invoice.invoiceNumber}
              </span>
              <i
                className={`icon ${isExpanded ? "icon-minus" : "icon-plus"}`}
                aria-hidden
              />
            </button>

            {isExpanded ? (
              <div className="account-billing-payments__accordion-panel">
                <dl className="account-billing-payments__detail-list">
                  <DetailRow label="Invoice Date" value={invoice.invoiceDate} />
                  <DetailRow label="Order Number" value={invoice.orderNumber} />
                  <DetailRow
                    label="Invoice Amount"
                    value={formatInr(invoice.invoiceAmount)}
                  />
                  <DetailRow
                    label="Amount Due"
                    value={formatInr(invoice.amountDue)}
                  />
                  <div className="account-billing-payments__detail-row">
                    <dt className="tf-lable fw-medium mb-0">Status</dt>
                    <dd>
                      <span
                        className={
                          isPaid
                            ? "fw-medium text-[#16a34a]"
                            : "fw-medium text-[#dc2626]"
                        }
                      >
                        {isPaid ? "Paid" : "Due"}
                      </span>
                    </dd>
                  </div>
                </dl>
                <BillingInvoiceActions isPaid={isPaid} align="start" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="account-billing-payments__detail-row">
      <dt className="tf-lable fw-medium mb-0">{label}</dt>
      <dd className="fw-medium mb-0">{value}</dd>
    </div>
  );
}