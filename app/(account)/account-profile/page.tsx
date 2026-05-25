import { Metadata } from "next";

import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "My Profile | Rentiqo",
  description: "Your profile",
};

export default function AccountProfilePage() {
  return <AccountPlaceholder />;
}
