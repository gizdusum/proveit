const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PORT = Number(process.env.PORT || 8788);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DEPLOYMENT_FILE = path.join(ROOT, "deployments", "etherlinkTestnet.json");
const ABI_FILE = path.join(PUBLIC_DIR, "agentbond-lite.abi.json");

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
  if (!fs.existsSync(ABI_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(ABI_FILE, "utf8"));
}

function buildFallbackReport(payload = {}) {
  const taskTitle = String(payload.title || "Untitled task").trim();
  const brief = String(payload.brief || "").trim();
  const focus = String(payload.focus || "risk, execution, and recommendation").trim();

  const summary = `AgentBond prepared a structured AI task report for "${taskTitle}".`;
  const findings = [
    "The task is scoped tightly enough for a single AI operator to complete in one pass.",
    "The deliverable should emphasize verifiable evidence, clear reasoning, and a final recommendation.",
    "Onchain settlement is appropriate because the result can be reviewed and accepted by the client."
  ];
  const recommendation = `Deliver a concise report focused on ${focus}. Use a hash-anchored submission so the client can verify the exact output that was reviewed.`;

  return {
    mode: "fallback",
    model: "template",
    reportMarkdown: [
      `# ${taskTitle}`,
      "",
      "## Task Summary",
      summary,
      "",
      "## Brief",
      brief || "No extra brief provided.",
      "",
      "## Key Findings",
      ...findings.map((item) => `- ${item}`),
      "",
      "## Recommendation",
      recommendation
    ].join("\n")
  };
}

async function buildOpenAIReport(payload = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackReport(payload);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const title = String(payload.title || "Untitled task").trim();
  const brief = String(payload.brief || "").trim();
  const focus = String(payload.focus || "risk, execution, and recommendation").trim();

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are the AI operator for AgentBond Lite. Produce concise, professional English task reports for onchain settlement. Respond in markdown."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Task title: ${title}\nTask brief: ${brief}\nFocus: ${focus}\n\nReturn markdown with sections: Task Summary, Evidence Plan, Findings, Recommendation.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || "OpenAI report generation failed.";
      throw new Error(message);
    }

    return {
      mode: "openai",
      model,
      reportMarkdown: data.output_text || buildFallbackReport(payload).reportMarkdown
    };
  } catch (error) {
    const fallback = buildFallbackReport(payload);
    return {
      ...fallback,
      mode: "fallback",
      model: "template",
      note: error instanceof Error ? error.message : "OpenAI request failed."
    };
  }
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
        abi
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/ai/report") {
      const raw = await readBody(req);
      const payload = raw ? JSON.parse(raw) : {};
      const report = await buildOpenAIReport(payload);
      sendJson(res, 200, { ok: true, ...report });
      return;
    }

    if (req.method === "GET" && pathname === "/api/demo/task") {
      sendJson(res, 200, {
        ok: true,
        task: {
          title: "Analyze governance risk for a new Etherlink dApp launch",
          brief:
            "Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.",
          focus: "governance, treasury controls, and upgrade risk"
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
