/** Routes under the account area; `href` must match `usePathname()` for active nav */
export const ACCOUNT_NAV_ITEMS = [
  { href: "/account-page", label: "Dashboard", icon: "icon-HouseLine" },
  { href: "/account-orders", label: "Your Orders", icon: "icon-Package" },
  {
    href: "/account-manage-subscription",
    label: "Manage Subscription",
    icon: "icon-ArrowsLeftRight",
  },
  {
    href: "/account-service-requests",
    label: "Service Requests",
    icon: "icon-Files",
  },
  {
    href: "/account-help-support",
    label: "Help & Support",
    icon: "icon-Headset",
  },
  {
    href: "/account-billing-payments",
    label: "Billing & Payments",
    icon: "icon-ReceiptX",
  },
  {
    href: "/account-refer-earn",
    label: "Refer & Earn ₹500",
    icon: "icon-ShareNetwork",
  },
  { href: "/account-profile", label: "My Profile", icon: "icon-User" },
  {
    href: "/account-kyc",
    label: "KYC Verification",
    icon: "icon-ShieldCheck",
  },
  { href: "/account-addresses", label: "My Address", icon: "icon-Tag" },
] as const;
