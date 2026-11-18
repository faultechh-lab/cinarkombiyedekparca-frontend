export const loginPath = "/giris/";
export const adminPath = "/yonetici/";
export const loginApi = "/api/auth/login/";
export const logoutApi = "/api/auth/logout/";
export const unavailable = "Oturum servisine ulaşılamadı. Lütfen tekrar deneyin.";
export const logoutError = "Oturum kapatılamadı. Lütfen tekrar deneyin.";

export async function requestSession(options = {}) {
  const response = await fetch(loginApi, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
  });
  if (response.status === 400) throw new Error("E-posta veya parola geçersiz.");
  if (response.status === 403) throw new Error("Oturum doğrulanamadı. Lütfen tekrar deneyin.");
  if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) {
    throw new Error(unavailable);
  }
  return response.json();
}

export async function endSession() {
  const session = await requestSession();
  if (!session.user) return;

  const response = await fetch(logoutApi, {
    method: "POST",
    credentials: "same-origin",
    headers: { "X-CSRFToken": session.csrf_token },
  });
  if (response.status !== 204) throw new Error(logoutError);
}
