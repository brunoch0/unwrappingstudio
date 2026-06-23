import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-i18n-server";
import type { JournalPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminJournal() {
  const { t } = await getAdminT();
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("journal_posts")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as JournalPost[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
          {t("journal.title")} <span className="text-[var(--text-faint)]">({posts.length})</span>
        </h1>
        <Link href="/admin/journal/new" className="us-btn us-btn--md us-btn--primary">
          {t("journal.new")}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/journal/${p.id}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white px-5 py-3.5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-[var(--text-strong)]">{p.title}</div>
              {p.subtitle && <div className="truncate text-[13px] text-[var(--text-muted)]">{p.subtitle}</div>}
            </div>
            <span className={`rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${
              p.status === "published"
                ? "bg-[var(--us-sub-tint)] text-[var(--us-sub-700)]"
                : "bg-[var(--us-grey-100)] text-[var(--text-faint)]"
            }`}>
              {p.status === "published" ? t("jf.statusPublished") : t("jf.statusDraft")}
            </span>
            <span className="text-[13px] font-semibold text-[var(--us-sub-700)]">{t("journal.edit")}</span>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-[14px] text-[var(--text-muted)]">{t("journal.empty")}</p>
        )}
      </div>
    </div>
  );
}
