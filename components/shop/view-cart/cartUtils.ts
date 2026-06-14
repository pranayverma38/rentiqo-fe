/** Display label for rental tenure (e.g. "12 Months"). */
export function formatDurationLabel(raw: string | null | undefined): string {
  if (!raw) {
    return "Standard tenure";
  }
  const normalized = raw.replace(/\s+/g, "").toLowerCase();
  const match = normalized.match(/(\d+)/);
  if (match != null) {
    const months = match[1];
    return `${months} Month${months === "1" ? "" : "s"}`;
  }
  return raw;
}
