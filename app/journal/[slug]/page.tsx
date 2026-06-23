import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProductCard } from "@/components/ProductCard";
import { getPostBySlug, getAllPostSlugs, getProductsBySlugs } from "@/lib/journal";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt ?? post.subtitle ?? undefined,
  };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getProductsBySlugs(post.related_product_slugs ?? []);

  return (
    <article>
      {/* Header */}
      <header className="px-5 pt-12 md:px-10 md:pt-16">
        <div className="mx-auto max-w-[760px]">
          <Link href="/journal" className="text-[12px] uppercase tracking-[var(--ls-wide)] text-[var(--us-sub-700)] hover:underline">
            ← Journal
          </Link>
          {post.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-[var(--radius-pill)] bg-[var(--us-key-tint)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.08] tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[46px]">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-4 text-[19px] leading-relaxed text-[var(--text-muted)]">
              {post.subtitle}
            </p>
          )}
        </div>
      </header>

      {post.cover_image && (
        <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-[1000px] overflow-hidden rounded-[var(--radius-md)] bg-[var(--us-grey-100)] md:px-0">
          <Image src={post.cover_image} alt={post.title} fill priority sizes="(max-width: 1000px) 100vw, 1000px" className="object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-12 md:px-10 md:py-16">
        <div className="us-prose mx-auto max-w-[680px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body ?? ""}
          </ReactMarkdown>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border-hair)] px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[22px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
              In this story
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
