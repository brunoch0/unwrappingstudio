import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Logo } from "@/components/Logo";
import { CollectionCard } from "@/components/CollectionCard";
import { getFeaturedCollections, getRecommendedProducts } from "@/lib/shop";

export const revalidate = 300;

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getFeaturedCollections(),
    getRecommendedProducts(8),
  ]);
  const featured = collections.filter((c) => c.is_featured).slice(0, 2);
  const countFor = (id: string) =>
    products.filter((p) => p.collection_id === id).length || undefined;

  return (
    <div>
      {/* Hero — cinematic key visual */}
      <section
        className="relative flex min-h-[78vh] flex-col justify-center overflow-hidden px-5 py-24 md:px-10"
        style={{ background: "var(--backdrop-cinematic)" }}
      >
        <div className="us-glitter" aria-hidden />
        <div className="us-reveal relative mx-auto w-full max-w-[1100px]">
          <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub)]">
            Branding &amp; Creative Direction — Seoul &amp; Dubai
          </span>
          <h1 className="mt-7 max-w-[18ch] text-[40px] font-extrabold leading-[1.05] tracking-[var(--ls-display)] text-white sm:text-[58px]">
            A curation shop for things worth trusting.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[18px] leading-relaxed text-white/80 sm:text-[21px]">
            Every brand — and every object — is wrapped in layers of perception,
            market, and desire. We begin by seeing beyond the surface, revealing
            what truly defines it. Now we bring that eye to a shop for the Gulf.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/shop" variant="accent" size="lg">
              Shop the curation →
            </Button>
            <Button href="#story" variant="dark" size="lg">
              Our story
            </Button>
          </div>
        </div>
      </section>

      {/* Manifesto split */}
      <section id="story" className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <Badge variant="tint">Why we unwrap</Badge>
            <h2 className="mt-5 text-[30px] font-bold leading-tight tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[34px]">
              The truth already exists within
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-body)]">
              A green box rests at the center. Inside, the thing waits in silence
              to be discovered. Our work is the moment of unwrapping — and once
              revealed, it never returns to what it was before. We carry that same
              patience into what we choose to sell.
            </p>
          </div>
          <div>
            <Badge variant="tint">In Dubai</Badge>
            <h2 className="mt-5 text-[30px] font-bold leading-tight tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[34px]">
              Where brands converge
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-body)]">
              Where clarity connects. In Dubai — a city where lines cross and
              cultures meet — we build the bridge between Korean makers and Gulf
              homes, with shipping, duties, and returns made plain.
            </p>
          </div>
        </div>
      </section>

      {/* The three layers, on deep green */}
      <section className="bg-[var(--surface-dark)] px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[60ch]">
            <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub)]">
              How we choose
            </span>
            <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-[var(--ls-display)] text-white sm:text-[34px]">
              Nothing is on the shelf without a reason
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-[var(--border-on-dark)] bg-[var(--border-on-dark)] md:grid-cols-3">
            {[
              ["01", "Context", "Where it comes from, who made it, and why it matters now — the layer beneath the surface."],
              ["02", "Essence", "Material, proportion, how it feels in the hand. The honest detail, never hidden."],
              ["03", "Creative", "How it lives in your space — styling, use, and the story we tell around it."],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-[var(--us-key)] p-8">
                <span className="text-[13px] font-bold text-[var(--us-sub)]">{n}</span>
                <h3 className="mt-3 text-[20px] font-semibold text-white">{t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-on-dark-mut)]">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collections preview */}
      {featured.length > 0 && (
        <section className="px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge variant="tint">From the shop</Badge>
                <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[34px]">
                  Start with a collection
                </h2>
              </div>
              <Button href="/shop" variant="secondary">
                Enter the shop →
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {featured.map((c) => (
                <CollectionCard key={c.id} collection={c} count={countFor(c.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section
        className="relative overflow-hidden px-5 py-24 md:px-10"
        style={{ background: "var(--backdrop-cinematic)" }}
      >
        <div className="us-glitter" aria-hidden />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Logo tone="light" size={28} withStudio />
          <p className="mt-7 text-[22px] leading-snug text-white sm:text-[26px]">
            Let&apos;s unwrap something worth keeping.
          </p>
          <p className="mt-3 max-w-[48ch] text-[15px] text-white/70">
            The moment before clarity aligns — for your home, in the Gulf.
          </p>
          <div className="mt-8">
            <Button href="/shop" variant="accent" size="lg">
              Shop the curation →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
