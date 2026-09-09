import { apiRequest } from "../API/http.js";
import { productRoutes } from "../ApiRoutes/routes.js";
import { normalizeProduct } from "../Utils/normalize.js";

export async function fetchProducts(pageId, q, pageName) {
  const res = await apiRequest(productRoutes.list(pageId, q));
  if (res.status === 401) return { auth: false, products: [] };
  if (!res.ok) return { auth: true, products: [] };
  const data = await res.json();
  const list = Array.isArray(data.products) ? data.products : [];
  return {
    auth: true,
    products: list.map((p) => normalizeProduct(p, pageId, pageName)),
  };
}
