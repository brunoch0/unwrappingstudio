import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, canManage } from "@/lib/admin";
import { getAdminT } from "@/lib/admin-i18n-server";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { JournalPost } from "@/lib/types";
import { saveJournalPost, deleteJournalPost } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";
const label = "text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]";

export default async function EditJournal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const admin = await getCurrentAdmin();
  const { t } = await getAdminT();
  const supabase = await createServerSupabase();

  let post: JournalPost | null = null;
  if (!isNew) {
    const { data } = await supabase.from("journal_posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    post = data as JournalPost;
  }
  const canDelete = admin ? canManage(admin.role) : false;

  return (
    <div className="max-w-[760px]">
      <Link href="/admin/journal" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--us-key)]">
        {t("jf.back")}
      </Link>
      <h1 className="mt-2 text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        {isNew ? t("journal.new") : post!.title}
      </h1>

      <form action={saveJournalPost} className="mt-7 flex flex-col gap-5">
        {!isNew && <input type="hidden" name="id" value={post!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.title")}</span>
            <input name="title" required defaultValue={post?.title ?? ""} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.slug")}</span>
            <input name="slug" defaultValue={post?.slug ?? ""} className={field} placeholder="auto" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("jf.subtitle")}</span>
          <input name="subtitle" defaultValue={post?.subtitle ?? ""} className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("jf.excerpt")}</span>
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={`${field} resize-y`} />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={label}>{t("jf.cover")}</span>
          <ImageUpload name="cover_image" defaultValue={post?.cover_image ?? ""} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("jf.body")}</span>
          <textarea name="body" rows={16} defaultValue={post?.body ?? ""} className={`${field} resize-y font-mono text-[13px]`} />
          <span className="text-[12px] text-[var(--text-faint)]">{t("jf.bodyHint")}</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.tags")}</span>
            <input name="tags" defaultValue={(post?.tags ?? []).join(", ")} className={field} />
            <span className="text-[12px] text-[var(--text-faint)]">{t("jf.tagsHint")}</span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.related")}</span>
            <input name="related_product_slugs" defaultValue={(post?.related_product_slugs ?? []).join(", ")} className={field} />
            <span className="text-[12px] text-[var(--text-faint)]">{t("jf.relatedHint")}</span>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.status")}</span>
            <select name="status" defaultValue={post?.status ?? "draft"} className={field}>
              <option value="draft">{t("jf.statusDraft")}</option>
              <option value="published">{t("jf.statusPublished")}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.publishedAt")}</span>
            <input name="published_at" type="datetime-local" defaultValue={(post?.published_at ?? "").slice(0, 16)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("jf.sort")}</span>
            <input name="sort" type="number" defaultValue={post?.sort ?? 0} className={field} />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="us-btn us-btn--md us-btn--primary">
            {isNew ? t("jf.create") : t("jf.save")}
          </button>
          <Link href="/admin/journal" className="us-btn us-btn--md us-btn--ghost">{t("jf.cancel")}</Link>
        </div>
      </form>

      {!isNew && canDelete && (
        <form action={deleteJournalPost} className="mt-10 border-t border-[var(--border-hair)] pt-6">
          <input type="hidden" name="id" value={post!.id} />
          <button type="submit" className="text-[13px] font-semibold text-[var(--us-danger)] hover:underline">
            {t("jf.delete")}
          </button>
        </form>
      )}
    </div>
  );
}
