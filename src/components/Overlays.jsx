import { useEffect } from "react";
import { useUi } from "../provider/UiProvider.jsx";

export function Overlays() {
  const { toast, modal, closeText } = useUi();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeText();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeText]);

  return (
    <>
      {toast ? <div className="toast show">{toast}</div> : null}
      {modal ? (
        <div className="text-modal" onClick={(e) => e.target === e.currentTarget && closeText()}>
          <div className="text-modal-card" role="dialog" aria-modal="true">
            <div className="text-modal-h">
              <h3>{modal.title || "Reply"}</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={closeText}>
                Close
              </button>
            </div>
            <pre className="text-modal-body">{modal.body}</pre>
          </div>
        </div>
      ) : null}
    </>
  );
}
