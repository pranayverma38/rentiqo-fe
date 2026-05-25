import { Metadata } from "next";

import AccountReferEarn from "@/components/account/account-refer-earn/AccountReferEarn";

export const metadata: Metadata = {
  title: "Refer & Earn | Rentiqo",
  description: "Refer friends and earn cash rewards",
};

export default function AccountReferEarnPage() {
  return <AccountReferEarn />;
}
