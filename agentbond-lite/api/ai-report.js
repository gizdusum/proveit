function buildFallbackReport(payload = {}) {
  const taskTitle = String(payload.title || "Untitled task").trim();
  const brief = String(payload.brief || "").trim();
  const focus = String(payload.focus || "risk, execution, and recommendation").trim();
  const mode = String(payload.mode || "governance").trim();

  const modeSections = {
    governance: {
      findings: [
        "The proposal should be evaluated for treasury authority, upgrade permissions, and concentration of operational power.",
        "The most useful output is a recommendation that explains whether execution risk is acceptable at launch.",
        "This task is a strong fit for onchain settlement because the client can review the final governance recommendation."
      ],
      recommendation: `Deliver governance intel focused on ${focus}. End with a recommendation of proceed, revise, or avoid.`,
      heading: "Governance Read"
    },
    token: {
      findings: [
        "The market-signals view should separate token fundamentals from crowd conviction and event-driven narrative.",
        "Prediction-market style framing is useful when it is treated as sentiment input, not a source of truth.",
        "The final output should highlight where crowd expectations may diverge from structural token risk."
      ],
      recommendation: `Deliver a market signals brief focused on ${focus}. Include one section on crowd expectations versus fundamentals.`,
      heading: "Market Signals"
    },
    nft: {
      findings: [
        "The identity graph should focus on suspicious wallet clustering, artificial volume, and reputation-sensitive behavior.",
        "The best output distinguishes organic collector activity from coordinated or manipulative flow.",
        "A short identity risk summary is well suited for hash-anchored onchain settlement."
      ],
      recommendation: `Deliver an identity graph summary focused on ${focus}. End with a trust assessment for the collection or wallet cluster.`,
      heading: "Identity Graph"
    }
  };

  const selected = modeSections[mode] || modeSections.governance;

  const summary = `AgentBond prepared a structured AI task report for "${taskTitle}".`;

  return {
    mode: "fallback",
    model: "template",
    reportMarkdown: [
      `# ${taskTitle}`,
      "",
      `## ${selected.heading}`,
      summary,
      "",
      "## Brief",
      brief || "No extra brief provided.",
      "",
      "## Key Findings",
      ...selected.findings.map((item) => `- ${item}`),
      "",
      "## Recommendation",
      selected.recommendation
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

  const modeInstruction =
    mode === "token"
      ? "You are writing a Market Signals brief. Include sections: Market Frame, Fundamental Risks, Crowd Expectations, Divergence, Recommendation."
      : mode === "nft"
        ? "You are writing an Identity Graph brief. Include sections: Activity Pattern, Suspicious Clusters, Reputation Risk, Recommendation."
        : "You are writing Governance Intel. Include sections: Proposal Summary, Governance Risks, Treasury/Upgrade Risk, Recommendation.";

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
                text: `Task mode: ${mode}\nTask title: ${title}\nTask brief: ${brief}\nFocus: ${focus}\n\n${modeInstruction}`
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
