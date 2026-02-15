"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import { LoginFormValues } from "@repo/packages/shared/schemas/index";

export async function loginAction(data: LoginFormValues) {
  const res = await FetchWrapper(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data)
    },
    true
  );

  return res;
}
