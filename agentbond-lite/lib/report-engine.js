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
  BLOCK: "AVOID",
  INSUFFICIENT_EVIDENCE: "REVISE"
};

const URL_PATTERN = /\bhttps?:\/\/[^\s)]+/gi;
const MAX_SOURCE_COUNT = 4;
const MAX_SOURCE_TEXT = 3200;
const REQUEST_TIMEOUT_MS = 8000;

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

function cleanStringList(items, limit = 220, maxItems = 5) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => truncateText(item, limit))
    .filter(Boolean)
    .slice(0, maxItems);
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

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractUrlList(payload = {}) {
  const explicit = [payload.sources_text, payload.source_urls, payload.website_url, payload.docs_url]
    .filter(Boolean)
    .join("\n");
  const promptMatches = String(payload.prompt || "").match(URL_PATTERN) || [];
  const raw = `${explicit}\n${promptMatches.join("\n")}`;

  return Array.from(
    new Set(
      raw
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => /^https?:\/\//i.test(item))
    )
  ).slice(0, MAX_SOURCE_COUNT);
}

function pickTitleFromHtml(html, fallback) {
  const match = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return truncateText(match?.[1] || fallback || "Source", 90);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": "AgentBondLite/1.0",
        Accept: "text/html,application/json,text/plain;q=0.9,*/*;q=0.8",
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchEvidenceSources(payload = {}) {
  const urls = extractUrlList(payload);
  const sources = [];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        sources.push({
          url,
          title: truncateText(new URL(url).hostname, 90),
          snippet: `Failed to fetch source (${response.status}).`,
          status: "error"
        });
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();
      const cleaned =
        contentType.includes("html") || rawText.includes("<html")
          ? stripHtml(rawText)
          : String(rawText).replace(/\s+/g, " ").trim();

      sources.push({
        url,
        title: pickTitleFromHtml(rawText, new URL(url).hostname),
        snippet: truncateText(cleaned, MAX_SOURCE_TEXT),
        status: cleaned ? "ok" : "empty"
      });
    } catch (error) {
      sources.push({
        url,
        title: truncateText(new URL(url).hostname, 90),
        snippet: `Failed to fetch source (${error instanceof Error ? error.message : "unknown error"}).`,
        status: "error"
      });
    }
  }

  return sources;
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
          "The current evidence set is too thin for a launch-grade green light."
        ],
        recommendation: "REVISE",
        confidence: 5200,
        evidence: ["No primary source documents were supplied."],
        unknowns: [
          "Treasury execution thresholds are not verified.",
          "Upgrade path and review delays are not evidenced.",
          "Admin powers are not confirmed from source material."
        ]
      },
      tr: {
        title: "Yönetişim istihbaratı incelemesi",
        summary: "Lansman öncesi yönetişim ve yükseltme riski için daha fazla birincil kaynağa ihtiyaç var.",
        findings: [
          "Treasury kontrolleri yetki yoğunlaşması açısından doğrulanmalıdır.",
          "Upgrade izinleri tek taraflı uygulama riski açısından kanıtla desteklenmelidir.",
          "Mevcut kanıt seti lansman seviyesinde güven vermek için yetersizdir."
        ],
        recommendation: "REVISE",
        confidence: 5200,
        evidence: ["Birincil kaynak doküman sağlanmadı."],
        unknowns: [
          "Treasury eşikleri doğrulanmadı.",
          "Upgrade yolu ve inceleme gecikmeleri kanıtlanmadı.",
          "Admin yetkileri kaynak materyalden teyit edilmedi."
        ]
      }
    },
    token_risk: {
      en: {
        title: "Token risk review",
        summary: "The token can only be assessed credibly if utility, emissions, admin controls, and liquidity are tied to evidence.",
        findings: [
          "Token utility claims require primary documentation.",
          "Liquidity and admin permissions can dominate launch risk.",
          "Without evidence, crowd expectations should not be treated as fundamentals."
        ],
        recommendation: "REVISE",
        confidence: 5000,
        evidence: ["No token documentation or official source was supplied."],
        unknowns: [
          "Utility and product role are not verified.",
          "Supply and emissions schedule are not verified.",
          "Liquidity setup and admin controls are not verified."
        ]
      },
      tr: {
        title: "Token risk incelemesi",
        summary: "Token ancak fayda, emisyon, admin kontrolleri ve likidite gerçek kanıta bağlandığında güvenilir biçimde değerlendirilebilir.",
        findings: [
          "Token faydası iddiaları birincil dokümanla desteklenmelidir.",
          "Likidite ve admin izinleri lansman riskini belirleyebilir.",
          "Kanıt yoksa kalabalık beklentileri temel veri gibi ele alınmamalıdır."
        ],
        recommendation: "REVISE",
        confidence: 5000,
        evidence: ["Resmi token dokümanı veya kaynak bağlantısı sağlanmadı."],
        unknowns: [
          "Fayda ve ürün rolü doğrulanmadı.",
          "Arz ve emisyon takvimi doğrulanmadı.",
          "Likidite yapısı ve admin kontrolleri doğrulanmadı."
        ]
      }
    },
    treasury: {
      en: {
        title: "Treasury control review",
        summary: "Treasury analysis is only reliable when execution rules and privileged roles are backed by evidence.",
        findings: [
          "Execution permissions should be mapped to specific actors and thresholds.",
          "Emergency powers should be bounded and legible.",
          "No verified treasury source material was supplied."
        ],
        recommendation: "REVISE",
        confidence: 5200,
        evidence: ["No treasury policy or contract source was supplied."],
        unknowns: [
          "Emergency powers are unknown.",
          "Signer thresholds are unknown.",
          "Review delays and override paths are unknown."
        ]
      },
      tr: {
        title: "Treasury kontrol incelemesi",
        summary: "Treasury analizi ancak yürütme kuralları ve ayrıcalıklı roller kanıtla desteklendiğinde güvenilir olur.",
        findings: [
          "Yürütme izinleri belirli aktörler ve eşikler üzerinden haritalanmalıdır.",
          "Acil durum yetkileri sınırlandırılmış ve anlaşılır olmalıdır.",
          "Doğrulanmış treasury kaynak materyali sağlanmadı."
        ],
        recommendation: "REVISE",
        confidence: 5200,
        evidence: ["Treasury politikası veya kontrat kaynağı sağlanmadı."],
        unknowns: [
          "Acil durum yetkileri bilinmiyor.",
          "İmza eşikleri bilinmiyor.",
          "İnceleme gecikmeleri ve override yolları bilinmiyor."
        ]
      }
    },
    upgrade_risk: {
      en: {
        title: "Upgrade risk review",
        summary: "Upgrade authority should not be greenlit without verified information about admin roles and execution constraints.",
        findings: [
          "Upgrade paths should disclose who can ship changes and how quickly.",
          "Proxy and admin design should be checked for override risk.",
          "No verified implementation or governance source was supplied."
        ],
        recommendation: "REVISE",
        confidence: 5100,
        evidence: ["No implementation docs or official upgrade source was supplied."],
        unknowns: [
          "Who can upgrade is unknown.",
          "How quickly upgrades can execute is unknown.",
          "Whether users receive review delay is unknown."
        ]
      },
      tr: {
        title: "Upgrade risk incelemesi",
        summary: "Admin rolleri ve uygulama kısıtları doğrulanmadan upgrade yetkisine yeşil ışık yakılmamalıdır.",
        findings: [
          "Upgrade yolları değişiklikleri kimin ne hızla gönderebildiğini açıkça göstermelidir.",
          "Proxy ve admin tasarımı override riski açısından kontrol edilmelidir.",
          "Doğrulanmış implementation veya yönetişim kaynağı sağlanmadı."
        ],
        recommendation: "REVISE",
        confidence: 5100,
        evidence: ["Implementation dokümanı veya resmi upgrade kaynağı sağlanmadı."],
        unknowns: [
          "Kimin upgrade yapabildiği bilinmiyor.",
          "Upgrade'lerin ne hızla yürütüldüğü bilinmiyor.",
          "Kullanıcıların inceleme gecikmesi alıp almadığı bilinmiyor."
        ]
      }
    }
  };

  const localized = copy[normalized] || copy.governance;
  return localized[language] || localized.en;
}

