import { Metadata } from "next";

import AccountServiceRequests from "@/components/account/account-service-requests/AccountServiceRequests";

export const metadata: Metadata = {
  title: "Service Requests | Rentiqo",
  description: "Raise and track service requests",
};

export default function AccountServiceRequestsPage() {
  return <AccountServiceRequests />;
}
