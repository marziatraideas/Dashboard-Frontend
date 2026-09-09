import { pageName } from "../APIServices/deskLoaders.js";
import { Badge } from "../components/Badge.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { useDesk } from "../provider/DeskProvider.jsx";
import { filtered } from "../Utils/format.js";

export function ComplaintsPage() {
  const { desk, state } = useDesk();
  const rows = filtered(desk.complaints, state.pageId, state.query);

  return (
    <DataTable
      headers={["Person", "Page", "Channel", "Issue", "Category", "Time", "Status"]}
      empty="No complaints"
      rows={rows.map((r) => ({
        key: r.id,
        cols: [
          <>
            <div className="name-cell">{r.name}</div>
            <div className="meta">{r.id}</div>
          </>,
          pageName(r.pageId),
          <span className="badge b-channel">{r.channel}</span>,
          <div className="clip">{r.text}</div>,
          r.category,
          <span className="meta">{r.at}</span>,
          <Badge status={r.status} />,
        ],
      }))}
    />
  );
}