function buildFullReportMarkdown({ language, title, shortSummary, keyFindings, recommendation, confidenceBps, evidenceUsed, knownUnknowns, detailedAnalysis }) {
  return [
    `# ${title}`,
    "",
    `## ${language === "tr" ? "Kısa Özet" : "Short Summary"}`,
    shortSummary,
    "",
    `## ${language === "tr" ? "Temel Bulgular" : "Key Findings"}`,
    ...keyFindings.map((item) => `- ${item}`),
    "",
    `## ${language === "tr" ? "Kullanılan Kanıtlar" : "Evidence Used"}`,
    ...(evidenceUsed.length ? evidenceUsed.map((item) => `- ${item}`) : [`- ${language === "tr" ? "Doğrudan kaynak kullanılmadı." : "No direct source was used."}`]),
    "",
    `## ${language === "tr" ? "Bilinen Boşluklar" : "Known Unknowns"}`,
    ...(knownUnknowns.length ? knownUnknowns.map((item) => `- ${item}`) : [`- ${language === "tr" ? "Kritik boşluk bildirilmedi." : "No critical unknowns reported."}`]),
    "",
    `## ${language === "tr" ? "Öneri" : "Recommendation"}`,
    recommendation,
    "",
    `## ${language === "tr" ? "Güven Skoru" : "Confidence Score"}`,
    `${(confidenceBps / 100).toFixed(2)}%`,
    "",
    `## ${language === "tr" ? "Detaylı Analiz" : "Detailed Analysis"}`,
    truncateText(detailedAnalysis, 2400)
  ].join("\n");
}

