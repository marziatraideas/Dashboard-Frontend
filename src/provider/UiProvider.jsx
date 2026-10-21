import { createContext, useCallback, useContext, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(""), 1600);
  }, []);

  const openText = useCallback(
    (title, body) => setModal({ kind: "text", title, body }),
    []
  );
  const openImage = useCallback(
    (title, src) => setModal({ kind: "image", title, src }),
    []
  );
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <UiContext.Provider
      value={{ toast, showToast, modal, openText, openImage, closeModal, closeText: closeModal }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}
