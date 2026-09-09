import { useEffect, useState } from "react";
import { getBaseURL } from "../API/getBaseURL.js";
import { login } from "../APIServices/authService.js";
import { authRoutes } from "../ApiRoutes/routes.js";

export function LoginPage() {
  const [email, setEmail] = useState("admin@admin.store");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Sign in · Desk";
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.assign("/overview");
    } catch {
      setError("Cannot reach API at " + getBaseURL() + ". Is the backend running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-mark">D</div>
        <h1>Sign in to Desk</h1>
        <p className="lead">Manage leads, replies, and order confirmation from one place.</p>
        <p className={"login-error" + (error ? " show" : "")}>{error}</p>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="username"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Continue"}
        </button>
        <p className="login-hint">
          Uses POST {getBaseURL()}
          {authRoutes.login}
        </p>
      </form>
    </div>
  );
}
