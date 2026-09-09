import { apiRequest } from "../API/http.js";
import { pageRoutes } from "../ApiRoutes/routes.js";
import { normalizePages } from "../Utils/normalize.js";

export async function fetchPages() {
  const res = await apiRequest(pageRoutes.list);
  if (res.status === 401) return { auth: false, pages: [] };
  if (!res.ok) return { auth: true, pages: [] };
  return { auth: true, pages: normalizePages(await res.json()) };
}

export async function fetchPageById(pageId) {
  if (!pageId || pageId === "all") return null;
  const res = await apiRequest(pageRoutes.byId(pageId));
  if (!res.ok) return null;
  return normalizePages(await res.json())[0] || null;
}
