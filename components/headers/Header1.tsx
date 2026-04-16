"use client";
import Link from "next/link";
import Image from "next/image";
import LanguageSelect from "../common/LanguageSelect";
import CartIconCount from "./CartIconCount";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";

export default function Header1() {
  const headerSticky = useHeaderSticky();

  return (
    <header
      className={`tf-header header-s2 scr-box-shadow${headerSticky ? " header-sticky" : ""}`}
      style={{
        top: headerSticky ? "0px" : "-80px",
        transition: "top 0.3s ease-in-out",
      }}
    >
      <div className="container-full">
        <div className="header-inner">
          <div className="box-open-menu-mobile d-none">
            {/* <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              className="btn-open-menu"
            >
              <i className="icon icon-List" />
            </a> */}
          </div>
          <div className="header-left">
            {/* <nav className="box-navigation">
              <ul className="box-nav-menu">
                <Nav />
              </ul>
            </nav> */}
            <Link href={`/`} className="logo-site">
              <Image
                loading="lazy"
                width={150}
                height={30}
                src="/assets/images/logo/logo.svg"
                alt="Image"
              />
            </Link>
            <div className="tf-list list-currenci d-none d-xxl-flex">
              <div className="tf-languages">
                <LanguageSelect textBlack />
              </div>
            </div>
          </div>
          <div className="header-center flex-1 max-w-[450px] !py-0 lg:!py-4">
            <div className="header-search">
              <form className="header-search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="!h-[40px] !max-h-[40px] !px-2 !pr-9 !text-base"
                  type="text"
                  placeholder="Search Sofa"
                  name="search"
                  tabIndex={2}
                  aria-label="Search"
                />
                <button type="submit" aria-label="Submit search">
                  <i className="icon icon-MagnifyingGlass" />
                </button>
              </form>
            </div>
          </div>
          <div className="header-right">
            <div className="br-line type-vertical d-none d-xxl-flex" />
            <ul className="nav-icon-list">
              <li>
                <a
                  href="#sign"
                  data-bs-toggle="modal"
                  className="nav-icon-item link"
                >
                  <i className="icon icon-User" />
                </a>
              </li>
              <li className="d-none d-sm-block">
                <Link href={`/wishlist`} className="nav-icon-item link">
                  <i className="icon icon-HeartStraight" />
                </Link>
              </li>
              <li>
                <a
                  href="#shoppingCart"
                  data-bs-toggle="offcanvas"
                  className="nav-icon-item link shop-cart"
                >
                  <i className="icon icon-Handbag" />
                  <CartIconCount />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
