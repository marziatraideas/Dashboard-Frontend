export function getBaseURL() {
  return (
    window.DESK_API ||
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
}
