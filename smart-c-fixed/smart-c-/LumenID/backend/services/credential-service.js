import { v4 as uuidv4 } from 'uuid';
import {
  mockCredentials,
  mockDIDDocuments,
  mockShareTokens,
  mockUsers,
} from '../data/mock-data.js';
import {
  recordIssuance,
  recordRevocation,
  verifyOnChain,
  resolveDIDOnChain,
} from './blockchain.js';
import {
  pinCredentialAssets,
  fetchFromIPFS,
} from './pinata.js';

// ─── READ ─────────────────────────────────────────────────────────────────────

export const getCredentialsByUser = (userId) =>
  mockCredentials.filter((c) => c.recipientUserId === userId);

export const getCredentialById = (id) =>
  mockCredentials.find((c) => c.id === id) || null;

export const getCredentialsByDID = (did) =>
  mockCredentials.filter(
    (c) => c.recipientDID === did || c.issuerDID === did
  );

export const getDIDDocument = async (did) => {
  const docURI = await resolveDIDOnChain(did);
  if (docURI) {
    try {
      const doc = await fetchFromIPFS(docURI);
      return { ...doc, _source: 'ipfs', _docURI: docURI };
    } catch (err) {
      console.error('[getDIDDocument] IPFS fetch failed, falling back to mock:', err.message);
    }
  }
  return mockDIDDocuments[did] || null;
};

export const getPendingCredentials = () =>
  mockCredentials.filter((c) => c.status === 'pending');

export const searchCredentials = ({ did, type, issuer, status }) => {
  let results = [...mockCredentials];
  if (did)    results = results.filter((c) => c.recipientDID === did || c.issuerDID === did);
  if (type)   results = results.filter((c) => c.type === type);
  if (issuer) results = results.filter((c) => c.issuer.toLowerCase().includes(issuer.toLowerCase()));
  if (status) results = results.filter((c) => c.status === status);
  return results;
};

// ─── WRITE — Issuer ───────────────────────────────────────────────────────────

export const issueCredential = async (credentialData) => {
  const {
    type, issuer, issuerDID, recipient, recipientDID,
    recipientUserId, claims, schema, nftImageURI: nftImageInput,
  } = credentialData;

  const id         = `cred-${uuidv4()}`;
  const issuedDate = new Date().toISOString();

  // ── Resolve recipientUserId from DID or email if not supplied ─────────────
  let resolvedUserId = recipientUserId || null;
  if (!resolvedUserId && recipientDID) {
    const found = mockUsers.find((u) => u.did === recipientDID);
    if (found) resolvedUserId = found.id;
  }
  if (!resolvedUserId && claims?.email) {
    const found = mockUsers.find((u) => u.email === claims.email);
    if (found) resolvedUserId = found.id;
  }

  // ── IPFS: upload image + pin metadata ──────────────────────────────────────
  let nftImageURI    = null;
  let nftMetadataURI = null;

  try {
    const pinned = await pinCredentialAssets({
      credentialId:    id,
      type:            type    || 'UniversityDegreeCredential',
      issuer:          issuer  || 'Unknown Issuer',
      recipient:       recipient || claims?.fullName || 'Unknown',
      issuedDate,
      claims:          claims || {},
      nftImageDataURI: nftImageInput || null,
    });
    nftImageURI    = pinned.nftImageURI;
    nftMetadataURI = pinned.nftMetadataURI;
  } catch (err) {
    console.error('[issueCredential] IPFS pin failed:', err.message);
  }

  const newCredential = {
    id,
    type:            type    || 'UniversityDegreeCredential',
    issuer:          issuer  || 'Unknown Issuer',
    issuerDID:       issuerDID       || 'did:lumen:issuer:unknown',
    recipient:       recipient       || claims?.fullName || 'Unknown',
    recipientDID:    recipientDID    || 'did:lumen:student:unknown',
    recipientUserId: resolvedUserId,
    issuedDate,
    status:          'pending',
    claims:          claims || {},
    schema:          schema || `${type || 'Credential'} (JSON-LD)`,
    blockchainHash:  null,
    txHash:          null,
    blockNumber:     null,
    nftMetadataURI,
    nftImageURI,
  };

  // ── BLOCKCHAIN: hash claims + write to Registry ────────────────────────────
  try {
    const onChain = await recordIssuance({
      credentialId: id,
      recipientDID: newCredential.recipientDID,
      claims:       newCredential.claims,
      metadataURI:  nftMetadataURI || '',
    });
    if (onChain) {
      newCredential.blockchainHash = onChain.claimsHash;
      newCredential.txHash         = onChain.txHash;
      newCredential.blockNumber    = onChain.blockNumber;
    }
  } catch (err) {
    console.error('[issueCredential] On-chain write failed:', err.message);
  }

  mockCredentials.push(newCredential);
  return newCredential;
};

// ─── WRITE — Student ──────────────────────────────────────────────────────────

