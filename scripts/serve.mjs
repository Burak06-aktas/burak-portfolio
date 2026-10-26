import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedRoot = process.argv[2] ? path.resolve(projectRoot, process.argv[2]) : projectRoot;
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"]
]);

const server = createServer(async (request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method || "GET")) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const requestedFile = path.resolve(requestedRoot, relativePath);
  const pathFromRoot = path.relative(requestedRoot, requestedFile);

  if (pathFromRoot.startsWith("..") || path.isAbsolute(pathFromRoot) || pathFromRoot.split(path.sep).some((part) => part.startsWith("."))) {
    response.writeHead(404).end("Not found");
    return;
  }

  let fileInfo;
  try {
    fileInfo = await stat(requestedFile);
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }

  if (!fileInfo.isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }

  const headers = {
    "Cache-Control": "no-cache",
    "Content-Length": fileInfo.size,
    "Content-Type": contentTypes.get(path.extname(requestedFile)) || "application/octet-stream",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN"
  };
  response.writeHead(200, headers);
  if (request.method === "HEAD") {
    response.end();
  } else {
    createReadStream(requestedFile).pipe(response);
  }
});

server.listen(port, host, () => {
  console.log(`Portfolio available at http://${host}:${port}`);
  console.log(`Serving ${requestedRoot}`);
});
