import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";

export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--us-grey-900)]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "var(--backdrop-cinematic)" }} />
        )}
      </div>
      <div className="mt-4">
        {post.tags?.length > 0 && (
          <span className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)]">
            {post.tags[0]}
          </span>
        )}
        <h3 className="mt-1.5 text-[19px] font-bold leading-snug tracking-[var(--ls-display)] text-[var(--text-strong)] transition-colors group-hover:text-[var(--us-key)]">
          {post.title}
        </h3>
        {post.subtitle && (
          <p className="mt-1.5 text-[14px] leading-snug text-[var(--text-muted)]">{post.subtitle}</p>
        )}
      </div>
    </Link>
  );
}
