export type SubscriptionStatus = "active" | "inactive";

export type Subscription = {
  id: string;
  title: string;
  plan: string;
  billing: string;
  costPerMonth: number;
  status: SubscriptionStatus;
  image: string;
  rentedFrom: string;
  /** e.g. "Renews on" or "Ended on" */
  renewalLabel: string;
  renewalDate: string;
  billingDate: string;
  endedOn?: string;
};

export type SubscriptionAction = {
  id: string;
  title: string;
  description: string;
  icon: string;
  offer?: string;
  href?: string;
};

export type AccountSubscriptionSummary = {
  outstandingDues: number;
  activeCount: number;
  monthlySpend: number;
  duesDetailsHref: string;
};

/** Set outstandingDues to 7904 to preview pending dues; 0 = all dues paid */
export const MOCK_SUBSCRIPTION_SUMMARY: AccountSubscriptionSummary = {
  outstandingDues: 0,
  activeCount: 2,
  monthlySpend: 1581,
  duesDetailsHref: "/account-billing-payments",
};

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-1",
    status: "active",
    title: "Washing Machine – Fully Automatic Top Load",
    plan: "1 month plan",
    billing: "Paid monthly",
    costPerMonth: 842,
    image: "/assets/images/product/square/product-9.jpg",
    rentedFrom: "6 Sept '25",
    renewalLabel: "Renews on",
    renewalDate: "6 Jun '26",
    billingDate: "6th of every month",
  },
  {
    id: "sub-2",
    status: "active",
    title: "Fridge – Single Door",
    plan: "1 month plan",
    billing: "Paid monthly",
    costPerMonth: 739,
    image: "/assets/images/product/square/product-5.jpg",
    rentedFrom: "18 Aug '25",
    renewalLabel: "Renews on",
    renewalDate: "18 Jul '26",
    billingDate: "18th of every month",
  },
  {
    id: "sub-3",
    status: "inactive",
    title: "Microwave Oven – 20L",
    plan: "6 month plan",
    billing: "Paid monthly",
    costPerMonth: 499,
    image: "/assets/images/product/square/product-2.jpg",
    rentedFrom: "12 May '25",
    renewalLabel: "Ended on",
    renewalDate: "15 Nov '25",
    billingDate: "12th of every month",
    endedOn: "15 Nov, 2025",
  },
];

export const MOCK_SUBSCRIPTION_ACTIONS: SubscriptionAction[] = [
  {
    id: "extend",
    title: "Extend Subscription",
    description: "Add more months to your current plan",
    icon: "icon-CalendarBlank",
    offer: "Up to 5% additional discount",
  },
  {
    id: "change-plan",
    title: "Change Subscription Plan",
    description: "Switch to a different duration or plan type",
    icon: "icon-GitDiff",
  },
  // {
  //   id: "invoice-preference",
  //   title: "Invoice Preference",
  //   description: "Add GST details to claim GST benefits on invoices",
  //   icon: "icon-ReceiptX",
  // },
  {
    id: "see-more",
    title: "See More",
    description: "View all available services",
    icon: "icon-ListDashes",
    href: "/account-service-requests",
  },
];

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonthlySpend(amount: number): string {
  return `${formatInr(amount)}/mo`;
}

export function getActiveSubscriptions(
  subscriptions: Subscription[],
): Subscription[] {
  return subscriptions.filter((s) => s.status === "active");
}

export function getInactiveSubscriptions(
  subscriptions: Subscription[],
): Subscription[] {
  return subscriptions.filter((s) => s.status === "inactive");
}

export function hasOutstandingDues(outstandingDues: number): boolean {
  return outstandingDues > 0;
}

/** Label for summary row and dues panel when nothing is owed */
export function formatDuesStatusLabel(outstandingDues: number): string {
  return hasOutstandingDues(outstandingDues)
    ? formatInr(outstandingDues)
    : "All dues paid";
}
