import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { restoreSession } from "../APIServices/authService.js";
import { loadLeads, loadOrders, loadPageById, loadPages, loadReplied } from "../APIServices/deskLoaders.js";
import { getToken } from "../Auth/session.js";
import { DESK_STATE } from "../state/desk.js";
import { useDesk } from "./DeskProvider.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const { refresh } = useDesk();

  useEffect(() => {
    let live = true;
    (async () => {
      if (!getToken()) {
        if (live) {
          setAuthed(false);
          setReady(true);
        }
        return;
      }
      const ok = await restoreSession();
      if (!ok) {
        if (live) {
          setAuthed(false);
          setReady(true);
        }
        return;
      }
      const pagesOk = await loadPages();
      if (!pagesOk) {
        if (live) {
          setAuthed(false);
          setReady(true);
        }
        return;
      }
      if (DESK_STATE.pageId && DESK_STATE.pageId !== "all") {
        await loadPageById(DESK_STATE.pageId);
      }
      await Promise.all([loadLeads(""), loadReplied(""), loadOrders("", "")]);
      if (live) {
        setAuthed(true);
        setReady(true);
        refresh();
      }
    })();
    return () => {
      live = false;
    };
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ ready, authed, setAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function ProtectedRoute() {
  const { ready, authed } = useAuth();
  const location = useLocation();
  if (!ready) return <div className="login-wrap"><p className="lead">Loading…</p></div>;
  if (!authed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function GuestRoute() {
  const { ready, authed } = useAuth();
  if (!ready) return <div className="login-wrap"><p className="lead">Loading…</p></div>;
  if (authed) return <Navigate to="/overview" replace />;
  return <Outlet />;
}
