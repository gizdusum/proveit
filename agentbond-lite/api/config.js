const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEPLOYMENT_FILE = path.join(ROOT, "deployments", "etherlinkTestnet.json");
const ABI_FILE = path.join(ROOT, "public", "agentbond-lite.abi.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = function handler(_req, res) {
  const deployment = readJson(DEPLOYMENT_FILE);
  const abi = readJson(ABI_FILE);

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(
    JSON.stringify({
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
    })
  );
};
