import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { InquiryForm } from "@/components/InquiryForm";
import { PolicyTemplates } from "@/components/PolicyTemplates";
import { getFeaturedCollections, getRecommendedProducts } from "@/lib/shop";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop — the curation",
  description:
    "A curated shop of objects worth trusting, with shipping, duties, and returns made plain for the Middle East.",
};

const TRUST = [
  ["Ships to UAE & KSA", "Across the Gulf, with more countries opening."],
  ["7–14 working days", "Tracked once it leaves the maker's hands."],
  ["Duties, explained", "What you may owe, who charges it, and when."],
  ["7-day returns", "Clear terms — see the policy before you ask."],
];

export default async function ShopPage() {
  const [collections, products] = await Promise.all([
    getFeaturedCollections(),
    getRecommendedProducts(50),
  ]);

  const picks = products.filter((p) => p.is_featured).slice(0, 4);
  const countFor = (id: string) =>
    products.filter((p) => p.collection_id === id).length || undefined;

  return (
    <div>
      {/* Shop hero */}
      <section className="border-b border-[var(--border-hair)] bg-[var(--surface-raised)] px-5 py-16 md:px-10 md:py-24">
        <div className="us-reveal mx-auto max-w-[1100px]">
          <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub-700)]">
            The Unwrapping Shop
          </span>
          <h1 className="mt-5 max-w-[20ch] text-[36px] font-extrabold leading-[1.06] tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[52px]">
            Objects chosen with a reason you can read.
          </h1>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--text-body)] sm:text-[19px]">
            We don&apos;t list everything. Each piece carries the context, the
            essence, and the way it lives in a room — unwrapped for you, and
            delivered to the Gulf with the shipping and duties made plain.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#collections" variant="primary" size="lg">
              Browse collections
            </Button>
            <Button href="#inquire" variant="secondary" size="lg">
              Ask about a piece
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip — 직구 핵심 안내 요약 */}
      <section className="border-b border-[var(--border-hair)] px-5 md:px-10">
        <div className="mx-auto grid max-w-[1100px] gap-px divide-y divide-[var(--border-hair)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {TRUST.map(([t, d], i) => (
            <a
              key={t}
              href="#shipping"
              className={`group flex flex-col gap-1.5 py-6 transition-colors hover:bg-[var(--us-sub-tint)] sm:px-6 ${
                i % 2 === 1 ? "sm:border-l sm:border-[var(--border-hair)]" : ""
              } lg:border-l lg:border-[var(--border-hair)] lg:first:border-l-0`}
            >
              <span className="text-[14px] font-semibold text-[var(--text-strong)]">
                {t}
              </span>
              <span className="text-[13px] leading-snug text-[var(--text-muted)]">
                {d}
              </span>
              <span className="mt-1 text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)] opacity-0 transition-opacity group-hover:opacity-100">
                Read the policy →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Curator's picks */}
      {picks.length > 0 && (
        <section id="products" className="px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1100px]">
            <Badge variant="tint">Curator&apos;s picks</Badge>
            <h2 className="mt-4 text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[32px]">
              Where to start
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {picks.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <section
          id="collections"
          className="bg-[var(--surface-raised)] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-[1100px]">
            <Badge variant="tint">Collections</Badge>
            <h2 className="mt-4 text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[32px]">
              Browse by theme
            </h2>
            <p className="mt-3 max-w-[56ch] text-[15px] text-[var(--text-muted)]">
              Each collection is a point of view — a reason these pieces belong
              together.
            </p>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c) => (
                <CollectionCard key={c.id} collection={c} count={countFor(c.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by collection — full catalogue */}
      {collections.map((c) => {
        const items = products.filter((p) => p.collection_id === c.id);
        if (items.length === 0) return null;
        return (
          <section key={c.id} className="px-5 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1100px]">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-hair)] pb-5">
                <div>
                  <h2 className="text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[28px]">
                    {c.title}
                  </h2>
                  {c.subtitle && (
                    <p className="mt-1.5 text-[15px] text-[var(--text-muted)]">
                      {c.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-[13px] uppercase tracking-[var(--ls-label)] text-[var(--text-faint)]">
                  {items.length} pieces
                </span>
              </div>
              {c.description && (
                <p className="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-[var(--text-body)]">
                  {c.description}
                </p>
              )}
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Shipping / duties / returns — standardized templates */}
      <section
        id="shipping"
        className="bg-[var(--surface-raised)] px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1100px]">
          <Badge variant="tint">Before you buy</Badge>
          <h2 className="mt-4 max-w-[24ch] text-[26px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[32px]">
            Shipping, duties, and returns — the same way, every time
          </h2>
          <div className="mt-10">
            <PolicyTemplates />
          </div>
          <p className="mt-6 text-[13px] text-[var(--text-faint)]">
            Estimates shown are not final charges. Final shipping and any duties
            are confirmed per order and destination.
          </p>
        </div>
      </section>

      {/* Inquiry / notify — alternative conversion */}
      <section
        id="inquire"
        className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28"
        style={{ background: "var(--backdrop-cinematic)" }}
      >
        <div className="us-glitter" aria-hidden />
        <div className="relative mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub)]">
              Not ready to check out?
            </span>
            <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-[var(--ls-display)] text-white sm:text-[34px]">
              Ask us, or get notified
            </h2>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/75">
              Checkout for the Gulf is opening in stages. Until then, tell us the
              piece you want — we&apos;ll confirm shipping to your country, hold
              it, or let you know the moment it&apos;s back. We reply in English
              or Arabic.
            </p>
            <ul className="mt-7 space-y-2.5 text-[14px] text-[var(--text-on-dark-mut)]">
              <li>— Confirm shipping &amp; duties to your country</li>
              <li>— Reserve a piece before it sells out</li>
              <li>— Restock and new-arrival alerts</li>
            </ul>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-on-dark)] bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
