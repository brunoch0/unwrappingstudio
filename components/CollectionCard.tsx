import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";

export function CollectionCard({
  collection,
  count,
}: {
  collection: Collection;
  count?: number;
}) {
  return (
    <Link
      href="/shop#products"
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-[var(--us-grey-900)]"
    >
      {collection.cover_image && (
        <Image
          src={collection.cover_image}
          alt={collection.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-80 transition-transform duration-500 ease-[var(--ease-reveal)] group-hover:scale-[1.05]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="relative p-6">
        {collection.is_featured && (
          <span className="mb-3 inline-block rounded-[var(--radius-pill)] bg-[var(--us-sub)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
            Featured
          </span>
        )}
        <h3 className="text-[22px] font-bold leading-tight tracking-[var(--ls-display)] text-white">
          {collection.title}
        </h3>
        {collection.subtitle && (
          <p className="mt-1.5 text-[13px] text-[var(--text-on-dark-mut)]">
            {collection.subtitle}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-200)]">
          <span>{count != null ? `${count} pieces` : "Explore"}</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
