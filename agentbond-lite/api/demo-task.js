module.exports = function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(
    JSON.stringify({
      ok: true,
      task: {
        title: "Analyze governance risk for a new Etherlink dApp launch",
        brief:
          "Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.",
        focus: "governance, treasury controls, and upgrade risk"
      }
    })
  );
};
