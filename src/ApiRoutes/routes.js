export const authRoutes = {
  login: "/auth/login",
  me: "/auth/me",
};

export const pageRoutes = {
  list: "/pages",
  byId: (pageId) => "/pages?pageId=" + encodeURIComponent(pageId),
};

export const productRoutes = {
  list: (pageId, q = "") =>
    "/products?pageId=" +
    encodeURIComponent(pageId) +
    "&q=" +
    encodeURIComponent(q || ""),
};

export const leadRoutes = {
  list: (pageId, q = "") =>
    "/leads?pageId=" +
    encodeURIComponent(pageId) +
    "&q=" +
    encodeURIComponent(q || ""),
  replied: (pageId, q = "") =>
    "/replied?pageId=" +
    encodeURIComponent(pageId) +
    "&q=" +
    encodeURIComponent(q || ""),
};

export const orderRoutes = {
  list: (pageId, q = "", status = "") =>
    "/orders?pageId=" +
    encodeURIComponent(pageId) +
    "&status=" +
    encodeURIComponent(status || "") +
    "&q=" +
    encodeURIComponent(q || ""),
};

export const customerRoutes = {
  list: (pageId, q = "") =>
    "/customers?pageId=" +
    encodeURIComponent(pageId) +
    "&q=" +
    encodeURIComponent(q || ""),
};
