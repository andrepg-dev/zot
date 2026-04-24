import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const cookieStore = await cookies();

  const extract_refresh_token = cookieStore.get("refresh_token");

  const refresh_token_value = extract_refresh_token?.value;

  const tokensExists = refresh_token_value;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isAuthRoute && tokensExists) {
    const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
    return NextResponse.redirect(new URL(returnTo ?? "/app/dashboard", request.url));
  }

  if (!isAuthRoute && !tokensExists) {
    const url = new URL("/login", request.url);
    const target = `${pathname}${search}`;
    if (target && target !== "/") url.searchParams.set("returnTo", target);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function safeReturnTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/app/:path*", "/login", "/signup"]
};