function buildFallbackStructuredReport(payload = {}) {
  const language = String(payload.language || "en").trim() === "tr" ? "tr" : "en";
  const mode = normalizeMode(payload.mode);
  const copy = modeCopy(mode, language);
  const title = truncateText(payload.title || copy.title, 120) || copy.title;
  const prompt = truncateText(payload.prompt || payload.request || payload.brief || title, 1200);
  const shortSummary = truncateText(payload.shortSummary || copy.summary, 180);
  const keyFindings = cleanStringList(copy.findings);
  const recommendation = normalizeRecommendation(payload.recommendation || copy.recommendation);
  const confidenceBps = clampConfidence(payload.confidence_bps || copy.confidence);
  const evidenceUsed = cleanStringList(copy.evidence, 180, 5);
  const knownUnknowns = cleanStringList(copy.unknowns, 180, 5);

  const fullReportMarkdown = buildFullReportMarkdown({
    language,
    title,
    shortSummary,
    keyFindings,
    recommendation,
    confidenceBps,
    evidenceUsed,
    knownUnknowns,
    detailedAnalysis: payload.brief || prompt
  });

  return buildCanonicalReport({
    requestId: `fallback-${randomUUID()}`,
    mode,
    title,
    prompt,
    shortSummary,
    keyFindings,
    recommendation,
    confidenceBps,
    evidenceUsed,
    knownUnknowns,
    fullReportMarkdown,
    contentURI: null,
    generatedBy: "template",
    sources: []
  });
}

