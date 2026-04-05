const { randomUUID } = require("crypto");
const { ethers } = require("ethers");

const MODE_ALIASES = {
  governance: "governance",
  governance_intel: "governance",
  token: "token_risk",
  token_risk: "token_risk",
  treasury: "treasury",
  upgrade: "upgrade_risk",
  upgrade_risk: "upgrade_risk"
};

const RECOMMENDATION_ALIASES = {
  GO: "GO",
  PROCEED: "GO",
  GREENLIGHT: "GO",
  REVISE: "REVISE",
  MODIFY: "REVISE",
  NEEDS_CHANGES: "REVISE",
  AVOID: "AVOID",
  REJECT: "AVOID",
  BLOCK: "AVOID"
};

function normalizeMode(input) {
  return MODE_ALIASES[String(input || "governance").trim().toLowerCase()] || "governance";
}

function normalizeRecommendation(input) {
  const raw = String(input || "REVISE")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z_]/g, "");
  return RECOMMENDATION_ALIASES[raw] || "REVISE";
}

function recommendationToEnum(recommendation) {
  const normalized = normalizeRecommendation(recommendation);
  if (normalized === "GO") return 1;
  if (normalized === "REVISE") return 2;
  if (normalized === "AVOID") return 3;
  return 0;
}

function modeToEnum(mode) {
  const normalized = normalizeMode(mode);
  if (normalized === "governance") return 0;
  if (normalized === "token_risk") return 1;
  if (normalized === "treasury") return 2;
  return 3;
}

function clampConfidence(input) {
  const value = Number(input);
  if (!Number.isFinite(value)) return 7000;
  return Math.max(0, Math.min(10000, Math.round(value)));
}

