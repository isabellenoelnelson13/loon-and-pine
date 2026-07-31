import Image from "next/image";
import Link from "next/link";
import { beginCheckout } from "./actions";
import { getProducts, type ShopifyProduct, type ShopifyVariant } from "../../lib/shopify";

export const dynamic = "force-dynamic";

const sampleProducts = [
  {
    id: "fern-cotton",
    title: "Meadow Fern Cotton",
    collection: "Meadow Lane",
    price: "$3.25",
    swatch: "fabric-yardage",
    detail: "100% quilting cotton · 44 in wide",
    variants: ["Quarter yard", "Half yard", "One yard"],
  },
  {
    id: "harvest-bundle",
    title: "Harvest Story Bundle",
    collection: "Loon & Pine edit",
    price: "$18.00",
    swatch: "fabric-precuts",
    detail: "Six coordinating fat quarters",
    variants: ["One bundle"],
  },
  {
    id: "patchwork-pouch",
    title: "Patchwork Zipper Pouch",
    collection: "Handmade goods",
    price: "$28.00",
    swatch: "fabric-quilted",
    detail: "Small batch · one of a kind",
    variants: ["One item"],
  },
  {
    id: "moss-thread",
    title: "Moss Green Thread Set",
    collection: "Sewing notions",
    price: "$9.00",
    swatch: "fabric-moss",
    detail: "Three everyday shades for making",
    variants: ["One set"],
  },
];

type DisplayProduct = {
  id: string;
  title: string;
  collection: string;
  detail: string;
  price: string;
  swatch: string;
  image?: ShopifyProduct["featuredImage"];
  variants: ShopifyVariant[];
  previewVariants: string[];
};

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function getPrimaryVariant(product: DisplayProduct) {
  return product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
}

function shorten(copy: string) {
  if (copy.length <= 150) {
    return copy;
  }

  return `${copy.slice(0, 147).trim()}...`;
}

function mapShopifyProduct(product: ShopifyProduct, index: number): DisplayProduct {
  const swatches = ["fabric-yardage", "fabric-precuts", "fabric-quilted", "fabric-moss"];
  const variant = product.variants[0];

  return {
    id: product.id,
    title: product.title,
    collection: product.productType || "Loon & Pine",
    detail: product.description
      ? shorten(product.description)
      : "A live product from the Loon & Pine Shopify catalog.",
    price: variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : "Unavailable",
    swatch: swatches[index % swatches.length],
    image: product.featuredImage,
    variants: product.variants,
    previewVariants: [],
  };
}

function mapSampleProduct(product: (typeof sampleProducts)[number]): DisplayProduct {
  return {
    ...product,
    image: null,
    variants: [],
    previewVariants: product.variants,
  };
}

