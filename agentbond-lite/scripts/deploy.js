const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;

  console.log("Deploying AgentBondLite with:", deployer.address);
  console.log("Treasury:", treasury);

  const Factory = await hre.ethers.getContractFactory("AgentBondLite");
  const contract = await Factory.deploy(treasury);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("AgentBondLite deployed to:", address);

  const artifact = await hre.artifacts.readArtifact("AgentBondLite");
  const output = {
    contractName: "AgentBondLite",
    address,
    chainId: hre.network.config.chainId,
    network: hre.network.name,
    rpcUrl: hre.network.config.url || null,
    treasury,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: artifact.abi
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