function truncateText(input, limit) {
  const text = String(input || "").trim();
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

function cleanFindings(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => truncateText(item, 220))
    .filter(Boolean)
    .slice(0, 5);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function hashUtf8(value) {
  return ethers.keccak256(ethers.toUtf8Bytes(value));
}

function modeCopy(mode, language) {
  const normalized = normalizeMode(mode);
  const copy = {
    governance: {
      en: {
        title: "Governance intelligence review",
        summary: "Governance and upgrade risk should be reviewed before launch.",
        findings: [
          "Treasury controls should be checked for concentration of power.",
          "Upgrade permissions should be reviewed for unilateral execution risk.",
          "A launch recommendation should explain whether current guardrails are sufficient."
        ],
        recommendation: "REVISE",
        confidence: 7600,
        reportHeading: "Governance Intelligence"
      },
      tr: {
        title: "Yönetişim istihbaratı incelemesi",
        summary: "Yönetişim ve upgrade riski lansmandan önce gözden geçirilmelidir.",
        findings: [
          "Treasury kontrolleri yetki yoğunlaşması açısından kontrol edilmelidir.",
          "Upgrade izinleri tek taraflı uygulama riski açısından incelenmelidir.",
          "Lansman tavsiyesi mevcut koruma katmanlarının yeterli olup olmadığını açıklamalıdır."
        ],
        recommendation: "REVISE",
        confidence: 7600,
        reportHeading: "Yönetişim İstihbaratı"
      }
    },
    token_risk: {
      en: {
        title: "Token risk review",
        summary: "Token structure and crowd expectations should be compared before launch.",
        findings: [
          "Token fundamentals should be separated from short-term market narrative.",
          "Admin permissions and liquidity structure can dominate launch risk.",
          "A usable verdict should show where conviction diverges from structure."
        ],
        recommendation: "REVISE",
        confidence: 7300,
        reportHeading: "Token Risk Review"
      },
      tr: {
        title: "Token risk incelemesi",
        summary: "Token yapısı ile kalabalık beklentileri lansmandan önce birlikte değerlendirilmelidir.",
        findings: [
          "Token temelleri kısa vadeli piyasa anlatısından ayrıştırılmalıdır.",
          "Yönetici izinleri ve likidite yapısı lansman riskini belirleyebilir.",
          "Kullanılabilir bir verdict, inancın yapıdan nerede ayrıştığını göstermelidir."
        ],
        recommendation: "REVISE",
        confidence: 7300,
        reportHeading: "Token Risk İncelemesi"
      }
    },
    treasury: {
      en: {
        title: "Treasury control review",
        summary: "Treasury execution rules should be reviewed for operational concentration.",
        findings: [
          "Execution permissions should be mapped to specific actors and thresholds.",
          "Emergency powers should be bounded and legible.",
          "The treasury path should be evaluated for delay, review, and override risk."
        ],
        recommendation: "REVISE",
        confidence: 7500,
        reportHeading: "Treasury Review"
      },
      tr: {
        title: "Treasury kontrol incelemesi",
        summary: "Treasury yürütme kuralları operasyonel güç yoğunlaşması açısından incelenmelidir.",
        findings: [
          "Yürütme izinleri belirli aktörler ve eşikler üzerinden haritalanmalıdır.",
          "Acil durum yetkileri sınırlandırılmış ve anlaşılır olmalıdır.",
          "Treasury akışı gecikme, inceleme ve override riski açısından değerlendirilmelidir."
        ],
        recommendation: "REVISE",
        confidence: 7500,
        reportHeading: "Treasury İncelemesi"
      }
    },
    upgrade_risk: {
      en: {
        title: "Upgrade risk review",
        summary: "Upgrade authority should be reviewed for centralization and execution safety.",
        findings: [
          "Upgrade paths should disclose who can ship changes and how quickly.",
          "Proxy and admin design should be checked for override risk.",
          "A meaningful verdict should explain whether review delays are strong enough."
        ],
        recommendation: "REVISE",
        confidence: 7400,
        reportHeading: "Upgrade Risk Review"
      },
      tr: {
        title: "Upgrade risk incelemesi",
        summary: "Upgrade yetkisi merkezileşme ve uygulama güvenliği açısından incelenmelidir.",
        findings: [
          "Upgrade yolları değişiklikleri kimin ne hızla gönderebildiğini açıkça göstermelidir.",
          "Proxy ve admin tasarımı override riski açısından kontrol edilmelidir.",
          "Anlamlı bir verdict, inceleme gecikmelerinin yeterli olup olmadığını açıklamalıdır."
        ],
        recommendation: "REVISE",
        confidence: 7400,
        reportHeading: "Upgrade Risk İncelemesi"
      }
    }
  };

  const localized = copy[normalized] || copy.governance;
  return localized[language] || localized.en;
}

function buildFallbackStructuredReport(payload = {}) {
  const language = String(payload.language || "en").trim() === "tr" ? "tr" : "en";
  const mode = normalizeMode(payload.mode);
  const copy = modeCopy(mode, language);
  const title = truncateText(payload.title || copy.title, 120) || copy.title;
  const prompt = truncateText(payload.prompt || payload.request || payload.brief || title, 600);
  const shortSummary = truncateText(payload.shortSummary || copy.summary, 180);
  const keyFindings = cleanFindings(copy.findings);
  const recommendation = normalizeRecommendation(payload.recommendation || copy.recommendation);
  const confidenceBps = clampConfidence(payload.confidence_bps || copy.confidence);

  const fullReportMarkdown = [
    `# ${title}`,
    "",
    `## ${language === "tr" ? "Kısa Özet" : "Short Summary"}`,
    shortSummary,
    "",
    `## ${language === "tr" ? "Temel Bulgular" : "Key Findings"}`,
    ...keyFindings.map((item) => `- ${item}`),
    "",
    `## ${language === "tr" ? "Öneri" : "Recommendation"}`,
    recommendation,
    "",
    `## ${language === "tr" ? "Güven Skoru" : "Confidence Score"}`,
    `${(confidenceBps / 100).toFixed(2)}%`,
    "",
    `## ${language === "tr" ? "Detaylı Not" : "Detailed Note"}`,
    truncateText(payload.brief || prompt, 800)
  ].join("\n");

  return buildCanonicalReport({
    requestId: `fallback-${randomUUID()}`,
    mode,
    title,
    prompt,
    shortSummary,
    keyFindings,
    recommendation,
    confidenceBps,
    fullReportMarkdown,
    contentURI: null,
    generatedBy: "template"
  });
}

function buildCanonicalReport(input) {
  const mode = normalizeMode(input.mode);
  const recommendation = normalizeRecommendation(input.recommendation);
  const confidenceBps = clampConfidence(input.confidenceBps);
  const shortSummary = truncateText(input.shortSummary, 180);
  const keyFindings = cleanFindings(input.keyFindings);

  const verdict = {
    version: "1",
    mode,
    recommendation,
    confidence_bps: confidenceBps,
    summary: shortSummary,
    key_findings: keyFindings
  };

  const canonicalVerdictJson = stableStringify(verdict);
  const fullReportMarkdown = String(input.fullReportMarkdown || "").trim();

  return {
    request_id: input.requestId || `rep-${randomUUID()}`,
    title: truncateText(input.title, 120),
    prompt: truncateText(input.prompt, 1200),
    mode,
    short_summary: shortSummary,
    key_findings: keyFindings,
    recommendation,
    confidence_bps: confidenceBps,
    full_report_markdown: fullReportMarkdown,
    verdict,
    canonical_verdict_json: canonicalVerdictJson,
    verdict_hash: hashUtf8(canonicalVerdictJson),
    report_hash: hashUtf8(fullReportMarkdown),
    content_uri: input.contentURI || null,
    generated_at: new Date().toISOString(),
    generated_by: input.generatedBy || "openai",
    onchain_payload: {
      mode_enum: modeToEnum(mode),
      recommendation_enum: recommendationToEnum(recommendation),
      confidence_bps: confidenceBps,
      verdict_hash: hashUtf8(canonicalVerdictJson),
      report_hash: hashUtf8(fullReportMarkdown)
    }
  };
}

function extractJsonObject(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Empty model output.");

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return JSON.parse(trimmed);
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return JSON.parse(fencedMatch[1].trim());
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }

  throw new Error("Could not parse structured JSON from model output.");
}

