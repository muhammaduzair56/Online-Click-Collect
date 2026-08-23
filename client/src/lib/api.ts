/*
  Online Click & Collect — FastAPI contract adapter.
  The Vercel frontend talks to a separate FastAPI service through VITE_FASTAPI_URL.
*/

export type Product = { id: string; name: string; category: string; price: number; stock: number; image_url?: string; is_active: boolean };
export type Order = { id: string; customer_name: string; phone: string; total: number; status: string; created_at: string };
export type Review = { order_number: string; rating: number; text: string };

const API_BASE = (import.meta.env.VITE_FASTAPI_URL || "").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("FastAPI is not connected yet. Add VITE_FASTAPI_URL to the Vercel environment variables.");
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, credentials: "include" });
  if (!response.ok) throw new Error((await response.text()) || `Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export const fastApi = {
  get isConfigured() { return Boolean(API_BASE); },
  get products() { return request<Product[]>("/api/products"); },
  createProduct: (payload: Omit<Product, "id" | "is_active">) => request<Product>("/api/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id: string, payload: Partial<Product>) => request<Product>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  get orders() { return request<Order[]>("/api/orders"); },
  updateOrder: (id: string, status: string) => request<Order>(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  submitReview: (payload: Review) => request<{ ok: boolean }>("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
};
