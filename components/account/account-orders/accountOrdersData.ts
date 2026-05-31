export type AccountOrderStatus =
  | "order_delivered"
  | "ordered"
  | "kyc_pending"
  | "delivery_pending"
  | "out_for_delivery";

export type BillingCycle = "Monthly" | "Quarterly" | "Weekly";

export type AccountOrderItem = {
  id: string;
  image: string;
  quantity: number;
  name: string;
  subscriptionTenure: string;
  rentPerMonth: number;
};

export type AccountOrderDelivery = {
  orderedOn: string;
  deliveredOn?: string;
  expectedDeliveryOn?: string;
  deliveredOnDisplay?: string;
  expectedDeliveryDisplay?: string;
  recipientName: string;
  address: string;
  phone: string;
};

export type AccountOrderPayment = {
  paymentMethod: string;
  totalAmountPaid: number;
  invoiceHref: string;
  advanceRent: number;
  deliveryInstallation: number;
  gst: number;
  totalPayable: number;
};

export type AccountOrder = {
  id: string;
  orderNumber: string;
  status: AccountOrderStatus;
  statusLabel: string;
  itemCount: number;
  billingCycle: BillingCycle;
  rentPerMonth: number;
  rentPerMonthRounded: number;
  items: AccountOrderItem[];
  delivery: AccountOrderDelivery;
  payment: AccountOrderPayment;
};

const SAMPLE_ADDRESS =
  "FLAT 102, SHREE APARTMENTS, NEAR CHURCH and Ekta Apartments, POCHANPUR, ROAD NO 1, DWARKA SECTOR 23B. Hereinafter referred to as the SAID PROPERTY. Church Delhi, Delhi - 110077";

export const MOCK_ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: "ord-1",
    orderNumber: "RQ-284719",
    status: "order_delivered",
    statusLabel: "Order Delivered",
    itemCount: 2,
    billingCycle: "Monthly",
    rentPerMonth: 1580.96,
    rentPerMonthRounded: 1581,
    items: [
      {
        id: "li-1",
        image: "/assets/images/product/square/product-1.jpg",
        quantity: 1,
        name: "Ergonomic Office Chair — Black",
        subscriptionTenure: "12 Months",
        rentPerMonth: 899,
      },
      {
        id: "li-2",
        image: "/assets/images/product/square/product-3.jpg",
        quantity: 1,
        name: "Height Adjustable Study Desk",
        subscriptionTenure: "12 Months",
        rentPerMonth: 681.96,
      },
    ],
    delivery: {
      orderedOn: "02/09/2025",
      deliveredOn: "06/09/2025",
      deliveredOnDisplay: "Sat 06, Sep 2025",
      recipientName: "Pranay Verma",
      address: SAMPLE_ADDRESS,
      phone: "8859228751",
    },
    payment: {
      paymentMethod: "UPI",
      totalAmountPaid: 4232,
      invoiceHref: "/account-billing-payments",
      advanceRent: 3162,
      deliveryInstallation: 499,
      gst: 571,
      totalPayable: 4232,
    },
  },
  {
    id: "ord-2",
    orderNumber: "RQ-284502",
    status: "kyc_pending",
    statusLabel: "KYC Pending",
    itemCount: 1,
    billingCycle: "Monthly",
    rentPerMonth: 899.5,
    rentPerMonthRounded: 900,
    items: [
      {
        id: "li-3",
        image: "/assets/images/product/square/product-5.jpg",
        quantity: 1,
        name: "Single Door Refrigerator 190L",
        subscriptionTenure: "24 Months",
        rentPerMonth: 899.5,
      },
    ],
    delivery: {
      orderedOn: "28/12/2025",
      expectedDeliveryOn: "05/01/2026",
      expectedDeliveryDisplay: "Mon 05, Jan 2026",
      recipientName: "Pranay Verma",
      address: SAMPLE_ADDRESS,
      phone: "8859228751",
    },
    payment: {
      paymentMethod: "Card",
      totalAmountPaid: 2698,
      invoiceHref: "/account-billing-payments",
      advanceRent: 1799,
      deliveryInstallation: 599,
      gst: 300,
      totalPayable: 2698,
    },
  },
  {
    id: "ord-3",
    orderNumber: "RQ-284388",
    status: "delivery_pending",
    statusLabel: "Delivery Pending",
    itemCount: 3,
    billingCycle: "Monthly",
    rentPerMonth: 3249.25,
    rentPerMonthRounded: 3249,
    items: [
      {
        id: "li-4",
        image: "/assets/images/product/square/product-7.jpg",
        quantity: 1,
        name: "Queen Size Bed with Storage",
        subscriptionTenure: "18 Months",
        rentPerMonth: 1499,
      },
      {
        id: "li-5",
        image: "/assets/images/product/square/product-8.jpg",
        quantity: 1,
        name: "6 Inch Memory Foam Mattress",
        subscriptionTenure: "18 Months",
        rentPerMonth: 999,
      },
      {
        id: "li-6",
        image: "/assets/images/product/square/product-2.jpg",
        quantity: 1,
        name: "Bedside Table — Walnut Finish",
        subscriptionTenure: "12 Months",
        rentPerMonth: 751.25,
      },
    ],
    delivery: {
      orderedOn: "20/12/2025",
      expectedDeliveryOn: "28/12/2025",
      expectedDeliveryDisplay: "Sun 28, Dec 2025",
      recipientName: "Pranay Verma",
      address: SAMPLE_ADDRESS,
      phone: "8859228751",
    },
    payment: {
      paymentMethod: "UPI",
      totalAmountPaid: 9748,
      invoiceHref: "/account-billing-payments",
      advanceRent: 6498,
      deliveryInstallation: 999,
      gst: 2251,
      totalPayable: 9748,
    },
  },
  {
    id: "ord-4",
    orderNumber: "RQ-284201",
    status: "out_for_delivery",
    statusLabel: "Out for Delivery",
    itemCount: 2,
    billingCycle: "Quarterly",
    rentPerMonth: 2100,
    rentPerMonthRounded: 2100,
    items: [
      {
        id: "li-7",
        image: "/assets/images/product/square/product-4.jpg",
        quantity: 2,
        name: "Fabric 2-Seater Sofa",
        subscriptionTenure: "12 Months",
        rentPerMonth: 1400,
      },
      {
        id: "li-8",
        image: "/assets/images/product/square/product-6.jpg",
        quantity: 1,
        name: "Center Table — Glass Top",
        subscriptionTenure: "12 Months",
        rentPerMonth: 700,
      },
    ],
    delivery: {
      orderedOn: "15/12/2025",
      expectedDeliveryOn: "24/12/2025",
      expectedDeliveryDisplay: "Wed 24, Dec 2025",
      recipientName: "Pranay Verma",
      address: SAMPLE_ADDRESS,
      phone: "8859228751",
    },
    payment: {
      paymentMethod: "Net Banking",
      totalAmountPaid: 7299,
      invoiceHref: "/account-billing-payments",
      advanceRent: 6300,
      deliveryInstallation: 699,
      gst: 300,
      totalPayable: 7299,
    },
  },
  {
    id: "ord-5",
    orderNumber: "RQ-283990",
    status: "ordered",
    statusLabel: "Ordered",
    itemCount: 1,
    billingCycle: "Monthly",
    rentPerMonth: 1299.99,
    rentPerMonthRounded: 1300,
    items: [
      {
        id: "li-9",
        image: "/assets/images/product/square/product-9.jpg",
        quantity: 1,
        name: "Fully Automatic Washing Machine 7kg",
        subscriptionTenure: "24 Months",
        rentPerMonth: 1299.99,
      },
    ],
    delivery: {
      orderedOn: "22/12/2025",
      expectedDeliveryOn: "02/01/2026",
      expectedDeliveryDisplay: "Fri 02, Jan 2026",
      recipientName: "Pranay Verma",
      address: SAMPLE_ADDRESS,
      phone: "8859228751",
    },
    payment: {
      paymentMethod: "UPI",
      totalAmountPaid: 3899,
      invoiceHref: "/account-billing-payments",
      advanceRent: 2599,
      deliveryInstallation: 799,
      gst: 501,
      totalPayable: 3899,
    },
  },
];

