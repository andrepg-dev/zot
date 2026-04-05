"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { ReactToHtmlResponse, ReactToHtmlValues } from "@repo/packages/shared/schemas";

export async function reactToHtml(data: ReactToHtmlValues) {
  return await FetchWrapper<ReactToHtmlResponse>("/react2html", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
