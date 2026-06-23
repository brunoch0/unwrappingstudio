"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { translate, type AdminLang } from "@/lib/admin-i18n";

const ITEMS = [
  { key: "nav.dashboard", href: "/admin" },
  { key: "nav.products", href: "/admin/products" },
  { key: "nav.collections", href: "/admin/collections" },
  { key: "nav.inquiries", href: "/admin/inquiries" },
];

export function AdminNav({ isSuper, lang }: { isSuper: boolean; lang: AdminLang }) {
  const pathname = usePathname();
  const items = isSuper ? [...ITEMS, { key: "nav.team", href: "/admin/team" }] : ITEMS;
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="hidden items-center gap-5 md:flex">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`text-[13px] transition-colors hover:text-[var(--us-key)] ${
            active(it.href)
              ? "font-semibold text-[var(--us-key)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          {translate(lang, it.key)}
        </Link>
      ))}
    </nav>
  );
}
