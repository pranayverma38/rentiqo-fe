"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSelect from "../common/LanguageSelect";
import CartIconCount from "./CartIconCount";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";

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
