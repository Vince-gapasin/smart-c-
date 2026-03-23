import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY;
const RPC_URL     = 'https://rpc.api.moonbase.moonbeam.network';

const privateKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet   = new ethers.Wallet(privateKey, provider);

console.log('Deploying from wallet:', wallet.address);

const balance = await provider.getBalance(wallet.address);
console.log('Balance:', ethers.formatEther(balance), 'DEV');

const artifact = JSON.parse(
  readFileSync('./hardhat/artifacts/contracts/LumenIDRegistry.sol/LumenIDRegistry.json', 'utf8')
);

const factory  = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

console.log('Deploying to Moonbase Alpha...');
const contract = await factory.deploy();
await contract.waitForDeployment();

const address = await contract.getAddress();
console.log('✅ Deployed to Moonbase Alpha:', address);
console.log('Add this to your .env:');
console.log(`REGISTRY_CONTRACT_ADDRESS=${address}`);