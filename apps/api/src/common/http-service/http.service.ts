import { Injectable } from "@nestjs/common";

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface HttpResponse<T = unknown> {
  status: number;
  statusText: string;
  data: T;
  headers: Headers;
}

@Injectable()
export class HttpService {
  private async request<T = unknown>(
    url: string,
    init: RequestInit & { timeout?: number },
  ): Promise<HttpResponse<T>> {
    const { timeout, ...fetchInit } = init;
    const controller = new AbortController();
    const timeoutId = timeout != null ? setTimeout(() => controller.abort(), timeout) : undefined;

    const hasBody = fetchInit.body != null && fetchInit.body !== "";
    const customHeaders =
      typeof fetchInit.headers === "object" && !(fetchInit.headers instanceof Headers)
        ? (fetchInit.headers as Record<string, string>)
        : {};

    try {
      const response = await fetch(url, {
        ...fetchInit,
        signal: init.signal ?? controller.signal,
        headers: {
          ...(hasBody && { "Content-Type": "application/json" }),
          ...customHeaders,
        },
      });

      const data = (await response.json().catch(() => ({}))) as T;
      return {
        status: response.status,
        statusText: response.statusText,
        data,
        headers: response.headers,
      };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "GET",
      signal: config?.signal,
      timeout: config?.timeout,
      headers: config?.headers,
    });
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: body != null ? JSON.stringify(body) : undefined,
      signal: config?.signal,
      timeout: config?.timeout,
      headers: config?.headers,
    });
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: body != null ? JSON.stringify(body) : undefined,
      signal: config?.signal,
      timeout: config?.timeout,
      headers: config?.headers,
    });
  }

  async patch<T = unknown>(
    url: string,
    body?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "PATCH",
      body: body != null ? JSON.stringify(body) : undefined,
      signal: config?.signal,
      timeout: config?.timeout,
      headers: config?.headers,
    });
  }

  async delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "DELETE",
      signal: config?.signal,
      timeout: config?.timeout,
      headers: config?.headers,
    });
  }
}
