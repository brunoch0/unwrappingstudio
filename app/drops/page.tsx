import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Countdown } from "@/components/Countdown";
import { DropWaitlist } from "@/components/DropWaitlist";
import { getDropCollections } from "@/lib/shop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Drops",
  description: "Limited seasonal releases. Join the waitlist before they open.",
};

export default async function DropsPage() {
  const drops = await getDropCollections();

  return (
    <div className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <Badge variant="tint">Drops</Badge>
        <h1 className="mt-4 max-w-[20ch] text-[32px] font-extrabold leading-[1.06] tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[44px]">
          Limited, seasonal, once
        </h1>
        <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-[var(--text-body)]">
          A few pieces, released for a moment. Join the waitlist and we&apos;ll
          message you the instant it opens.
        </p>

        {drops.length === 0 ? (
          <p className="mt-12 text-[15px] text-[var(--text-muted)]">
            No drops scheduled right now — follow{" "}
            <a href="https://instagram.com/unwrapping_objects" target="_blank" rel="noopener noreferrer" className="text-[var(--us-sub-700)] hover:underline">
              @unwrapping_objects
            </a>{" "}
            for the next one.
          </p>
        ) : (
          <div className="mt-10 flex flex-col gap-8">
            {drops.map((d) => {
              const live = !d.drop_at || new Date(d.drop_at).getTime() <= Date.now();
              return (
                <div
                  key={d.id}
                  className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--us-grey-900)]"
                >
                  <div className="relative min-h-[360px] md:min-h-[420px]">
                    {d.cover_image && (
                      <Image src={d.cover_image} alt={d.title} fill sizes="(max-width: 1100px) 100vw, 1100px" className="object-cover opacity-65" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
                    <div className="relative flex min-h-[360px] flex-col justify-end p-7 md:min-h-[420px] md:p-10">
                      <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub)]">
                        {live ? "Open now" : "Upcoming drop"}
                      </span>
                      <h2 className="mt-3 max-w-[20ch] text-[28px] font-bold leading-tight tracking-[var(--ls-display)] text-white sm:text-[38px]">
                        {d.title}
                      </h2>
                      {d.subtitle && (
                        <p className="mt-2 max-w-[48ch] text-[15px] text-white/80">{d.subtitle}</p>
                      )}

                      <div className="mt-6">
                        {live ? (
                          <Button href={`/shop/collections/${d.slug}`} variant="accent" size="lg">
                            Shop the drop →
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-5">
                            {d.drop_at && <Countdown to={d.drop_at} dark />}
                            <DropWaitlist dropSlug={d.slug} dropTitle={d.title} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
