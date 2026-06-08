"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useStore } from "@/context/store";
import {
  getCategoryLabel,
  getCategoryPath,
  getSubcategoryPath,
  isCategorySlug,
  type CategorySlug,
  type LocationSlug,
} from "@/lib/catalog/catalogRoutes";
import type { ProductCategoryNav } from "@/lib/catalog/rentiqoStoreCatalog";
import type { ProductCardItem } from "@/types/productCard";

type Crumb = { label: string; href?: string };

function buildCatalogBreadcrumbs(
  categoryNav: ProductCategoryNav,
  location: LocationSlug,
  productName: string,
): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

  const { parentHandle, parentName, leafHandle, leafName } = categoryNav;

  if (parentHandle != null && isCategorySlug(parentHandle) && parentName != null) {
    crumbs.push({
      label: getCategoryLabel(parentHandle) || parentName,
      href: getCategoryPath(location, parentHandle),
    });
  }

  if (
    leafHandle != null &&
    leafName != null &&
    parentHandle != null &&
    isCategorySlug(parentHandle)
  ) {
    crumbs.push({
      label: leafName,
      href: getSubcategoryPath(location, parentHandle, leafHandle),
    });
  }

  crumbs.push({ label: productName });
  return crumbs;
}

export default function Breadcrumb({ product }: { product: ProductCardItem }) {
  const selectedLocation = useStore((state) => state.selectedLocation);

  const categoryNav = (
    product as ProductCardItem & { categoryNav?: ProductCategoryNav }
  ).categoryNav;

  const crumbs = useMemo(() => {
    if (categoryNav != null && (categoryNav.parentName ?? categoryNav.leafName)) {
      return buildCatalogBreadcrumbs(categoryNav, selectedLocation, product.name);
    }
    return [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop-default" },
      { label: product.name },
    ] as Crumb[];
  }, [categoryNav, selectedLocation, product.name]);

  return (
    <div className="section-page-title-single flat-spacing-3">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            {crumbs.map((crumb, index) => (
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
                  <p className="text-caption-01 mb-0 d-inline">{crumb.label}</p>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}