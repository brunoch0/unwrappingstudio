"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toList(v: string | null): string[] {
  if (!v) return [];
  return v
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = (v as string | null)?.trim();
  return s ? s : null;
}

export async function saveProduct(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required");

  let slug = (formData.get("slug") as string)?.trim();
  if (!slug) slug = slugify(name);

  const priceRaw = (formData.get("price") as string)?.trim();
  const price = priceRaw ? Number(priceRaw) : null;

  const payload = {
    name,
    slug,
    price,
    currency: strOrNull(formData.get("currency")) ?? "AED",
    status: (formData.get("status") as string) || "active",
    is_featured: formData.get("is_featured") === "on",
    sort: Number((formData.get("sort") as string) || 0),
    collection_id: strOrNull(formData.get("collection_id")),
    thumbnail: strOrNull(formData.get("thumbnail")),
    curation_point: strOrNull(formData.get("curation_point")),
    curation_comment: strOrNull(formData.get("curation_comment")),
    material: strOrNull(formData.get("material")),
    size: strOrNull(formData.get("size")),
    care: strOrNull(formData.get("care")),
    origin: strOrNull(formData.get("origin")),
    includes: strOrNull(formData.get("includes")),
    badges: toList(formData.get("badges") as string | null),
    images: toList(formData.get("images") as string | null),
    fulfillment: (formData.get("fulfillment") as string) || "in_stock",
    goal: Number((formData.get("goal") as string) || 0),
    campaign_ends_at: strOrNull(formData.get("campaign_ends_at")),
  };

  const supabase = await createServerSupabase();
  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  if (slug) revalidatePath(`/shop/${slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
