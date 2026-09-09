import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider.jsx";
import { useDesk } from "../provider/DeskProvider.jsx";

export function useDeskLoad(loader) {
  const { refresh } = useDesk();
  const { setAuthed } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      const ok = await loader();
      if (!live) return;
      if (!ok) {
        setAuthed(false);
        return;
      }
      refresh();
      setLoading(false);
    })();
    return () => {
      live = false;
    };
  }, [loader, refresh, setAuthed]);

  return loading;
}
