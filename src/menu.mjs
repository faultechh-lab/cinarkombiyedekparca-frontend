import { adminPath, requestSession } from "./auth-client.mjs";

const trigger = document.querySelector(".menu-toggle");
const dialog = document.querySelector("#mobil-menu");
const mobileLayout = window.matchMedia("(max-width: 920px)");
const menus = [document.querySelector(".header-nav"), dialog.querySelector("nav")];
const adminLinks = menus.map((menu) => {
  const link = document.createElement("a");
  link.href = adminPath;
  link.textContent = "Yönetici";

  return { menu, link };
});
let sessionCheck;

async function refreshAdminLinks() {
  sessionCheck?.abort();
  const controller = new AbortController();
  sessionCheck = controller;
  let signedIn = false;

  try {
    const session = await requestSession({ signal: controller.signal });
    signedIn = Boolean(session.user);
  } catch {
    // Keep the public menu available when the login service is unreachable.
  }

  if (controller.signal.aborted) return;
  for (const { menu, link } of adminLinks) {
    if (signedIn && !link.isConnected) menu.append(link);
    if (!signedIn) link.remove();
  }
  trigger.closest(".site-header").classList.toggle("has-admin", signedIn);
}

if (typeof dialog.showModal === "function") {
  trigger.addEventListener("click", () => {
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
  });

  dialog.addEventListener("close", () => {
    trigger.setAttribute("aria-expanded", "false");
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  mobileLayout.addEventListener("change", () => {
    if (!mobileLayout.matches && dialog.open) dialog.close();
  });

  trigger.closest(".site-header").classList.add("menu-ready");
}

refreshAdminLinks();
window.addEventListener("pageshow", (event) => {
  if (event.persisted) refreshAdminLinks();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshAdminLinks();
});
