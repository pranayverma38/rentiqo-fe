import { Metadata } from "next";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";

export const metadata: Metadata = {
  title: "My Address | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AccountAddressesPage = () => {
  return <AccountAddresses />;
};

export default AccountAddressesPage;
