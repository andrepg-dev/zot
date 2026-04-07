import { getPostHogClient } from "@/lib/posthog-server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const access_token = request.nextUrl.searchParams.get("access_token");
  const refresh_token = request.nextUrl.searchParams.get("refresh_token");

  if (!access_token || !refresh_token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", access_token, {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  cookieStore.set("refresh_token", refresh_token, {
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 seven days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  const posthog = getPostHogClient();
  const distinctId = request.nextUrl.searchParams.get("distinct_id") ?? access_token.slice(0, 16);

  posthog.capture({
    distinctId,
    event: "oauth_login_completed",
    properties: { method: "oauth" },
  });

  return NextResponse.redirect(new URL("/app/dashboard", request.url));
}
