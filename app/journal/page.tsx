import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { JournalCard } from "@/components/JournalCard";
import { getPublishedPosts } from "@/lib/journal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Found objects, makers, and the reasons behind the curation — from Unwrapping Studio.",
};

export default async function JournalPage() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;

  return (
    <div className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <Badge variant="tint">Journal</Badge>
        <h1 className="mt-4 max-w-[20ch] text-[32px] font-extrabold leading-[1.06] tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[44px]">
          The reasons behind the curation
        </h1>
        <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-[var(--text-body)]">
          Found objects, the makers who shape them, and why each one earns its
          place. Read slowly.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-[15px] text-[var(--text-muted)]">
            The first stories are being written.
          </p>
        ) : (
          <>
            {lead && (
              <div className="mt-10 border-b border-[var(--border-hair)] pb-12">
                <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
                  <JournalCard post={lead} />
                  <div>
                    {lead.tags?.[0] && (
                      <span className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)]">
                        {lead.tags[0]}
                      </span>
                    )}
                    <h2 className="mt-2 text-[26px] font-bold leading-tight tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[32px]">
                      {lead.title}
                    </h2>
                    {lead.excerpt && (
                      <p className="mt-3 text-[16px] leading-relaxed text-[var(--text-body)]">
                        {lead.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <JournalCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
