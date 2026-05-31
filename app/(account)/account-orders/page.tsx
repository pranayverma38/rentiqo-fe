import { Metadata } from "next";

import AccountOrders from "@/components/account/account-orders/AccountOrders";

export const metadata: Metadata = {
  title: "Your Orders | Rentiqo",
  description: "View rental orders and manage subscriptions",
};

const AccountOrdersPage = () => {
  return <AccountOrders />;
};

export default AccountOrdersPage;
