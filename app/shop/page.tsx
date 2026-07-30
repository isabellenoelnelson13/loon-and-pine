"use client";

import { useMemo, useState } from "react";

const products = [
  {
    id: "fern-cotton",
    title: "Meadow Fern Cotton",
    collection: "Meadow Lane",
    price: 3.25,
    swatch: "fabric-yardage",
    detail: "100% quilting cotton · 44 in wide",
  },
  {
    id: "harvest-bundle",
    title: "Harvest Story Bundle",
    collection: "Loon & Pine edit",
    price: 18,
    swatch: "fabric-precuts",
    detail: "Six coordinating fat quarters",
  },
  {
    id: "patchwork-pouch",
    title: "Patchwork Zipper Pouch",
    collection: "Handmade goods",
    price: 28,
    swatch: "fabric-quilted",
    detail: "Small batch · one of a kind",
  },
  {
    id: "moss-thread",
    title: "Moss Green Thread Set",
    collection: "Sewing notions",
    price: 9,
    swatch: "fabric-moss",
    detail: "Three everyday shades for making",
  },
];

type BagItem = {
  id: string;
  title: string;
  variant: string;
  price: number;
};

export default function ShopPreview() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [variant, setVariant] = useState("Quarter yard");
  const [bagOpen, setBagOpen] = useState(false);

  const bagTotal = useMemo(
    () => bag.reduce((total, item) => total + item.price, 0),
    [bag],
  );

  function selectProduct(product: (typeof products)[number]) {
    setSelectedProduct(product);
    setVariant(product.id === "fern-cotton" ? "Quarter yard" : "One item");
  }

  function addToBag() {
    setBag((items) => [
      ...items,
      {
        id: `${selectedProduct.id}-${items.length}`,
        title: selectedProduct.title,
        variant,
        price: selectedProduct.price,
      },
    ]);
    setBagOpen(true);
  }

  return (
    <main className="shop-preview">
      <div className="preview-banner">
        Storefront preview · Sample products only · Your live site is unchanged
      </div>

      <header className="shop-header">
        <a className="wordmark" href="/" aria-label="Back to Loon and Pine home">
          <img src="/loon-and-pine-logo.png" alt="Loon & Pine" />
        </a>
        <nav aria-label="Shop navigation">
          <a href="#collection">Shop all</a>
          <a href="#about-shop">About</a>
          <a href="/">Home</a>
        </nav>
        <button className="bag-button" onClick={() => setBagOpen(true)}>
          Bag <span>{bag.length}</span>
        </button>
      </header>

      <section className="shop-hero">
        <div>
          <p className="eyebrow">The opening collection</p>
          <h1>Made for your next<br />favorite project.</h1>
          <p>
            Thoughtfully chosen fabric, useful sewing notions, and small-batch
            quilted goods for the joy of making.
          </p>
          <a className="button primary" href="#collection">Shop the collection</a>
        </div>
        <div className="shop-hero-art" aria-hidden="true">
          <img src="/loon-and-pine-logo-cream.png" alt="" />
          <span>Fabric · Notions · Handmade</span>
        </div>
      </section>

      <section className="shop-content" id="collection">
        <div className="shop-intro">
          <div>
            <p className="eyebrow">Featured finds</p>
            <h2>A small, lovely start.</h2>
          </div>
          <p>
            These are sample products for the storefront preview. In the real
            shop, everything here will be created and managed in Shopify.
          </p>
        </div>

        <div className="shop-grid">
          {products.map((product) => (
            <article className="shop-card" key={product.id}>
              <button
                className={`shop-swatch ${product.swatch}`}
                onClick={() => selectProduct(product)}
                aria-label={`View ${product.title}`}
              >
                <span>{product.collection}</span>
              </button>
              <p className="shop-card-type">{product.collection}</p>
              <h3>{product.title}</h3>
              <p>{product.detail}</p>
              <div className="shop-card-bottom">
                <strong>${product.price.toFixed(2)}</strong>
                <button className="shop-link" onClick={() => selectProduct(product)}>
                  View item <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="product-panel" aria-label="Selected product">
        <div className={`product-panel-art ${selectedProduct.swatch}`} aria-hidden="true" />
        <div className="product-panel-copy">
          <p className="eyebrow">{selectedProduct.collection}</p>
          <h2>{selectedProduct.title}</h2>
          <p>{selectedProduct.detail}</p>
          <p className="product-price">${selectedProduct.price.toFixed(2)}</p>
          {selectedProduct.id === "fern-cotton" && (
            <fieldset className="yardage-options">
              <legend>Cut size</legend>
              {["Quarter yard", "Half yard", "One yard"].map((option) => (
                <button
                  className={variant === option ? "selected" : ""}
                  key={option}
                  onClick={() => setVariant(option)}
                >
                  {option}
                </button>
              ))}
            </fieldset>
          )}
          <button className="button primary" onClick={addToBag}>Add to bag</button>
          <p className="shop-note">
            Preview interaction only. Shopify will handle real stock and checkout.
          </p>
        </div>
      </section>

      <section className="shop-about" id="about-shop">
        <p className="eyebrow">The Loon & Pine way</p>
        <h2>Good materials invite you to make something.</h2>
      </section>

      <aside className={`bag-drawer ${bagOpen ? "open" : ""}`} aria-label="Shopping bag">
        <button className="close-bag" onClick={() => setBagOpen(false)} aria-label="Close bag">×</button>
        <p className="eyebrow">Your bag</p>
        <h2>{bag.length ? "Saved for your next make." : "Your bag is waiting."}</h2>
        {bag.length === 0 ? (
          <p>Choose a sample item to see the storefront flow.</p>
        ) : (
          <div className="bag-items">
            {bag.map((item) => (
              <div className="bag-item" key={item.id}>
                <div><strong>{item.title}</strong><span>{item.variant}</span></div>
                <strong>${item.price.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
        <div className="bag-total"><span>Subtotal</span><strong>${bagTotal.toFixed(2)}</strong></div>
        <button className="button primary" disabled={!bag.length}>Checkout with Shopify</button>
        <p className="shop-note">This preview does not process payments.</p>
      </aside>
      {bagOpen && <button className="bag-backdrop" onClick={() => setBagOpen(false)} aria-label="Close bag" />}
    </main>
  );
}
