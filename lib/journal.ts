import { createSupabaseClient } from "./supabase";
import type { JournalPost, Product } from "./types";

export async function getPublishedPosts(): Promise<JournalPost[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("sort", { ascending: true });
  if (error) {
    console.error("getPublishedPosts", error.message);
    return [];
  }
  return (data ?? []) as JournalPost[];
}

export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as JournalPost) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .in("slug", slugs)
    .neq("status", "hidden");
  return (data ?? []) as Product[];
}
