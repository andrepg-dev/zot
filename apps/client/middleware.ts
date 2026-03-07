import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();

  const extract_refresh_token = cookieStore.get("refresh_token");

  const refresh_token_value = extract_refresh_token?.value;

  const tokensExists = refresh_token_value;

  if (pathname === "/login" && tokensExists) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  if (pathname !== "/login" && !tokensExists) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/app/:path*", "/login"]
};
