import { DESK, DESK_STATE } from "../state/desk.js";
import { clearSession } from "../Auth/session.js";
import { PAGE_ID_KEY } from "../Auth/storageKeys.js";
import { fetchPageById, fetchPages } from "./pagesService.js";
import { fetchProducts } from "./productsService.js";
import { fetchLeads, fetchReplied } from "./leadsService.js";
import { fetchCustomers, fetchOrders } from "./shopService.js";
import { normalizeCustomer, normalizeLead, normalizeOrder, normalizeReplied } from "../Utils/normalize.js";

export function pageName(id) {
  const found = DESK.pages.find((p) => p.id === id || p.pageId === id);
  return found ? found.name : "—";
}

export function currentPageId() {
  return DESK_STATE.pageId;
}

function pageIdsForApi() {
  const pageId = currentPageId();
  return pageId === "all"
    ? DESK.pages.map((p) => p.id).filter(Boolean)
    : pageId
      ? [pageId]
      : [];
}

function syncSelectedPage() {
  const saved = DESK_STATE.pageId;
  const ids = DESK.pages.map((p) => p.id);
  if (saved === "all" || ids.includes(saved)) return;
  DESK_STATE.pageId = ids[0] || "all";
  localStorage.setItem(PAGE_ID_KEY, DESK_STATE.pageId);
}

export async function loadPages() {
  try {
    const result = await fetchPages();
    if (result.auth === false) {
      clearSession();
      return false;
    }
    DESK.pages = result.pages;
    syncSelectedPage();
    return true;
  } catch {
    DESK.pages = [];
    return true;
  }
}

export async function loadPageById(pageId) {
  const page = await fetchPageById(pageId);
  if (!page) return null;
  const i = DESK.pages.findIndex((p) => p.id === page.id);
  if (i >= 0) DESK.pages[i] = page;
  else DESK.pages.push(page);
  return page;
}

async function loadAcrossPages(fetchOne, assign, normalize, q) {
  const query = q != null ? q : (DESK_STATE.query || "").trim();
  const ids = pageIdsForApi();
  if (!ids.length) {
    assign([]);
    return true;
  }
  try {
    const results = await Promise.all(ids.map((id) => fetchOne(id, query)));
    if (results.some((r) => r.auth === false)) {
      clearSession();
      return false;
    }
    assign(results.flatMap((r) => r.items || r.products || []).map(normalize));
    return true;
  } catch (err) {
    console.error("loadAcrossPages failed", err);
    assign([]);
    return true;
  }
}

export function loadLeads(q) {
  const query = q != null ? q : (DESK_STATE.query || "").trim();
  return loadAcrossPages(
    (id, queryText) => fetchLeads(id, queryText),
    (rows) => {
      DESK.leads = rows;
    },
    normalizeLead,
    query
  );
}

export function loadReplied(q) {
  const query = q != null ? q : (DESK_STATE.query || "").trim();
  return loadAcrossPages(
    (id, queryText) => fetchReplied(id, queryText),
    (rows) => {
      DESK.replied = rows;
    },
    normalizeReplied,
    query
  );
}

function tallyOrders(rows) {
  return {
    pending: rows.filter((o) => o.status === "pending").length,
    accepted: rows.filter((o) => o.status === "accepted").length,
    rejected: rows.filter((o) => o.status === "rejected").length,
  };
}

export function orderStatusParam(tab = DESK_STATE.orderTab) {
  return tab === "all" ? "" : tab;
}

export async function loadOrders(status, q) {
  const query = q != null ? q : (DESK_STATE.query || "").trim();
  const statusParam = status == null ? orderStatusParam() : status;
  const ids = pageIdsForApi();
  if (!ids.length) {
    DESK.orders = [];
    if (!statusParam && !query) DESK.orderCounts = tallyOrders([]);
    return true;
  }
  try {
    const results = await Promise.all(
      ids.map((id) => fetchOrders(id, query, statusParam))
    );
    if (results.some((r) => r.auth === false)) {
      clearSession();
      return false;
    }
    const rows = results.flatMap((r) => r.items || []).map(normalizeOrder);
    DESK.orders = rows;
    if (!statusParam && !query) DESK.orderCounts = tallyOrders(rows);
    return true;
  } catch (err) {
    console.error("loadOrders failed", err);
    DESK.orders = [];
    return true;
  }
}

export async function loadOrderCounts() {
  const ids = pageIdsForApi();
  if (!ids.length) {
    DESK.orderCounts = tallyOrders([]);
    return true;
  }
  try {
    const results = await Promise.all(ids.map((id) => fetchOrders(id, "", "")));
    if (results.some((r) => r.auth === false)) {
      clearSession();
      return false;
    }
    DESK.orderCounts = tallyOrders(
      results.flatMap((r) => r.items || []).map(normalizeOrder)
    );
    return true;
  } catch (err) {
    console.error("loadOrderCounts failed", err);
    return true;
  }
}

export async function loadCustomers(q) {
  const query = q != null ? q : (DESK_STATE.query || "").trim();
  return loadAcrossPages(
    (id, queryText) => fetchCustomers(id, queryText),
    (rows) => {
      DESK.customers = rows;
    },
    normalizeCustomer,
    query
  );
}

export async function loadProducts() {
  const q = (DESK_STATE.query || "").trim();
  const ids = pageIdsForApi();
  if (!ids.length) {
    DESK.products = [];
    return true;
  }
  try {
    const results = await Promise.all(
      ids.map((id) => fetchProducts(id, q, pageName(id)))
    );
    if (results.some((r) => r.auth === false)) {
      clearSession();
      return false;
    }
    DESK.products = results.flatMap((r) => r.products);
    return true;
  } catch {
    DESK.products = [];
    return true;
  }
}
