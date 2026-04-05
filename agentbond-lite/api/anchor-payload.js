const { buildAnchorPayload } = require("../lib/report-engine");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!payload.report) {
      res.status(400).json({ ok: false, error: "Missing report payload." });
      return;
    }

    const registryPayload = buildAnchorPayload(payload.report, payload);

    res.status(200).json({
      ok: true,
      registry_payload: registryPayload
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
};
