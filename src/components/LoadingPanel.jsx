export function LoadingPanel({ text }) {
  return (
    <section className="panel">
      <div className="empty">
        <strong>{text}</strong>
      </div>
    </section>
  );
}
