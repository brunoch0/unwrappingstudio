import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin, ROLE_LABEL, isSuperAdmin } from "@/lib/admin";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[var(--surface-raised)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-hair)] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center gap-6 px-5 py-3.5">
          <Link href="/admin" className="shrink-0">
            <Logo tone="key" size={18} />
          </Link>
          <span className="rounded-[var(--radius-pill)] bg-[var(--us-key-tint)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
            Admin
          </span>
          <AdminNav isSuper={isSuperAdmin(admin.role)} />
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-[12px] font-medium text-[var(--text-strong)]">
                {admin.email}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {ROLE_LABEL[admin.role]}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8">{children}</main>
    </div>
  );
}
