import { Metadata } from "next";

import AccountMobileMenuPage from "@/components/account/account-page/AccountMobileMenuPage";

export const metadata: Metadata = {
  title: "My Account | Rentiqo",
  description: "Account menu",
};

export default function AccountPage() {
  return <AccountMobileMenuPage />;
}
