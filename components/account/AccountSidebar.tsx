"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ACCOUNT_NAV_ITEMS } from "./accountNav";
import { useAuth } from "@/context/AuthProvider";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/login");
  };

  return (
    <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
      <nav className="my-account-nav" aria-label="Account">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`link-account${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <i className={`icon ${item.icon}`} />
              <span className="text h6 fw-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className="link-account border-0 bg-transparent w-100 text-start"
          onClick={handleLogout}
        >
          <i className="icon icon-SignOut" />
          <span className="text h6 fw-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
