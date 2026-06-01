import { Metadata } from "next";

import AccountManageSubscription from "@/components/account/account-manage-subscription/AccountManageSubscription";

export const metadata: Metadata = {
  title: "Manage Subscription | Rentiqo",
  description: "Manage active subscriptions, dues, and plan preferences",
};

export default function AccountManageSubscriptionPage() {
  return <AccountManageSubscription />;
}
