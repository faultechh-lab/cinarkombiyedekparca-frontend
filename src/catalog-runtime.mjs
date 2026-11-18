import { adminPath, loginApi, loginPath, logoutApi } from "./auth-client.mjs";
import { origin } from "./catalog.mjs";
import { catalogPath, categoryPath, pages, productPath, renderCatalog, renderCategory, renderHome, renderProduct } from "./site.mjs";

export function isBackendPath(pathname) {
  return pathname === loginApi || pathname === logoutApi
    || pathname.startsWith("/api/categories/") || pathname.startsWith("/api/products/")
    || pathname.startsWith("/media/");
}

const staticPaths = [...pages.keys()].filter(path => !["/404.html", loginPath, adminPath].includes(path));
const htmlHeaders = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" };
const xmlHeaders = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" };
const routePattern = /^\/(yedek-parcalar|urun)\/([a-z0-9_-]+)\/?$/;

export function renderSitemap(categories = [], products = []) {
  const paths = [...staticPaths, ...categories.map(categoryPath), ...products.map(productPath)];
  const entries = paths.map(path => "  <url><loc>" + origin + path + "</loc></url>").join("\n");
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + "\n</urlset>\n";
}

async function readList(backendOrigin, headers, resource, filters = {}) {
  const url = new URL("/api/" + resource + "/", backendOrigin);
  url.search = new URLSearchParams(filters).toString();
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Catalog API returned " + response.status);
  const list = await response.json();
  if (!Array.isArray(list)) throw new Error("Catalog API did not return a list");
  return list;
}

export async function catalogResponse(request, backendOrigin, backendHeaders = {}) {
  if (!["GET", "HEAD"].includes(request.method)) return undefined;
  const url = new URL(request.url);
  const path = url.pathname;
  const match = path.match(routePattern);

  if (path === "/yedek-parcalar" || (match && !path.endsWith("/"))) {
    return new Response(null, { status: 301, headers: { Location: path + "/" + url.search } });
  }
  if (path !== "/" && path !== catalogPath && path !== "/sitemap.xml" && !match) return undefined;

  const read = (resource, filters) => readList(backendOrigin, backendHeaders, resource, filters);
  const send = (body, status = 200, headers = htmlHeaders) =>
    new Response(request.method === "HEAD" ? null : body, { status, headers });
  const notFound = () => send(pages.get("/404.html"), 404);
  try {
    if (path === "/sitemap.xml") {
      const [categories, products] = await Promise.all([read("categories"), read("products")]);
      return send(renderSitemap(categories, products), 200, xmlHeaders);
    }
    if (path === "/" || path === catalogPath) {
      const categories = await read("categories", { ordering: "created_at" });
      return send(path === "/" ? renderHome(categories) : renderCatalog(categories));
    }

    const [, section, slug] = match;
    if (section === "urun") {
      const [product] = await read("products", { slug });
      return product ? send(renderProduct(product)) : notFound();
    }

    const [category] = await read("categories", { slug });
    if (!category) return notFound();
    const products = await read("products", { category: String(category.id) });
    return send(renderCategory(category, products));
  } catch (error) {
    console.error("Catalog load failed:", path, error.message);
    if (path === "/") return send(renderHome(null), 503);
    if (path === catalogPath) return send(renderCatalog(null), 503);
    return send("Katalog şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.", 503, {
      "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store",
    });
  }
}
