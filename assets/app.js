(function () {
  const ICONS = {
    overview:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    leads:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16M4 12h10M4 19h16"/><circle cx="18" cy="12" r="2"/></svg>',
    replied:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H5l2.2-2.4A8.5 8.5 0 1 1 21 12Z"/></svg>',
    orders:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 7h13l-1.4 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.6L6 4H3"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    customers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.2"/><path d="M16 19c.3-2.2 1.7-4 4.2-4.6"/></svg>',
    products:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z"/><path d="M3 8.5v7L12 20l9-4.5v-7"/><path d="M12 13v7"/></svg>',
    complaints:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 4.7 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
  };

  const PAGES = {
    overview: { title: "Overview", sub: "Snapshot for the selected page" },
    leads: { title: "Leads", sub: "People who have not been replied to yet" },
    replied: { title: "Replied", sub: "Conversations already answered, with time" },
    orders: { title: "Order confirmation", sub: "Call the customer, then accept or reject" },
    customers: { title: "Customers", sub: "People who messaged or ordered" },
    products: { title: "Products", sub: "Catalog used in auto-replies" },
    complaints: { title: "Complaints", sub: "Issues flagged from WhatsApp or Messenger" },
    settings: { title: "Settings", sub: "Pages, store, and how this desk works" },
  };

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function money(n) {
    return "৳" + Number(n).toLocaleString("en-BD");
  }

  function pageName(id) {
    const found = DESK.pages.find((p) => p.id === id);
    return found ? found.name : "—";
  }

  function currentPageId() {
    return DESK_STATE.pageId;
  }

  function inPage(row) {
    const id = currentPageId();
    return id === "all" || row.pageId === id;
  }

  function filtered(list) {
    const q = (DESK_STATE.query || "").trim().toLowerCase();
    let rows = list.filter(inPage);
    if (!q) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }

  function counts() {
    const leads = DESK.leads.filter(inPage);
    const replied = DESK.replied.filter(inPage);
    const orders = DESK.orders.filter(inPage);
    return {
      leads: leads.filter((l) => l.status === "new").length,
      failed: leads.filter((l) => l.status === "failed").length,
      replied: replied.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    };
  }

  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1600);
  }

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      toast(label + " copied");
    } catch {
      toast("Copy failed");
    }
  }

  function badgeStatus(status) {
    const map = {
      new: ["b-new", "New"],
      failed: ["b-failed", "Failed"],
      replied: ["b-replied", "Replied"],
      pending: ["b-pending", "Pending"],
      accepted: ["b-accepted", "Accepted"],
      rejected: ["b-rejected", "Rejected"],
      open: ["b-open", "Open"],
      resolved: ["b-replied", "Resolved"],
      connected: ["b-replied", "Connected"],
      None: ["b-channel", "No order"],
      Pending: ["b-pending", "Pending"],
      Accepted: ["b-accepted", "Accepted"],
      Rejected: ["b-rejected", "Rejected"],
    };
    const [cls, label] = map[status] || ["b-channel", status];
    return `<span class="badge ${cls}">${esc(label)}</span>`;
  }

  function pageSelect() {
    const id = currentPageId();
    const opts = [`<option value="all"${id === "all" ? " selected" : ""}>All pages</option>`]
      .concat(
        DESK.pages.map(
          (p) =>
            `<option value="${esc(p.id)}"${id === p.id ? " selected" : ""}>${esc(p.name)}</option>`
        )
      )
      .join("");
    return `<div class="page-switch"><select id="page-switch">${opts}</select></div>`;
  }

  function navItem(id, href, icon, label, count) {
    const active = document.body.dataset.page === id ? " active" : "";
    const extra = id === "orders" ? " orders-link" : "";
    const badge = count != null ? `<span class="count">${count}</span>` : "";
    return `<a class="${extra}${active}" href="${href}">${ICONS[icon]}<span>${label}</span>${badge}</a>`;
  }

  function shell(inner, extras) {
    const c = counts();
    const page = PAGES[document.body.dataset.page] || { title: "", sub: "" };
    return `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">D</div>
          <div><strong>Desk</strong><span>Page management</span></div>
        </div>
        ${pageSelect()}
        <nav class="nav">
          <div class="nav-label">Inbox</div>
          ${navItem("overview", "overview.html", "overview", "Overview")}
          ${navItem("leads", "leads.html", "leads", "Leads", c.leads)}
          ${navItem("replied", "replied.html", "replied", "Replied")}
          <div class="nav-label">Sales</div>
          ${navItem("orders", "orders.html", "orders", "Orders", c.pending)}
          ${navItem("customers", "customers.html", "customers", "Customers")}
          ${navItem("products", "products.html", "products", "Products")}
          <div class="nav-label">Support</div>
          ${navItem("complaints", "complaints.html", "complaints", "Complaints")}
          ${navItem("settings", "settings.html", "settings", "Settings")}
        </nav>
        <div class="sidebar-foot">
          <div class="avatar">${esc((sessionUser().name || "?").slice(0, 1).toUpperCase())}</div>
          <div class="who">${esc(sessionUser().name)}<small>${esc(sessionUser().role || "owner")} · <a href="login.html" id="sign-out">Sign out</a></small></div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div>
            <h1>${esc(page.title)}</h1>
            <p class="sub">${esc(page.sub)}</p>
          </div>
          <div class="topbar-actions">
            ${extras && extras.hideSearch ? "" : `<input class="search" id="global-search" placeholder="Search name, phone, product" value="${esc(DESK_STATE.query)}">`}
            ${extras && extras.actions ? extras.actions : ""}
          </div>
        </header>
        <div class="content">${inner}</div>
      </div>
    `;
  }

  function bindShell() {
    const sw = document.getElementById("page-switch");
    if (sw) {
      sw.addEventListener("change", () => {
        DESK_STATE.pageId = sw.value;
        localStorage.setItem("desk.pageId", sw.value);
        DESK_STATE.selectedOrderId = null;
        render();
      });
    }
    const search = document.getElementById("global-search");
    if (search) {
      search.addEventListener("input", () => {
        DESK_STATE.query = search.value;
        render();
        const again = document.getElementById("global-search");
        if (again) {
          again.focus();
          again.setSelectionRange(again.value.length, again.value.length);
        }
      });
    }
    const signOut = document.getElementById("sign-out");
    if (signOut) {
      signOut.addEventListener("click", (e) => {
        e.preventDefault();
        clearSession();
        location.href = "login.html";
      });
    }
  }

  const API_BASE = window.DESK_API || "http://127.0.0.1:8000";
  const TOKEN_KEY = "desk.token";
  const USER_KEY = "desk.user";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function sessionUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null") || {
        name: DESK.operator.name,
        role: DESK.operator.role,
        email: "",
      };
    } catch {
      return { name: DESK.operator.name, role: DESK.operator.role, email: "" };
    }
  }

  function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function apiErrorMessage(res) {
    try {
      const body = await res.json();
      if (typeof body.detail === "string") return body.detail;
      if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
    } catch {
      /* ignore */
    }
    if (res.status === 401) return "Invalid email or password";
    return "Could not sign in (" + res.status + ")";
  }

  async function restoreSession() {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(API_BASE + "/auth/me", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.status === 401) {
        clearSession();
        return false;
      }
      if (!res.ok) return true;
      saveSession(token, await res.json());
      return true;
    } catch {
      return true;
    }
  }

  function renderLogin() {
    document.getElementById("app").innerHTML = `
      <div class="login-wrap">
        <form class="login-card" id="login-form">
          <div class="login-mark">D</div>
          <h1>Sign in to Desk</h1>
          <p class="lead">Manage leads, replies, and order confirmation from one place.</p>
          <p class="login-error" id="login-error"></p>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" value="admin@admin.store" autocomplete="username" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" type="password" value="" autocomplete="current-password" required>
          </div>
          <button class="btn btn-primary" type="submit" id="login-submit">Continue</button>
          <p class="login-hint">Uses POST ${esc(API_BASE)}/auth/login</p>
        </form>
      </div>
    `;
    const form = document.getElementById("login-form");
    const errorEl = document.getElementById("login-error");
    const submit = document.getElementById("login-submit");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.classList.remove("show");
      errorEl.textContent = "";
      submit.disabled = true;
      submit.textContent = "Signing in…";
      try {
        const res = await fetch(API_BASE + "/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
          }),
        });
        if (!res.ok) {
          errorEl.textContent = await apiErrorMessage(res);
          errorEl.classList.add("show");
          return;
        }
        const data = await res.json();
        saveSession(data.access_token, data.user);
        location.href = "overview.html";
      } catch {
        errorEl.textContent = "Cannot reach API at " + API_BASE + ". Is uvicorn running?";
        errorEl.classList.add("show");
      } finally {
        submit.disabled = false;
        submit.textContent = "Continue";
      }
    });
  }

  function miniRows(rows, cols, empty) {
    if (!rows.length) return `<div class="empty"><strong>${esc(empty)}</strong></div>`;
    const body = rows
      .map((r) => `<tr>${cols.map((c) => `<td>${c(r)}</td>`).join("")}</tr>`)
      .join("");
    return `<div class="table-wrap"><table class="data"><tbody>${body}</tbody></table></div>`;
  }

  function renderOverview() {
    const c = counts();
    const leadRows = filtered(DESK.leads).slice(0, 5);
    const orderRows = filtered(DESK.orders)
      .filter((o) => o.status === "pending")
      .slice(0, 5);
    const inner = `
      <div class="stats">
        <div class="stat"><div class="k">New leads</div><div class="v">${c.leads}</div><div class="hint">Not replied</div></div>
        <div class="stat"><div class="k">Failed replies</div><div class="v">${c.failed}</div><div class="hint">Need a manual follow-up</div></div>
        <div class="stat"><div class="k">Replied</div><div class="v">${c.replied}</div><div class="hint">Answered conversations</div></div>
        <div class="stat"><div class="k">Pending orders</div><div class="v">${c.pending}</div><div class="hint">Waiting for your call</div></div>
        <div class="stat"><div class="k">Confirmed</div><div class="v">${c.accepted}</div><div class="hint">${c.rejected} rejected</div></div>
      </div>
      <div class="grid-2">
        <section class="panel">
          <div class="panel-h"><h2>Unreplied leads</h2><a href="leads.html">Open leads</a></div>
          ${miniRows(
            leadRows,
            [
              (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.channel)} · ${esc(r.at)}</div>`,
              (r) => `<div class="clip">${esc(r.message)}</div>`,
              (r) => badgeStatus(r.status),
            ],
            "No unreplied leads on this page"
          )}
        </section>
        <section class="panel">
          <div class="panel-h"><h2>Orders to confirm</h2><a href="orders.html">Open orders</a></div>
          ${miniRows(
            orderRows,
            [
              (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.phone)}</div>`,
              (r) => `<div>${esc(r.product)}</div><div class="meta">${esc(r.createdAt)}</div>`,
              (r) => badgeStatus(r.status),
            ],
            "No pending orders"
          )}
        </section>
      </div>
    `;
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
  }

  function tablePage(headers, rows, cells, empty) {
    if (!rows.length) {
      return `<section class="panel"><div class="empty"><strong>${esc(empty)}</strong><div>Try another page or clear search.</div></div></section>`;
    }
    return `
      <section class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>
              ${rows
                .map((r) => `<tr>${cells.map((c) => `<td>${c(r)}</td>`).join("")}</tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderLeads() {
    const rows = filtered(DESK.leads);
    const inner = tablePage(
      ["Person", "Page", "Channel", "Message", "Product", "Time", "Status"],
      rows,
      [
        (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.id)}</div>`,
        (r) => esc(pageName(r.pageId)),
        (r) => `<span class="badge b-channel">${esc(r.channel)}</span>`,
        (r) => `<div class="clip">${esc(r.message)}</div>`,
        (r) => esc(r.product),
        (r) => `<span class="meta">${esc(r.at)}</span>`,
        (r) => badgeStatus(r.status),
      ],
      "No leads to show"
    );
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
  }

  function renderReplied() {
    const rows = filtered(DESK.replied);
    const inner = tablePage(
      ["Person", "Page", "Channel", "Last message", "Product", "Replied at", "Order"],
      rows,
      [
        (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.id)}</div>`,
        (r) => esc(pageName(r.pageId)),
        (r) => `<span class="badge b-channel">${esc(r.channel)}</span>`,
        (r) => `<div class="clip">${esc(r.message)}</div>`,
        (r) => esc(r.product),
        (r) => `<span class="meta">${esc(r.repliedAt)}</span>`,
        (r) =>
          r.order === "Pending"
            ? `${badgeStatus(r.order)} <a href="orders.html" style="margin-left:8px;color:var(--accent);font-weight:600;font-size:12px">Open</a>`
            : badgeStatus(r.order),
      ],
      "No replied conversations"
    );
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
  }

  function ordersForTab() {
    const tab = DESK_STATE.orderTab;
    return filtered(DESK.orders).filter((o) => (tab === "all" ? true : o.status === tab));
  }

  function selectedOrder() {
    const rows = ordersForTab();
    const id = DESK_STATE.selectedOrderId;
    return rows.find((o) => o.id === id) || rows[0] || null;
  }

  function renderOrders() {
    const c = counts();
    const rows = ordersForTab();
    const selected = selectedOrder();
    if (selected) DESK_STATE.selectedOrderId = selected.id;

    const list = rows.length
      ? rows
          .map((o) => {
            const active = selected && o.id === selected.id ? " active" : "";
            return `
              <div class="order-item${active}" data-order="${esc(o.id)}">
                <div class="row1">
                  <strong>${esc(o.name)}</strong>
                  ${badgeStatus(o.status)}
                </div>
                <div class="prod">${esc(o.product)} · ${esc(o.createdAt)}</div>
                <div class="meta">${esc(o.phone)}</div>
              </div>`;
          })
          .join("")
      : `<div class="empty"><strong>No orders in this tab</strong></div>`;

    const detail = selected
      ? `
        <div class="detail">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div>
              <h3>${esc(selected.name)}</h3>
              <div class="when">${esc(selected.id)} · ${esc(pageName(selected.pageId))} · ${esc(selected.channel)} · ${esc(selected.createdAt)}</div>
            </div>
            ${badgeStatus(selected.status)}
          </div>
          <div class="callout">Admin calls the customer manually. Copy the number, call, then mark accepted or rejected. No auto-call in this screen.</div>
          <div class="block">
            <h4>Phone</h4>
            <div class="copy-row">
              <div class="val mono">${esc(selected.phone)}</div>
              <button class="btn btn-ghost btn-sm" data-copy="${esc(selected.phone)}" data-label="Phone">Copy</button>
            </div>
          </div>
          <div class="block">
            <h4>Address</h4>
            <div class="copy-row">
              <div class="val">${esc(selected.address)}</div>
              <button class="btn btn-ghost btn-sm" data-copy="${esc(selected.address)}" data-label="Address">Copy</button>
            </div>
          </div>
          <div class="block">
            <h4>Product</h4>
            <div class="product-box">
              <div>
                <strong>${esc(selected.product)}</strong>
                <div class="meta">${esc(selected.sku)} · Qty ${esc(selected.qty)}</div>
              </div>
              <div class="price">${money(selected.price * selected.qty)}</div>
            </div>
          </div>
          <div class="block">
            <h4>Call note</h4>
            <textarea class="note" id="order-note" placeholder="e.g. Called, confirmed COD, deliver tomorrow">${esc(selected.note)}</textarea>
          </div>
          <div class="actions">
            <button class="btn btn-danger" data-status="rejected" ${selected.status === "rejected" ? "disabled" : ""}>Reject</button>
            <button class="btn btn-ghost" data-status="pending" ${selected.status === "pending" ? "disabled" : ""}>Keep pending</button>
            <button class="btn btn-ok" data-status="accepted" ${selected.status === "accepted" ? "disabled" : ""}>Accept</button>
          </div>
        </div>`
      : `<div class="detail-empty"><div><strong>Select an order</strong><div>Pending orders wait here until you call and decide.</div></div></div>`;

    const inner = `
      <div class="filters">
        <div class="tabs">
          <button data-tab="pending" class="${DESK_STATE.orderTab === "pending" ? "active" : ""}">Pending <span class="n">${c.pending}</span></button>
          <button data-tab="accepted" class="${DESK_STATE.orderTab === "accepted" ? "active" : ""}">Accepted <span class="n">${c.accepted}</span></button>
          <button data-tab="rejected" class="${DESK_STATE.orderTab === "rejected" ? "active" : ""}">Rejected <span class="n">${c.rejected}</span></button>
          <button data-tab="all" class="${DESK_STATE.orderTab === "all" ? "active" : ""}">All</button>
        </div>
      </div>
      <div class="workstation">
        <section class="panel order-list">${list}</section>
        <section class="panel">${detail}</section>
      </div>
    `;
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();

    document.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        DESK_STATE.orderTab = btn.dataset.tab;
        DESK_STATE.selectedOrderId = null;
        render();
      });
    });
    document.querySelectorAll("[data-order]").forEach((el) => {
      el.addEventListener("click", () => {
        DESK_STATE.selectedOrderId = el.dataset.order;
        render();
      });
    });
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy, btn.dataset.label));
    });
    const note = document.getElementById("order-note");
    if (note && selected) {
      note.addEventListener("change", () => {
        selected.note = note.value;
      });
    }
    document.querySelectorAll("[data-status]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!selected) return;
        if (note) selected.note = note.value;
        selected.status = btn.dataset.status;
        toast("Order " + btn.dataset.status);
        if (btn.dataset.status !== DESK_STATE.orderTab && DESK_STATE.orderTab !== "all") {
          DESK_STATE.selectedOrderId = null;
        }
        render();
      });
    });
  }

  function renderCustomers() {
    const rows = filtered(DESK.customers);
    const inner = tablePage(
      ["Name", "Page", "Phone", "Orders", "Last seen"],
      rows,
      [
        (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.id)}</div>`,
        (r) => esc(pageName(r.pageId)),
        (r) =>
          `<span class="mono">${esc(r.phone)}</span> <button class="btn btn-ghost btn-sm" data-copy="${esc(r.phone)}" data-label="Phone">Copy</button>`,
        (r) => esc(r.orders),
        (r) => `<span class="meta">${esc(r.last)}</span>`,
      ],
      "No customers on this page"
    );
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy, btn.dataset.label));
    });
  }

  function renderProducts() {
    const q = (DESK_STATE.query || "").trim().toLowerCase();
    let rows = DESK.products;
    if (currentPageId() !== "all") {
      const name = pageName(currentPageId());
      rows = rows.filter((p) => p.pages === name);
    }
    if (q) rows = rows.filter((p) => JSON.stringify(p).toLowerCase().includes(q));
    const inner = tablePage(
      ["SKU", "Product", "Price", "Stock", "Page"],
      rows,
      [
        (r) => `<span class="mono">${esc(r.sku)}</span>`,
        (r) => `<div class="name-cell">${esc(r.name)}</div>`,
        (r) => money(r.price),
        (r) => esc(r.stock),
        (r) => esc(r.pages),
      ],
      "No products for this page"
    );
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
  }

  function renderComplaints() {
    const rows = filtered(DESK.complaints);
    const inner = tablePage(
      ["Person", "Page", "Channel", "Issue", "Category", "Time", "Status"],
      rows,
      [
        (r) => `<div class="name-cell">${esc(r.name)}</div><div class="meta">${esc(r.id)}</div>`,
        (r) => esc(pageName(r.pageId)),
        (r) => `<span class="badge b-channel">${esc(r.channel)}</span>`,
        (r) => `<div class="clip">${esc(r.text)}</div>`,
        (r) => esc(r.category),
        (r) => `<span class="meta">${esc(r.at)}</span>`,
        (r) => badgeStatus(r.status),
      ],
      "No complaints"
    );
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner)}</div>`;
    bindShell();
  }

  function renderSettings() {
    const pageRows = DESK.pages
      .map(
        (p) => `
        <div class="setting-row">
          <div><span class="dot"></span><strong>${esc(p.name)}</strong><div class="meta">facebook.com/${esc(p.handle)}</div></div>
          ${badgeStatus("connected")}
        </div>`
      )
      .join("");
    const inner = `
      <div class="settings-grid">
        <section class="panel">
          <div class="panel-h"><h2>Connected pages</h2></div>
          <div style="padding:4px 16px 12px">${pageRows}</div>
        </section>
        <section class="panel">
          <div class="panel-h"><h2>Desk</h2></div>
          <div style="padding:4px 16px 12px">
            <div class="setting-row"><span>Timezone</span><strong>Asia/Dhaka</strong></div>
            <div class="setting-row"><span>Order confirmation</span><strong>Manual call</strong></div>
            <div class="setting-row"><span>Auto reply</span><strong>On (Messenger + WhatsApp)</strong></div>
            <div class="setting-row"><span>Operator</span><strong>${esc(sessionUser().name)}</strong></div>
          </div>
        </section>
      </div>
    `;
    document.getElementById("app").innerHTML = `<div class="shell">${shell(inner, { hideSearch: true })}</div>`;
    bindShell();
  }

  const ROUTES = {
    login: renderLogin,
    overview: renderOverview,
    leads: renderLeads,
    replied: renderReplied,
    orders: renderOrders,
    customers: renderCustomers,
    products: renderProducts,
    complaints: renderComplaints,
    settings: renderSettings,
  };

  function render() {
    const page = document.body.dataset.page;
    (ROUTES[page] || renderOverview)();
  }

  async function boot() {
    const page = document.body.dataset.page;
    if (page === "login") {
      if (getToken() && (await restoreSession())) {
        location.href = "overview.html";
        return;
      }
      renderLogin();
      return;
    }
    if (!getToken()) {
      location.href = "login.html";
      return;
    }
    const ok = await restoreSession();
    if (!ok) {
      location.href = "login.html";
      return;
    }
    render();
  }

  boot();
})();
