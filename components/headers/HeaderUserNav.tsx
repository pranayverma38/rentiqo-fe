"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ACCOUNT_DESKTOP_ENTRY_HREF,
  ACCOUNT_MOBILE_MENU_HREF,
} from "@/components/account/accountEntry";
import { useAuth } from "@/context/AuthProvider";

const ACCOUNT_MENU_LINKS = [
  { href: ACCOUNT_DESKTOP_ENTRY_HREF, label: "My Account" },
  { href: "/account-orders", label: "Your Order" },
  { href: "/account-addresses", label: "My Address" },
  { href: "/account-profile", label: "My Profile" },
] as const;

export default function HeaderUserNav() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <li>
        <span className="nav-icon-item link" aria-hidden="true">
          <i className="icon icon-User" />
        </span>
      </li>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <li className="nav-account d-none d-sm-block">
          <a href="#" className="nav-icon-item link" onClick={(e) => e.preventDefault()}>
            <i className="icon icon-User" />
          </a>
          <div className="dropdown-account">
            <ul className="list-menu-item">
              {ACCOUNT_MENU_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="sub-menu_link">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="sub-menu_link border-0 bg-transparent p-0 w-100 text-start"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </li>
        <li className="d-sm-none">
          <Link href={ACCOUNT_MOBILE_MENU_HREF} className="nav-icon-item link">
            <i className="icon icon-User" />
          </Link>
        </li>
      </>
    );
  }

  return (
    <li>
      <a href="#sign" data-bs-toggle="modal" className="nav-icon-item link">
        <i className="icon icon-User" />
      </a>
    </li>
  );
}