import { useEffect } from "react";
import { useUi } from "../provider/UiProvider.jsx";

export function Overlays() {
  const { toast, modal, closeModal } = useUi();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal]);

  return (
    <>
      {toast ? <div className="toast show">{toast}</div> : null}
      {modal ? (
        <div className="text-modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          {modal.kind === "image" ? (
            <div className="text-modal-card text-modal-card--image" role="dialog" aria-modal="true">
              <div className="text-modal-h">
                <h3>{modal.title || "Product"}</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={closeModal}>
                  Close
                </button>
              </div>
              <div className="image-modal-body">
                <img src={modal.src} alt={modal.title || "Product"} />
              </div>
            </div>
          ) : (
            <div className="text-modal-card" role="dialog" aria-modal="true">
              <div className="text-modal-h">
                <h3>{modal.title || "Reply"}</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={closeModal}>
                  Close
                </button>
              </div>
              <pre className="text-modal-body">{modal.body}</pre>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
