export function DataTable({ headers, rows, empty }) {
  if (!rows.length) {
    return (
      <section className="panel">
        <div className="empty">
          <strong>{empty}</strong>
          <div>Try another page or clear search.</div>
        </div>
      </section>
    );
  }
  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={cells.key || i}>
                {cells.cols.map((col, j) => (
                  <td key={j}>{col}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MiniRows({ rows, empty }) {
  if (!rows.length) {
    return (
      <div className="empty">
        <strong>{empty}</strong>
      </div>
    );
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <tbody>
          {rows.map((cells, i) => (
            <tr key={cells.key || i}>
              {cells.cols.map((col, j) => (
                <td key={j}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
