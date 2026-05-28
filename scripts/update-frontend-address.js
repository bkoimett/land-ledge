import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the deployment info
const deploymentPath = path.join(__dirname, '../deployments/contract.json');
const contractPath = path.join(__dirname, '../client/lib/contract.ts');

if (!fs.existsSync(deploymentPath)) {
  console.error('❌ Deployment file not found. Please deploy the contract first.');
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
const contractAddress = deployment.address;

console.log(`📝 Updating frontend with contract address: ${contractAddress}`);

// Read the current contract.ts file
let contractContent = fs.readFileSync(contractPath, 'utf8');

// Replace the address
const addressRegex = /LAND_REGISTRY_ADDRESS = '0x[a-fA-F0-9]{40}'/;
const newAddressLine = `LAND_REGISTRY_ADDRESS = '${contractAddress}'`;

if (addressRegex.test(contractContent)) {
  contractContent = contractContent.replace(addressRegex, newAddressLine);
  fs.writeFileSync(contractPath, contractContent, 'utf8');
  console.log('✅ Frontend contract address updated successfully!');
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Deployed at: ${deployment.deployedAt}`);
} else {
  console.error('❌ Could not find address pattern in contract.ts');
  process.exit(1);
}
