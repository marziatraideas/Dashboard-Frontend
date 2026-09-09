import { getBaseURL } from "./getBaseURL.js";
import { getToken } from "../Auth/session.js";

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token && !headers.Authorization) headers.Authorization = "Bearer " + token;
  return fetch(getBaseURL() + path, { ...options, headers });
}

export async function readErrorMessage(res) {
  try {
    const body = await res.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
  } catch {
    /* ignore */
  }
  if (res.status === 401) return "Invalid email or password";
  return "Could not sign in (" + res.status + ")";
}