async function buildOpenAIStructuredReport(payload = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackStructuredReport(payload);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const language = String(payload.language || "en").trim() === "tr" ? "Turkish" : "English";
  const mode = normalizeMode(payload.mode);
  const title = truncateText(payload.title || modeCopy(mode, language === "Turkish" ? "tr" : "en").title, 120);
  const prompt = truncateText(payload.prompt || payload.brief || title, 1200);
  const brief = truncateText(payload.brief || prompt, 1200);
  const focus = truncateText(payload.focus || "governance risk, treasury controls, upgrade safety", 300);

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
                "You are the AI operator for AgentBond Lite. Return only valid JSON. Your job is to produce a governance-grade research verdict that can be anchored onchain. Keep findings concrete, concise, and professional."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Mode: ${mode}`,
                `Language: ${language}`,
                `Title: ${title}`,
                `Prompt: ${prompt}`,
                `Brief: ${brief}`,
                `Focus: ${focus}`,
                "",
                "Return a JSON object with exactly these fields:",
                "{",
                '  "short_summary": "string, <= 180 chars",',
                '  "key_findings": ["array of 3 to 5 concise findings"],',
                '  "recommendation": "GO | REVISE | AVOID",',
                '  "confidence_bps": "integer between 0 and 10000",',
                '  "full_report_markdown": "markdown string with sections: Short Summary, Key Findings, Recommendation, Confidence Score, Detailed Analysis"',
                "}",
                "",
                "The recommendation must be strict and credible. Confidence must be conservative and integer."
              ].join("\n")
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI report generation failed.");
  }

  const parsed = extractJsonObject(data.output_text || "");

  return buildCanonicalReport({
    requestId: `openai-${randomUUID()}`,
    mode,
    title,
    prompt,
    shortSummary: parsed.short_summary,
    keyFindings: parsed.key_findings,
    recommendation: parsed.recommendation,
    confidenceBps: parsed.confidence_bps,
    fullReportMarkdown: parsed.full_report_markdown,
    contentURI: payload.content_uri || null,
    generatedBy: model
  });
}

async function generateStructuredReport(payload = {}) {
  try {
    return await buildOpenAIStructuredReport(payload);
  } catch (error) {
    const fallback = buildFallbackStructuredReport(payload);
    return {
      ...fallback,
      note: error instanceof Error ? error.message : "OpenAI request failed."
    };
  }
}

function buildAnchorPayload(report, params = {}) {
  return {
    requester: params.requester_address || null,
    operator: params.operator_address || null,
    title: report.title,
    content_uri: report.content_uri || "",
    mode_enum: report.onchain_payload.mode_enum,
    recommendation_enum: report.onchain_payload.recommendation_enum,
    confidence_bps: report.onchain_payload.confidence_bps,
    verdict_hash: report.onchain_payload.verdict_hash,
    report_hash: report.onchain_payload.report_hash
  };
}

module.exports = {
  normalizeMode,
  normalizeRecommendation,
  recommendationToEnum,
  modeToEnum,
  stableStringify,
  hashUtf8,
  generateStructuredReport,
  buildFallbackStructuredReport,
  buildAnchorPayload
};
