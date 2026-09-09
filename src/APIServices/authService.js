import { apiRequest, readErrorMessage } from "../API/http.js";
import { authRoutes } from "../ApiRoutes/routes.js";
import { clearSession, getToken, saveSession } from "../Auth/session.js";

export async function login(email, password) {
  const res = await apiRequest(authRoutes.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    return { ok: false, error: await readErrorMessage(res) };
  }
  const data = await res.json();
  saveSession(data.access_token, data.user);
  return { ok: true, data };
}

export async function restoreSession() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await apiRequest(authRoutes.me);
    if (res.status === 401) {
      clearSession();
      return false;
    }
    if (!res.ok) return true;
    saveSession(token, await res.json());
    return true;
  } catch {
    return true;
  }
}
