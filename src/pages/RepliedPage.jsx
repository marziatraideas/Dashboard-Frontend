import { useCallback } from "react";
import { Link } from "react-router-dom";
import { pageName, loadReplied } from "../APIServices/deskLoaders.js";
import { Badge } from "../components/Badge.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { CommentLink, ExpandableText } from "../components/ExpandableText.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";

export function RepliedPage() {
  const { desk } = useDesk();
  const loading = useDeskLoad(useCallback(() => loadReplied(), []));

  if (loading) return <LoadingPanel text="Loading replies…" />;

  return (
    <DataTable
      headers={["Person", "Page", "Channel", "Last message", "Reply", "Product", "Comment", "Replied at", "Order"]}
      empty="No replied conversations"
      rows={desk.replied.map((r) => ({
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
          <span className="meta">{r.repliedAt}</span>,
          r.order === "Pending" ? (
            <>
              <Badge status={r.order} />{" "}
              <Link to="/orders" style={{ marginLeft: 8, color: "var(--accent)", fontWeight: 600, fontSize: 12 }}>
                Open
              </Link>
            </>
          ) : (
            <Badge status={r.order} />
          ),
        ],
      }))}
    />
  );
}
