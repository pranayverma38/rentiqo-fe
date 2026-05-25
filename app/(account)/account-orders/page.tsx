import { Metadata } from "next";

import AccountOrders from "@/components/account/account-orders/AccountOrders";

export const metadata: Metadata = {
  title: "Your Orders | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AccountOrdersPage = () => {
  return <AccountOrders />;
};

export default AccountOrdersPage;
