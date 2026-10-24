import type { CategoryPage, CategorySummary, EnquiryInput, Product } from "./types";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const body: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

/** The only module that knows the API's shape. Pages and components depend on this, not on fetch. */
export const api = {
  featured: () => request<{ items: Product[] }>("/featured").then((r) => r.items),
  categories: () => request<{ items: CategorySummary[] }>("/categories").then((r) => r.items),
  category: (slug: string) => request<CategoryPage>(`/categories/${encodeURIComponent(slug)}`),
  search: (q: string) =>
    request<{ items: Product[] }>(`/search?q=${encodeURIComponent(q)}`).then((r) => r.items),
  product: (id: number) => request<Product>(`/products/${id}`),
  enquire: (input: EnquiryInput) =>
    request<{ message: string }>("/enquiries", { method: "POST", body: JSON.stringify(input) }),
};
