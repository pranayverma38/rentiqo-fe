import {
  ACCOUNT_DESKTOP_ENTRY_HREF,
  ACCOUNT_MOBILE_MENU_HREF,
} from "@/components/account/accountEntry";
import type { AccountSidebarCountKey } from "@/components/account/accountSidebarCounts";

/** Mobile hub: full-page account menu; sub-routes show content + back here */
export const ACCOUNT_MENU_HREF = ACCOUNT_MOBILE_MENU_HREF;

/** Default landing when opening account on desktop (header, login, etc.) */
export const ACCOUNT_DESKTOP_HOME_HREF = ACCOUNT_DESKTOP_ENTRY_HREF;

export type AccountNavItem = {
  href: string;
  label: string;
  icon: string;
  countKey?: AccountSidebarCountKey;
};

/** Routes under the account area; `href` must match `usePathname()` for active nav */
export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { href: "/account-orders", label: "My Orders", icon: "icon-Package" },
  {
    href: "/account-manage-subscription",
    label: "Manage Subscription",
    icon: "icon-ArrowsLeftRight",
    countKey: "activeSubscriptions",
  },
  {
    href: "/account-service-requests",
    label: "Service Requests",
    icon: "icon-Files",
    countKey: "activeServiceRequests",
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
