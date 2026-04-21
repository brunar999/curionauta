import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Generic API fetch helper
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const isWrite = options?.method && options.method !== "GET";
  const res = await fetch(url, {
    headers: isWrite ? { "Content-Type": "application/json" } : {},
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }
  return res.json().catch(() => ({}) as T);
}
