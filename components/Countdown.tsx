"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { ms, d, h, m, s };
}

export function Countdown({ to, dark = false }: { to: string; dark?: boolean }) {
  const target = new Date(to).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t) return <div className="h-[52px]" aria-hidden />;

  if (t.ms <= 0) {
    return (
      <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--us-sub)] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
        Live now
      </span>
    );
  }

  const cell = (val: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className={`text-[24px] font-bold leading-none tabular-nums ${dark ? "text-white" : "text-[var(--text-strong)]"}`}>
        {String(val).padStart(2, "0")}
      </span>
      <span className={`mt-1 text-[10px] uppercase tracking-[var(--ls-label)] ${dark ? "text-[var(--text-on-dark-mut)]" : "text-[var(--text-faint)]"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-start gap-4">
      {cell(t.d, "Days")}
      {cell(t.h, "Hrs")}
      {cell(t.m, "Min")}
      {cell(t.s, "Sec")}
    </div>
  );
}
