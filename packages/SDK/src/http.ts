import { ZotAPIError } from "./types";

export interface RequestOptions {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  query?: Record<string, string>;
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async request<T>(opts: RequestOptions): Promise<T> {
    const url = new URL(opts.path, this.baseUrl);

    if (opts.query) {
      for (const [key, value] of Object.entries(opts.query)) {
        if (value !== undefined) url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url.toString(), {
      method: opts.method,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => response.statusText);
      throw new ZotAPIError(response.status, body);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
}
