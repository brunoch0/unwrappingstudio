import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Stateless Supabase client for reading public, published shop data
 * from Server Components. Reads are gated by RLS (published collections,
 * non-hidden products), so the publishable key is safe here.
 */
export function createSupabaseClient() {
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
