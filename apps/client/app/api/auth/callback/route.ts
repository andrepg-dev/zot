import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const access_token = request.nextUrl.searchParams.get("access_token");

  if (!access_token) {
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

  return NextResponse.redirect(new URL("/app/dashboard", request.url));
}
