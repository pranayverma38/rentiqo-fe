import { Metadata } from "next";

import AccountChatSupport from "@/components/account/account-help-support/AccountChatSupport";
import ServiceRequestTypeGrid from "@/components/account/account-service-requests/ServiceRequestTypeGrid";

export const metadata: Metadata = {
  title: "Help & Support | Rentiqo",
  description: "Get help and support",
};

export default function AccountHelpSupportPage() {
  return (
    <div className="account-service-requests w-full min-w-0">
      <section className="account-service-requests__section mb-24">
        <h6 className="account-service-requests__section-title fw-medium mb-16">
          Raise a service request
        </h6>
        <ServiceRequestTypeGrid />
      </section>
      <AccountChatSupport />
    </div>
  );
}
