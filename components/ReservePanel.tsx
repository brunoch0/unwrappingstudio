"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { getUtm, track } from "@/lib/analytics";
import { Countdown } from "./Countdown";

type Mode = "preorder" | "reserve" | "crowdfund";

const COPY: Record<Mode, { eyebrow: string; cta: string; note: string }> = {
  preorder: {
    eyebrow: "Pre-order",
    cta: "Pre-order — no charge now",
    note: "Reserve now with no payment. We confirm shipping & duties to your country, then send a secure way to pay when it ships.",
  },
  reserve: {
    eyebrow: "Register interest",
    cta: "I want this",
    note: "No payment. We'll message you the moment it's available to buy in your country.",
  },
  crowdfund: {
    eyebrow: "Reserve to unlock",
    cta: "Reserve yours",
    note: "We import this once enough of you reserve. No charge until the order is confirmed.",
  },
};

export function ReservePanel({
  product,
  mode,
  goal,
  reserved,
  endsAt,
}: {
  product: { id: string; slug: string; name: string };
  mode: Mode;
  goal: number;
  reserved: number;
  endsAt: string | null;
}) {
  const copy = COPY[mode];
  const [form, setForm] = useState({ name: "", contact: "", country: "", qty: 1 });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const pct = goal > 0 ? Math.min(100, Math.round((reserved / goal) * 100)) : 0;
  const funded = goal > 0 && reserved >= goal;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.contact.trim()) return;
    setState("sending");
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("inquiries").insert({
      type: "reservation",
      name: form.name.trim() || null,
      contact: form.contact.trim(),
      message: `${copy.eyebrow}: ${product.name}`,
      context: {
        source: "reserve_panel",
        mode,
        product_slug: product.slug,
        product_name: product.name,
        qty: form.qty,
        country: form.country.trim() || null,
        utm: getUtm(),
      },
    });
    if (!error) track("reservation", { mode, product: product.slug, qty: form.qty });
    setState(error ? "error" : "done");
  }

  const input =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-raised)] p-5">
      <span className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)]">
        {copy.eyebrow}
      </span>

      {/* Crowdfund progress */}
      {mode === "crowdfund" && goal > 0 && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between text-[13px]">
            <span className="font-semibold text-[var(--text-strong)]">
              {reserved} reserved
            </span>
            <span className="text-[var(--text-muted)]">goal {goal}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--us-grey-200)]">
            <div className="h-full rounded-full bg-[var(--us-sub)] transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          {endsAt && !funded && (
            <div className="mt-4">
              <Countdown to={endsAt} />
            </div>
          )}
          {funded && (
            <p className="mt-3 text-[13px] font-semibold text-[var(--us-sub-700)]">
              Goal reached — we&apos;re importing it. Reserve to join the order.
            </p>
          )}
        </div>
      )}

      {state === "done" ? (
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-body)]">
          You&apos;re in. We&apos;ll message you with the next step — in English or
          Arabic, within 24–48 hours.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2.5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <input className={input} placeholder="Name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} placeholder="Country (UAE / KSA…)" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <input className={input} placeholder="Email or WhatsApp" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          {state === "error" && (
            <p className="text-[13px] text-[var(--us-danger)]">Something went wrong — please try again.</p>
          )}
          <button type="submit" disabled={state === "sending"} className="us-btn us-btn--lg us-btn--primary us-btn--full mt-1">
            {state === "sending" ? "…" : copy.cta}
          </button>
        </form>
      )}

      <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-faint)]">{copy.note}</p>
    </div>
  );
}
