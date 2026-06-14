function formatInrAmount(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Storefront rental price label (Medusa amounts are whole INR units per month). */
export function formatPrice(value: number): string {
  return `${formatInrAmount(value)} /mo`;
}

/** One-time security deposit (no billing period suffix). */
export function formatDepositAmount(value: number): string {
  return formatInrAmount(value);
}

/** Security deposit equals one month of rent (same rule as product detail). */
export function getDepositAmount(monthlyRent: number): number {
  return monthlyRent;
}
