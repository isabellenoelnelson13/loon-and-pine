# Loon & Pine

The coming-soon website for Loon & Pine, an independent fabric, notions, and handmade-goods shop.

## Stack

- Next.js
- React
- TypeScript
- CSS
- Vercel

## Run locally

```bash
npm install
npm run dev
```

## Shopify

The shop page reads live products from the Shopify Storefront API when these
environment variables are set:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your_private_storefront_token
SHOPIFY_STOREFRONT_API_VERSION=2026-07
```

If you only have a public Storefront API access token, use
`SHOPIFY_STOREFRONT_ACCESS_TOKEN` instead of the private token. The page falls
back to sample products until Shopify is configured.

## Deploy

Import this repository into Vercel. Vercel will automatically run `npm run build` for each push to `main`.
