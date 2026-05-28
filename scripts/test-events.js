import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const contract = LandRegistry.attach(contractAddress);

  const landId = "LAND" + Math.floor(Math.random() * 1000000);
  const location = "Nairobi, Kenya";
  const area = 1000;

  console.log(`Registering land ${landId}...`);
  const tx = await contract.registerLand(landId, location, area);
  await tx.wait();
  console.log("Land registered!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
