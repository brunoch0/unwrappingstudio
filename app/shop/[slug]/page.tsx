import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { PolicyTemplates } from "@/components/PolicyTemplates";
import { InquiryForm } from "@/components/InquiryForm";
import { formatPrice } from "@/lib/format";
import {
  getProductBySlug,
  getCollectionById,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/shop";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.curation_point ?? product.curation_comment ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [collection, related] = await Promise.all([
    getCollectionById(product.collection_id),
    getRelatedProducts(product.collection_id, product.id),
  ]);

  const soldout = product.status === "soldout";
  const details: [string, string | null][] = [
    ["Material", product.material],
    ["Size", product.size],
    ["Care", product.care],
    ["Origin", product.origin],
    ["In the box", product.includes],
  ];
  const hasDetails = details.some(([, v]) => v);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="border-b border-[var(--border-hair)] px-5 py-3.5 text-[12px] text-[var(--text-muted)] md:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-1.5">
          <Link href="/shop" className="hover:text-[var(--us-key)]">Shop</Link>
          <span className="text-[var(--text-faint)]">/</span>
          {collection && (
            <>
              <Link href="/shop#collections" className="hover:text-[var(--us-key)]">
                {collection.title}
              </Link>
              <span className="text-[var(--text-faint)]">/</span>
            </>
          )}
          <span className="text-[var(--text-strong)]">{product.name}</span>
        </div>
      </nav>

      {/* Product main */}
      <section className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-2 md:gap-14">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="md:sticky md:top-24 md:self-start">
            {collection && (
              <Link
                href="/shop#collections"
                className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub-700)] hover:underline"
              >
                {collection.title}
              </Link>
            )}
            <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[38px]">
              {product.name}
            </h1>
            {product.curation_point && (
              <p className="mt-3 text-[17px] italic leading-snug text-[var(--text-muted)]">
                “{product.curation_point}”
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-[24px] font-semibold text-[var(--text-strong)]">
                {formatPrice(product.price, product.currency)}
              </span>
              <a href="#shipping" className="text-[13px] text-[var(--us-sub-700)] hover:underline">
                + shipping &amp; possible duties
              </a>
            </div>

            {product.badges?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <Badge key={b} variant="outline">{b}</Badge>
                ))}
              </div>
            )}

            {/* CTA — no checkout yet, so alternative conversion */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="#inquire" variant="primary" size="lg" full>
                {soldout ? "Notify me when it's back" : "Inquire to buy"}
              </Button>
              <Button href="#shipping" variant="secondary" size="lg">
                Shipping &amp; returns
              </Button>
            </div>
            <p className="mt-3 text-[13px] text-[var(--text-faint)]">
              Checkout for the Gulf is opening in stages. For now we confirm
              shipping, hold a piece, or arrange payment by message.
            </p>

            {/* Curation comment — why this piece */}
            {product.curation_comment && (
              <div className="mt-9 border-t border-[var(--border-hair)] pt-7">
                <span className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)]">
                  Why this piece
                </span>
                <p className="mt-3 text-[16px] leading-relaxed text-[var(--text-body)]">
                  {product.curation_comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      {hasDetails && (
        <section className="border-t border-[var(--border-hair)] px-5 py-12 md:px-10 md:py-16">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[20px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
              The detail
            </h2>
            <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {details
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 border-b border-[var(--border-hair)] pb-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-faint)]">
                      {k}
                    </dt>
                    <dd className="text-[15px] text-[var(--text-body)]">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </section>
      )}

      {/* Shipping / duties / returns */}
      <section
        id="shipping"
        className="border-t border-[var(--border-hair)] bg-[var(--surface-raised)] px-5 py-14 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-[1100px]">
          <Badge variant="tint">Before you buy</Badge>
          <h2 className="mt-4 max-w-[24ch] text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[30px]">
            Shipping, duties, and returns
          </h2>
          <div className="mt-9">
            <PolicyTemplates />
          </div>
          <p className="mt-6 text-[13px] text-[var(--text-faint)]">
            Estimates shown are not final charges. Final shipping and any duties
            are confirmed per order and destination.
          </p>
        </div>
      </section>

      {/* Inquiry / notify */}
      <section
        id="inquire"
        className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24"
        style={{ background: "var(--backdrop-cinematic)" }}
      >
        <div className="us-glitter" aria-hidden />
        <div className="relative mx-auto grid max-w-[1100px] gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub)]">
              {soldout ? "Currently sold out" : "Not ready to check out?"}
            </span>
            <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-[var(--ls-display)] text-white sm:text-[32px]">
              {soldout
                ? `Get notified about ${product.name}`
                : `Ask about ${product.name}`}
            </h2>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/75">
              Tell us your country and we&apos;ll confirm shipping and any duties,
              hold the piece, or let you know the moment it&apos;s back. We reply
              in English or Arabic within 24–48 hours.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-on-dark)] bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
            <InquiryForm
              source="product_detail"
              defaultMode={soldout ? "notify" : "inquiry"}
              productContext={{ id: product.id, slug: product.slug, name: product.name }}
            />
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border-hair)] px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[22px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
              From the same collection
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
