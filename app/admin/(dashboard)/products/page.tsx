import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-[var(--us-sub-tint)] text-[var(--us-sub-700)]",
  soldout: "bg-[var(--us-grey-100)] text-[var(--text-muted)]",
  hidden: "bg-[var(--us-grey-100)] text-[var(--text-faint)]",
};

export default async function AdminProducts() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort", { ascending: true });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
          Products <span className="text-[var(--text-faint)]">({products.length})</span>
        </h1>
        <Link href="/admin/products/new" className="us-btn us-btn--md us-btn--primary">
          New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-[var(--border-hair)] bg-[var(--surface-raised)] text-[12px] uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--border-hair)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--text-strong)]">{p.name}</td>
                <td className="px-4 py-3 text-[var(--text-body)]">
                  {formatPrice(p.price, p.currency)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${STATUS_STYLE[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">
                  {p.is_featured ? "★" : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-[13px] font-semibold text-[var(--us-sub-700)] hover:underline"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-muted)]">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-[var(--us-sub-700)] hover:underline">
                    Add the first one
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
