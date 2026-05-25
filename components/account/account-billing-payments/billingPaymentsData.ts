export type InvoiceStatus = "payment_due" | "paid";

export type BillingInvoice = {
  id: string;
  invoiceDate: string;
  invoiceNumber: string;
  orderNumber: string;
  invoiceAmount: number;
  amountDue: number;
  status: InvoiceStatus;
};

/** Placeholder invoices until billing API is wired */
export const MOCK_BILLING_INVOICES: BillingInvoice[] = [
  {
    id: "inv-1",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28932",
    orderNumber: "954005220",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-2",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28931",
    orderNumber: "954005219",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-3",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28930",
    orderNumber: "954005218",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-4",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28929",
    orderNumber: "954005217",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-5",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28928",
    orderNumber: "954005216",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-6",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28927",
    orderNumber: "954005215",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
  {
    id: "inv-7",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28926",
    orderNumber: "954005214",
    invoiceAmount: 842,
    amountDue: 0,
    status: "paid",
  },
  {
    id: "inv-8",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28925",
    orderNumber: "954005213",
    invoiceAmount: 842,
    amountDue: 0,
    status: "paid",
  },
  {
    id: "inv-9",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28924",
    orderNumber: "954005212",
    invoiceAmount: 842,
    amountDue: 0,
    status: "paid",
  },
  {
    id: "inv-10",
    invoiceDate: "2026-01-06",
    invoiceNumber: "IN2526DEL28923",
    orderNumber: "954005211",
    invoiceAmount: 842,
    amountDue: 842,
    status: "payment_due",
  },
];

const PAGE_SIZE = 7;

export function getVisibleInvoices(
  invoices: BillingInvoice[],
  visibleCount: number,
): BillingInvoice[] {
  return invoices.slice(0, visibleCount);
}

export function getTotalAmountDue(invoices: BillingInvoice[]): number {
  return invoices
    .filter((inv) => inv.status === "payment_due")
    .reduce((sum, inv) => sum + inv.amountDue, 0);
}

export { PAGE_SIZE };

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
