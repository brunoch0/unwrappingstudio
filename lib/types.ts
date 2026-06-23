export type Collection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  sort: number;
  is_featured: boolean;
  published: boolean;
  is_drop: boolean;
  drop_at: string | null;
};

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  cover_image: string | null;
  body: string | null;
  status: "draft" | "published";
  tags: string[];
  related_product_slugs: string[];
  published_at: string | null;
  sort: number;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  currency: string;
  thumbnail: string | null;
  curation_point: string | null;
  curation_comment: string | null;
  collection_id: string | null;
  sort: number;
  is_featured: boolean;
  status: "active" | "hidden" | "soldout";
  badges: string[];
  material: string | null;
  size: string | null;
  care: string | null;
  origin: string | null;
  includes: string | null;
  images: string[];
  /** 'in_stock' | 'preorder' | 'reserve' | 'crowdfund' */
  fulfillment: "in_stock" | "preorder" | "reserve" | "crowdfund";
  goal: number;
  campaign_ends_at: string | null;
  reserved_count: number;
};