export const acceptCredential = (id, userId) => {
  const cred = mockCredentials.find((c) => c.id === id && c.recipientUserId === userId);
  if (!cred) return null;
  if (cred.status !== 'pending') throw new Error('Only pending credentials can be accepted');
  cred.status     = 'active';
  cred.acceptedAt = new Date().toISOString();
  return cred;
};

export const rejectCredential = (id, userId, reason) => {
  const cred = mockCredentials.find((c) => c.id === id && c.recipientUserId === userId);
  if (!cred) return null;
  if (cred.status !== 'pending') throw new Error('Only pending credentials can be rejected');
  cred.status          = 'rejected';
  cred.rejectionReason = reason || 'No reason provided';
  cred.rejectedAt      = new Date().toISOString();
  return cred;
};

export const requestCredential = (requestData, userId) => {
  console.log('[Credential Request]', { userId, ...requestData });
  return { requestId: `req-${uuidv4()}`, status: 'submitted' };
};

// ─── WRITE — Verifier ─────────────────────────────────────────────────────────

export const revokeCredential = async (id, reason) => {
  const cred = mockCredentials.find((c) => c.id === id);
  if (!cred) return null;

  // ── BLOCKCHAIN: push to revocation registry ────────────────────────────────
  try {
    const onChain = await recordRevocation(id, reason || 'Revoked by issuer');
    if (onChain) {
      cred.revocationTxHash      = onChain.txHash;
      cred.revocationBlockNumber = onChain.blockNumber;
    }
  } catch (err) {
    console.error('[revokeCredential] On-chain write failed:', err.message);
  }

  cred.status           = 'revoked';
  cred.revocationReason = reason || 'Revoked by issuer';
  cred.revokedAt        = new Date().toISOString();
  return cred;
};

// ─── VERIFICATION ─────────────────────────────────────────────────────────────

export const verifyCredential = async (id) => {
  const cred = mockCredentials.find((c) => c.id === id);

  if (!cred) return { valid: false, reason: 'Credential not found' };

  if (cred.status === 'revoked') {
    return {
      valid:            false,
      reason:           'Credential has been revoked',
      revokedAt:        cred.revokedAt,
      revocationReason: cred.revocationReason,
    };
  }

  if (cred.status !== 'active') {
    return { valid: false, reason: `Credential status is "${cred.status}"` };
  }

  // ── BLOCKCHAIN: compare hash + check revocation ────────────────────────────
  let tamperProof = false;
  let onChainData = {};

  try {
    const result = await verifyOnChain(id, cred.claims);

    if (result.revoked) {
      return {
        valid:        false,
        reason:       'Credential has been revoked on-chain',
        onChain:      true,
        credentialId: cred.id,
        issuer:       cred.issuer,
        issuerDID:    cred.issuerDID,
        recipient:    cred.recipient,
        issuedDate:   cred.issuedDate,
        verifiedAt:   new Date().toISOString(),
      };
    }

    tamperProof = result.tamperProof;
    onChainData = {
      onChain:        result.onChain,
      blockchainHash: result.claimsHash  || cred.blockchainHash,
      nftMetadataURI: result.metadataURI || cred.nftMetadataURI,
      txHash:         cred.txHash        || null,
      blockNumber:    cred.blockNumber   || null,
    };
  } catch (err) {
    console.error('[verifyCredential] On-chain read failed:', err.message);
    tamperProof = Boolean(cred.blockchainHash);
    onChainData = {
      onChain:        false,
      blockchainHash: cred.blockchainHash,
      nftMetadataURI: cred.nftMetadataURI,
      txHash:         cred.txHash      || null,
      blockNumber:    cred.blockNumber || null,
    };
  }

  return {
    valid:        true,
    tamperProof,
    credentialId: cred.id,
    issuer:       cred.issuer,
    issuerDID:    cred.issuerDID,
    recipient:    cred.recipient,
    issuedDate:   cred.issuedDate,
    verifiedAt:   new Date().toISOString(),
    ...onChainData,
  };
};

// ─── SHARE TOKENS ─────────────────────────────────────────────────────────────

export const createShareToken = (credentialIds, userId, ttlMinutes = 60) => {
  const token     = uuidv4();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  mockShareTokens.set(token, { credentialIds, userId, expiresAt, ttlMinutes });
  return { token, shareURL: `/verify?token=${token}`, expiresAt, credentialCount: credentialIds.length };
};

export const resolveShareToken = (token) => {
  const entry = mockShareTokens.get(token);
  if (!entry) return { valid: false, reason: 'Invalid or expired share link' };
  if (new Date(entry.expiresAt) < new Date()) {
    mockShareTokens.delete(token);
    return { valid: false, reason: 'Share link has expired' };
  }
  const credentials = entry.credentialIds
    .map((id) => mockCredentials.find((c) => c.id === id && c.status === 'active'))
    .filter(Boolean);
  return { valid: true, expiresAt: entry.expiresAt, credentials };
};