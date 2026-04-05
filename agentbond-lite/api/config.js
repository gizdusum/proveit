const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEPLOYMENT_FILE = path.join(ROOT, "deployments", "etherlinkTestnet.json");
const LEGACY_ABI_FILE = path.join(ROOT, "public", "agentbond-lite.abi.json");
const REPORT_REGISTRY_ABI_FILE = path.join(ROOT, "public", "report-registry.abi.json");
const SETTLEMENT_ESCROW_ABI_FILE = path.join(ROOT, "public", "settlement-escrow.abi.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = function handler(_req, res) {
  const deployment = readJson(DEPLOYMENT_FILE);
  const abi = readJson(LEGACY_ABI_FILE);
  const reportRegistryAbi = readJson(REPORT_REGISTRY_ABI_FILE);
  const settlementEscrowAbi = readJson(SETTLEMENT_ESCROW_ABI_FILE);

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
      abi,
      contracts: {
        reportRegistry: {
          address: deployment?.contracts?.reportRegistry?.address || null,
          abi: reportRegistryAbi || deployment?.contracts?.reportRegistry?.abi || null
        },
        settlementEscrow: {
          address: deployment?.contracts?.settlementEscrow?.address || null,
          abi: settlementEscrowAbi || deployment?.contracts?.settlementEscrow?.abi || null
        }
      }
    })
  );
};
