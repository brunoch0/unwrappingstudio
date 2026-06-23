import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, ROLE_LABEL } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  const supabase = await createServerSupabase();
  const head = { count: "exact" as const, head: true };
  const [products, live, collections, inquiries] = await Promise.all([
    supabase.from("products").select("*", head).then((r) => r.count ?? 0),
    supabase.from("products").select("*", head).eq("status", "active").then((r) => r.count ?? 0),
    supabase.from("collections").select("*", head).then((r) => r.count ?? 0),
    supabase.from("inquiries").select("*", head).then((r) => r.count ?? 0),
  ]);

  const cards = [
    { label: "Products", value: products, sub: `${live} live`, href: "/admin/products" },
    { label: "Collections", value: collections, href: "/admin/collections" },
    { label: "Inquiries", value: inquiries, sub: "leads", href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        Welcome{admin ? `, ${admin.email.split("@")[0]}` : ""}
      </h1>
      <p className="mt-1.5 text-[14px] text-[var(--text-muted)]">
        Signed in as {admin ? ROLE_LABEL[admin.role] : ""}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]">
              {c.label}
            </div>
            <div className="mt-3 text-[34px] font-bold leading-none text-[var(--text-strong)]">
              {c.value}
            </div>
            {c.sub && (
              <div className="mt-1.5 text-[13px] text-[var(--us-sub-700)]">
                {c.sub}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="us-btn us-btn--md us-btn--primary">
          New product
        </Link>
        <Link href="/admin/collections/new" className="us-btn us-btn--md us-btn--secondary">
          New collection
        </Link>
        <Link href="/shop" className="us-btn us-btn--md us-btn--ghost">
          View storefront →
        </Link>
      </div>
    </div>
  );
}
