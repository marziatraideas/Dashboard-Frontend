import { useCallback } from "react";
import { Link } from "react-router-dom";
import { loadLeads, loadOrders, loadReplied } from "../APIServices/deskLoaders.js";
import { Badge } from "../components/Badge.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { MiniRows } from "../components/DataTable.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { counts, matchesQuery } from "../Utils/format.js";

export function OverviewPage() {
  const { desk, state } = useDesk();
  const loading = useDeskLoad(
    useCallback(
      () => Promise.all([loadLeads(), loadReplied(), loadOrders("")]).then((ok) => ok.every(Boolean)),
      []
    )
  );
  const c = counts(desk, state.pageId);
  const leadRows = matchesQuery(desk.leads, state.query).slice(0, 5);
  const orderRows = matchesQuery(desk.orders, state.query)
    .filter((o) => o.status === "pending")
    .slice(0, 5);

  if (loading) return <LoadingPanel text="Loading overview…" />;

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="k">New leads</div>
          <div className="v">{c.leads}</div>
          <div className="hint">Not replied</div>
        </div>
        <div className="stat">
          <div className="k">Failed replies</div>
          <div className="v">{c.failed}</div>
          <div className="hint">Need a manual follow-up</div>
        </div>
        <div className="stat">
          <div className="k">Replied</div>
          <div className="v">{c.replied}</div>
          <div className="hint">Answered conversations</div>
        </div>
        <div className="stat">
          <div className="k">Pending orders</div>
          <div className="v">{c.pending}</div>
          <div className="hint">Waiting for your call</div>
        </div>
        <div className="stat">
          <div className="k">Confirmed</div>
          <div className="v">{c.accepted}</div>
          <div className="hint">{c.rejected} rejected</div>
        </div>
      </div>
      <div className="grid-2">
        <section className="panel">
          <div className="panel-h">
            <h2>Unreplied leads</h2>
            <Link to="/leads">Open leads</Link>
          </div>
          <MiniRows
            empty="No unreplied leads on this page"
            rows={leadRows.map((r) => ({
              key: r.id,
              cols: [
                <>
                  <div className="name-cell">{r.name}</div>
                  <div className="meta">
                    {r.channel} · {r.at}
                  </div>
                </>,
                <div className="clip">{r.message}</div>,
                <Badge status={r.status} />,
              ],
            }))}
          />
        </section>
        <section className="panel">
          <div className="panel-h">
            <h2>Orders to confirm</h2>
            <Link to="/orders">Open orders</Link>
          </div>
          <MiniRows
            empty="No pending orders"
            rows={orderRows.map((r) => ({
              key: r.id,
              cols: [
                <>
                  <div className="name-cell">{r.name}</div>
                  <div className="meta">{r.phone}</div>
                </>,
                <>
                  <div>{r.product}</div>
                  <div className="meta">{r.createdAt}</div>
                </>,
                <Badge status={r.status} />,
              ],
            }))}
          />
        </section>
      </div>
    </>
  );
}
