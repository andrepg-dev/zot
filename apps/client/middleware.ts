import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();
  const extract_access_token = cookieStore.get("access_token");
  const access_token_value = extract_access_token?.value;

  if (pathname === "/login" && access_token_value) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  if (!access_token_value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/app/:path*", "/login"]
};
