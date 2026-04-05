const fs = require("fs");
const path = require("path");

function main() {
  const contracts = [
    {
      artifactPath: path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "ReportRegistry.sol",
        "ReportRegistry.json"
      ),
      outputPath: path.join(__dirname, "..", "public", "report-registry.abi.json")
    },
    {
      artifactPath: path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "SettlementEscrow.sol",
        "SettlementEscrow.json"
      ),
      outputPath: path.join(__dirname, "..", "public", "settlement-escrow.abi.json")
    }
  ];

  const bundled = {};

  for (const item of contracts) {
    if (!fs.existsSync(item.artifactPath)) {
      throw new Error("Compile the contracts first with `npm run compile`.");
    }

    const artifact = JSON.parse(fs.readFileSync(item.artifactPath, "utf8"));
    fs.writeFileSync(item.outputPath, JSON.stringify(artifact.abi, null, 2));
    bundled[artifact.contractName] = artifact.abi;
    console.log("ABI exported to:", item.outputPath);
  }

  const legacyOutputPath = path.join(__dirname, "..", "public", "agentbond-lite.abi.json");
  fs.writeFileSync(legacyOutputPath, JSON.stringify(bundled.ReportRegistry, null, 2));

  const bundlePath = path.join(__dirname, "..", "public", "contracts.bundle.json");
  fs.writeFileSync(bundlePath, JSON.stringify(bundled, null, 2));
  console.log("ABI bundle exported to:", bundlePath);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
