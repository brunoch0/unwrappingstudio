import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Collection } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCollections() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .order("sort", { ascending: true });
  const collections = (data ?? []) as Collection[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
          Collections <span className="text-[var(--text-faint)]">({collections.length})</span>
        </h1>
        <Link href="/admin/collections/new" className="us-btn us-btn--md us-btn--primary">
          New collection
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/admin/collections/${c.id}`}
            className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold text-[var(--text-strong)]">{c.title}</h3>
              {c.is_featured && <span className="text-[12px] text-[var(--us-sub-700)]">★</span>}
              {!c.published && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--us-grey-100)] px-2 py-0.5 text-[10px] uppercase tracking-[0.04em] text-[var(--text-faint)]">
                  Draft
                </span>
              )}
            </div>
            {c.subtitle && <p className="mt-1 text-[13px] text-[var(--text-muted)]">{c.subtitle}</p>}
            <span className="mt-3 inline-block text-[13px] font-semibold text-[var(--us-sub-700)]">Edit →</span>
          </Link>
        ))}
        {collections.length === 0 && (
          <p className="text-[14px] text-[var(--text-muted)]">No collections yet.</p>
        )}
      </div>
    </div>
  );
}
