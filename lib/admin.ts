import { createServerSupabase } from "./supabase/server";

export type AdminRole = "super_admin" | "admin" | "editor";

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
};

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

/** Current signed-in admin (active), or null. */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  return (data as AdminUser) ?? null;
}

export const canManage = (role: AdminRole) =>
  role === "super_admin" || role === "admin";
export const isSuperAdmin = (role: AdminRole) => role === "super_admin";
