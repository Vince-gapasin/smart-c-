import { ethers } from 'ethers';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ABI = require(path.join(__dirname, '../contracts/LumenIDRegistry.abi.json'));

const RPC_URL          = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.REGISTRY_CONTRACT_ADDRESS;
const PRIVATE_KEY      = process.env.ISSUER_PRIVATE_KEY;

const BLOCKCHAIN_ENABLED = Boolean(RPC_URL && CONTRACT_ADDRESS);

if (!BLOCKCHAIN_ENABLED) {
  console.warn(
    '[blockchain] RPC_URL or REGISTRY_CONTRACT_ADDRESS not set — ' +
    'running in MOCK mode. On-chain calls will be skipped.'
  );
}

let provider       = null;
let signer         = null;
let contract       = null;
let signerContract = null;

if (BLOCKCHAIN_ENABLED) {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  if (PRIVATE_KEY) {
    signer         = new ethers.Wallet(PRIVATE_KEY, provider);
    signerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  } else {
    console.warn(
      '[blockchain] ISSUER_PRIVATE_KEY not set — write operations ' +
      '(issue, revoke) will throw until a key is provided.'
    );
  }
}

export const hashClaims = (claims) => {
  const stable = JSON.stringify(claims, Object.keys(claims).sort());
  return ethers.keccak256(ethers.toUtf8Bytes(stable));
};

export const recordIssuance = async ({ credentialId, recipientDID, claims, metadataURI = '' }) => {
  if (!BLOCKCHAIN_ENABLED) return null;
  if (!signerContract) throw new Error('[blockchain] ISSUER_PRIVATE_KEY is required for write operations');

  const claimsHash = hashClaims(claims);
  const tx = await signerContract.issueCredential(credentialId, recipientDID, claimsHash, metadataURI);
  const receipt = await tx.wait();

  return { txHash: receipt.hash, blockNumber: receipt.blockNumber, claimsHash };
};

export const recordRevocation = async (credentialId, reason = 'Revoked by issuer') => {
  if (!BLOCKCHAIN_ENABLED) return null;
  if (!signerContract) throw new Error('[blockchain] ISSUER_PRIVATE_KEY is required for write operations');

  const tx = await signerContract.revokeCredential(credentialId, reason);
  const receipt = await tx.wait();

  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
};

export const verifyOnChain = async (credentialId, currentClaims) => {
  if (!BLOCKCHAIN_ENABLED) {
    return { onChain: false, tamperProof: false, revoked: false, claimsHash: null, metadataURI: null };
  }

  const [claimsHash, metadataURI, , isRevoked] = await contract.getCredential(credentialId);
  const currentHash = hashClaims(currentClaims);
  const tamperProof = claimsHash !== ethers.ZeroHash && claimsHash === currentHash;

  return { onChain: true, tamperProof, revoked: isRevoked, claimsHash, metadataURI };
};

export const resolveDIDOnChain = async (did) => {
  if (!BLOCKCHAIN_ENABLED) return null;
  const docURI = await contract.resolveDID(did);
  return docURI || null;
};

export const blockchainStatus = () => ({
  enabled:          BLOCKCHAIN_ENABLED,
  rpcConfigured:    Boolean(RPC_URL),
  signerConfigured: Boolean(PRIVATE_KEY),
  contractAddress:  CONTRACT_ADDRESS || null,
});