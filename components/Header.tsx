"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Studio", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop#collections" },
  { label: "Shipping", href: "/shop#shipping" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "AR">("EN");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-hair)] bg-[rgba(255,255,255,0.82)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-5 py-4 md:px-10">
        <Link href="/" aria-label="Unwrapping Studio — home" className="shrink-0">
          <Logo tone="key" size={20} />
        </Link>

        <nav className="ml-4 hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] tracking-[0.02em] transition-colors hover:text-[var(--us-key)] ${
                isActive(item.href)
                  ? "font-semibold text-[var(--us-key)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
            className="hidden items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border-hair)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)] transition-colors hover:border-[var(--us-key)] hover:text-[var(--us-key)] sm:flex"
            aria-label="Toggle language"
            title="Arabic coming soon"
          >
            {lang} <span className="opacity-50">/</span>{" "}
            <span className="opacity-50">{lang === "EN" ? "AR" : "EN"}</span>
          </button>
          <Link href="/shop" className="us-btn us-btn--sm us-btn--primary hidden sm:inline-flex">
            Shop the curation
          </Link>
          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="block h-px w-6 bg-[var(--us-ink)]" />
            <span className="mt-1.5 block h-px w-6 bg-[var(--us-ink)]" />
            <span className="mt-1.5 block h-px w-6 bg-[var(--us-ink)]" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--border-hair)] bg-white px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-[var(--text-body)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="us-btn us-btn--md us-btn--primary us-btn--full mt-2"
          >
            Shop the curation
          </Link>
        </nav>
      )}
    </header>
  );
}
