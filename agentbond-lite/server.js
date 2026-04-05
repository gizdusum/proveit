const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { generateStructuredReport, buildAnchorPayload } = require("./lib/report-engine");

const PORT = Number(process.env.PORT || 8788);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DEPLOYMENT_FILE = path.join(ROOT, "deployments", "etherlinkTestnet.json");
const LEGACY_ABI_FILE = path.join(PUBLIC_DIR, "agentbond-lite.abi.json");
const REPORT_REGISTRY_ABI_FILE = path.join(PUBLIC_DIR, "report-registry.abi.json");
const SETTLEMENT_ESCROW_ABI_FILE = path.join(PUBLIC_DIR, "settlement-escrow.abi.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function loadDeployment() {
  if (!fs.existsSync(DEPLOYMENT_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
}

function loadAbi() {
  if (!fs.existsSync(LEGACY_ABI_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(LEGACY_ABI_FILE, "utf8"));
}

function loadContracts() {
  const reportRegistryAbi = fs.existsSync(REPORT_REGISTRY_ABI_FILE)
    ? JSON.parse(fs.readFileSync(REPORT_REGISTRY_ABI_FILE, "utf8"))
    : null;
  const settlementEscrowAbi = fs.existsSync(SETTLEMENT_ESCROW_ABI_FILE)
    ? JSON.parse(fs.readFileSync(SETTLEMENT_ESCROW_ABI_FILE, "utf8"))
    : null;

  return {
    reportRegistry: reportRegistryAbi,
    settlementEscrow: settlementEscrowAbi
  };
}

function serveStatic(res, pathname) {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(PUBLIC_DIR, relativePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { ok: false, error: "Forbidden path." });
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(res, 404, { ok: false, error: "File not found." });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=300"
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (req.method === "GET" && pathname === "/api/config") {
      const deployment = loadDeployment();
      const abi = loadAbi();
      const contracts = loadContracts();
      sendJson(res, 200, {
        ok: true,
        network: {
          name: "Etherlink Shadownet Testnet",
          chainId: 127823,
          rpcUrl: process.env.ETHERLINK_RPC_URL || "https://node.shadownet.etherlink.com",
          explorerUrl: process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com",
          currencySymbol: "XTZ"
        },
        deployment,
        abi,
        contracts: {
          reportRegistry: {
            address: deployment?.contracts?.reportRegistry?.address || null,
            abi: contracts.reportRegistry || deployment?.contracts?.reportRegistry?.abi || null
          },
          settlementEscrow: {
            address: deployment?.contracts?.settlementEscrow?.address || null,
            abi: contracts.settlementEscrow || deployment?.contracts?.settlementEscrow?.abi || null
          }
        }
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/ai/report") {
      const raw = await readBody(req);
      const payload = raw ? JSON.parse(raw) : {};
      const report = await generateStructuredReport(payload);
      sendJson(res, 200, {
        ok: true,
        mode: report.generated_by === "template" ? "fallback" : "openai",
        model: report.generated_by,
        report,
        reportMarkdown: report.full_report_markdown
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/anchor-payload") {
      const raw = await readBody(req);
      const payload = raw ? JSON.parse(raw) : {};
      if (!payload.report) {
        sendJson(res, 400, { ok: false, error: "Missing report payload." });
        return;
      }
      sendJson(res, 200, {
        ok: true,
        registry_payload: buildAnchorPayload(payload.report, payload)
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/demo/task") {
      sendJson(res, 200, {
        ok: true,
        task: {
          title: "Produce governance intel for a new Etherlink dApp launch",
          brief:
            "Read the launch proposal, identify treasury and upgrade risks, summarize the governance tradeoffs, and end with a clear recommendation.",
          focus: "proposal intent, treasury controls, upgrade risk, and execution recommendation",
          mode: "governance"
        }
      });
      return;
    }

    if (req.method === "GET") {
      serveStatic(res, pathname);
      return;
    }

    sendJson(res, 404, { ok: false, error: "Route not found." });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`AgentBond Lite running at http://${HOST}:${PORT}`);
});
