import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, canManage } from "@/lib/admin";
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
        ← Collections
      </Link>
      <h1 className="mt-2 text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        {isNew ? "New collection" : collection!.title}
      </h1>

      <form action={saveCollection} className="mt-7 flex flex-col gap-5">
        {!isNew && <input type="hidden" name="id" value={collection!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Title *</span>
            <input name="title" required defaultValue={collection?.title ?? ""} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Slug</span>
            <input name="slug" defaultValue={collection?.slug ?? ""} className={field} placeholder="auto" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>Subtitle</span>
          <input name="subtitle" defaultValue={collection?.subtitle ?? ""} className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Theme story</span>
          <textarea name="description" rows={4} defaultValue={collection?.description ?? ""} className={`${field} resize-y`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Cover image URL</span>
          <input name="cover_image" defaultValue={collection?.cover_image ?? ""} className={field} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Sort order</span>
            <input name="sort" type="number" defaultValue={collection?.sort ?? 0} className={field} />
          </label>
          <div className="flex flex-col justify-center gap-2.5 pt-5">
            <label className="flex items-center gap-2.5">
              <input name="is_featured" type="checkbox" defaultChecked={collection?.is_featured ?? false} className="h-4 w-4 accent-[var(--us-key)]" />
              <span className="text-[14px] text-[var(--text-body)]">Featured</span>
            </label>
            <label className="flex items-center gap-2.5">
              <input name="published" type="checkbox" defaultChecked={collection?.published ?? true} className="h-4 w-4 accent-[var(--us-key)]" />
              <span className="text-[14px] text-[var(--text-body)]">Published</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="us-btn us-btn--md us-btn--primary">
            {isNew ? "Create collection" : "Save changes"}
          </button>
          <Link href="/admin/collections" className="us-btn us-btn--md us-btn--ghost">Cancel</Link>
        </div>
      </form>

      {!isNew && canDelete && (
        <form action={deleteCollection} className="mt-10 border-t border-[var(--border-hair)] pt-6">
          <input type="hidden" name="id" value={collection!.id} />
          <button type="submit" className="text-[13px] font-semibold text-[var(--us-danger)] hover:underline">
            Delete this collection
          </button>
        </form>
      )}
    </div>
  );
}
