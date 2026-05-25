import { Metadata } from "next";

import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "Service Requests | Rentiqo",
  description: "View and manage service requests",
};

export default function AccountServiceRequestsPage() {
  return <AccountPlaceholder />;
}
