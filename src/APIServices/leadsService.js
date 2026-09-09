import { apiRequest } from "../API/http.js";
import { leadRoutes } from "../ApiRoutes/routes.js";

export async function fetchList(path, listKey) {
  const res = await apiRequest(path);
  if (res.status === 401) return { auth: false, items: [] };
  if (!res.ok) return { auth: true, items: [] };
  const data = await res.json();
  const list = Array.isArray(data[listKey]) ? data[listKey] : [];
  return { auth: true, items: list };
}

export function fetchLeads(pageId, q) {
  return fetchList(leadRoutes.list(pageId, q), "leads");
}

export function fetchReplied(pageId, q) {
  return fetchList(leadRoutes.replied(pageId, q), "replied");
}
