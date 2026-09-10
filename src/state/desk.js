import { PAGE_ID_KEY } from "../Auth/storageKeys.js";

export const DESK = {
  operator: { name: "Admin", role: "Owner" },
  pages: [],
  leads: [],
  replied: [],
  orders: [],
  orderCounts: { pending: 0, accepted: 0, rejected: 0 },
  customers: [],
  products: [],
  complaints: [
    {
      id: "CP-08",
      pageId: "marzia",
      name: "Rina Akter",
      channel: "WhatsApp",
      text: "Order late, refund chai",
      category: "Delivery",
      at: "2026-09-08 09:12",
      status: "open",
    },
    {
      id: "CP-07",
      pageId: "techpoint",
      name: "Mahin Khan",
      channel: "Messenger",
      text: "Wrong color delivered",
      category: "Product",
      at: "2026-09-07 17:40",
      status: "open",
    },
    {
      id: "CP-04",
      pageId: "marzia",
      name: "Samiul Haque",
      channel: "WhatsApp",
      text: "Call korar por o confirm hoy nai",
      category: "Order",
      at: "2026-09-06 11:05",
      status: "resolved",
    },
  ],
};

export const DESK_STATE = {
  pageId: localStorage.getItem(PAGE_ID_KEY) || "all",
  orderTab: "pending",
  selectedOrderId: null,
  query: "",
};

window.DESK = DESK;
window.DESK_STATE = DESK_STATE;
