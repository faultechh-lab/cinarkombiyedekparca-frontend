import { legacyDestination } from "./legacy.mjs";
import { catalogResponse, isBackendPath } from "./catalog-runtime.mjs";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" || request.method === "HEAD") {
      const destination = legacyDestination(url);
      if (destination) return Response.redirect(new URL(destination, url), 301);
    }
    if (env.DJANGO_ORIGIN) {
      if (isBackendPath(url.pathname)) {
        const target = new URL(url.pathname + url.search, env.DJANGO_ORIGIN);
        return fetch(new Request(target, request));
      }
      const catalog = await catalogResponse(request, env.DJANGO_ORIGIN);
      if (catalog) return catalog;
    }
    return env.ASSETS.fetch(request);
  },
};
