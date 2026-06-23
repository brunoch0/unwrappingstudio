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
};
