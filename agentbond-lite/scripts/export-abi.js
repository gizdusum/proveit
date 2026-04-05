const fs = require("fs");
const path = require("path");

function main() {
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "AgentBondLite.sol",
    "AgentBondLite.json"
  );
  const outputPath = path.join(__dirname, "..", "public", "agentbond-lite.abi.json");

  if (!fs.existsSync(artifactPath)) {
    throw new Error("Compile the contract first with `npm run compile`.");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));
  console.log("ABI exported to:", outputPath);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
