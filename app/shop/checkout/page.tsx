"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/Button";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { getUtm, track } from "@/lib/analytics";

export default function CheckoutPage() {
  const { items, subtotal, clear, ready } = useCart();
  const currency = items[0]?.currency ?? "AED";

  const [form, setForm] = useState({
    name: "",
    contact: "",
    country: "",
    city: "",
    address: "",
    postal: "",
    note: "",
  });
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setState("sending");
    const supabase = createBrowserSupabase();
    const { error } = await supabase.from("inquiries").insert({
      type: "order",
      name: form.name.trim() || null,
      contact: form.contact.trim(),
      message: form.note.trim() || null,
      context: {
        source: "checkout",
        utm: getUtm(),
        shipping: {
          country: form.country,
          city: form.city,
          address: form.address,
          postal: form.postal,
        },
        items: items.map((i) => ({
          id: i.id,
          slug: i.slug,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        subtotal,
        currency,
      },
    });
    if (error) {
      setState("error");
      return;
    }
    track("purchase_request", { value: subtotal, currency, items: items.length });
    clear();
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[560px] text-center">
          <h1 className="text-[28px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
            Order request received
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
            Thank you. We&apos;ll confirm shipping and any duties to your country,
            then send a secure way to pay — usually within 24–48 hours, in English
            or Arabic.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button href="/shop" variant="primary">Back to the shop</Button>
          </div>
        </div>
      </div>
    );
  }

  if (ready && items.length === 0) {
    return (
      <div className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[560px] text-center">
          <h1 className="text-[24px] font-bold text-[var(--text-strong)]">Your cart is empty</h1>
          <div className="mt-6"><Button href="/shop" variant="primary">Enter the shop</Button></div>
        </div>
      </div>
    );
  }

  const input =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";
  const label = "text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]";

  return (
    <div className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-[960px] gap-10 md:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <h1 className="text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
            Checkout
          </h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={label}>Name</span>
              <input className={input} value={form.name} onChange={set("name")} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Email or WhatsApp *</span>
              <input className={input} value={form.contact} onChange={set("contact")} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Country</span>
              <input className={input} value={form.country} onChange={set("country")} placeholder="UAE / KSA …" required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>City</span>
              <input className={input} value={form.city} onChange={set("city")} required />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={label}>Address</span>
              <input className={input} value={form.address} onChange={set("address")} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Postal code</span>
              <input className={input} value={form.postal} onChange={set("postal")} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={label}>Note (optional)</span>
            <textarea className={`${input} min-h-[80px] resize-y`} value={form.note} onChange={set("note")} />
          </label>

          <label className="flex items-start gap-2.5 text-[13px] text-[var(--text-body)]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--us-key)]" required />
            <span>
              I understand customs duties or VAT may apply on arrival, charged by
              my local authority — these are estimates, not final, and usually
              paid on delivery.
            </span>
          </label>

          {state === "error" && (
            <p className="text-[13px] text-[var(--us-danger)]">
              Something went wrong. Please try again or message us on Instagram.
            </p>
          )}

          <button
            type="submit"
            disabled={!agree || state === "sending"}
            className="us-btn us-btn--lg us-btn--primary us-btn--full"
          >
            {state === "sending" ? "Submitting…" : "Submit order request"}
          </button>
          <p className="text-[12px] text-[var(--text-faint)]">
            No card is charged now. We confirm shipping &amp; duties, then send a
            secure way to pay.
          </p>
        </form>

        {/* Summary */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-raised)] p-6">
            <h2 className="text-[15px] font-semibold text-[var(--text-strong)]">Your order</h2>
            <div className="mt-4 flex flex-col gap-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-3 text-[14px]">
                  <span className="text-[var(--text-body)]">
                    {it.name} <span className="text-[var(--text-faint)]">× {it.qty}</span>
                  </span>
                  <span className="shrink-0 font-medium text-[var(--text-strong)]">
                    {formatPrice((it.price ?? 0) * it.qty, it.currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--border-hair)] pt-4 text-[16px]">
              <span className="text-[var(--text-body)]">Subtotal</span>
              <span className="font-semibold text-[var(--text-strong)]">{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="mt-2 text-[12px] text-[var(--text-faint)]">+ shipping &amp; possible duties</p>
            <Link href="/shop/cart" className="mt-4 inline-block text-[13px] text-[var(--us-sub-700)] hover:underline">
              ← Edit cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
