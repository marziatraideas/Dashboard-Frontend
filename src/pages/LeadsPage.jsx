import { useCallback } from "react";
import { pageName, loadLeads } from "../APIServices/deskLoaders.js";
import { Badge } from "../components/Badge.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { CommentLink, ExpandableText } from "../components/ExpandableText.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { matchesQuery } from "../Utils/format.js";

export function LeadsPage() {
  const { desk, state } = useDesk();
  const loading = useDeskLoad(useCallback(() => loadLeads(), []));
  const rows = matchesQuery(desk.leads, state.query);

  if (loading) return <LoadingPanel text="Loading leads…" />;

  return (
    <DataTable
      headers={["Person", "Page", "Channel", "Message", "Reply", "Product", "Comment", "Time", "Status"]}
      empty="No leads to show"
      rows={rows.map((r) => ({
        key: r.id,
        cols: [
          <>
            <div className="name-cell">{r.name}</div>
            <div className="meta">{r.id}</div>
          </>,
          pageName(r.pageId),
          <span className="badge b-channel">{r.channel}</span>,
          <ExpandableText text={r.message} title="Message" />,
          <ExpandableText text={r.reply} title="Reply" />,
          <ExpandableText text={r.product} title="Product" />,
          <CommentLink url={r.comment_ref} />,
          <span className="meta">{r.at}</span>,
          <Badge status={r.status} />,
        ],
      }))}
    />
  );
}
