module.exports = function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(
    JSON.stringify({
      ok: true,
      task: {
        title: "Produce governance intel for a new Etherlink dApp launch",
        brief:
          "Read the launch proposal, identify treasury and upgrade risks, summarize the governance tradeoffs, and end with a clear recommendation.",
        focus: "proposal intent, treasury controls, upgrade risk, and execution recommendation",
        mode: "governance"
      }
    })
  );
};
