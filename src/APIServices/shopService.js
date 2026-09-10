import { apiRequest } from "../API/http.js";
import { customerRoutes, orderRoutes } from "../ApiRoutes/routes.js";

async function fetchList(path, listKey) {
  const res = await apiRequest(path);
  if (res.status === 401) return { auth: false, items: [] };
  if (!res.ok) return { auth: true, items: [] };
  const data = await res.json();
  const list = Array.isArray(data[listKey]) ? data[listKey] : [];
  return { auth: true, items: list };
}

export function fetchOrders(pageId, q, status = "") {
  return fetchList(orderRoutes.list(pageId, q, status), "orders");
}

export function fetchCustomers(pageId, q) {
  return fetchList(customerRoutes.list(pageId, q), "customers");
}
