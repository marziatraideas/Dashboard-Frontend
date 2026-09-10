export function money(n) {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : Number(String(n).replace(/[৳\s,]/g, ""));
  if (!Number.isFinite(num)) return "৳" + String(n);
  return "৳" + num.toLocaleString("en-BD");
}

export function dash(value) {
  const text = value == null ? "" : String(value).trim();
  return text || "—";
}

export function inPage(row, pageId) {
  return pageId === "all" || row.pageId === pageId;
}

export function filtered(list, pageId, query) {
  const q = (query || "").trim().toLowerCase();
  let rows = list.filter((row) => inPage(row, pageId));
  if (!q) return rows;
  return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
}

export function counts(desk, pageId) {
  const leads = desk.leads.filter((row) => inPage(row, pageId));
  const replied = desk.replied.filter((row) => inPage(row, pageId));
  const orders = desk.orders.filter((row) => inPage(row, pageId));
  const oc = desk.orderCounts || {};
  return {
    leads: leads.filter((l) => l.status === "new").length,
    failed: leads.filter((l) => l.status === "failed").length,
    replied: replied.length,
    pending: oc.pending ?? orders.filter((o) => o.status === "pending").length,
    accepted: oc.accepted ?? orders.filter((o) => o.status === "accepted").length,
    rejected: oc.rejected ?? orders.filter((o) => o.status === "rejected").length,
  };
}
