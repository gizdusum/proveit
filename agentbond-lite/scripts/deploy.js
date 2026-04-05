const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const operator = process.env.REPORT_OPERATOR_ADDRESS || deployer.address;

  console.log("Deploying Phase 2 contracts with deployer:", deployer.address);
  console.log("Report operator:", operator);

  const ReportRegistry = await hre.ethers.getContractFactory("ReportRegistry");
  const reportRegistry = await ReportRegistry.deploy();
  await reportRegistry.waitForDeployment();

  const SettlementEscrow = await hre.ethers.getContractFactory("SettlementEscrow");
  const settlementEscrow = await SettlementEscrow.deploy(await reportRegistry.getAddress());
  await settlementEscrow.waitForDeployment();

  const reportRegistryAddress = await reportRegistry.getAddress();
  const settlementEscrowAddress = await settlementEscrow.getAddress();

  console.log("ReportRegistry deployed to:", reportRegistryAddress);
  console.log("SettlementEscrow deployed to:", settlementEscrowAddress);

  const reportRegistryArtifact = await hre.artifacts.readArtifact("ReportRegistry");
  const settlementEscrowArtifact = await hre.artifacts.readArtifact("SettlementEscrow");
  const output = {
    contractName: "AgentBondLitePhase2",
    address: reportRegistryAddress,
    chainId: hre.network.config.chainId,
    network: hre.network.name,
    rpcUrl: hre.network.config.url || null,
    operator,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      reportRegistry: {
        contractName: "ReportRegistry",
        address: reportRegistryAddress,
        abi: reportRegistryArtifact.abi
      },
      settlementEscrow: {
        contractName: "SettlementEscrow",
        address: settlementEscrowAddress,
        abi: settlementEscrowArtifact.abi
      }
    },
    abi: reportRegistryArtifact.abi
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  const filePath = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

  console.log("Deployment file written to:", filePath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
