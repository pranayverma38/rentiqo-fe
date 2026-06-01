/** Mobile: full-width account nav (sidebar only). Desktop entry: manage subscription */
export const ACCOUNT_MOBILE_MENU_HREF = "/account-page";

export const ACCOUNT_DESKTOP_ENTRY_HREF = "/account-manage-subscription";

/** Matches Bootstrap `lg` — sidebar + content split */
export const ACCOUNT_DESKTOP_MEDIA = "(min-width: 992px)";

export function getAccountEntryHref(): string {
  if (typeof window === "undefined") {
    return ACCOUNT_DESKTOP_ENTRY_HREF;
  }
  return window.matchMedia(ACCOUNT_DESKTOP_MEDIA).matches
    ? ACCOUNT_DESKTOP_ENTRY_HREF
    : ACCOUNT_MOBILE_MENU_HREF;
}

export function isDesktopAccountViewport(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return window.matchMedia(ACCOUNT_DESKTOP_MEDIA).matches;
}
