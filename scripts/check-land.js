import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main({ ethers }) {
  const landId = process.argv[2] || "KE2000";
  
  console.log(`\n🔍 Checking land ID: ${landId}\n`);

  // Get deployment address
  const deploymentPath = path.join(__dirname, '../deployments/contract.json');
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deployment.address;

  console.log(`📍 Contract Address: ${contractAddress}\n`);

  // Get contract
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const contract = await LandRegistry.attach(contractAddress);

  try {
    // Try to get land details
    const details = await contract.getLandDetails(landId);
    console.log("✅ Land Found!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Land ID Hash: ${details.landId}`);
    console.log(`Current Owner: ${details.currentOwner}`);
    console.log(`Location: ${details.location}`);
    console.log(`Area (sq meters): ${details.areaSqMeters.toString()}`);
    console.log(`Exists: ${details.exists}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Get history
    const history = await contract.getHistory(landId);
    console.log(`📜 History (${history.length} records):`);
    history.forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.action} by ${record.owner} at ${new Date(Number(record.timestamp) * 1000).toLocaleString()}`);
    });
  } catch (error) {
    console.log("❌ Land Not Found");
    console.log(`Error: ${error.message}\n`);
    
    // Try to get recent events
    console.log("📋 Checking recent LandRegistered events...\n");
    const filter = contract.filters.LandRegistered();
    const events = await contract.queryFilter(filter, -100);
    
    if (events.length === 0) {
      console.log("No lands registered yet.\n");
    } else {
      console.log(`Found ${events.length} registered lands:\n`);
      events.forEach((event, i) => {
        console.log(`${i + 1}. Land ID Hash: ${event.args.landId}`);
        console.log(`   Owner: ${event.args.owner}`);
        console.log(`   Location: ${event.args.location}`);
        console.log(`   Block: ${event.blockNumber}\n`);
      });
    }
  }
}

export default main;
