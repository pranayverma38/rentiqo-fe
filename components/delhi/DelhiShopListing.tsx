import Link from "next/link";
import type { ReactNode } from "react";

import DelhiSubcategoryFilter from "@/components/delhi/DelhiSubcategoryFilter";
import Shop from "@/components/shop/shop-default/Shop";
import type { DelhiCategorySlug } from "@/lib/delhi/subcategories";

export type DelhiShopCrumb = {
  label: string;
  href?: string;
};

export type DelhiShopListingProps = {
  crumbs: DelhiShopCrumb[];
  title: string;
  description: ReactNode;
  categoryPath: string;
  categorySlug: DelhiCategorySlug;
  activeSubcategorySlug?: string | null;
};

/**
 * Shared hero + left-sidebar shop grid for Delhi category routes.
 * Product source is wired inside `Shop` (static data today; Medusa later).
 */
export default function DelhiShopListing({
  crumbs,
  title,
  categoryPath,
  categorySlug,
  activeSubcategorySlug,
}: DelhiShopListingProps) {
  const displayCrumbs =
    (activeSubcategorySlug == null || activeSubcategorySlug === "all") &&
    crumbs[crumbs.length - 1]?.label !== "All"
      ? [...crumbs, { label: "All" }]
      : crumbs;

  return (
    <>
      <section className="section-page-title pb-0 pt-6 md:pt-8">
        <div className="container">
          <div className="main-page-title !mx-0 !max-w-none !py-0">
            <div className="flex items-center justify-between gap-4">
              <div className="breadcrumbs !mx-0 !mb-0 !justify-start !text-left">
              {displayCrumbs.map((c, i) => (
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
                    <span className="text-caption-01">{c.label}</span>
                  )}
                </span>
              ))}
              </div>
              <h3 className="!mb-0 text-left">{title}</h3>
            </div>
          </div>
        </div>
      </section>
      <DelhiSubcategoryFilter
        categoryPath={categoryPath}
        categorySlug={categorySlug}
        activeSubcategorySlug={activeSubcategorySlug}
      />
      <Shop variant={["leftSidebar"]} />
    </>
  );
}
