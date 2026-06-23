import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, ROLE_LABEL, type AdminUser, type AdminRole } from "@/lib/admin";
import { inviteAdmin, updateRole, removeAdmin, cancelInvite } from "./actions";

export const dynamic = "force-dynamic";

type Invite = { email: string; role: AdminRole; created_at: string };

const field =
  "rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3 py-2 text-[14px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";
const ROLES: AdminRole[] = ["super_admin", "admin", "editor"];

export default async function TeamPage() {
  const me = await getCurrentAdmin();
  if (!me || me.role !== "super_admin") redirect("/admin");

  const supabase = await createServerSupabase();
  const [{ data: admins }, { data: invites }] = await Promise.all([
    supabase.from("admin_users").select("*").order("created_at", { ascending: true }),
    supabase.from("admin_invites").select("*").order("created_at", { ascending: true }),
  ]);
  const roster = (admins ?? []) as AdminUser[];
  const pending = (invites ?? []) as Invite[];

  return (
    <div className="max-w-[760px]">
      <h1 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        Team
      </h1>
      <p className="mt-1.5 text-[14px] text-[var(--text-muted)]">
        Invite people and set what they can do. Only a super admin sees this page.
      </p>

      {/* Invite */}
      <div className="mt-7 rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white p-6">
        <h2 className="text-[15px] font-semibold text-[var(--text-strong)]">Invite an admin</h2>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          They get access when they create an account with this email at <code>/admin/login</code>.
        </p>
        <form action={inviteAdmin} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]">Email</span>
            <input name="email" type="email" required placeholder="name@email.com" className={`${field} w-full`} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]">Role</span>
            <select name="role" defaultValue="admin" className={field}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="us-btn us-btn--md us-btn--primary">Send invite</button>
        </form>
      </div>

      {/* Roster */}
      <h2 className="mt-9 text-[15px] font-semibold text-[var(--text-strong)]">
        Admins ({roster.length})
      </h2>
      <div className="mt-3 flex flex-col gap-2.5">
        {roster.map((a) => {
          const self = a.id === me.id;
          return (
            <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-white px-5 py-3.5">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium text-[var(--text-strong)]">
                  {a.email} {self && <span className="text-[var(--text-faint)]">(you)</span>}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {self ? (
                  <span className="rounded-[var(--radius-pill)] bg-[var(--us-key-tint)] px-3 py-1 text-[12px] font-semibold text-[var(--us-key)]">
                    {ROLE_LABEL[a.role]}
                  </span>
                ) : (
                  <>
                    <form action={updateRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={a.id} />
                      <select name="role" defaultValue={a.role} className={field}>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                        ))}
                      </select>
                      <button type="submit" className="us-btn us-btn--sm us-btn--secondary">Save</button>
                    </form>
                    <form action={removeAdmin}>
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" className="text-[13px] font-semibold text-[var(--us-danger)] hover:underline">
                        Remove
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending invites */}
      {pending.length > 0 && (
        <>
          <h2 className="mt-9 text-[15px] font-semibold text-[var(--text-strong)]">
            Pending invites ({pending.length})
          </h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {pending.map((inv) => (
              <div key={inv.email} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border-hair)] bg-white px-5 py-3.5">
                <span className="text-[14px] text-[var(--text-body)]">{inv.email}</span>
                <span className="rounded-[var(--radius-pill)] bg-[var(--surface-sunken)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--text-muted)]">
                  {ROLE_LABEL[inv.role]}
                </span>
                <form action={cancelInvite} className="ml-auto">
                  <input type="hidden" name="email" value={inv.email} />
                  <button type="submit" className="text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--us-danger)]">
                    Cancel
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
