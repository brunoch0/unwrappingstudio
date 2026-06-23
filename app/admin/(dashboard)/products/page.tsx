import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-i18n-server";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-[var(--us-sub-tint)] text-[var(--us-sub-700)]",
  soldout: "bg-[var(--us-grey-100)] text-[var(--text-muted)]",
  hidden: "bg-[var(--us-grey-100)] text-[var(--text-faint)]",
};
const STATUS_KEY: Record<string, string> = {
  active: "status.active",
  soldout: "status.soldout",
  hidden: "status.hidden",
};

export default async function AdminProducts() {
  const { t } = await getAdminT();
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
          {t("prod.title")} <span className="text-[var(--text-faint)]">({products.length})</span>
        </h1>
        <Link href="/admin/products/new" className="us-btn us-btn--md us-btn--primary">
          {t("prod.new")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-[var(--border-hair)] bg-[var(--surface-raised)] text-[12px] uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">{t("prod.colName")}</th>
              <th className="px-4 py-3 font-semibold">{t("prod.colPrice")}</th>
              <th className="px-4 py-3 font-semibold">{t("prod.colStatus")}</th>
              <th className="px-4 py-3 font-semibold">{t("prod.colFeatured")}</th>
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
                    {t(STATUS_KEY[p.status])}
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
                    {t("prod.edit")}
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-muted)]">
                  {t("prod.empty")}{" "}
                  <Link href="/admin/products/new" className="text-[var(--us-sub-700)] hover:underline">
                    {t("prod.addFirst")}
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
