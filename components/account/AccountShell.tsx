"use client";

import { usePathname } from "next/navigation";

import AccountShellTitle from "@/components/account/AccountShellTitle";
import AccountSidebar from "@/components/account/AccountSidebar";
import { getAccountPageMeta } from "@/components/account/accountPageMeta";

type AccountShellProps = {
  children: React.ReactNode;
};

export default function AccountShell({ children }: AccountShellProps) {
  const pathname = usePathname();
  const meta = getAccountPageMeta(pathname);
  const sectionClassName = meta?.sectionClassName ?? "flat-spacing";

  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3">
            <AccountSidebar />
          </div>
          <div className="col-lg-8 ms-auto">
            <div className="my-account-content">
              <AccountShellTitle />
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