export function getAccountOrderById(orderId: string): AccountOrder | undefined {
  return MOCK_ACCOUNT_ORDERS.find((order) => order.id === orderId);
}

export function formatItemCountLabel(count: number): string {
  return `${count} Item${count === 1 ? "" : "s"}`;
}

export function formatOrderMetaLine(
  itemCount: number,
  billingCycle: BillingCycle,
): string {
  return `${formatItemCountLabel(itemCount)} | ${billingCycle} |`;
}

export function formatOrderItemsDetailLine(
  itemCount: number,
  billingCycle: BillingCycle,
): string {
  return `${formatItemCountLabel(itemCount)} | ${billingCycle}`;
}

export function formatInr(
  amount: number,
  options?: { decimals?: number },
): string {
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatRentPerMonthDisplay(
  amount: number,
  roundedMonthly: number,
): string {
  return `${formatInr(amount, { decimals: 2 })} ( ${formatInr(roundedMonthly)}/m)`;
}

export function formatDeliveryHeadline(order: AccountOrder): string {
  const { delivery, status } = order;
  if (
    status === "order_delivered" &&
    delivery.deliveredOnDisplay
  ) {
    return `Delivered On: ${delivery.deliveredOnDisplay}`;
  }
  if (delivery.expectedDeliveryDisplay) {
    return `Expected Delivery: ${delivery.expectedDeliveryDisplay}`;
  }
  return "Delivery date to be confirmed";
}

export function formatDeliveryFooterDate(order: AccountOrder): string {
  const { delivery, status } = order;
  if (status === "order_delivered" && delivery.deliveredOn) {
    return delivery.deliveredOn;
  }
  if (delivery.expectedDeliveryOn) {
    return delivery.expectedDeliveryOn;
  }
  return "—";
}

export function getDeliveryFooterLabel(order: AccountOrder): string {
  return order.status === "order_delivered"
    ? "Delivered On:"
    : "Expected Delivery:";
}

export function getAccountOrderStatusClass(
  status: AccountOrderStatus,
): string {
  switch (status) {
    case "order_delivered":
      return "account-orders__status--delivered";
    case "ordered":
      return "account-orders__status--ordered";
    case "kyc_pending":
      return "account-orders__status--kyc";
    case "delivery_pending":
      return "account-orders__status--delivery-pending";
    case "out_for_delivery":
      return "account-orders__status--out-for-delivery";
    default:
      return "";
  }
}
