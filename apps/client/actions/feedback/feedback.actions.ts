"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { FeedbackResponse } from "@repo/packages/shared/schemas";

export async function submitFeedback(formData: FormData) {
  return await FetchWrapper<FeedbackResponse>("/feedback", {
    method: "POST",
    body: formData
  });
}
