"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCart } from "../../lib/shopify";

export async function beginCheckout(formData: FormData) {
  const variantId = formData.get("variantId");

  if (typeof variantId !== "string" || !variantId) {
    throw new Error("A product variant is required to start checkout.");
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const buyerIp = forwardedFor?.split(",")[0]?.trim();
  const checkoutUrl = await createCart(variantId, buyerIp);

  redirect(checkoutUrl);
}
