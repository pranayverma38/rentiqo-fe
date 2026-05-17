"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSelect from "../common/LanguageSelect";
import CartNavIcon from "./CartNavIcon";
import HeaderUserNav from "./HeaderUserNav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import NavHeader1 from "./NavHeader1";

export default function Header1() {
  const headerSticky = useHeaderSticky();
  const rotatingSearchTexts = ["Search Sofa", "Search Bed", "Search Table", "Search AC"];
  const rotatingSearchTextsLoop = [...rotatingSearchTexts, rotatingSearchTexts[0]];
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isResettingTicker, setIsResettingTicker] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) return;
    if (placeholderIndex < rotatingSearchTexts.length) {
      const stepTimeout = setTimeout(() => {
        setPlaceholderIndex((prev) => prev + 1);
      }, 2200);
      return () => clearTimeout(stepTimeout);
    }

    const resetTimeout = setTimeout(() => {
      setIsResettingTicker(true);
      setPlaceholderIndex(0);

      // Re-enable transition on the next paint so next cycle animates normally.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsResettingTicker(false);
        });
      });
    }, 420);

    return () => clearTimeout(resetTimeout);
  }, [placeholderIndex, rotatingSearchTexts.length, searchQuery]);

  return (
    <header
      className={`tf-header header-s2 scr-box-shadow relative max-w-full${
        headerSticky ? " header-sticky" : ""
      }`}
      style={{
        top: headerSticky ? "0px" : "-100%",
        transition: "top 0.3s ease-in-out",
      }}
    >
      <div className="w-[1440px] max-w-full mx-auto px-[15px]">
        <div className="header-inner">
          <div className="box-open-menu-mobile d-xl-none ![display:block] !flex-[0_0_auto] !mr-[10px] !self-center md:!hidden">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              className="btn-open-menu !flex !items-center !justify-center !h-full !leading-none"
              aria-label="Open menu"
            >
              <i className="icon icon-List !block !leading-none" />
            </a>
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
            <div className="tf-list list-currenci d-flex">
              <div className="tf-languages">
                <LanguageSelect textBlack />
              </div>
            </div>
          </div>
          <div className="header-center flex-1 max-w-[450px] !py-0 lg:!py-4">
            <div className="header-search">
              <form className="header-search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="!h-[40px] !max-h-[40px] !px-2 !pr-9 !text-sm placeholder:!text-sm focus:!border-[var(--primary)] focus:!outline-none focus:!ring-0"
                  type="text"
                  placeholder=""
                  name="search"
                  tabIndex={2}
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {!searchQuery && (
                  <span className="pointer-events-none absolute left-2 top-1/2 h-[20px] -translate-y-1/2 overflow-hidden">
                    <span
                      className={`block !text-sm leading-5 text-[#9a9aa4] ${
                        isResettingTicker ? "" : "transition-transform duration-[420ms] ease-in-out"
                      }`}
                      style={{ transform: `translateY(-${placeholderIndex * 20}px)` }}
                    >
                      {rotatingSearchTextsLoop.map((text, index) => (
                        <span key={`${text}-${index}`} className="block h-[20px]">
                          {text}
                        </span>
                      ))}
                    </span>
                  </span>
                )}
                <button type="submit" aria-label="Submit search">
                  <i className="icon icon-MagnifyingGlass !font-black [-webkit-text-stroke:0.3px_currentColor]" />
                </button>
              </form>
            </div>
          </div>
          <div className="header-right">
            <ul className="nav-icon-list">
              <HeaderUserNav />
              <li>
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
      <div className="header-bottom_wrap d-none d-xl-block header-bottom_wrap--header1-clone min-w-0 max-w-full">
        <div className="container min-w-0 max-w-full">
          <div className="header-bottom !w-full min-w-0 max-w-full">
            <nav className="box-navigation !w-full min-w-0 max-w-full">
              <ul className="box-nav-menu !flex !w-full !min-w-0 !max-w-full !flex-wrap !justify-start !gap-y-2 [&>li]:shrink-0">
                <NavHeader1 />
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Explicit divider to ensure the thin grey line is visible under the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[#e9e9ee] z-10"
      />
    </header>
  );
}
