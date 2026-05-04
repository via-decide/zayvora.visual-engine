import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runZayvora } from "./engine/zayvora-core.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 7070);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function serveFile(res, urlPath) {
  const safePath = urlPath === "/" ? "/workspace/index.html" : urlPath;
  const filePath = path.normalize(path.join(__dirname, safePath));
  if (!filePath.startsWith(__dirname)) return send(res, 403, "Forbidden", "text/plain");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return send(res, 404, "Not found", "text/plain");
  }
  const ext = path.extname(filePath);
  send(res, 200, fs.readFileSync(filePath), mime[ext] || "application/octet-stream");
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "POST" && url.pathname === "/api/generate") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = await runZayvora({
          input: String(payload.input || "").trim(),
          mode: String(payload.mode || "full"),
          slideCount: Number(payload.slideCount || 15)
        });
        send(res, 200, JSON.stringify(result, null, 2));
      } catch (error) {
        send(res, 500, JSON.stringify({ error: error.message }, null, 2));
      }
    });
    return;
  }

  serveFile(res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Zayvora workspace running at http://localhost:${PORT}`);
});
