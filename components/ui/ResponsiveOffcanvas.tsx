"use client";

import type { ReactNode } from "react";

export type ResponsiveOffcanvasProps = {
  /** Unique DOM id — triggers use `href="#{id}"` + `data-bs-toggle="offcanvas"`. */
  id: string;
  children: ReactNode;
  /** Extra panel classes (e.g. `canvas-quickview` for product layout). */
  panelClassName?: string;
  /** Optional leading column (product gallery, illustration, etc.). */
  media?: ReactNode;
  /** Header title. Omit when using a custom `header` or `hideHeader`. */
  title?: string;
  /** Replaces the default title + close row. */
  header?: ReactNode;
  /** Render children only — no built-in header chrome. */
  hideHeader?: boolean;
  /** Register with `LayoutModals` so the panel closes on route change. */
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
};

/** Bootstrap `data-bs-toggle` attributes for opening a responsive offcanvas by id. */
export function responsiveOffcanvasTriggerProps(id: string) {
  return {
    href: `#${id}`,
    "data-bs-toggle": "offcanvas" as const,
  };
}

/**
 * Reusable app offcanvas: slides in from the right on desktop (md+),
 * slides up from the bottom on mobile. Uses Bootstrap Offcanvas under the hood.
 */
export default function ResponsiveOffcanvas({
  id,
  children,
  panelClassName,
  media,
  title,
  header,
  hideHeader = false,
  registerOffcanvasElement,
}: ResponsiveOffcanvasProps) {
  const panelClass = [
    "offcanvas",
    "offcanvas-end",
    "canvas-responsive",
    "overflow-hidden md:rounded-tl-[20px] md:rounded-bl-[20px]",
    panelClassName,
    media ? "canvas-responsive--media" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const headerPaddingClass = media
    ? "canvas-header !px-[20px] !py-[18px] md:!pl-0 md:!pr-[32px] md:!pt-[32px] md:!pb-[24px]"
    : "canvas-header !px-[28px] !py-[28px] md:!px-[32px] md:!py-[32px]";

  const bodyPaddingClass = media
    ? "canvas-body !px-[20px] !py-[24px] md:!pl-0 md:!pr-[32px] md:!py-[32px]"
    : "canvas-body !px-[28px] !py-[28px] md:!px-[32px] md:!py-[32px]";

  return (
    <div
      ref={registerOffcanvasElement}
      className={panelClass}
      id={id}
      tabIndex={-1}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      {media}
      <div className="wrap-canvas">
        {!hideHeader &&
          (header ?? (
            <div className={headerPaddingClass}>
              {title ? (
                <h5 className="title-pop" id={`${id}-title`}>
                  {title}
                </h5>
              ) : (
                <span />
              )}
              <span
                className="icon-close-popup"
                data-bs-dismiss="offcanvas"
                role="button"
                tabIndex={0}
                aria-label="Close"
              >
                <i className="icon icon-X2" />
              </span>
            </div>
          ))}
        <div className={bodyPaddingClass}>{children}</div>
      </div>
    </div>
  );
}