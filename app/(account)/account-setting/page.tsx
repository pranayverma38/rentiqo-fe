import { Metadata } from "next";

import AccountSetting from "@/components/account/account-setting/AccountSetting";

export const metadata: Metadata = {
  title: "Setting | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AccountSettingPage = () => {
  return <AccountSetting />;
};

export default AccountSettingPage;
