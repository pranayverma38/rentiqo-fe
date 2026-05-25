import { Metadata } from "next";

import AccountProfile from "@/components/account/account-profile/AccountProfile";

export const metadata: Metadata = {
  title: "My Profile | Rentiqo",
  description: "Manage your profile and account information",
};

export default function AccountProfilePage() {
  return <AccountProfile />;
}
