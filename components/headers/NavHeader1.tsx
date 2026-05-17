"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  navHomeLinks,
  navShop,
  navProduct,
} from "@/data/navHeader1";
import { topPicsProducts } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";
import {
  type CategorySlug,
  getCategoryPath,
} from "@/lib/catalog/catalogRoutes";
import { useStore } from "@/context/store";

const locationAwareMenus: Array<{
  label: string;
  category: CategorySlug;
}> = [
  { label: "Home Furniture", category: "home-furniture" },
  { label: "Appliances", category: "appliances" },
  { label: "Combos", category: "combos" },
];

type CatalogNavApiItem = { label: string; href: string };

async function fetchCatalogNavItems(
  location: string,
  category: CategorySlug,
): Promise<CatalogNavApiItem[]> {
  const params = new URLSearchParams({ location, category });
  const res = await fetch(`/api/catalog/subcategory-nav?${params.toString()}`);
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { items?: CatalogNavApiItem[] };
  return data.items ?? [];
}

export default function NavHeader1({
  variant2 = false,
  variant3 = false,
}: {
  variant2?: boolean;
  variant3?: boolean;
}) {
  const selectedLocation = useStore((state) => state.selectedLocation);
  const [navByCategory, setNavByCategory] = useState<
    Partial<Record<CategorySlug, CatalogNavApiItem[]>>
  >({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        locationAwareMenus.map(async (menu) => {
          const items = await fetchCatalogNavItems(
            selectedLocation,
            menu.category,
          );
          return [menu.category, items] as const;
        }),
      );
      if (!cancelled) {
        setNavByCategory(Object.fromEntries(entries));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedLocation]);

  return (
    <>
      {locationAwareMenus.map((menu) => {
        const links = navByCategory[menu.category] ?? [];
        const allCategoryHref = getCategoryPath(selectedLocation, menu.category);
        const menuLinks =
          links.length > 0
            ? links
            : [{ label: "View all", href: allCategoryHref }];

        return (
          <li key={menu.category} className="menu-item position-relative">
            <Link href={allCategoryHref} className="item-link !pt-[2px] !pb-[5px]">
              <span className="text cus-text"> {menu.label} </span>
              <i className="icon icon-CaretDown" />
            </Link>
            <div className="sub-menu mega-menu-item">
              <ul className="sub-menu_list">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sub-menu_link has-text">
                      <span className="cus-text"> {link.label} </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
      <li className="menu-item">
        <Link href="/" className="item-link !pt-[2px] !pb-[5px]">
          <span className="text cus-text"> Refer a friend </span>
        </Link>
      </li>
      <li className="menu-item position-relative">
        <a href="#" className="item-link !pt-[2px] !pb-[5px]">
          <span className="text cus-text"> Home </span>
          <i className="icon icon-CaretDown" aria-hidden />
        </a>
        <div
          className={`sub-menu mega-menu_home_v2${variant2 ? " home-type_2" : ""}${variant3 ? " home-type_3" : ""}`}
        >
          {navHomeLinks.map((column, colIndex) => (
            <ul key={colIndex} className="sub-menu_list">
              {column.map((item) => (
                <li key={item.href + item.text}>
                  <Link href={item.href} className="sub-menu_link has-text">
                    <span className="cus-text"> {item.text} </span>
                    {item.label != null && (
                      <span className={`demo-label type-${item.label}`}>
                        {item.label === "hot"
                          ? "Hot"
                          : item.label === "new"
                            ? "New"
                            : "Trend"}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
          <div className="image-preview">
            <Image
              src="/assets/images/section/amerce-html.jpg"
              alt=""
              width={300}
              height={264}
              loading="lazy"
            />
          </div>
        </div>
      </li>
      <li className="menu-item">
        <a href="#" className="item-link !pt-[2px] !pb-[5px]">
          <span className="text cus-text"> Shop </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navShop.map((column, index) => (
                <div className="col-2" key={index}>
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="sub-menu_link has-text"
                          >
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-4">
                <div className="box-image_v01 style-2 h-100">
                  <Link
                    href="/shop-default"
                    className="box-image_img img-style"
                  >
                    <Image
                      src="/assets/images/collection/cls-7.jpg"
                      alt=""
                      width={700}
                      height={461}
                      loading="lazy"
                    />
                  </Link>
                  <div className="box-image_content">
                    <Link
                      href="/shop-default"
                      className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
                    >
                      Shop Men
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="menu-item">
        <a href="#" className="item-link !pt-[2px] !pb-[5px]">
          <span className="text cus-text"> Product </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navProduct.map((column, index) => (
                <div
                  className={`col-2 ${index === 0 ? "ms-auto" : ""}`}
                  key={index}
                >
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="sub-menu_link has-text"
                          >
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-4 me-auto">
                <TfSwiper
                  preview={2}
                  tablet={2}
                  mobileSm={2}
                  mobile={2}
                  space={10}
                  pagination={2}
                  paginationSm={2}
                  paginationMd={2}
                  paginationLg={2}
                  paginationClassName="sw-dot-default tf-sw-pagination"
                >
                  {topPicsProducts.map((product) => (
                    <ProductCard
                      key={product.img}
                      product={product}
                      actionBotLabel="Quick Add"
                      actionBotDataToggle="modal"
                    />
                  ))}
                </TfSwiper>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}
