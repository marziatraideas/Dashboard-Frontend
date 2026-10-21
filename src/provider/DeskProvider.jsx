import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PAGE_ID_KEY } from "../Auth/storageKeys.js";
import { loadPageById } from "../APIServices/deskLoaders.js";
import { DESK, DESK_STATE } from "../state/desk.js";

const DeskContext = createContext(null);

export function DeskProvider({ children }) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  const setPageId = useCallback(
    async (pageId) => {
      DESK_STATE.pageId = pageId;
      DESK_STATE.selectedOrderId = null;
      localStorage.setItem(PAGE_ID_KEY, pageId);
      if (pageId !== "all") await loadPageById(pageId);
      refresh();
    },
    [refresh]
  );

  const setQuery = useCallback(
    (query) => {
      DESK_STATE.query = query;
      refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      desk: DESK,
      state: DESK_STATE,
      refresh,
      setPageId,
      setQuery,
    }),
    [tick, refresh, setPageId, setQuery]
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error("useDesk must be used inside DeskProvider");
  return ctx;
}
