export type AccountPageMeta = {
  sectionTitle: string;
  /** Dashboard-style greeting: "Hello, {name}" */
  useGreeting?: boolean;
  sectionClassName?: string;
  /** Mobile back link; defaults to account menu */
  backHref?: string;
};

/** Section title + layout per account route; extend when adding pages */
export const ACCOUNT_PAGE_META: Record<string, AccountPageMeta> = {
  "/account-page": {
    sectionTitle: "",
    useGreeting: true,
  },
  "/account-orders": {
    sectionTitle: "My Orders",
    sectionClassName: "flat-spacing",
  },
  "/account-manage-subscription": {
    sectionTitle: "Manage Subscription",
  },
  "/account-service-requests": {
    sectionTitle: "Service Requests",
  },
  "/account-help-support": {
    sectionTitle: "Help & Support",
  },
  "/account-billing-payments": {
    sectionTitle: "Billing & Payments",
  },
  "/account-refer-earn": {
    sectionTitle: "Refer & Earn ₹500",
  },
  "/account-profile": {
    sectionTitle: "My Profile",
  },
  "/account-kyc": {
    sectionTitle: "KYC Verification",
  },
  "/account-addresses": {
    sectionTitle: "My Address",
  },
};

export function getAccountPageMeta(pathname: string): AccountPageMeta | undefined {
  if (
    pathname.startsWith("/account-orders/") &&
    pathname !== "/account-orders"
  ) {
    return {
      sectionTitle: "Order Details",
      sectionClassName: "flat-spacing",
      backHref: "/account-orders",
    };
  }

  return ACCOUNT_PAGE_META[pathname];
}
