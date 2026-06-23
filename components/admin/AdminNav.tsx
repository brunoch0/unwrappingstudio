"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Inquiries", href: "/admin/inquiries" },
];

export function AdminNav({ isSuper }: { isSuper: boolean }) {
  const pathname = usePathname();
  const items = isSuper ? [...ITEMS, { label: "Team", href: "/admin/team" }] : ITEMS;
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
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
