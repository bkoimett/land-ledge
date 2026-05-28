const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Factory = await ethers.getContractFactory("LandRegistry");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("LandRegistry deployed to:", address);

  // Save address + ABI for Integration Engineer
  const artifact = await ethers.getContractFactory("LandRegistry");
  fs.writeFileSync("./deployments/contract.json", JSON.stringify({
    address,
    abi: JSON.parse(artifact.interface.formatJson()),
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  }, null, 2));

  con
main().catch(console.error);sole.log("Saved to deployments/contract.json");
}

