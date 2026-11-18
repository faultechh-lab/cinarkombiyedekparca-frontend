import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { adminPath, requestSession, unavailable } from "./auth-client.mjs";

function Login() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    requestSession({ signal: controller.signal }).then((current) => {
      if (current.user) window.location.replace(adminPath);
      else setSession(current);
    }).catch(() => {
      if (!controller.signal.aborted) setError(unavailable);
    });
    return () => controller.abort();
  }, [attempt]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const credentials = { email: fields.get("email"), password: fields.get("password") };
    setError("");
    setBusy(true);
    try {
      // Refresh the CSRF token if it rotated in another tab.
      const current = await requestSession();
      const updated = await requestSession({
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": current.csrf_token },
        body: JSON.stringify(credentials),
      });
      if (!updated.user) throw new Error(unavailable);
      window.location.replace(adminPath);
    } catch (failure) {
      setError(failure instanceof TypeError ? unavailable : failure.message);
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return error ? <>
      <p className="login-error" role="alert">{error}</p>
      <button className="button button-primary" type="button" onClick={() => {
        setError("");
        setAttempt(previous => previous + 1);
      }}>Tekrar Dene</button>
    </> : <p role="status">Oturum kontrol ediliyor…</p>;
  }

  return <form className="login-form" method="post" onSubmit={submit}>
    <label htmlFor="login-email">E-posta</label>
    <input id="login-email" name="email" type="email" autoComplete="username" maxLength={254} required />
    <label htmlFor="login-password">Parola</label>
    <input id="login-password" name="password" type="password" autoComplete="current-password" required />
    {error && <p className="login-error" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Giriş Yap"}</button>
  </form>;
}

createRoot(document.getElementById("login-root")).render(<Login />);
