"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { getUtm, track } from "@/lib/analytics";

type Mode = "inquiry" | "notify";

export function InquiryForm({
  defaultMode = "inquiry",
  productContext,
  source = "shop_landing",
}: {
  defaultMode?: Mode;
  productContext?: { id: string; slug: string; name: string };
  source?: string;
} = {}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setState("sending");
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("inquiries").insert({
      type: mode,
      name: name.trim() || null,
      contact: contact.trim(),
      message: message.trim() || null,
      context: { source, product: productContext ?? null, utm: getUtm() },
    });
    if (!error) track(mode === "notify" ? "notify_signup" : "inquiry_submit", {
      product: productContext?.slug,
      source,
    });
    setState(error ? "error" : "done");
  }

  const inputCls =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border-on-dark)] bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-[var(--us-sub)] focus:shadow-[var(--shadow-focus)]";

  if (state === "done") {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-on-dark)] bg-white/5 p-8 text-center">
        <p className="text-[20px] font-semibold text-white">
          We&apos;ve received it.
        </p>
        <p className="mt-2 text-[14px] text-[var(--text-on-dark-mut)]">
          Expect a reply within 24–48 hours — in English or Arabic. Until then,
          the curation keeps unwrapping on Instagram.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="mb-1 flex gap-2">
        {(["inquiry", "notify"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-[var(--radius-pill)] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[var(--ls-label)] transition ${
              mode === m
                ? "bg-[var(--us-sub)] text-[var(--us-key)]"
                : "border border-[var(--border-on-dark)] text-[var(--text-on-dark-mut)] hover:text-white"
            }`}
          >
            {m === "inquiry" ? "Inquire" : "Notify me"}
          </button>
        ))}
      </div>

      <input
        className={inputCls}
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={inputCls}
        placeholder="Email or WhatsApp"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <textarea
        className={`${inputCls} min-h-[96px] resize-y`}
        placeholder={
          mode === "inquiry"
            ? "What would you like to know? (a product, shipping to your country, a price)"
            : "Which piece or collection should we notify you about?"
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {state === "error" && (
        <p className="text-[13px] text-[var(--us-sub-400)]">
          Something went wrong. Please try again or message us on Instagram.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-1 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--us-sub)] px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)] transition hover:bg-[var(--us-sub-600)] disabled:opacity-50"
      >
        {state === "sending"
          ? "Sending…"
          : mode === "inquiry"
            ? "Send inquiry"
            : "Notify me"}
      </button>
      <p className="text-[12px] text-[var(--text-on-dark-mut)]">
        No spam. We use your contact only to reply about this request.
      </p>
    </form>
  );
}
