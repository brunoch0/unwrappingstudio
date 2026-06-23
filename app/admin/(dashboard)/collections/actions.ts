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

export async function saveCollection(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required");
  let slug = (formData.get("slug") as string)?.trim();
  if (!slug) slug = slugify(title);

  const payload = {
    title,
    slug,
    subtitle: strOrNull(formData.get("subtitle")),
    description: strOrNull(formData.get("description")),
    cover_image: strOrNull(formData.get("cover_image")),
    sort: Number((formData.get("sort") as string) || 0),
    is_featured: formData.get("is_featured") === "on",
    published: formData.get("published") === "on",
    is_drop: formData.get("is_drop") === "on",
    drop_at: strOrNull(formData.get("drop_at")),
  };

  const supabase = await createServerSupabase();
  if (id) {
    const { error } = await supabase.from("collections").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("collections").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/collections");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/collections");
}

export async function deleteCollection(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/collections");
  revalidatePath("/shop");
  redirect("/admin/collections");
}
