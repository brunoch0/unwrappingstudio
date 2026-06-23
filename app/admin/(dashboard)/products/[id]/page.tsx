import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdmin, canManage } from "@/lib/admin";
import { getAdminT } from "@/lib/admin-i18n-server";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Product, Collection } from "@/lib/types";
import { saveProduct, deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border-hair)] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[var(--us-key)] focus:shadow-[var(--shadow-focus)]";
const label =
  "text-[12px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--text-muted)]";

function Row({
  name,
  title,
  children,
  hint,
}: {
  name?: string;
  title: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={name}>
      <span className={label}>{title}</span>
      {children}
      {hint && <span className="text-[12px] text-[var(--text-faint)]">{hint}</span>}
    </label>
  );
}

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const admin = await getCurrentAdmin();
  const { t } = await getAdminT();
  const supabase = await createServerSupabase();

  let product: Product | null = null;
  if (!isNew) {
    const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    product = data as Product;
  }

  const { data: cols } = await supabase
    .from("collections")
    .select("*")
    .order("sort", { ascending: true });
  const collections = (cols ?? []) as Collection[];
  const canDelete = admin ? canManage(admin.role) : false;

  return (
    <div className="max-w-[760px]">
      <Link href="/admin/products" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--us-key)]">
        {t("pf.back")}
      </Link>
      <h1 className="mt-2 text-[24px] font-bold tracking-[var(--ls-display)] text-[var(--text-strong)]">
        {isNew ? "New product" : product!.name}
      </h1>

      <form action={saveProduct} className="mt-7 flex flex-col gap-5">
        {!isNew && <input type="hidden" name="id" value={product!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <Row name="name" title={t("pf.name")}>
            <input id="name" name="name" required defaultValue={product?.name ?? ""} className={field} />
          </Row>
          <Row name="slug" title={t("pf.slug")} hint={t("pf.slugHint")}>
            <input id="slug" name="slug" defaultValue={product?.slug ?? ""} className={field} placeholder="auto" />
          </Row>
          <Row name="price" title={t("pf.price")}>
            <input id="price" name="price" type="number" step="0.01" defaultValue={product?.price ?? ""} className={field} />
          </Row>
          <Row name="currency" title={t("pf.currency")}>
            <input id="currency" name="currency" defaultValue={product?.currency ?? "AED"} className={field} />
          </Row>
          <Row name="status" title={t("pf.status")}>
            <select id="status" name="status" defaultValue={product?.status ?? "active"} className={field}>
              <option value="active">{t("status.active")}</option>
              <option value="soldout">{t("status.soldout")}</option>
              <option value="hidden">{t("status.hidden")}</option>
            </select>
          </Row>
          <Row name="collection_id" title={t("pf.collection")}>
            <select id="collection_id" name="collection_id" defaultValue={product?.collection_id ?? ""} className={field}>
              <option value="">{t("pf.none")}</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </Row>
          <Row name="sort" title={t("pf.sort")} hint={t("pf.sortHint")}>
            <input id="sort" name="sort" type="number" defaultValue={product?.sort ?? 0} className={field} />
          </Row>
          <label className="flex items-center gap-2.5 pt-7" htmlFor="is_featured">
            <input id="is_featured" name="is_featured" type="checkbox" defaultChecked={product?.is_featured ?? false} className="h-4 w-4 accent-[var(--us-key)]" />
            <span className="text-[14px] text-[var(--text-body)]">{t("pf.featured")}</span>
          </label>
        </div>

        <Row name="curation_point" title={t("pf.curationPoint")} hint={t("pf.curationPointHint")}>
          <input id="curation_point" name="curation_point" defaultValue={product?.curation_point ?? ""} className={field} />
        </Row>
        <Row name="curation_comment" title={t("pf.why")} hint={t("pf.whyHint")}>
          <textarea id="curation_comment" name="curation_comment" rows={4} defaultValue={product?.curation_comment ?? ""} className={`${field} resize-y`} />
        </Row>

        <div className="grid gap-5 sm:grid-cols-2">
          <Row name="material" title={t("pf.material")}><input id="material" name="material" defaultValue={product?.material ?? ""} className={field} /></Row>
          <Row name="size" title={t("pf.size")}><input id="size" name="size" defaultValue={product?.size ?? ""} className={field} /></Row>
          <Row name="care" title={t("pf.care")}><input id="care" name="care" defaultValue={product?.care ?? ""} className={field} /></Row>
          <Row name="origin" title={t("pf.origin")}><input id="origin" name="origin" defaultValue={product?.origin ?? ""} className={field} /></Row>
        </div>
        <Row name="includes" title={t("pf.includes")}><input id="includes" name="includes" defaultValue={product?.includes ?? ""} className={field} /></Row>

        <Row title={t("pf.thumbnail")}>
          <ImageUpload name="thumbnail" defaultValue={product?.thumbnail ?? ""} />
        </Row>
        <Row title={t("pf.gallery")} hint={t("pf.galleryHint")}>
          <ImageUpload name="images" defaultValue={product?.images ?? []} multiple />
        </Row>
        <Row name="badges" title={t("pf.badges")} hint={t("pf.badgesHint")}>
          <input id="badges" name="badges" defaultValue={(product?.badges ?? []).join(", ")} className={field} />
        </Row>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="us-btn us-btn--md us-btn--primary">
            {isNew ? t("pf.create") : t("pf.save")}
          </button>
          <Link href="/admin/products" className="us-btn us-btn--md us-btn--ghost">{t("pf.cancel")}</Link>
        </div>
      </form>

      {!isNew && canDelete && (
        <form action={deleteProduct} className="mt-10 border-t border-[var(--border-hair)] pt-6">
          <input type="hidden" name="id" value={product!.id} />
          <button type="submit" className="text-[13px] font-semibold text-[var(--us-danger)] hover:underline">
            {t("pf.delete")}
          </button>
        </form>
      )}
    </div>
  );
}
