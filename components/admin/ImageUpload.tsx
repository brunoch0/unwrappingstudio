"use client";

import Image from "next/image";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

const BUCKET = "product-images";

export function ImageUpload({
  name,
  defaultValue,
  multiple = false,
}: {
  name: string;
  defaultValue?: string | string[] | null;
  multiple?: boolean;
}) {
  const init = Array.isArray(defaultValue)
    ? defaultValue.filter(Boolean)
    : defaultValue
      ? [defaultValue]
      : [];
  const [urls, setUrls] = useState<string[]>(init);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setErr(null);
    const supabase = createBrowserSupabase();
    const out: string[] = [];
    for (const f of files) {
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
      const rand = Math.random().toString(36).slice(2, 8);
      const path = `${name}/${Date.now()}-${rand}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, f, { upsert: false, contentType: f.type });
      if (error) {
        setErr(error.message);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      out.push(data.publicUrl);
    }
    setUrls(multiple ? [...urls, ...out] : out.slice(-1));
    setBusy(false);
    e.target.value = "";
  }

  function remove(u: string) {
    setUrls(urls.filter((x) => x !== u));
  }

  const value = multiple ? urls.join("\n") : (urls[0] ?? "");

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={value} readOnly />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((u) => (
            <div
              key={u}
              className="group relative h-24 w-24 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-hair)] bg-[var(--us-grey-100)]"
            >
              <Image src={u} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => remove(u)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[12px] leading-none text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--border-hair)] px-4 py-2.5 text-[13px] font-medium text-[var(--text-muted)] transition hover:border-[var(--us-key)] hover:text-[var(--us-key)]">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onPick}
          disabled={busy}
          className="hidden"
        />
        {busy ? "업로드 중…" : multiple ? "이미지 추가" : urls.length ? "이미지 교체" : "이미지 업로드"}
      </label>

      {err && <span className="text-[12px] text-[var(--us-danger)]">{err}</span>}
    </div>
  );
}
