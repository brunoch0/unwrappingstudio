import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, canManage } from "@/lib/admin";
import { getAdminT } from "@/lib/admin-i18n-server";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Collection } from "@/lib/types";
import { saveCollection, deleteCollection } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";
const label = "text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]";

export default async function EditCollection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const admin = await getCurrentAdmin();
  const { t } = await getAdminT();
  const supabase = await createServerSupabase();

  let collection: Collection | null = null;
  if (!isNew) {
    const { data } = await supabase.from("collections").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    collection = data as Collection;
  }
  const canDelete = admin ? canManage(admin.role) : false;

  return (
    <div className="max-w-[680px]">
      <Link href="/admin/collections" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--us-key)]">
        {t("cf.back")}
      </Link>
      <h1 className="mt-2 text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        {isNew ? "New collection" : collection!.title}
      </h1>

      <form action={saveCollection} className="mt-7 flex flex-col gap-5">
        {!isNew && <input type="hidden" name="id" value={collection!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("cf.title")}</span>
            <input name="title" required defaultValue={collection?.title ?? ""} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("cf.slug")}</span>
            <input name="slug" defaultValue={collection?.slug ?? ""} className={field} placeholder="auto" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("cf.subtitle")}</span>
          <input name="subtitle" defaultValue={collection?.subtitle ?? ""} className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("cf.story")}</span>
          <textarea name="description" rows={4} defaultValue={collection?.description ?? ""} className={`${field} resize-y`} />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className={label}>{t("cf.cover")}</span>
          <ImageUpload name="cover_image" defaultValue={collection?.cover_image ?? ""} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("cf.sort")}</span>
            <input name="sort" type="number" defaultValue={collection?.sort ?? 0} className={field} />
          </label>
          <div className="flex flex-col justify-center gap-2.5 pt-5">
            <label className="flex items-center gap-2.5">
              <input name="is_featured" type="checkbox" defaultChecked={collection?.is_featured ?? false} className="h-4 w-4 accent-[var(--us-key)]" />
              <span className="text-[14px] text-[var(--text-body)]">{t("cf.featured")}</span>
            </label>
            <label className="flex items-center gap-2.5">
              <input name="published" type="checkbox" defaultChecked={collection?.published ?? true} className="h-4 w-4 accent-[var(--us-key)]" />
              <span className="text-[14px] text-[var(--text-body)]">{t("cf.published")}</span>
            </label>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-raised)] p-4">
          <label className="flex items-center gap-2.5">
            <input name="is_drop" type="checkbox" defaultChecked={collection?.is_drop ?? false} className="h-4 w-4 accent-[var(--us-key)]" />
            <span className="text-[14px] font-medium text-[var(--text-strong)]">{t("cf.isDrop")}</span>
          </label>
          <div className="mt-3 flex flex-col gap-1.5">
            <span className={label}>{t("cf.dropAt")}</span>
            <input name="drop_at" type="datetime-local" defaultValue={(collection?.drop_at ?? "").slice(0, 16)} className={field} />
            <span className="text-[12px] text-[var(--text-faint)]">{t("cf.dropHint")}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="us-btn us-btn--md us-btn--primary">
            {isNew ? t("cf.create") : t("cf.save")}
          </button>
          <Link href="/admin/collections" className="us-btn us-btn--md us-btn--ghost">{t("cf.cancel")}</Link>
        </div>
      </form>

      {!isNew && canDelete && (
        <form action={deleteCollection} className="mt-10 border-t border-[var(--border-hair)] pt-6">
          <input type="hidden" name="id" value={collection!.id} />
          <button type="submit" className="text-[13px] font-semibold text-[var(--us-danger)] hover:underline">
            {t("cf.delete")}
          </button>
        </form>
      )}
    </div>
  );
}
