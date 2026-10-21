import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { loadCustomers, loadLeads, loadOrderCounts, loadOrders, loadProducts, loadReplied, orderStatusParam } from "../APIServices/deskLoaders.js";
import { clearSession, sessionUser } from "../Auth/session.js";
import { NavIcon } from "../components/NavIcons.jsx";
import { API_SEARCH_PAGES, NAV, PAGE_META } from "../constants/pages.js";
import { counts } from "../Utils/format.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { DESK_STATE } from "../state/desk.js";

export function AppLayout() {
  const { desk, state, refresh, setPageId, setQuery } = useDesk();
  const location = useLocation();
  const pageId = location.pathname.replace(/^\//, "") || "overview";
  const meta = PAGE_META[pageId] || PAGE_META.overview;
  const c = counts(desk, state.pageId);
  const user = sessionUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState(state.query);
  const searchTimer = useRef(0);
  const lastPath = useRef(location.pathname);
  const hideSearch = pageId === "settings";

  if (lastPath.current !== location.pathname) {
    lastPath.current = location.pathname;
    DESK_STATE.query = "";
  }

  useEffect(() => {
    setMenuOpen(false);
    setSearchText("");
    document.title = `${meta.title} · Desk`;
  }, [location.pathname, meta.title]);

  useEffect(() => {
    return () => clearTimeout(searchTimer.current);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest(".sidebar-foot")) setMenuOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function onPageChange(value) {
    await setPageId(value);
    if (pageId === "orders") {
      await Promise.all([loadOrders(orderStatusParam()), loadOrderCounts()]);
    } else if (pageId === "customers") {
      await Promise.all([loadCustomers(), loadOrderCounts()]);
    } else if (pageId === "products") {
      await Promise.all([loadProducts(), loadOrderCounts()]);
    } else if (["leads", "replied", "overview"].includes(pageId)) {
      await Promise.all([loadLeads(), loadReplied(), loadOrders("")]);
    } else {
      await Promise.all([loadLeads(""), loadReplied(""), loadOrders("", "")]);
    }
    refresh();
  }

  function onSearch(value) {
    setSearchText(value);
    setQuery(value);
    if (!API_SEARCH_PAGES.includes(pageId)) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      if (pageId === "products") await loadProducts();
      else if (pageId === "leads") await loadLeads();
      else if (pageId === "replied") await loadReplied();
      else if (pageId === "orders") await loadOrders(orderStatusParam());
      else if (pageId === "customers") await loadCustomers();
      else if (pageId === "overview") await Promise.all([loadLeads(), loadReplied(), loadOrders("")]);
      refresh();
    }, 350);
  }

  function signOut() {
    clearSession();
    window.location.assign("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <strong>Desk</strong>
            <span>Page management</span>
          </div>
        </div>
        <div className="page-switch">
          <select value={state.pageId} onChange={(e) => onPageChange(e.target.value)}>
            <option value="all">All pages</option>
            {desk.pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <nav className="nav">
          {NAV.map((group) => (
            <div key={group.group}>
              <div className="nav-label">{group.group}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) =>
                    `${item.id === "orders" ? "orders-link " : ""}${isActive ? "active" : ""}`
                  }
                >
                  <NavIcon id={item.id} />
                  <span>{item.label}</span>
                  {item.count != null ? <span className="count">{c[item.count]}</span> : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button
            type="button"
            className={`account-btn${menuOpen ? " open" : ""}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
          >
            <div className="avatar">{(user.name || "?").slice(0, 1).toUpperCase()}</div>
            <div className="who">
              {user.name}
              <small>{user.role || "owner"}</small>
            </div>
            <span className="account-caret" aria-hidden="true" />
          </button>
          {menuOpen ? (
            <div className="account-menu">
              <button type="button" className="account-signout" onClick={signOut}>
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <h1>{meta.title}</h1>
            <p className="sub">{meta.sub}</p>
          </div>
          <div className="topbar-actions">
            {hideSearch ? null : (
              <input
                className="search"
                type="search"
                placeholder="Search name, phone, product"
                value={searchText}
                onChange={(e) => onSearch(e.target.value)}
              />
            )}
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
