import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const MODE_LABEL: Record<string, string> = {
  preorder: "Pre-order",
  reserve: "Reserve",
  crowdfund: "Crowdfunding",
};

export function ProductCard({ product }: { product: Product }) {
  const soldout = product.status === "soldout";
  const mode =
    product.fulfillment && product.fulfillment !== "in_stock"
      ? product.fulfillment
      : null;
  const cta = soldout ? "Notify me →" : mode ? `${MODE_LABEL[mode]} →` : "Inquire →";
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-card)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-reveal)] hover:-translate-y-[3px] hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--us-grey-100)]">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "var(--backdrop-cinematic)" }}
          />
        )}
        {soldout ? (
          <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-200)]">
            Sold out
          </span>
        ) : mode ? (
          <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--us-sub)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-key)]">
            {MODE_LABEL[mode]}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-strong)]">
          {product.name}
        </h3>
        {product.curation_point && (
          <p className="mt-1 text-[13px] italic leading-snug text-[var(--text-muted)]">
            “{product.curation_point}”
          </p>
        )}

        <div className="mt-auto pt-4">
          {product.badges?.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {product.badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className="rounded-[var(--radius-sm)] bg-[var(--us-sub-tint)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-[var(--us-sub-700)]"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[var(--text-strong)]">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)] opacity-0 transition-opacity group-hover:opacity-100">
              {cta}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
