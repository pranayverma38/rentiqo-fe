"use client";

import Link from "next/link";

type AccountChatSupportProps = {
  href?: string;
};

export default function AccountChatSupport({
  href = "/account-help-support",
}: AccountChatSupportProps) {
  return (
    <section className="account-service-requests__section">
      <h6 className="account-service-requests__section-title fw-medium mb-16">
        Chat support
      </h6>
      <div className="account-my_address d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-12">
        <p className="cl-text-2 mb-0">
          Connect to get instant reply. <span className="fw-medium">(9am - 9pm IST)</span>
        </p>
        <Link href={href} className="tf-btn animate-btn small">
          Chat Now
        </Link>
      </div>
    </section>
  );
}
