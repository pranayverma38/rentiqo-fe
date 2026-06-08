/** Storefront rental price label (Medusa amounts are whole INR units per month). */
export function formatPrice(value: number): string {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
  return `${amount} /mo`;
}
