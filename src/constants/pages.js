export const PAGE_META = {
  overview: { title: "Overview", sub: "Snapshot for the selected page" },
  leads: { title: "Leads", sub: "People who have not been replied to yet" },
  replied: { title: "Replied", sub: "Conversations already answered, with time" },
  orders: { title: "Order confirmation", sub: "Call the customer, then accept or reject" },
  customers: { title: "Customers", sub: "People who messaged or ordered" },
  products: { title: "Products", sub: "Catalog used in auto-replies" },
  complaints: { title: "Complaints", sub: "Issues flagged from WhatsApp or Messenger" },
  settings: { title: "Settings", sub: "Pages, store, and how this desk works" },
};

export const NAV = [
  { group: "Inbox", items: [
    { to: "/overview", id: "overview", label: "Overview" },
    { to: "/leads", id: "leads", label: "Leads", count: "leads" },
    { to: "/replied", id: "replied", label: "Replied" },
  ]},
  { group: "Sales", items: [
    { to: "/orders", id: "orders", label: "Orders", count: "pending" },
    { to: "/customers", id: "customers", label: "Customers" },
    { to: "/products", id: "products", label: "Products" },
  ]},
  { group: "Support", items: [
    { to: "/complaints", id: "complaints", label: "Complaints" },
    { to: "/settings", id: "settings", label: "Settings" },
  ]},
];

export const API_SEARCH_PAGES = ["overview", "leads", "replied", "products", "orders", "customers"];
