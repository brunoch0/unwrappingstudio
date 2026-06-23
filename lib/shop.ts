import { createSupabaseClient } from "./supabase";
import type { Collection, Product } from "./types";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .neq("status", "hidden")
    .maybeSingle();
  if (error) {
    console.error("getProductBySlug", error.message);
    return null;
  }
  return (data as Product) ?? null;
}

export async function getCollectionById(
  id: string | null
): Promise<Collection | null> {
  if (!id) return null;
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Collection) ?? null;
}

export async function getRelatedProducts(
  collectionId: string | null,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  if (!collectionId) return [];
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", collectionId)
    .neq("id", excludeId)
    .neq("status", "hidden")
    .order("sort", { ascending: true })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .neq("status", "hidden");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getDropCollections(): Promise<Collection[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("published", true)
    .eq("is_drop", true)
    .order("drop_at", { ascending: true, nullsFirst: false });
  return (data ?? []) as Collection[];
}

export async function getCollectionBySlug(
  slug: string
): Promise<Collection | null> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Collection) ?? null;
}

export async function getProductsByCollection(
  collectionId: string
): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", collectionId)
    .neq("status", "hidden")
    .order("is_featured", { ascending: false })
    .order("sort", { ascending: true });
  return (data ?? []) as Product[];
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("collections")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export type ProductFilters = {
  q?: string;
  collection?: string; // collection slug
  sort?: "recommended" | "newest" | "price_asc" | "price_desc";
};

export async function searchProducts(
  filters: ProductFilters
): Promise<Product[]> {
  const supabase = createSupabaseClient();
  let collectionId: string | null = null;
  if (filters.collection) {
    const { data: col } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", filters.collection)
      .maybeSingle();
    collectionId = (col as { id: string } | null)?.id ?? null;
  }

  let query = supabase.from("products").select("*").neq("status", "hidden");
  if (filters.q) query = query.ilike("name", `%${filters.q}%`);
  if (collectionId) query = query.eq("collection_id", collectionId);

  switch (filters.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("sort", { ascending: true });
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}

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
