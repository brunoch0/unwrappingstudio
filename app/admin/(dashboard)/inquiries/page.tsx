import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-i18n-server";

export const dynamic = "force-dynamic";

type Inquiry = {
  id: string;
  type: string;
  name: string | null;
  contact: string;
  message: string | null;
  context: { source?: string; product?: { name?: string } | null } | null;
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
              {q.context?.product?.name && (
                <span className="text-[13px] font-medium text-[var(--text-strong)]">
                  {q.context.product.name}
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
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-[14px] text-[var(--text-muted)]">{t("inq.empty")}</p>
        )}
      </div>
    </div>
  );
}
