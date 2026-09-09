import { useState } from "react";
import { pageName } from "../APIServices/deskLoaders.js";
import { Badge } from "../components/Badge.jsx";
import { useDesk } from "../provider/DeskProvider.jsx";
import { useUi } from "../provider/UiProvider.jsx";
import { counts, filtered, money } from "../Utils/format.js";
import { DESK_STATE } from "../state/desk.js";

async function copyText(text, label, showToast) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label + " copied");
  } catch {
    showToast("Copy failed");
  }
}

export function OrdersPage() {
  const { desk, state, refresh } = useDesk();
  const { showToast } = useUi();
  const [, setNoteTick] = useState(0);
  const c = counts(desk, state.pageId);
  const tab = state.orderTab;
  const rows = filtered(desk.orders, state.pageId, state.query).filter((o) =>
    tab === "all" ? true : o.status === tab
  );
  const selected =
    rows.find((o) => o.id === state.selectedOrderId) || rows[0] || null;
  if (selected) DESK_STATE.selectedOrderId = selected.id;

  function setTab(next) {
    DESK_STATE.orderTab = next;
    DESK_STATE.selectedOrderId = null;
    refresh();
  }

  function setStatus(next) {
    if (!selected) return;
    selected.status = next;
    showToast("Order " + next);
    if (next !== DESK_STATE.orderTab && DESK_STATE.orderTab !== "all") {
      DESK_STATE.selectedOrderId = null;
    }
    refresh();
  }

  return (
    <>
      <div className="filters">
        <div className="tabs">
          <button type="button" className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>
            Pending <span className="n">{c.pending}</span>
          </button>
          <button type="button" className={tab === "accepted" ? "active" : ""} onClick={() => setTab("accepted")}>
            Accepted <span className="n">{c.accepted}</span>
          </button>
          <button type="button" className={tab === "rejected" ? "active" : ""} onClick={() => setTab("rejected")}>
            Rejected <span className="n">{c.rejected}</span>
          </button>
          <button type="button" className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
            All
          </button>
        </div>
      </div>
      <div className="workstation">
        <section className="panel order-list">
          {rows.length ? (
            rows.map((o) => (
              <div
                key={o.id}
                className={"order-item" + (selected && o.id === selected.id ? " active" : "")}
                onClick={() => {
                  DESK_STATE.selectedOrderId = o.id;
                  refresh();
                }}
              >
                <div className="row1">
                  <strong>{o.name}</strong>
                  <Badge status={o.status} />
                </div>
                <div className="prod">
                  {o.product} · {o.createdAt}
                </div>
                <div className="meta">{o.phone}</div>
              </div>
            ))
          ) : (
            <div className="empty">
              <strong>No orders in this tab</strong>
            </div>
          )}
        </section>
        <section className="panel">
          {selected ? (
            <div className="detail">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h3>{selected.name}</h3>
                  <div className="when">
                    {selected.id} · {pageName(selected.pageId)} · {selected.channel} · {selected.createdAt}
                  </div>
                </div>
                <Badge status={selected.status} />
              </div>
              <div className="callout">
                Admin calls the customer manually. Copy the number, call, then mark accepted or rejected. No auto-call
                in this screen.
              </div>
              <div className="block">
                <h4>Phone</h4>
                <div className="copy-row">
                  <div className="val mono">{selected.phone}</div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyText(selected.phone, "Phone", showToast)}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="block">
                <h4>Address</h4>
                <div className="copy-row">
                  <div className="val">{selected.address}</div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyText(selected.address, "Address", showToast)}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="block">
                <h4>Product</h4>
                <div className="product-box">
                  <div>
                    <strong>{selected.product}</strong>
                    <div className="meta">
                      {selected.sku} · Qty {selected.qty}
                    </div>
                  </div>
                  <div className="price">{money(selected.price * selected.qty)}</div>
                </div>
              </div>
              <div className="block">
                <h4>Call note</h4>
                <textarea
                  className="note"
                  placeholder="e.g. Called, confirmed COD, deliver tomorrow"
                  value={selected.note}
                  onChange={(e) => {
                    selected.note = e.target.value;
                    setNoteTick((n) => n + 1);
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={selected.status === "rejected"}
                  onClick={() => setStatus("rejected")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={selected.status === "pending"}
                  onClick={() => setStatus("pending")}
                >
                  Keep pending
                </button>
                <button
                  type="button"
                  className="btn btn-ok"
                  disabled={selected.status === "accepted"}
                  onClick={() => setStatus("accepted")}
                >
                  Accept
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-empty">
              <div>
                <strong>Select an order</strong>
                <div>Pending orders wait here until you call and decide.</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
