"use server";

import { submitWaitlistSchema, SubmitWaitListValues } from "@repo/packages/shared/schemas/index";

export async function submitWaitListAction(data: SubmitWaitListValues) {
  const result = submitWaitlistSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.message ?? "Something went wrong");
  }

  return { success: true, data: result.data };
}
