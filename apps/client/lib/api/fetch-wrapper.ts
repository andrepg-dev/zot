export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    data: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function FetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
  isLogging: boolean = false
): Promise<T> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const headers: any = {
    ...options.headers
  };

  if (options.method === "POST") {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers["Cookie"] = `access_token=${accessToken}`;
  }

  let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include"
  });

  // try to get the refresh token and try one time to make the fetch again
  if (res.status === 401) {
    const refreshHeaders = { ...headers };
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (refreshToken) {
      refreshHeaders["Cookie"] = `access_token=${accessToken}; refresh_token=${refreshToken}`;
    }

    const RefreshTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
      {
        ...options,
        headers: refreshHeaders,
        credentials: "include"
      }
    );

    if (RefreshTokenResponse.ok) {
      const setCookie = RefreshTokenResponse.headers.get("set-cookie") ?? "";
      const newAccessToken = getCookie("access_token", setCookie);
      const newRefreshToken = getCookie("refresh_token", setCookie);

      if (newAccessToken) {
        cookieStore.set("access_token", newAccessToken, { path: "/", maxAge: 3600 });
        headers["Cookie"] = `access_token=${newAccessToken}`;
      }
      if (newRefreshToken) {
        cookieStore.set("refresh_token", newRefreshToken, { path: "/", maxAge: 7 * 24 * 60 * 60 });
      }

      res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include"
      });
    }
  }

  if (!res.ok) {
    const errorResponse = await res.json().catch((e) => console.log({ e }));
    throw new ApiError(res.status, errorResponse.message ?? "Unexpected error", errorResponse);
  }

  // This only works using the login/register local method
  if (isLogging) {
    const cookie = res.headers.get("set-cookie") ?? "";

    const access_token = getCookie("access_token", cookie) ?? "";
    const refresh_token = getCookie("refresh_token", cookie) ?? "";

    cookieStore.set("access_token", access_token, { path: "/", maxAge: 3600 });
    cookieStore.set("refresh_token", refresh_token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
  }

  return await res.json();
}

function getCookie(name: string, cookies: string) {
  const nameEQ = name + "=";
  const cookieParts = cookies.split(",");

  for (const part of cookieParts) {
    const segments = part.split(";");

    for (let seg of segments) {
      seg = seg.trim();
      if (seg.startsWith(nameEQ)) {
        return seg.substring(nameEQ.length);
      }
    }
  }

  return null;
}
