type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  featuredImage: ShopifyImage | null;
  variants: ShopifyVariant[];
};

type ShopifyProductNode = Omit<ShopifyProduct, "variants"> & {
  variants: {
    nodes: ShopifyVariant[];
  };
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type ShopifyConfig = {
  domain: string;
  token: string;
  tokenHeader: "Shopify-Storefront-Private-Token" | "X-Shopify-Storefront-Access-Token";
  version: string;
};

export type ShopifyProductsResult = {
  configured: boolean;
  products: ShopifyProduct[];
  error?: string;
};

function normalizeDomain(domain: string) {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

function getConfig(): ShopifyConfig | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";

  if (!domain || (!privateToken && !publicToken)) {
    return null;
  }

  return {
    domain: normalizeDomain(domain),
    token: privateToken || publicToken || "",
    tokenHeader: privateToken
      ? "Shopify-Storefront-Private-Token"
      : "X-Shopify-Storefront-Access-Token",
    version,
  };
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  buyerIp?: string,
) {
  const config = getConfig();

  if (!config) {
    throw new Error("Shopify storefront environment variables are not configured.");
  }

  const response = await fetch(
    `https://${config.domain}/api/${config.version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [config.tokenHeader]: config.token,
        ...(buyerIp && config.tokenHeader === "Shopify-Storefront-Private-Token"
          ? { "Shopify-Storefront-Buyer-IP": buyerIp }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (payload.errors?.length || !payload.data) {
    throw new Error(
      payload.errors?.map((error) => error.message).join(" ") ||
        "Shopify returned no data.",
    );
  }

  return payload.data;
}

export async function getProducts(): Promise<ShopifyProductsResult> {
  if (!getConfig()) {
    return { configured: false, products: [] };
  }

  try {
    const data = await shopifyFetch<{
      products: { nodes: ShopifyProductNode[] };
    }>(
      `
        query GetProducts($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
              handle
              description
              productType
              featuredImage {
                url
                altText
                width
                height
              }
              variants(first: 20) {
                nodes {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `,
      { first: 24 },
    );

    return {
      configured: true,
      products: data.products.nodes.map((product) => ({
        ...product,
        variants: product.variants.nodes,
      })),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load Shopify products.";
    console.error("Shopify product sync failed:", message);

    return { configured: true, products: [], error: message };
  }
}

export async function createCart(variantId: string, buyerIp?: string) {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { checkoutUrl: string } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(
    `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
    },
    buyerIp,
  );

  const { cart, userErrors } = data.cartCreate;

  if (!cart || userErrors.length) {
    throw new Error(
      userErrors.map((error) => error.message).join(" ") ||
        "Unable to create a Shopify cart.",
    );
  }

  return cart.checkoutUrl;
}
