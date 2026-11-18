import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, request as forwardRequest } from "node:http";
import { request as forwardSecureRequest } from "node:https";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalogResponse, isBackendPath } from "../src/catalog-runtime.mjs";
import { legacyDestination } from "../src/legacy.mjs";

const root = fileURLToPath(new URL("../dist/client", import.meta.url));
const args = process.argv.slice(2);
const argument = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const port = Number(argument("--port", 4173));
const host = argument("--host", "127.0.0.1");
const authBackendPort = Number(process.env.AUTH_BACKEND_PORT ?? 8000);
const production = process.env.NODE_ENV === "production";
const backendOrigin = process.env.DJANGO_ORIGIN || `http://127.0.0.1:${authBackendPort}`;
const robotsHeaders = production ? {} : { "X-Robots-Tag": "noindex" };
const backendHeaders = production ? { "X-Forwarded-Proto": "https" } : {};
const types = {
  ".html": "text/html; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png",
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${host}:${port}`);
  if (isBackendPath(url.pathname)) {
    const target = new URL(url.pathname + url.search, backendOrigin);
    const forward = target.protocol === "https:" ? forwardSecureRequest : forwardRequest;
    const headers = { ...request.headers, ...backendHeaders };
    if (production) headers.host = target.host;
    const upstream = forward(target, {
      method: request.method,
      headers,
    }, (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    });
    upstream.setTimeout(10000, () => upstream.destroy());
    upstream.on("error", () => {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ detail: "Sunucuya ulaşılamadı." }));
    });
    response.on("close", () => {
      if (!response.writableEnded) upstream.destroy();
    });
    request.pipe(upstream);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  const redirect = legacyDestination(url);
  if (redirect) {
    response.writeHead(301, { Location: redirect }).end();
    return;
  }

  const catalog = await catalogResponse(new Request(url, { method: request.method }), backendOrigin, backendHeaders);
  if (catalog) {
    response.writeHead(catalog.status, {
      ...Object.fromEntries(catalog.headers),
      ...robotsHeaders,
    });
    response.end(request.method === "HEAD" ? undefined : await catalog.text());
    return;
  }

  let file = join(root, url.pathname);
  let statusCode = 200;
  try {
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: url.pathname + "/" + url.search }).end();
        return;
      }
      file = join(file, "index.html");
      await stat(file);
    }
  } catch {
    file = join(root, "404.html");
    statusCode = 404;
  }

  response.writeHead(statusCode, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    ...robotsHeaders,
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(file).pipe(response);
}).listen(port, host, () => process.stdout.write(`http://${host}:${port}/\n`));
