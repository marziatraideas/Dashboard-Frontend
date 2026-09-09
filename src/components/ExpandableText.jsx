import { useUi } from "../provider/UiProvider.jsx";

export function ExpandableText({ text, title }) {
  const { openText } = useUi();
  const value = String(text || "").trim();
  if (!value) return "—";
  return (
    <button type="button" className="text-preview" onClick={() => openText(title, value)}>
      <span className="clip">{value}</span>
      <span className="text-preview-hint">View</span>
    </button>
  );
}

export function CommentLink({ url }) {
  const href = String(url || "").trim();
  if (!href) return "—";
  if (!/^https?:\/\//i.test(href)) return <div className="clip">{href}</div>;
  return (
    <a className="comment-ref" href={href} target="_blank" rel="noopener noreferrer">
      Comment
    </a>
  );
}
