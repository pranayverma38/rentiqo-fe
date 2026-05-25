export type AccountPageMeta = {
  sectionTitle: string;
  /** Dashboard-style greeting: "Hello, {name}" */
  useGreeting?: boolean;
  sectionClassName?: string;
};

/** Section title + layout per account route; extend when adding pages */
export const ACCOUNT_PAGE_META: Record<string, AccountPageMeta> = {
  "/account-page": {
    sectionTitle: "",
    useGreeting: true,
  },
  "/account-orders": {
    sectionTitle: "Your Orders",
    sectionClassName: "flat-spacing flat-animate-tab",
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
  return ACCOUNT_PAGE_META[pathname];
}
