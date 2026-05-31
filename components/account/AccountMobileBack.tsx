"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ACCOUNT_MENU_HREF } from "./accountNav";
import { getAccountPageMeta } from "./accountPageMeta";

export default function AccountMobileBack() {
  const pathname = usePathname();
  const meta = getAccountPageMeta(pathname);
  const backHref = meta?.backHref ?? ACCOUNT_MENU_HREF;
  const isOrderDetail = Boolean(meta?.backHref?.startsWith("/account-orders"));

  return (
    <Link
      href={backHref}
      className="account-mobile-back d-lg-none"
      aria-label={
        isOrderDetail ? "Back to orders" : "Back to account menu"
      }
    >
      <i className="icon icon-ArrowLeft" aria-hidden />
      <span className="account-mobile-back__label">Back</span>
    </Link>
  );
}
