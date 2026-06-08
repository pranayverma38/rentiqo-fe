import Link from "next/link";
import type { ReactNode } from "react";

import CategoryFilter from "@/components/catalog/CategoryFilter";
import Shop from "@/components/shop/shop-default/Shop";
import type { MedusaSubcategoryNavItem } from "@/lib/catalog/rentiqoStoreCatalog";
import type {
  CategorySlug,
  LocationSlug,
} from "@/lib/catalog/catalogRoutes";
import type { ShopProduct } from "@/types/shopFilter";

export type ShopCrumb = {
  label: string;
  href?: string;
};

export type CategoryShopListingProps = {
  crumbs: ShopCrumb[];
  title: string;
  description: ReactNode;
  locationSlug: LocationSlug;
  categoryPath: string;
  categorySlug: CategorySlug;
  activeSubcategorySlug?: string | null;
  /** From `fetchCatalogProducts` on the server (Medusa / BFF). */
  catalogProducts: ShopProduct[];
  subcategoryNavSource?: "static" | "medusa";
  medusaSubcategoryNav?: MedusaSubcategoryNavItem[];
};

/**
 * Shared hero + left-sidebar shop grid for location-aware category routes.
 * Products are loaded per route via `catalogProducts` (see `fetchCatalogProducts`).
 */
export default function CategoryShopListing({
  crumbs,
  title,
  locationSlug,
  categoryPath,
  categorySlug,
  activeSubcategorySlug,
  catalogProducts,
  subcategoryNavSource = "static",
  medusaSubcategoryNav,
}: CategoryShopListingProps) {
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
                {displayCrumbs.map((crumb, index) => (
                  <span key={`${crumb.label}-${index}`}>
                    {index > 0 ? (
                      <i className="icon icon-CaretRightThin cl-text-3" />
                    ) : null}
                    {crumb.href != null ? (
                      <Link
                        href={crumb.href}
                        className="text-caption-01 cl-text-3 link"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-caption-01">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </div>
              <h3 className="!mb-0 text-left">{title}</h3>
            </div>
          </div>
        </div>
      </section>
      <CategoryFilter
        locationSlug={locationSlug}
        categoryPath={categoryPath}
        categorySlug={categorySlug}
        activeSubcategorySlug={activeSubcategorySlug}
        subcategoryNavSource={subcategoryNavSource}
        medusaSubcategoryNav={medusaSubcategoryNav}
      />
      <Shop variant={["leftSidebar"]} catalogProducts={catalogProducts} />
    </>
  );
}