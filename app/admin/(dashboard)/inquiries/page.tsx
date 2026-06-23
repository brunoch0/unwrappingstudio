import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-i18n-server";

export const dynamic = "force-dynamic";

type OrderItem = { name?: string; qty?: number; price?: number };
type Inquiry = {
  id: string;
  type: string;
  name: string | null;
  contact: string;
  message: string | null;
  context:
    | {
        source?: string;
        product?: { name?: string } | null;
        items?: OrderItem[];
        subtotal?: number;
        currency?: string;
        shipping?: { country?: string; city?: string; address?: string; postal?: string };
        mode?: string;
        product_name?: string;
        qty?: number;
        country?: string;
        drop?: string;
      }
    | null;
  created_at: string;
};

export default async function AdminInquiries() {
  const { t } = await getAdminT();
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const inquiries = (data ?? []) as Inquiry[];

  return (
    <div>
      <h1 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        {t("inq.title")} <span className="text-[var(--text-faint)]">({inquiries.length})</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-[var(--text-muted)]">
        {t("inq.sub")}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {inquiries.map((q) => (
          <div key={q.id} className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${
                q.type === "notify"
                  ? "bg-[var(--us-grey-100)] text-[var(--text-muted)]"
                  : "bg-[var(--us-sub-tint)] text-[var(--us-sub-700)]"
              }`}>
                {q.type}
              </span>
              {(q.context?.product?.name || q.context?.product_name) && (
                <span className="text-[13px] font-medium text-[var(--text-strong)]">
                  {q.context?.product?.name || q.context?.product_name}
                </span>
              )}
              {q.type === "reservation" && q.context?.mode && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--us-key-tint)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--us-key)]">
                  {q.context.mode}
                </span>
              )}
              <span className="ml-auto text-[12px] text-[var(--text-faint)]">
                {new Date(q.created_at).toLocaleString()}
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
              {q.name && <span className="text-[var(--text-strong)]">{q.name}</span>}
              <a href={`mailto:${q.contact}`} className="font-medium text-[var(--us-sub-700)] hover:underline">
                {q.contact}
              </a>
            </div>
            {q.message && (
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-body)]">{q.message}</p>
            )}

            {q.type === "reservation" && (
              <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                {q.context?.qty ? `수량 ${q.context.qty}` : ""}
                {q.context?.country ? ` · ${q.context.country}` : ""}
                {q.context?.drop ? ` · drop: ${q.context.drop}` : ""}
              </p>
            )}

            {q.type === "order" && q.context?.items && (
              <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--border-hair)] bg-[var(--surface-raised)] p-3.5">
                <ul className="flex flex-col gap-1 text-[13px] text-[var(--text-body)]">
                  {q.context.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span>{it.name} <span className="text-[var(--text-faint)]">× {it.qty}</span></span>
                      <span className="text-[var(--text-muted)]">
                        {q.context?.currency ?? "AED"} {((it.price ?? 0) * (it.qty ?? 1)).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t border-[var(--border-hair)] pt-2 text-[13px] font-semibold text-[var(--text-strong)]">
                  <span>합계</span>
                  <span>{q.context.currency ?? "AED"} {(q.context.subtotal ?? 0).toLocaleString()}</span>
                </div>
                {q.context.shipping && (
                  <p className="mt-2 text-[12px] text-[var(--text-muted)]">
                    배송지: {[q.context.shipping.country, q.context.shipping.city, q.context.shipping.address, q.context.shipping.postal].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-[14px] text-[var(--text-muted)]">{t("inq.empty")}</p>
        )}
      </div>
    </div>
  );
}
