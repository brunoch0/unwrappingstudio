import { ReactNode } from "react";

type Variant = "tint" | "accent" | "outline" | "dark";

const variants: Record<Variant, string> = {
  tint: "bg-[var(--us-key-tint)] text-[var(--us-key)]",
  accent: "bg-[var(--us-sub)] text-[var(--us-key)]",
  outline: "border border-[var(--border-hair)] text-[var(--text-muted)]",
  dark: "bg-[rgba(255,255,255,0.1)] text-[var(--us-sub-200)]",
};

export function Badge({
  children,
  variant = "tint",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
