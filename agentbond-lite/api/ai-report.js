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
