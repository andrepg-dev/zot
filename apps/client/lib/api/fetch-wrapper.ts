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

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include"
  });

  // if (res.status === 401) {
  //   // Use the refresh token
  //   return;
  // }

  if (!res.ok) {
    const errorResponse = await res.json().catch((e) => console.log({ e }));
    throw new ApiError(res.status, errorResponse.message ?? "Unexpected error", errorResponse);
  }

  if (isLogging) {
    const cookie = res.headers.get("set-cookie") ?? "";
    const access_token = getCookie("access_token", cookie) ?? "";
    cookieStore.set("access_token", access_token, { path: "/", maxAge: 3600 });
  }

  return await res.json();
}

function getCookie(name: string, cookies: string) {
  var nameEQ = name + "=";
  var ca = cookies.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
