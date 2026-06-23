import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/shop/FilterBar";
import { getFeaturedCollections, searchProducts, type ProductFilters } from "@/lib/shop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All pieces",
  description: "Search and browse the full curation.",
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const filters: ProductFilters = {
    q: get("q") || undefined,
    collection: get("collection") || undefined,
    sort: (get("sort") as ProductFilters["sort"]) || undefined,
  };

  const [collections, products] = await Promise.all([
    getFeaturedCollections(),
    searchProducts(filters),
  ]);

  return (
    <div className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <Badge variant="tint">The full curation</Badge>
        <h1 className="mt-4 text-[28px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)] sm:text-[36px]">
          Browse every piece
        </h1>

        <div className="mt-8">
          <Suspense fallback={null}>
            <FilterBar collections={collections.map((c) => ({ slug: c.slug, title: c.title }))} />
          </Suspense>
        </div>

        <p className="mt-6 text-[13px] text-[var(--text-faint)]">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>

        {products.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-[15px] text-[var(--text-muted)]">
            Nothing matches that yet. Try another search or clear the filters.
          </p>
        )}
      </div>
    </div>
  );
}
