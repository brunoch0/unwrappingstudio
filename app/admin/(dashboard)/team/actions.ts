"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin";

const ROLES = ["super_admin", "admin", "editor"] as const;

async function requireSuper() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "super_admin") {
    throw new Error("Only a super admin can manage the team.");
  }
  return admin;
}

export async function inviteAdmin(formData: FormData) {
  await requireSuper();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = formData.get("role") as string;
  if (!email) throw new Error("Email is required");
  if (!ROLES.includes(role as (typeof ROLES)[number])) throw new Error("Invalid role");

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("admin_invites")
    .upsert({ email, role }, { onConflict: "email" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}

export async function updateRole(formData: FormData) {
  const me = await requireSuper();
  const id = formData.get("id") as string;
  const role = formData.get("role") as string;
  if (id === me.id) throw new Error("You can't change your own role.");
  if (!ROLES.includes(role as (typeof ROLES)[number])) throw new Error("Invalid role");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("admin_users").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}

export async function removeAdmin(formData: FormData) {
  const me = await requireSuper();
  const id = formData.get("id") as string;
  if (id === me.id) throw new Error("You can't remove yourself.");
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}

export async function cancelInvite(formData: FormData) {
  await requireSuper();
  const email = formData.get("email") as string;
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("admin_invites").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}
