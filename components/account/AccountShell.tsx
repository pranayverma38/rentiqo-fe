"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import AccountMobileBack from "@/components/account/AccountMobileBack";
import AccountShellTitle from "@/components/account/AccountShellTitle";
import AccountSidebar from "@/components/account/AccountSidebar";
import { ACCOUNT_MENU_HREF } from "@/components/account/accountNav";
import { getAccountPageMeta } from "@/components/account/accountPageMeta";

type AccountShellProps = {
  children: React.ReactNode;
};

export default function AccountShell({ children }: AccountShellProps) {
  const pathname = usePathname();
  const meta = getAccountPageMeta(pathname);
  const sectionClassName = meta?.sectionClassName ?? "flat-spacing";
  const isMobileMenuView = pathname === ACCOUNT_MENU_HREF;

  useEffect(() => {
    document.documentElement.classList.add("account-route");
    return () => {
      document.documentElement.classList.remove("account-route");
    };
  }, []);

  return (
    <section
      className={`account-section ${sectionClassName} max-lg:!pt-[30px]`.trim()}
    >
      <div className="container">
        <div
          className={`row account-shell${isMobileMenuView ? " account-shell--mobile-menu" : " account-shell--mobile-content"}`}
        >
          <div className="col-lg-4 col-xl-3 account-shell__sidebar">
            {isMobileMenuView ? (
              <div className="account-shell__menu-heading d-lg-none">
                <AccountShellTitle />
              </div>
            ) : null}
            <AccountSidebar />
          </div>
          <div className="col-lg-8 ms-auto account-shell__main">
            <div className="my-account-content">
              {!isMobileMenuView ? <AccountMobileBack /> : null}
              <div
                className={
                  isMobileMenuView ? "account-shell__title-desktop d-none d-lg-block" : undefined
                }
              >
                <AccountShellTitle />
              </div>
              <div className="account-shell__body">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}