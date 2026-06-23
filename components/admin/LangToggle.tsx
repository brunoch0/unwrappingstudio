"use client";

import { useRouter } from "next/navigation";
import { ADMIN_LANG_COOKIE, type AdminLang } from "@/lib/admin-i18n";

export function LangToggle({ lang }: { lang: AdminLang }) {
  const router = useRouter();
  function set(next: AdminLang) {
    if (next === lang) return;
    document.cookie = `${ADMIN_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  return (
    <div className="flex items-center rounded-[var(--radius-pill)] border border-[var(--border-hair)] p-0.5 text-[11px] font-semibold">
      {(["ko", "en"] as AdminLang[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          className={`rounded-[var(--radius-pill)] px-2.5 py-1 uppercase tracking-[0.06em] transition ${
            l === lang
              ? "bg-[var(--us-key)] text-white"
              : "text-[var(--text-muted)] hover:text-[var(--us-key)]"
          }`}
        >
          {l === "ko" ? "KR" : "EN"}
        </button>
      ))}
    </div>
  );
}
