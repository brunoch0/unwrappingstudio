import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser Supabase client (auth in cookies via @supabase/ssr). */
export function createBrowserSupabase() {
  return createBrowserClient(url, anonKey);
}
