import { createSupabaseClient } from "./supabase";
import type { Collection, Product } from "./types";

export async function getFeaturedCollections(): Promise<Collection[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error) {
    console.error("getFeaturedCollections", error.message);
    return [];
  }
  return (data ?? []) as Collection[];
}

export async function getRecommendedProducts(limit = 8): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("status", "hidden")
    .order("is_featured", { ascending: false })
    .order("sort", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("getRecommendedProducts", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}
