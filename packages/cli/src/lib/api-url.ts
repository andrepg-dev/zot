const DEFAULT_API_URL = "https://api.zot.so/v1";

export function resolveApiUrl(): string {
  const fromEnv = process.env.ZOT_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_API_URL;
  return url.replace(/\/$/, "");
}
