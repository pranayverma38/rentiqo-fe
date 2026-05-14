"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  getEquivalentLocationPath,
  getLocationSlugFromPathname,
  locationOptions,
} from "@/lib/catalog/catalogRoutes";
import { useStore } from "@/context/store";

interface LanguageSelectProps {
  placement?: string;
  textBlack?: boolean;
  textColor?: string;
}

export default function LanguageSelect({
  placement = "bottom-start",
  textBlack = false,
  textColor = "color-white",
}: LanguageSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedLocation = useStore((state) => state.selectedLocation);
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);
  const activeLocation =
    locationOptions.find((location) => location.slug === selectedLocation) ??
    locationOptions[0];

  useEffect(() => {
    const locationFromPath = getLocationSlugFromPathname(pathname);
    if (
      locationFromPath != null &&
      locationFromPath !== selectedLocation
    ) {
      setSelectedLocation(locationFromPath);
    }
  }, [pathname, selectedLocation, setSelectedLocation]);

  return (
    <div
      className={`dropdown bootstrap-select tf-dropdown-select style-default ${
        textBlack ? "" : textColor
      } type-languages`}
    >
      <button
        type="button"
        className="btn dropdown-toggle btn-light"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={activeLocation.label}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">
              {activeLocation.label}
            </div>
          </div>
        </div>
      </button>

      <div className="dropdown-menu" data-popper-placement={placement}>
        <ul className="dropdown-menu inner show" role="presentation">
          {locationOptions.map((location) => (
            <li
              key={location.slug}
              className={
                activeLocation.slug === location.slug ? "selected active" : ""
              }
            >
              <a
                role="option"
                aria-selected={activeLocation.slug === location.slug}
                className={`dropdown-item ${
                  activeLocation.slug === location.slug ? "active selected" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.slug === activeLocation.slug) {
                    return;
                  }

                  setSelectedLocation(location.slug);
                  const nextPath = getEquivalentLocationPath(
                    pathname,
                    location.slug,
                  );
                  if (nextPath == null || nextPath === pathname) {
                    return;
                  }

                  const queryString =
                    typeof window === "undefined" ? "" : window.location.search;
                  router.push(
                    queryString ? `${nextPath}${queryString}` : nextPath,
                  );
                }}
              >
                <span className="text">{location.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
