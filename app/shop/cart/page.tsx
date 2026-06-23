"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cartOrderText } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, subtotal, ready } = useCart();
  const currency = items[0]?.currency ?? "AED";

  if (ready && items.length === 0) {
    return (
      <div className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[560px] text-center">
          <h1 className="text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
            Your cart is empty
          </h1>
          <p className="mt-3 text-[15px] text-[var(--text-muted)]">
            Start with a collection, or browse every piece.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary">Enter the shop</Button>
            <Button href="/shop/all" variant="secondary">Browse all pieces</Button>
          </div>
          <Link href="/shop#shipping" className="mt-6 inline-block text-[13px] text-[var(--us-sub-700)] hover:underline">
            Shipping, duties &amp; returns →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-[28px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
          Cart
        </h1>

        <div className="mt-8 flex flex-col gap-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white p-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--us-grey-100)]">
                {it.thumbnail && (
                  <Image src={it.thumbnail} alt={it.name} fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/shop/${it.slug}`} className="text-[15px] font-semibold text-[var(--text-strong)] hover:underline">
                  {it.name}
                </Link>
                <span className="mt-1 text-[14px] text-[var(--text-body)]">
                  {formatPrice(it.price, it.currency)}
                </span>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border-hair)]">
                    <button onClick={() => setQty(it.id, it.qty - 1)} className="px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--us-key)]" aria-label="Decrease">−</button>
                    <span className="min-w-[28px] text-center text-[14px]">{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.qty + 1)} className="px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--us-key)]" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(it.id)} className="text-[13px] text-[var(--text-faint)] hover:text-[var(--us-danger)]">
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right text-[15px] font-semibold text-[var(--text-strong)]">
                {formatPrice((it.price ?? 0) * it.qty, it.currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-raised)] p-6">
          <div className="flex items-center justify-between text-[16px]">
            <span className="text-[var(--text-body)]">Subtotal</span>
            <span className="font-semibold text-[var(--text-strong)]">
              {formatPrice(subtotal, currency)}
            </span>
          </div>
          <p className="mt-2 text-[13px] text-[var(--text-faint)]">
            Shipping &amp; any duties are confirmed per order and destination —
            see <Link href="/shop#shipping" className="text-[var(--us-sub-700)] hover:underline">the policy</Link>.
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <Button href="/shop/checkout" variant="primary" size="lg" full>
              Continue to checkout
            </Button>
            <WhatsAppButton
              text={cartOrderText(items, subtotal, currency)}
              label="Order on WhatsApp"
              full
              event="whatsapp_order_cart"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
