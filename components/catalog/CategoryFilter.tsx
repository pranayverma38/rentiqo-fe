import Image from "next/image";
import Link from "next/link";

import type {
  CategorySlug,
  LocationSlug,
} from "@/lib/catalog/subcategories";
import { getLocationCategoryFilters } from "@/lib/catalog/subcategories";

const DEFAULT_FILTER_IMAGE = "/assets/images/custom-top-filter/apple2.png";

type CategoryFilterProps = {
  locationSlug: LocationSlug;
  categoryPath: string;
  categorySlug: CategorySlug;
  activeSubcategorySlug?: string | null;
};

function isFilterActive(
  filterSlug: string,
  activeSubcategorySlug?: string | null,
): boolean {
  if (filterSlug === "all") {
    return activeSubcategorySlug == null || activeSubcategorySlug === "all";
  }

  return filterSlug === activeSubcategorySlug;
}

export default function CategoryFilter({
  locationSlug,
  categoryPath,
  categorySlug,
  activeSubcategorySlug,
}: CategoryFilterProps) {
  const filters = getLocationCategoryFilters(locationSlug, categorySlug);
  const activeRingClass =
    "ring-2 ring-[rgb(247_130_64)] shadow-[inset_0_0_0_2px_#fff]";

  if (filters.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[var(--line)] px-0 py-2 md:py-3">
      <div className="container">
        <nav
          className="-ml-[1px] flex max-w-full gap-2.5 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-3 [&::-webkit-scrollbar]:hidden"
          aria-label={`${categorySlug} subcategories`}
        >
          {filters.map((filter) => {
            const active = isFilterActive(filter.slug, activeSubcategorySlug);
            const href =
              filter.slug === "all"
                ? categoryPath
                : `${categoryPath}/${filter.slug}`;

            return (
              <Link
                key={filter.slug}
                href={href}
                className="group flex w-[82px] shrink-0 flex-col items-center gap-1.5 text-center text-[var(--text)] focus-visible:outline-none sm:w-[90px] md:w-[98px]"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={[
                    "relative inline-flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-[#fff8f5] p-2 shadow-[0_1px_3px_rgba(17,24,39,0.05)] transition-all duration-200 sm:h-[78px] sm:w-[78px] md:h-[86px] md:w-[86px]",
                    active ? activeRingClass : "",
                  ].join(" ")}
                >
                  <Image
                    src={DEFAULT_FILTER_IMAGE}
                    alt={filter.imageAlt ?? filter.label}
                    width={84}
                    height={84}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </span>
                <span
                  className={[
                    "flex min-h-[32px] w-full items-center justify-center text-center text-[12px] font-medium leading-[1.25] text-[var(--text)] sm:text-[13px]",
                    active ? "text-[var(--dark)]" : "",
                  ].join(" ")}
                >
                  {filter.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
