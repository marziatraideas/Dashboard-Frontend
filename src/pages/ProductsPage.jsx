import { useCallback } from "react";
import { loadProducts } from "../APIServices/deskLoaders.js";
import { DataTable } from "../components/DataTable.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { dash, money } from "../Utils/format.js";

export function ProductsPage() {
  const { desk } = useDesk();
  const loading = useDeskLoad(useCallback(() => loadProducts(), []));

  if (loading) return <LoadingPanel text="Loading products…" />;

  return (
    <DataTable
      headers={["Name", "SKU", "Category", "Description", "Price", "Floor price", "Max discount", "Stock"]}
      empty="No products for this page"
      rows={desk.products.map((r, i) => ({
        key: r.sku || r.name || i,
        cols: [
          <div className="name-cell">{dash(r.name)}</div>,
          <span className="mono">{dash(r.sku)}</span>,
          dash(r.category),
          <div className="clip">{dash(r.description)}</div>,
          r.price === "" || r.price == null ? "—" : money(r.price),
          r.floor_price === "" || r.floor_price == null ? "—" : money(r.floor_price),
          dash(r.maximum_discount),
          dash(r.stock),
        ],
      }))}
    />
  );
}
