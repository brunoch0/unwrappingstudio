"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Opt = { slug: string; title: string };

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function FilterBar({ collections }: { collections: Opt[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    router.push(`/shop/all?${sp.toString()}`);
  }

  const control =
    "rounded-[var(--radius-sm)] border border-[var(--border-hair)] bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[var(--us-key)]";
  const activeCollection = params.get("collection") ?? "";
  const activeSort = params.get("sort") ?? "recommended";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q });
        }}
        className="flex-1"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pieces…"
          className={`${control} w-full`}
        />
      </form>
      <select
        value={activeCollection}
        onChange={(e) => update({ collection: e.target.value })}
        className={control}
      >
        <option value="">All collections</option>
        {collections.map((c) => (
          <option key={c.slug} value={c.slug}>{c.title}</option>
        ))}
      </select>
      <select
        value={activeSort}
        onChange={(e) => update({ sort: e.target.value })}
        className={control}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
