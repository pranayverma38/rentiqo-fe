"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthProvider";
import { getAccountPageMeta } from "@/components/account/accountPageMeta";

export default function AccountShellTitle() {
  const pathname = usePathname();
  const meta = getAccountPageMeta(pathname);
  const { customer } = useAuth();

  if (!meta) {
    return null;
  }

  if (meta.useGreeting) {
    const greetingName =
      customer?.first_name?.trim() ||
      customer?.email?.split("@")[0] ||
      "there";
    return <h4 className="account-title">{`Hello, ${greetingName}`}</h4>;
  }

  return <h4 className="account-title">{meta.sectionTitle}</h4>;
}
