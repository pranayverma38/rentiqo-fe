"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

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
import { products } from "@/data/products/products";
import type { ProductCardItem } from "@/types/productCard";

type Crumb = { label: string; href?: string };

function useAdjacentProductIds(currentId: string | number) {
  return useMemo(() => {
    const key = String(currentId);
    const sorted = [...products].sort((a, b) =>
      String(a.id).localeCompare(String(b.id), undefined, { numeric: true }),
    );
    const idx = sorted.findIndex((p) => String(p.id) === key);
    if (idx === -1) {
      return {
        prevId: null as string | number | null,
        nextId: null as string | number | null,
      };
    }
    return {
      prevId: idx > 0 ? sorted[idx - 1].id : null,
      nextId: idx < sorted.length - 1 ? sorted[idx + 1].id : null,
    };
  }, [currentId]);
}

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

function NavArrow({
  direction,
  href,
  iconClass,
}: {
  direction: "prev" | "next";
  href: string | undefined;
  iconClass: string;
}) {
  const className = `link nav-post-item nav-post-${direction}`;

  if (!href) {
    return (
      <span
        className={`${className} opacity-50`}
        style={{ pointerEvents: "none" }}
        aria-disabled="true"
        tabIndex={-1}
      >
        <i className={`icon ${iconClass}`} />
      </span>
    );
  }

  return (
    <Link href={href} className={className} prefetch={false}>
      <i className={`icon ${iconClass}`} />
    </Link>
  );
}

export default function Breadcrumb({ product }: { product: ProductCardItem }) {
  const params = useParams();
  const pathname = usePathname() ?? "";
  const selectedLocation = useStore((state) => state.selectedLocation);

  const idParam = params?.id;
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam;
  const currentId: string | number =
    rawId != null && rawId !== "" ? rawId : product.id;

  const basePath =
    pathname.includes("/") && pathname.length > 0
      ? pathname.slice(0, pathname.lastIndexOf("/"))
      : "";

  const { prevId, nextId } = useAdjacentProductIds(currentId);

  const prevHref =
    basePath && prevId != null ? `${basePath}/${prevId}` : undefined;
  const nextHref =
    basePath && nextId != null ? `${basePath}/${nextId}` : undefined;

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
          <div className="nav-post-list">
            <NavArrow
              direction="prev"
              href={prevHref}
              iconClass="icon-CaretLeft"
            />
            <Link
              href="/shop-default"
              className="link nav-all-post nav-post-link"
            >
              <i className="icon icon-SquaresFour" />
            </Link>
            <NavArrow
              direction="next"
              href={nextHref}
              iconClass="icon-CaretRightThin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
