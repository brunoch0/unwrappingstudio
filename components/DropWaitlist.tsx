"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { getUtm, track } from "@/lib/analytics";

export function DropWaitlist({ dropSlug, dropTitle }: { dropSlug: string; dropTitle: string }) {
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setState("sending");
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("inquiries").insert({
      type: "notify",
      contact: contact.trim(),
      message: `Waitlist: ${dropTitle}`,
      context: { source: "drop_waitlist", drop: dropSlug, utm: getUtm() },
    });
    if (!error) track("drop_waitlist", { drop: dropSlug });
    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return (
      <p className="text-[14px] text-[var(--us-sub-400)]">
        You&apos;re on the list — we&apos;ll message you the moment it opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[420px] flex-col gap-2 sm:flex-row">
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Email or WhatsApp"
        required
        className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border-on-dark)] bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-[var(--us-sub)]"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="us-btn us-btn--md us-btn--accent"
      >
        {state === "sending" ? "…" : "Notify me"}
      </button>
    </form>
  );
}
