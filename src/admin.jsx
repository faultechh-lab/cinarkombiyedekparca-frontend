import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { endSession, loginPath, logoutError, requestSession, unavailable } from "./auth-client.mjs";
import { CatalogAdmin } from "./catalog-admin.jsx";

function Admin() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      setUser(null);
      setError("");
      try {
        const session = await requestSession({ signal: controller.signal });
        if (!session.user) window.location.replace(loginPath);
        else setUser(session.user);
      } catch {
        if (!controller.signal.aborted) setError(unavailable);
      }
    }

    function onPageShow(event) {
      if (event.persisted) checkSession();
    }

    checkSession();
    window.addEventListener("pageshow", onPageShow);
    return () => {
      controller.abort();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  async function signOut() {
    setError("");
    setBusy(true);
    try {
      await endSession();
      window.location.replace(loginPath);
    } catch {
      setError(logoutError);
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return <div className="login-screen">
      <section className="login-card">
        <h1>Katalog yönetimi</h1>
        {error ? <>
          <p className="login-error" role="alert">{error}</p>
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Tekrar Dene</button>
        </> : <p role="status">Oturum kontrol ediliyor…</p>}
      </section>
    </div>;
  }

  return <CatalogAdmin user={user} signingOut={busy} onSignOut={signOut} logoutError={error} />;
}

createRoot(document.getElementById("admin-root")).render(<Admin />);
