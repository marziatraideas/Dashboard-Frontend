import { useCallback, useState } from "react";
import { useUi } from "../provider/UiProvider.jsx";
import { loadProducts } from "../APIServices/deskLoaders.js";
import { DataTable } from "../components/DataTable.jsx";
import { ExpandableText } from "../components/ExpandableText.jsx";
import { LoadingPanel } from "../components/LoadingPanel.jsx";
import { useDeskLoad } from "../hooks/useDeskLoad.js";
import { useDesk } from "../provider/DeskProvider.jsx";
import { dash, matchesQuery, money } from "../Utils/format.js";

function ProductThumb({ url, name }) {
  const { openImage } = useUi();
  const [broken, setBroken] = useState(false);
  const src = String(url ?? "").trim();
  const title = name || "Product";
  if (!src || broken) {
    return <div className="product-thumb product-thumb--empty" title="No image" />;
  }
  return (
    <button
      type="button"
      className="product-thumb-btn"
      title="View image"
      onClick={() => openImage(title, src)}
    >
      <img
        className="product-thumb"
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
      />
    </button>
  );
}

export function ProductsPage() {
  const { desk, state } = useDesk();
  const loading = useDeskLoad(useCallback(() => loadProducts(), []));
  const rows = matchesQuery(desk.products, state.query);

  if (loading) return <LoadingPanel text="Loading products…" />;

  return (
    <DataTable
      headers={["", "Name", "SKU", "Category", "Description", "Price", "Floor price", "Max discount", "Stock"]}
      empty="No products for this page"
      rows={rows.map((r, i) => ({
        key: r.sku || r.name || i,
        cols: [
          <ProductThumb url={r.image_url} name={r.name} />,
          <div className="name-cell">{dash(r.name)}</div>,
          <span className="mono">{dash(r.sku)}</span>,
          dash(r.category),
          <ExpandableText text={r.description} title="Description" />,
          r.price === "" || r.price == null ? "—" : money(r.price),
          r.floor_price === "" || r.floor_price == null ? "—" : money(r.floor_price),
          dash(r.maximum_discount),
          dash(r.stock),
        ],
      }))}
    />
  );
}
