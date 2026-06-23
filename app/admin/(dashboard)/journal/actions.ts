"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = (v as string | null)?.trim();
  return s ? s : null;
}
function toList(v: string | null): string[] {
  if (!v) return [];
  return v.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
}

export async function saveJournalPost(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required");
  let slug = (formData.get("slug") as string)?.trim();
  if (!slug) slug = slugify(title);

  const status = (formData.get("status") as string) || "draft";
  let published_at = strOrNull(formData.get("published_at"));
  if (status === "published" && !published_at) {
    published_at = new Date().toISOString();
  }

  const payload = {
    title,
    slug,
    subtitle: strOrNull(formData.get("subtitle")),
    excerpt: strOrNull(formData.get("excerpt")),
    cover_image: strOrNull(formData.get("cover_image")),
    body: strOrNull(formData.get("body")),
    status,
    tags: toList(formData.get("tags") as string | null),
    related_product_slugs: toList(formData.get("related_product_slugs") as string | null),
    published_at,
    sort: Number((formData.get("sort") as string) || 0),
  };

  const supabase = await createServerSupabase();
  if (id) {
    const { error } = await supabase.from("journal_posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("journal_posts").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  if (slug) revalidatePath(`/journal/${slug}`);
  redirect("/admin/journal");
}

export async function deleteJournalPost(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("journal_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  redirect("/admin/journal");
}
