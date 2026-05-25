import { Metadata } from "next";

import AccountBillingPayments from "@/components/account/account-billing-payments/AccountBillingPayments";

export const metadata: Metadata = {
  title: "Billing & Payments | Rentiqo",
  description: "View invoices and manage payments",
};

export default function AccountBillingPaymentsPage() {
  return <AccountBillingPayments />;
}
