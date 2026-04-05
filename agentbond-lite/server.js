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
  const mode = String(payload.mode || "governance").trim();
  const language = String(payload.language || "en").trim();

  const localized = {
    en: {
      summary: `AgentBond prepared a structured AI task report for "${taskTitle}".`,
      briefHeading: "Brief",
      findingsHeading: "Key Findings",
      recommendationHeading: "Recommendation"
    },
    tr: {
      summary: `AgentBond "${taskTitle}" icin yapilandirilmis bir AI gorev raporu hazirladi.`,
      briefHeading: "Ozet",
      findingsHeading: "Temel Bulgular",
      recommendationHeading: "Oneri"
    }
  };

  const modeSections = {
    governance: {
      findings: {
        en: [
        "The proposal should be evaluated for treasury authority, upgrade permissions, and concentration of operational power.",
        "The most useful output is a recommendation that explains whether execution risk is acceptable at launch.",
        "This task is a strong fit for onchain settlement because the client can review the final governance recommendation."
        ],
        tr: [
          "Teklif treasury yetkisi, upgrade izinleri ve operasyonel gucun yogunlasmasi acisindan degerlendirilmelidir.",
          "En yararli cikti, uygulama riskinin kabul edilebilir olup olmadigini aciklayan net bir tavsiyedir.",
          "Musteri nihai governance tavsiyesini gozden gecirebildigi icin bu gorev onchain settlement icin uygundur."
        ]
      },
      recommendation: {
        en: `Deliver governance intel focused on ${focus}. End with a recommendation of proceed, revise, or avoid.`,
        tr: `${focus} odakli bir governance intel raporu uret. Sonunda devam et, revize et veya kacin tavsiyesi ver.`
      },
      heading: { en: "Governance Read", tr: "Governance Ozeti" }
    },
    token: {
      findings: {
        en: [
        "The market-signals view should separate token fundamentals from crowd conviction and event-driven narrative.",
        "Prediction-market style framing is useful when it is treated as sentiment input, not a source of truth.",
        "The final output should highlight where crowd expectations may diverge from structural token risk."
        ],
        tr: [
          "Market signals bakisi token temellerini kalabalik inanci ve event kaynakli anlati dinamiklerinden ayirmalidir.",
          "Prediction-market benzeri cerceve, dogrudan gercek kabul edilmeden sentiment girdisi olarak kullanildiginda faydalidir.",
          "Nihai cikti, kalabalik beklentilerinin yapisal token riskinden nerede ayrildigini gostermelidir."
        ]
      },
      recommendation: {
        en: `Deliver a market signals brief focused on ${focus}. Include one section on crowd expectations versus fundamentals.`,
        tr: `${focus} odakli bir market signals ozeti uret. Kalabalik beklentileri ile temeller arasindaki farklara ayri bir bolum ekle.`
      },
      heading: { en: "Market Signals", tr: "Piyasa Sinyalleri" }
    },
    nft: {
      findings: {
        en: [
        "The identity graph should focus on suspicious wallet clustering, artificial volume, and reputation-sensitive behavior.",
        "The best output distinguishes organic collector activity from coordinated or manipulative flow.",
        "A short identity risk summary is well suited for hash-anchored onchain settlement."
        ],
        tr: [
          "Identity graph supheli wallet cluster'lari, yapay hacim ve itibar hassas davranislara odaklanmalidir.",
          "En iyi cikti organik koleksiyoncu aktivitesi ile koordineli veya manipule akis arasindaki farki gosterir.",
          "Kisa bir kimlik riski ozeti hash-anchored onchain settlement icin uygundur."
        ]
      },
      recommendation: {
        en: `Deliver an identity graph summary focused on ${focus}. End with a trust assessment for the collection or wallet cluster.`,
        tr: `${focus} odakli bir identity graph ozeti uret. Sonunda koleksiyon veya wallet cluster icin bir guven degerlendirmesi ver.`
      },
      heading: { en: "Identity Graph", tr: "Kimlik Grafigi" }
    }
  };

  const selected = modeSections[mode] || modeSections.governance;
  const lang = localized[language] ? language : "en";
  const selectedHeading = selected.heading[lang] || selected.heading.en;
  const selectedFindings = selected.findings[lang] || selected.findings.en;
  const selectedRecommendation = selected.recommendation[lang] || selected.recommendation.en;
  const copy = localized[lang];

  return {
    mode: "fallback",
    model: "template",
    reportMarkdown: [
      `# ${taskTitle}`,
      "",
      `## ${selectedHeading}`,
      copy.summary,
      "",
      `## ${copy.briefHeading}`,
      brief || "No extra brief provided.",
      "",
      `## ${copy.findingsHeading}`,
      ...selectedFindings.map((item) => `- ${item}`),
      "",
      `## ${copy.recommendationHeading}`,
      selectedRecommendation
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
  const mode = String(payload.mode || "governance").trim();
  const language = String(payload.language || "en").trim();

  const modeInstruction =
    mode === "token"
      ? "You are writing a Market Signals brief. Include sections: Market Frame, Fundamental Risks, Crowd Expectations, Divergence, Recommendation."
      : mode === "nft"
        ? "You are writing an Identity Graph brief. Include sections: Activity Pattern, Suspicious Clusters, Reputation Risk, Recommendation."
        : "You are writing Governance Intel. Include sections: Proposal Summary, Governance Risks, Treasury/Upgrade Risk, Recommendation.";
  const languageInstruction =
    language === "tr"
      ? "Write the report in Turkish."
      : language === "es"
        ? "Write the report in Spanish."
        : language === "fr"
          ? "Write the report in French."
          : language === "de"
            ? "Write the report in German."
            : language === "ja"
              ? "Write the report in Japanese."
              : "Write the report in English.";

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
                text: `Task mode: ${mode}\nTask title: ${title}\nTask brief: ${brief}\nFocus: ${focus}\n\n${modeInstruction}\n${languageInstruction}`
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
