"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await createBrowserSupabase().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-muted)] transition hover:border-[var(--us-key)] hover:text-[var(--us-key)]"
    >
      Sign out
    </button>
  );
}
