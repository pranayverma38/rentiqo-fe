/**
 * Turns a URL segment like `dining-tables` into `Dining tables` for headings.
 */
export function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
