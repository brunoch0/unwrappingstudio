import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin, isSuperAdmin } from "@/lib/admin";
import { getAdminT } from "@/lib/admin-i18n-server";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { LangToggle } from "@/components/admin/LangToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const { lang, t } = await getAdminT();

  return (
    <div className="min-h-screen bg-[var(--surface-raised)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-hair)] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center gap-6 px-5 py-3.5">
          <Link href="/admin" className="shrink-0">
            <Logo tone="key" size={18} />
          </Link>
          <span className="rounded-[var(--radius-pill)] bg-[var(--us-key-tint)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
            {t("auth.admin")}
          </span>
          <AdminNav isSuper={isSuperAdmin(admin.role)} lang={lang} />
          <div className="ml-auto flex items-center gap-3">
            <LangToggle lang={lang} />
            <div className="hidden text-right sm:block">
              <div className="text-[12px] font-medium text-[var(--text-strong)]">
                {admin.email}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {t(`role.${admin.role}`)}
              </div>
            </div>
            <LogoutButton lang={lang} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8">{children}</main>
    </div>
  );
}
