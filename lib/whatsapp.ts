/** Digits-only WhatsApp number (country code + number, no +). Set via env. */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
).replace(/[^0-9]/g, "");

export const SITE_URL = "https://unwrappingstudio.vercel.app";

/** Build a wa.me link, or null if no number configured. */
export function waLink(text: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function productOrderText(name: string, slug: string): string {
  return `Hi Unwrapping Studio — I'd like this piece:\n\n• ${name}\n${SITE_URL}/shop/${slug}\n\nMy name:\nCountry / city:`;
}

export function cartOrderText(
  items: { name: string; qty: number; price: number | null; currency: string }[],
  subtotal: number,
  currency: string
): string {
  const lines = items
    .map((i) => `• ${i.name} ×${i.qty}`)
    .join("\n");
  return `Hi Unwrapping Studio — I'd like to order:\n\n${lines}\n\nSubtotal: ${currency} ${subtotal.toLocaleString()} (+ shipping & possible duties)\n\nMy name:\nCountry / city:\nAddress:`;
}

export function generalText(): string {
  return `Hi Unwrapping Studio — I have a question about the shop.`;
}