function ProductArtwork({
  product,
  className,
  sizes,
  priority = false,
}: {
  product: DisplayProduct;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={`${className} product-photo`}>
        <Image
          src={product.image.url}
          alt={product.image.altText ?? product.title}
          fill
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return <div className={`${className} ${product.swatch}`} aria-hidden="true" />;
}

function ShopifyCheckoutButton({
  variant,
  label = "Checkout with Shopify",
}: {
  variant: ShopifyVariant | undefined;
  label?: string;
}) {
  if (!variant) {
    return (
      <button className="button primary" disabled>
        Preview only
      </button>
    );
  }

  return (
    <form action={beginCheckout}>
      <input type="hidden" name="variantId" value={variant.id} />
      <button className="button primary" type="submit" disabled={!variant.availableForSale}>
        {variant.availableForSale ? label : "Sold out"}
      </button>
    </form>
  );
}

export default async function ShopPage() {
  const shopify = await getProducts();
  const hasLiveProducts = shopify.products.length > 0;
  const products = hasLiveProducts
    ? shopify.products.map(mapShopifyProduct)
    : sampleProducts.map(mapSampleProduct);
  const featuredProduct = products[0];
  const featuredVariant = getPrimaryVariant(featuredProduct);

  return (
    <main className="shop-preview">
      <div className="preview-banner">
        {hasLiveProducts
          ? "Live Shopify inventory · Checkout opens through Shopify"
          : "Storefront preview · Add Shopify env vars to show live products"}
      </div>

      <header className="shop-header">
        <Link className="wordmark" href="/" aria-label="Back to Loon and Pine home">
          <Image
            src="/loon-and-pine-logo.png"
            alt="Loon & Pine"
            width={150}
            height={70}
            priority
          />
        </Link>
        <nav aria-label="Shop navigation">
          <a href="#collection">Shop all</a>
          <a href="#about-shop">About</a>
          <Link href="/">Home</Link>
        </nav>
        <a className="bag-button" href="#collection">
          Shop <span>{products.length}</span>
        </a>
      </header>

      <section className="shop-hero">
        <div>
          <p className="eyebrow">The opening collection</p>
          <h1>
            Made for your next
            <br />
            favorite project.
          </h1>
          <p>
            Thoughtfully chosen fabric, useful sewing notions, and small-batch
            quilted goods for the joy of making.
          </p>
          <a className="button primary" href="#collection">
            Shop the collection
          </a>
        </div>
        <div className="shop-hero-art" aria-hidden="true">
          <Image
            src="/loon-and-pine-logo-cream.png"
            alt=""
            width={390}
            height={260}
            priority
          />
          <span>Fabric · Notions · Handmade</span>
        </div>
      </section>

      <section className="shop-content" id="collection">
        <div className="shop-intro">
          <div>
            <p className="eyebrow">Featured finds</p>
            <h2>{hasLiveProducts ? "Ready from Shopify." : "A small, lovely start."}</h2>
          </div>
          <p>
            {hasLiveProducts
              ? "Products, prices, availability, and checkout now come directly from Shopify."
              : "These sample products remain visible until Shopify credentials are configured in Vercel."}
          </p>
        </div>

        {shopify.error ? (
          <p className="shop-alert">
            Shopify is configured, but products could not load: {shopify.error}
          </p>
        ) : null}

        <div className="shop-grid">
          {products.map((product) => {
            const variant = getPrimaryVariant(product);

            return (
              <article className="shop-card" key={product.id}>
                <ProductArtwork
                  product={product}
                  className="shop-swatch"
                  sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
                />
                <p className="shop-card-type">{product.collection}</p>
                <h3>{product.title}</h3>
                <p>{product.detail}</p>
                <div className="shop-card-bottom">
                  <strong>{variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : product.price}</strong>
                  <ShopifyCheckoutButton variant={variant} label="Buy now" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="product-panel" aria-label="Featured product">
        <ProductArtwork
          product={featuredProduct}
          className="product-panel-art"
          sizes="(max-width: 900px) 100vw, 50vw"
          priority={Boolean(featuredProduct.image)}
        />
        <div className="product-panel-copy">
          <p className="eyebrow">{featuredProduct.collection}</p>
          <h2>{featuredProduct.title}</h2>
          <p>{featuredProduct.detail}</p>
          <p className="product-price">
            {featuredVariant
              ? formatPrice(featuredVariant.price.amount, featuredVariant.price.currencyCode)
              : featuredProduct.price}
          </p>

          {featuredProduct.variants.length ? (
            <div className="variant-list" aria-label="Available options">
              {featuredProduct.variants.map((variant) => (
                <form className="variant-row" action={beginCheckout} key={variant.id}>
                  <input type="hidden" name="variantId" value={variant.id} />
                  <div>
                    <strong>{variant.title === "Default Title" ? "Standard" : variant.title}</strong>
                    <span>{formatPrice(variant.price.amount, variant.price.currencyCode)}</span>
                  </div>
                  <button className="button primary" type="submit" disabled={!variant.availableForSale}>
                    {variant.availableForSale ? "Buy" : "Sold out"}
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <>
              <fieldset className="yardage-options">
                <legend>Preview options</legend>
                {featuredProduct.previewVariants.map((option) => (
                  <button
                    className={option === featuredProduct.previewVariants[0] ? "selected" : ""}
                    key={option}
                    disabled
                  >
                    {option}
                  </button>
                ))}
              </fieldset>
              <ShopifyCheckoutButton variant={featuredVariant} />
            </>
          )}

          <p className="shop-note">
            {hasLiveProducts
              ? "Checkout is securely completed by Shopify."
              : "Set Shopify env vars in Vercel to enable live stock and checkout."}
          </p>
        </div>
      </section>

      <section className="shop-about" id="about-shop">
        <p className="eyebrow">The Loon & Pine way</p>
        <h2>Good materials invite you to make something.</h2>
      </section>
    </main>
  );
}