function buildCanonicalReport(input) {
  const mode = normalizeMode(input.mode);
  const recommendation = normalizeRecommendation(input.recommendation);
  const confidenceBps = clampConfidence(input.confidenceBps);
  const shortSummary = truncateText(input.shortSummary, 180);
  const keyFindings = cleanStringList(input.keyFindings);
  const evidenceUsed = cleanStringList(input.evidenceUsed, 180, 6);
  const knownUnknowns = cleanStringList(input.knownUnknowns, 180, 6);
  const sources = Array.isArray(input.sources)
    ? input.sources.map((source) => ({
        url: source.url,
        title: truncateText(source.title, 90),
        status: source.status,
        snippet: truncateText(source.snippet, 260)
      }))
    : [];

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
    evidence_used: evidenceUsed,
    known_unknowns: knownUnknowns,
    recommendation,
    confidence_bps: confidenceBps,
    full_report_markdown: fullReportMarkdown,
    verdict,
    sources,
    source_count: sources.filter((source) => source.status === "ok" && source.snippet).length,
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

function buildSourceBrief(sources, language) {
  if (!sources.length) {
    return language === "Turkish"
      ? "Hiçbir harici kaynak sağlanmadı. Sonuçta bu eksiklik açıkça belirtilmeli ve yeterli kanıt yoksa düşük güven verilmelidir."
      : "No external source was supplied. The report must say this explicitly and lower confidence when evidence is insufficient.";
  }

  return sources
    .map((source, index) => {
      const title = source.title || new URL(source.url).hostname;
      return [
        `Source ${index + 1}: ${title}`,
        `URL: ${source.url}`,
        `Status: ${source.status}`,
        `Snippet: ${truncateText(source.snippet, 1200)}`
      ].join("\n");
    })
    .join("\n\n");
}

async function buildOpenAIStructuredReport(payload = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackStructuredReport(payload);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const languageCode = String(payload.language || "en").trim() === "tr" ? "tr" : "en";
  const language = languageCode === "tr" ? "Turkish" : "English";
  const mode = normalizeMode(payload.mode);
  const localized = modeCopy(mode, languageCode);
  const title = truncateText(payload.title || localized.title, 120);
  const prompt = truncateText(payload.prompt || payload.brief || title, 1200);
  const brief = truncateText(payload.brief || prompt, 1200);
  const focus = truncateText(payload.focus || "governance risk, treasury controls, upgrade safety", 300);
  const assetName = truncateText(payload.asset_name || payload.assetName || "", 80);
  const sources = await fetchEvidenceSources(payload);
  const sourceBrief = buildSourceBrief(sources, language);

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
                "You are the AI operator for AgentBond Lite. Return only valid JSON. You are writing a grounded research verdict for Web3 governance and token-risk decisions. Only rely on the evidence provided. If evidence is missing, say so directly, lower confidence, and avoid fake certainty."
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
                `Asset or proposal name: ${assetName || "Not provided"}`,
                "",
                "Evidence sources:",
                sourceBrief,
                "",
                "Return a JSON object with exactly these fields:",
                "{",
                '  "short_summary": "string, <= 180 chars",',
                '  "key_findings": ["array of 3 to 5 concrete findings grounded in evidence"],',
                '  "evidence_used": ["array of 1 to 6 short bullets describing which evidence informed the report"],',
                '  "known_unknowns": ["array of 1 to 5 short bullets for unresolved gaps"],',
                '  "recommendation": "GO | REVISE | AVOID",',
                '  "confidence_bps": "integer between 0 and 10000",',
                '  "full_report_markdown": "markdown with sections: Short Summary, Key Findings, Evidence Used, Known Unknowns, Recommendation, Confidence Score, Detailed Analysis"',
                "}",
                "",
                "Rules:",
                "- Do not claim facts that are not supported by the evidence block.",
                "- If evidence is insufficient, say so explicitly.",
                "- Token reviews should cover utility, supply/emissions, admin controls, liquidity setup, and known unknowns when possible.",
                "- Governance reviews should cover treasury controls, upgrade path, permission structure, and known unknowns when possible.",
                "- The recommendation must be strict and credible."
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
    evidenceUsed: parsed.evidence_used,
    knownUnknowns: parsed.known_unknowns,
    recommendation: parsed.recommendation,
    confidenceBps: parsed.confidence_bps,
    fullReportMarkdown: parsed.full_report_markdown,
    contentURI: payload.content_uri || null,
    generatedBy: model,
    sources
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
