export function formatPrice(price: number | null, currency = "AED"): string {
  if (price == null) return "Price on request";
  const n = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `${currency} ${n}`;
}
