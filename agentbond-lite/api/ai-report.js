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
      summary: `AgentBond "${taskTitle}" için yapılandırılmış bir yapay zekâ görev raporu hazırladı.`,
      briefHeading: "Özet",
      findingsHeading: "Temel Bulgular",
      recommendationHeading: "Öneri"
    },
    es: {
      summary: `AgentBond preparo un informe estructurado de IA para "${taskTitle}".`,
      briefHeading: "Resumen",
      findingsHeading: "Hallazgos clave",
      recommendationHeading: "Recomendación"
    },
    fr: {
      summary: `AgentBond a préparé un rapport IA structuré pour "${taskTitle}".`,
      briefHeading: "Brief",
      findingsHeading: "Points clés",
      recommendationHeading: "Recommendation"
    },
    de: {
      summary: `AgentBond hat einen strukturierten KI-Bericht für "${taskTitle}" erstellt.`,
      briefHeading: "Kurzbrief",
      findingsHeading: "Wichtige Erkenntnisse",
      recommendationHeading: "Empfehlung"
    },
    ja: {
      summary: `AgentBond prepared a structured AI task report for "${taskTitle}".`,
      briefHeading: "Brief",
      findingsHeading: "Key Findings",
      recommendationHeading: "Recommendation"
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
          "Teklif treasury yetkisi, upgrade izinleri ve operasyonel gücün yoğunlaşması açısından değerlendirilmelidir.",
          "En yararlı çıktı, uygulama riskinin kabul edilebilir olup olmadığını açıklayan net bir tavsiyedir.",
          "Müşteri nihai yönetişim tavsiyesini gözden geçirebildiği için bu görev onchain settlement için uygundur."
        ]
      },
      recommendation: {
        en: `Deliver governance intel focused on ${focus}. End with a recommendation of proceed, revise, or avoid.`,
        tr: `${focus} odaklı bir yönetişim istihbaratı raporu üret. Sonunda devam et, revize et veya kaçın tavsiyesi ver.`
      },
      heading: { en: "Governance Read", tr: "Yönetişim Özeti" }
    },
    token: {
      findings: {
        en: [
        "The market-signals view should separate token fundamentals from crowd conviction and event-driven narrative.",
        "Prediction-market style framing is useful when it is treated as sentiment input, not a source of truth.",
        "The final output should highlight where crowd expectations may diverge from structural token risk."
        ],
        tr: [
          "Piyasa sinyalleri bakışı token temellerini kalabalık inancı ve olay kaynaklı anlatı dinamiklerinden ayırmalıdır.",
          "Prediction-market benzeri çerçeve, doğrudan gerçek kabul edilmeden duygu girdisi olarak kullanıldığında faydalıdır.",
          "Nihai çıktı, kalabalık beklentilerinin yapısal token riskinden nerede ayrıldığını göstermelidir."
        ]
      },
      recommendation: {
        en: `Deliver a market signals brief focused on ${focus}. Include one section on crowd expectations versus fundamentals.`,
        tr: `${focus} odaklı bir piyasa sinyalleri özeti üret. Kalabalık beklentileri ile temeller arasındaki farklara ayrı bir bölüm ekle.`
      },
      heading: { en: "Market Signals", tr: "Piyasa Sinyalleri" }
    },
    identity: {
      findings: {
        en: [
        "The identity graph should focus on suspicious wallet clustering, artificial volume, and reputation-sensitive behavior.",
        "The best output distinguishes organic collector activity from coordinated or manipulative flow.",
        "A short identity risk summary is well suited for hash-anchored onchain settlement."
        ],
        tr: [
          "Kimlik grafiği şüpheli cüzdan kümelerine, yapay hacme ve itibara hassas davranışlara odaklanmalıdır.",
          "En iyi çıktı organik koleksiyoncu aktivitesi ile koordineli veya manipüle akış arasındaki farkı gösterir.",
          "Kısa bir kimlik riski özeti hash-anchored onchain settlement için uygundur."
        ]
      },
      recommendation: {
        en: `Deliver an identity graph summary focused on ${focus}. End with a trust assessment for the collection or wallet cluster.`,
        tr: `${focus} odaklı bir kimlik grafiği özeti üret. Sonunda koleksiyon veya cüzdan kümesi için bir güven değerlendirmesi ver.`
      },
      heading: { en: "Identity Graph", tr: "Kimlik Grafiği" }
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
      : mode === "identity"
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
                  "You are the AI operator for AgentBond Lite. Produce concise, professional task reports for onchain settlement. Respond in markdown and follow the requested output language."
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
      throw new Error(data?.error?.message || "OpenAI report generation failed.");
    }

    return {
      mode: "openai",
      model,
      reportMarkdown: data.output_text || buildFallbackReport(payload).reportMarkdown
    };
  } catch (error) {
    return {
      ...buildFallbackReport(payload),
      note: error instanceof Error ? error.message : "OpenAI request failed."
    };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const report = await buildOpenAIReport(payload);
    res.status(200).json({ ok: true, ...report });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
};
