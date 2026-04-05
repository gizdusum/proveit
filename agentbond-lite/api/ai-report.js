const { generateStructuredReport } = require("../lib/report-engine");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const report = await generateStructuredReport(payload);

    res.status(200).json({
      ok: true,
      mode: report.generated_by === "template" ? "fallback" : "openai",
      model: report.generated_by,
      report,
      reportMarkdown: report.full_report_markdown
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
};
