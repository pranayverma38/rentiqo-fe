"use client";

import { useMemo, useState } from "react";
import { shopDefaultProducts } from "@/data/products/products";
import type { ShopProduct } from "@/types/shopFilter";
import { useShopState } from "./useShopState";
import { SORT_OPTIONS } from "./ShopFilterBody";
import { ShopMainColumn } from "./ShopMainColumn";
import { ShopPageLayout } from "./ShopPageLayout";
import { ShopOffcanvas } from "./ShopOffcanvas";
import { ShopProvider, type ShopContextValue } from "./ShopContext";
import type { GridCols } from "./shopGridCols";
import {
  computePageItems,
  normalizeShopVariants,
  type ShopLayoutVariant,
  type ShopVariantProp,
} from "./shopLayoutUtils";

export type { ShopLayoutVariant, ShopVariantProp };
export { normalizeShopVariants };
export { useShop } from "./ShopContext";
export type { ShopContextValue } from "./ShopContext";

export default function Shop({
  variant,
  isFullWidth = false,
  /** When set (e.g. catalog routes), shop filters/grid use this list instead of `shopDefaultProducts`. */
  catalogProducts,
}: {
  variant?: ShopVariantProp;
  isFullWidth?: boolean;
  catalogProducts?: ShopProduct[];
}) {
  const sourceProducts = catalogProducts ?? shopDefaultProducts;
  /** Catalog routes pass `catalogProducts`; theme shop pages omit it. */
  const squareProductCards = catalogProducts !== undefined;

  const variants = useMemo(() => normalizeShopVariants(variant), [variant]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [gridCols, setGridCols] = useState<GridCols>(() =>
    variants.includes("filterDrawer") ? "tf-col-3" : "tf-col-4",
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [wideEnoughForSidebar, setWideEnoughForSidebar] = useState(false);

  const {
    state,
    dispatch,
    visibleProducts: pagedVisibleProducts,
    getFilterCount,
    hasNoFilteredItems,
    hasMultiplePages,
  } = useShopState({ products: sourceProducts });

  const infiniteScroll = variants.includes("infinityScroll");
  const progressive =
    infiniteScroll || variants.includes("loadMoreButton");

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === state.sortingOption)?.label ??
    "Best Selling";

  const totalPages = Math.max(
    1,
    Math.ceil(state.sorted.length / state.itemPerPage),
  );

  const showPaginationFooter = !progressive && hasMultiplePages;
  const pageItems = computePageItems(totalPages, state.currentPage);

  const sidebarPlacement = variants.find(
    (v): v is "leftSidebar" | "rightSidebar" =>
      v === "leftSidebar" || v === "rightSidebar",
  );
  const showDesktopSidebar = sidebarPlacement != null && wideEnoughForSidebar;
  const showOffcanvas =
    !showDesktopSidebar && !variants.includes("filterDrawer");

  const shop = useMemo<ShopContextValue>(
    () => ({
      variants,
      sidebarPlacement,
      showDesktopSidebar,
      setWideEnoughForSidebar,
      viewMode,
      setViewMode,
      gridCols,
      setGridCols,
      sortOpen,
      setSortOpen,
      sortLabel,
      state,
      dispatch,
      hasNoFilteredItems,
      showPaginationFooter,
      progressive,
      infiniteScroll,
      filterBodyProps: {
        state,
        dispatch,
        getFilterCount,
        sourceProducts,
      },
      pagedVisibleProducts,
      totalPages,
      pageItems,
      squareProductCards,
    }),
    [
      variants,
      sidebarPlacement,
      showDesktopSidebar,
      setWideEnoughForSidebar,
      viewMode,
      gridCols,
      sortOpen,
      sortLabel,
      state,
      dispatch,
      getFilterCount,
      sourceProducts,
      hasNoFilteredItems,
      showPaginationFooter,
      progressive,
      infiniteScroll,
      pagedVisibleProducts,
      totalPages,
      pageItems,
      squareProductCards,
    ],
  );

  return (
    <ShopProvider value={shop}>
      <section className="flat-spacing">
        {showOffcanvas && <ShopOffcanvas />}

        <ShopPageLayout
          isFullWidth={isFullWidth}
          showDesktopSidebar={showDesktopSidebar}
          sidebarPlacement={sidebarPlacement}
        >
          <ShopMainColumn />
        </ShopPageLayout>
      </section>
    </ShopProvider>
  );
}
