export function normalizePages(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload.pages)
      ? payload.pages
      : payload && (payload.pageId || payload.id)
        ? [payload]
        : [];
  return list
    .map((p) => {
      const pageId = String(p.pageId || p.id || "");
      return {
        id: pageId,
        pageId,
        name: p.name || pageId || "Untitled",
        handle: p.handle || "",
      };
    })
    .filter((p) => p.id);
}

export function normalizeProduct(p, pageId, pageName) {
  return {
    name: p.name || "",
    sku: p.sku || "",
    category: p.category || "",
    description: p.description || "",
    price: p.price,
    floor_price: p.floor_price,
    maximum_discount: p.maximum_discount || "",
    stock: p.stock || "",
    pageId,
    pages: pageName || "",
  };
}

export function normalizeLead(row) {
  return {
    id: row.id || "",
    pageId: String(row.pageId || ""),
    name: row.name || "",
    channel: row.channel || "",
    message: row.message || "",
    reply: row.reply || "",
    product: row.product || "",
    comment_ref: row.comment_ref || "",
    at: row.at || "",
    status: row.status || "new",
  };
}

export function normalizeReplied(row) {
  return {
    id: row.id || "",
    pageId: String(row.pageId || ""),
    name: row.name || "",
    channel: row.channel || "",
    message: row.message || "",
    reply: row.reply || "",
    product: row.product || "",
    comment_ref: row.comment_ref || "",
    repliedAt: row.repliedAt || "",
    order: row.order || "None",
  };
}
