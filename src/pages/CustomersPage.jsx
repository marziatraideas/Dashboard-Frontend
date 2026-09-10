import { useCallback } from "react";
import { loadCustomers, pageName } from "../APIServices/deskLoaders.js";
import { DataTable } from "../components/DataTable.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { useUi } from "../provider/UiProvider.jsx";

export function CustomersPage() {
  const { desk } = useDesk();
  const { showToast } = useUi();
  const loading = useDeskLoad(useCallback(() => loadCustomers(), []));

  async function copyPhone(phone) {
    try {
      await navigator.clipboard.writeText(phone);
      showToast("Phone copied");
    } catch {
      showToast("Copy failed");
    }
  }

  if (loading) return <LoadingPanel text="Loading customers…" />;

  return (
    <DataTable
      headers={["Name", "Page", "Phone", "Orders", "Last seen"]}
      empty="No customers on this page"
      rows={desk.customers.map((r) => ({
        key: r.id,
        cols: [
          <>
            <div className="name-cell">{r.name}</div>
            <div className="meta">{r.id}</div>
          </>,
          pageName(r.pageId),
          <>
            <span className="mono">{r.phone}</span>{" "}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyPhone(r.phone)}>
              Copy
            </button>
          </>,
          r.orders,
          <span className="meta">{r.last}</span>,
        ],
      }))}
    />
  );
}
