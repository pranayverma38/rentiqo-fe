"use client";

import Link from "next/link";

import { ACCOUNT_MENU_HREF } from "./accountNav";

export default function AccountMobileBack() {
  return (
    <Link
      href={ACCOUNT_MENU_HREF}
      className="account-mobile-back d-lg-none"
      aria-label="Back to account menu"
    >
      <i className="icon icon-ArrowLeft" aria-hidden />
      <span className="account-mobile-back__label">Back</span>
    </Link>
  );
}
