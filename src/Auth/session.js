import { DESK } from "../state/desk.js";
import { TOKEN_KEY, USER_KEY } from "./storageKeys.js";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function sessionUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null") || {
      name: DESK.operator.name,
      role: DESK.operator.role,
      email: "",
    };
  } catch {
    return { name: DESK.operator.name, role: DESK.operator.role, email: "" };
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
