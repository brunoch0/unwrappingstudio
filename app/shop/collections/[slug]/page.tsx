import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import {
  getCollectionBySlug,
  getProductsByCollection,
  getAllCollectionSlugs,
} from "@/lib/shop";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollectionBySlug(slug);
  if (!c) return { title: "Not found" };
  return { title: c.title, description: c.subtitle ?? c.description ?? undefined };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const products = await getProductsByCollection(collection.id);

  return (
    <div>
      {/* Hero with theme story */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[44vh] bg-[var(--us-grey-900)]">
          {collection.cover_image && (
            <Image
              src={collection.cover_image}
              alt={collection.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative mx-auto flex min-h-[44vh] max-w-[1100px] flex-col justify-end px-5 py-12 md:px-10">
            <nav className="mb-auto pt-2 text-[12px] text-white/70">
              <Link href="/shop" className="hover:text-white">Shop</Link>
              <span className="mx-1.5">/</span>
              <span className="text-white">{collection.title}</span>
            </nav>
            {collection.is_featured && (
              <span className="mb-3 w-fit rounded-[var(--radius-pill)] bg-[var(--us-sub)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
                Featured
              </span>
            )}
            <h1 className="max-w-[18ch] text-[34px] font-extrabold leading-[1.06] tracking-[var(--ls-display)] text-white sm:text-[48px]">
              {collection.title}
            </h1>
            {collection.subtitle && (
              <p className="mt-3 max-w-[52ch] text-[17px] text-white/80">
                {collection.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Theme story */}
      {collection.description && (
        <section className="px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[680px]">
            <Badge variant="tint">The story</Badge>
            <p className="mt-5 text-[18px] leading-relaxed text-[var(--text-body)]">
              {collection.description}
            </p>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="border-t border-[var(--border-hair)] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-end justify-between">
            <h2 className="text-[22px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
              In this collection
            </h2>
            <span className="text-[13px] uppercase tracking-[var(--ls-label)] text-[var(--text-faint)]">
              {products.length} pieces
            </span>
          </div>
          {products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-[15px] text-[var(--text-muted)]">
              Pieces are being added to this collection. Ask us what&apos;s coming.
            </p>
          )}
          <div className="mt-10">
            <Button href="/shop/all" variant="secondary">
              Browse all pieces →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
