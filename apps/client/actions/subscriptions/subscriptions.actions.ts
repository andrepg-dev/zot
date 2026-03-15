"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  CreateCheckoutSessionValues,
  CheckoutSessionResponse,
} from "@repo/packages/shared/schemas";

export async function createCheckoutSession(data: CreateCheckoutSessionValues) {
  return await FetchWrapper<CheckoutSessionResponse>("/subscriptions/checkout-session", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
