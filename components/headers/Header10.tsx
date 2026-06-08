"use client";
import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import CartNavIcon from "./CartNavIcon";
import HeaderUserNav from "./HeaderUserNav";

export default function Header10({
  parentClass = "tf-header header-s10 scr-box-shadow",
  containerFull = false,
  hasHrLine = false,
}) {
  const headerSticky = useHeaderSticky();
  const containerClass = containerFull ? "container-full" : "container";
  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-80px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`${parentClass}${headerSticky ? " header-sticky" : ""}`}
    >
      {hasHrLine && <div className="br-line fake-class bottom-0"></div>}
      <div className={containerClass}>
        <div className="header-inner">
          <div className="box-open-menu-mobile d-xl-none">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              className="btn-open-menu"
            >
              <i className="icon icon-List" />
            </a>
          </div>
          <div className="header-left">
            <Link href={`/`} className="logo-site">
              <Image
                loading="lazy"
                width={150}
                height={30}
                src="/assets/images/logo/logo.svg"
                alt="Image"
              />
            </Link>
          </div>
          <div className="header-center d-none d-xl-block">
            <nav className="box-navigation">
              <ul className="box-nav-menu">
                <Nav variant2 />
              </ul>
            </nav>
          </div>
          <div className="header-right">
            <ul className="nav-icon-list">
              <li className="d-none d-sm-block">
                <a
                  href="#search"
                  data-bs-toggle="modal"
                  className="nav-icon-item link"
                >
                  <i className="icon icon-MagnifyingGlass" />
                </a>
              </li>
              <HeaderUserNav />
              <li className="d-none d-sm-block">
                <Link href={`/wishlist`} className="nav-icon-item link">
                  <i className="icon icon-HeartStraight" />
                </Link>
              </li>
              <li>
                <CartNavIcon />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}