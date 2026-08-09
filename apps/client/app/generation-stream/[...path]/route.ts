import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Same-origin proxy for the generation SSE streams.
 *
 * The auth cookies are set on this app's own domain, so a browser request
 * straight to the API host never carries them. Every other call solves this in
 * FetchWrapper by reading the cookie server side and forwarding it; a stream
 * cannot go through FetchWrapper because the UI needs the events as they
 * arrive, so it proxies through here instead and the body is piped back
 * untouched.
 *
 * This deliberately sits outside /api. next.config.js rewrites /api/:path* to
 * the backend, and an array-form rewrite is applied after static files but
 * before dynamic routes, so a catch-all route under /api would be shadowed.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cookieHeader = [
    `access_token=${accessToken}`,
    refreshToken ? `refresh_token=${refreshToken}` : null
  ]
    .filter(Boolean)
    .join("; ");

  const body = await request.text();

  const upstream = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/generation/${path.join("/")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Cookie: cookieHeader
      },
      body: body || "{}",
      // Node buffers a streamed response by default; opt out so events reach
      // the browser as the backend emits them.
      cache: "no-store",
      // @ts-expect-error duplex is required by Node fetch for streaming bodies
      duplex: "half"
    }
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");

    return NextResponse.json(
      { message: detail || `Generation request failed (${upstream.status})` },
      { status: upstream.status }
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Disable proxy buffering so the stream is not held back.
      "X-Accel-Buffering": "no"
    }
  });
}
