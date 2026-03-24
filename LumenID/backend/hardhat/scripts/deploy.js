import hre from 'hardhat';

async function main() {
  console.log('Deploying LumenIDRegistry...');

  const LumenIDRegistry = await hre.ethers.getContractFactory('LumenIDRegistry');
  const registry = await LumenIDRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log('✅ LumenIDRegistry deployed to:', address);
  console.log('Copy this into your backend .env as REGISTRY_CONTRACT_ADDRESS=', address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});