import Link from "next/link";
import type { ReactNode } from "react";

import Shop from "@/components/shop/shop-default/Shop";

export type DelhiShopCrumb = {
  label: string;
  href?: string;
};

export type DelhiShopListingProps = {
  crumbs: DelhiShopCrumb[];
  title: string;
  description: ReactNode;
};

/**
 * Shared hero + left-sidebar shop grid for Delhi category routes.
 * Product source is wired inside `Shop` (static data today; Medusa later).
 */
export default function DelhiShopListing({
  crumbs,
  title,
  description,
}: DelhiShopListingProps) {
  return (
    <>
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              {crumbs.map((c, i) => (
                <span key={`${c.label}-${i}`}>
                  {i > 0 ? (
                    <i className="icon icon-CaretRightThin cl-text-3" />
                  ) : null}
                  {c.href != null ? (
                    <Link
                      href={c.href}
                      className="text-caption-01 cl-text-3 link"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <p className="text-caption-01">{c.label}</p>
                  )}
                </span>
              ))}
            </div>
            <h3>{title}</h3>
            <p className="text-body-1 cl-text-2">{description}</p>
          </div>
        </div>
      </section>
      <Shop variant={["leftSidebar"]} />
    </>
  );
}
