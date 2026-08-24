/*
  Online Click & Collect — FastAPI contract adapter.
  The Vercel frontend talks to a separate FastAPI service through VITE_FASTAPI_URL.
*/

export type Product = { id: string; name: string; category: string; price: number; stock: number; image_url?: string; is_active: boolean };
export type Order = { id: string; customer_name: string; phone: string; total: number; status: string; created_at: string };
export type Review = { order_number: string; rating: number; text: string };
export type Address = { id: string; label: string; recipient_name: string; phone: string; city: string; address_line: string; landmark?: string; is_default: boolean };
export type GalleryImage = { id: string; url: string; alt?: string; sort_order: number };

const API_BASE = (import.meta.env.VITE_FASTAPI_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "occ_access_token";

export const auth = {
  get token() { return localStorage.getItem(TOKEN_KEY); },
  setToken(token: string) { localStorage.setItem(TOKEN_KEY, token); },
  clear() { localStorage.removeItem(TOKEN_KEY); },
};

let sessionRedirecting = false;

function handleSessionExpiry() {
  auth.clear();
  if (typeof window !== "undefined" && !sessionRedirecting && !["/login", "/signup"].includes(window.location.pathname)) {
    sessionRedirecting = true;
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/login?next=${encodeURIComponent(next)}`);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("FastAPI is not connected yet. Add VITE_FASTAPI_URL to the Vercel environment variables.");
  const token = auth.token;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options?.headers || {}) }, credentials: "include" });
  if (response.status === 401) { handleSessionExpiry(); throw new Error("Your session expired. Please sign in again."); }
  if (!response.ok) throw new Error((await response.text()) || `Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export const fastApi = {
  login: async (email: string, password: string) => { const data = await request<{ access_token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); auth.setToken(data.access_token); return data; },
  signup: async (name: string, email: string, password: string) => { const data = await request<{ access_token: string }>("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }); auth.setToken(data.access_token); return data; },
  logout: () => auth.clear(),
  get isConfigured() { return Boolean(API_BASE); },
  get products() { return request<Product[]>("/api/products"); },
  getProduct: (id: string) => request<Product>(`/api/products/${id}`),
  get favorites() { return request<string[]>("/api/me/favorites"); },
  syncFavorites: (productIds: string[]) => request<{ ok: boolean }>("/api/me/favorites", { method: "PUT", body: JSON.stringify({ product_ids: productIds }) }),
  createProduct: (payload: Omit<Product, "id" | "is_active">) => request<Product>("/api/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id: string, payload: Partial<Product>) => request<Product>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  getProductGallery: (id: string) => request<GalleryImage[]>(`/api/products/${id}/gallery`),
  uploadProductImage: async (id: string, file: File) => { if (!API_BASE) throw new Error("FastAPI is not connected yet."); const body = new FormData(); body.append("file", file); const response = await fetch(`${API_BASE}/api/products/${id}/gallery`, { method: "POST", body, headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {}, credentials: "include" }); if (!response.ok) throw new Error((await response.text()) || "Image upload failed"); return response.json() as Promise<GalleryImage>; },
  deleteProductImage: (productId: string, imageId: string) => request<{ ok: boolean }>(`/api/products/${productId}/gallery/${imageId}`, { method: "DELETE" }),
  reorderProductGallery: (productId: string, imageIds: string[]) => request<GalleryImage[]>(`/api/products/${productId}/gallery/reorder`, { method: "PUT", body: JSON.stringify({ image_ids: imageIds }) }),
  get orders() { return request<Order[]>("/api/orders"); },
  get myOrders() { return request<Order[]>("/api/me/orders"); },
  trackOrder: (orderId: string) => request<Order>(`/api/orders/${encodeURIComponent(orderId.trim())}/tracking`),
  get myAddresses() { return request<Address[]>("/api/me/addresses"); },
  saveAddress: (payload: Omit<Address, "id">) => request<Address>("/api/me/addresses", { method: "POST", body: JSON.stringify(payload) }),
  deleteAddress: (id: string) => request<{ ok: boolean }>(`/api/me/addresses/${id}`, { method: "DELETE" }),
  updateOrder: (id: string, status: string) => request<Order>(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getRecommendations: () => request<Product[]>("/api/me/recommendations"),
  submitReview: (payload: Review) => request<{ ok: boolean }>("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
};
