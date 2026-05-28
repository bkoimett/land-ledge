import { network } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";

async function main() {
  const { ethers } = await network.connect();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Factory = await ethers.getContractFactory("LandRegistry");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("LandRegistry deployed to:", address);

  mkdirSync("./deployments", { recursive: true });
  writeFileSync(
    "./deployments/contract.json",
    JSON.stringify(
      {
        address,
        network: network.name,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("Saved to deployments/contract.json");
}

main().catch(console.error);