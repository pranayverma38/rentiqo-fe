import { Metadata } from "next";

import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "Billing & Payments | Rentiqo",
  description: "Billing and payment history",
};

export default function AccountBillingPaymentsPage() {
  return <AccountPlaceholder />;
}
