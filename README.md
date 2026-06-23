# Unwrapping Studio — Curation Shop

Marketing **home** + **shop landing** for Unwrapping Studio's Middle-East curation
shop. Built on the studio brand system (Golos Text, deep green `#023500` / reveal
green `#33CC66`, cinematic key visuals).

## Stack
- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind v4** + brand design tokens (`app/globals.css`)
- **Supabase** (Postgres) — collections, products, inquiries — project `ltqcuswchnstfndnyprx`
- Deploy target: **Vercel**

## Pages
| Route | What |
|-------|------|
| `/` | Home — cinematic hero, the unwrapping manifesto, "how we choose" layers, featured collections, closing CTA |
| `/shop` | Shop landing — hero, shipping/duties/returns trust strip, curator's picks, collections, browse-by-collection, standardized policy templates, inquiry / notify form (alt-conversion) |

Both pages are ISR (`revalidate = 300`), so DB edits appear within 5 minutes without a redeploy.

## Data model (`public`)
- `collections` — slug, title, subtitle, description, cover_image, sort, is_featured, published
- `products` — slug, name, price, currency, thumbnail, curation_point, curation_comment, collection_id, status (`active|hidden|soldout`), badges[]
- `inquiries` — type (`inquiry|notify`), name, contact, message, context (jsonb)

RLS: public reads published collections & non-hidden products; anyone may insert an inquiry.

## Local dev
```bash
npm install
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
npm run dev                  # http://localhost:3000
```

## Not yet built (next phases per the spec)
Product detail pages, cart, checkout, operator/admin tools, Arabic localization.
