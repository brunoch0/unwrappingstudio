"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import { translate, type AdminLang, ADMIN_LANG_COOKIE } from "@/lib/admin-i18n";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lang, setLang] = useState<AdminLang>("ko");
  useEffect(() => {
    const m = document.cookie.match(new RegExp(`${ADMIN_LANG_COOKIE}=(en|ko)`));
    if (m) setLang(m[1] as AdminLang);
  }, []);
  const t = (k: string) => translate(lang, k);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createBrowserSupabase();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMsg(error.message);
        setBusy(false);
        return;
      }
      // try to sign in immediately (works if email confirmation is off)
      const { error: sErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (sErr) {
        setMsg(t("auth.created"));
        setMode("signin");
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMsg(error.message);
        setBusy(false);
        return;
      }
    }
    router.replace("/admin");
    router.refresh();
  }

  const input =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-4 py-3 text-[15px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-raised)] px-5">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center">
          <Logo tone="key" size={22} />
          <p className="mt-3 text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--text-muted)]">
            {t("auth.admin")}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-hair)] bg-white p-7 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex gap-1 rounded-[var(--radius-pill)] bg-[var(--surface-sunken)] p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setMsg(null);
                }}
                className={`flex-1 rounded-[var(--radius-pill)] py-2 text-[13px] font-semibold transition ${
                  mode === m
                    ? "bg-white text-[var(--us-key)] shadow-[var(--shadow-xs)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {m === "signin" ? t("auth.signin") : t("auth.signup")}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              className={input}
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className={input}
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
            {msg && (
              <p className="text-[13px] leading-snug text-[var(--us-danger)]">
                {msg}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="us-btn us-btn--md us-btn--primary us-btn--full mt-1"
            >
              {busy
                ? t("common.busy")
                : mode === "signin"
                  ? t("auth.signin")
                  : t("auth.signup")}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[12px] leading-relaxed text-[var(--text-faint)]">
          {t("auth.firstNote")}
        </p>
      </div>
    </div>
  );
}
