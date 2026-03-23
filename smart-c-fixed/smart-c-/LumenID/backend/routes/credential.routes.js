/**
 * credential.routes.js
 * Maps to: /api/credentials/* and /api/did/*
 *
 * Endpoints consumed by frontend credentialService.js:
 *   GET    /api/credentials                     → student's own credentials
 *   GET    /api/credentials/:id                 → single credential
 *   POST   /api/credentials/request             → student requests a credential
 *   POST   /api/credentials/issue               → issuer creates credential (verifier only)
 *   GET    /api/credentials/verify/:id          → cryptographic verification (public)
 *   POST   /api/credentials/:id/revoke          → issuer revokes (verifier only)
 *   POST   /api/credentials/:id/accept          → student accepts pending credential
 *   POST   /api/credentials/:id/reject          → student rejects pending credential
 *   GET    /api/credentials/did/:did            → get credentials by DID
 *   GET    /api/credentials/submissions/pending → pending queue (verifier only)
 *   GET    /api/credentials/search              → filter credentials
 *   POST   /api/credentials/share               → create share token (student)
 *   GET    /api/credentials/shared/:token       → resolve share token (public / verifier)
 *   GET    /api/did/:did                        → resolve DID document
 */

import { Router } from 'express';
import * as CredService from '../services/credential-service.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import * as R from '../utils/response.js';

const router = Router();

// ─── PUBLIC ───────────────────────────────────────────────────────────────

// Verify a credential (called by the Verifier's "Verify" button)
// IMPORTANT: must be defined before /:id to avoid route shadowing
router.get('/verify/:id', (req, res) => {
  try {
    const result = CredService.verifyCredential(req.params.id);
    return R.ok(res, result, result.valid ? 'Credential is valid' : 'Credential is invalid');
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Resolve a share token (verifier scans QR / opens link)
router.get('/shared/:token', (req, res) => {
  try {
    const result = CredService.resolveShareToken(req.params.token);
    if (!result.valid) return R.fail(res, result.reason, 410);
    return R.ok(res, result, 'Share token resolved');
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Resolve a DID document
router.get('/did/:did', (req, res) => {
  const doc = CredService.getDIDDocument(req.params.did);
  if (!doc) return R.notFound(res, 'DID not found');
  return R.ok(res, doc);
});

// Public: get all ACTIVE credentials by DID (for employer verification)
router.get('/public/did/:did', (req, res) => {
  try {
    const credentials = CredService.getCredentialsByDID(req.params.did)
      .filter((c) => c.status === 'active');
    return R.ok(res, credentials);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// ─── AUTHENTICATED — STUDENT ──────────────────────────────────────────────

// Get all credentials for the logged-in student
router.get('/', authenticate, (req, res) => {
  try {
    const credentials = CredService.getCredentialsByUser(req.user.id);
    return R.ok(res, credentials);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Search / filter credentials
router.get('/search', authenticate, (req, res) => {
  try {
    const { did, type, issuer, status } = req.query;
    const results = CredService.searchCredentials({ did, type, issuer, status });
    return R.ok(res, results);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Get credentials by DID
router.get('/did/:did', authenticate, (req, res) => {
  try {
    const credentials = CredService.getCredentialsByDID(req.params.did);
    return R.ok(res, credentials);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Get single credential by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const cred = CredService.getCredentialById(req.params.id);
    if (!cred) return R.notFound(res, 'Credential not found');
    return R.ok(res, cred);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Student requests a credential
// Body: { type, message, ... }
router.post('/request', authenticate, (req, res) => {
  try {
    const result = CredService.requestCredential(req.body, req.user.id);
    return R.ok(res, result, 'Credential request submitted');
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Student accepts a pending credential
router.post('/:id/accept', authenticate, (req, res) => {
  try {
    const cred = CredService.acceptCredential(req.params.id, req.user.id);
    if (!cred) return R.notFound(res, 'Credential not found or not yours');
    return R.ok(res, cred, 'Credential accepted and stored in vault');
  } catch (err) {
    return R.fail(res, err.message);
  }
});

// Student rejects a pending credential
// Body: { reason? }
router.post('/:id/reject', authenticate, (req, res) => {
  try {
    const cred = CredService.rejectCredential(req.params.id, req.user.id, req.body.reason);
    if (!cred) return R.notFound(res, 'Credential not found or not yours');
    return R.ok(res, cred, 'Credential rejected');
  } catch (err) {
    return R.fail(res, err.message);
  }
});

// Student creates a share token (selective disclosure)
// Body: { credentialIds: string[], ttlMinutes?: number }
router.post('/share', authenticate, (req, res) => {
  try {
    const { credentialIds, ttlMinutes } = req.body;
    if (!credentialIds || !Array.isArray(credentialIds) || credentialIds.length === 0) {
      return R.fail(res, 'credentialIds must be a non-empty array');
    }
    const result = CredService.createShareToken(credentialIds, req.user.id, ttlMinutes);
    return R.ok(res, result, 'Share token created');
  } catch (err) {
    return R.serverError(res, err);
  }
});

// ─── AUTHENTICATED — VERIFIER (ISSUER) ONLY ──────────────────────────────

// Issue a new credential to a student
// Body: { type, issuer, issuerDID, recipient, recipientDID, recipientUserId, claims, schema }
router.post('/issue', authenticate, requireRole('verifier'), (req, res) => {
  try {
    const newCred = CredService.issueCredential(req.body);
    return R.ok(res, newCred, 'Credential issued successfully', 201);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Revoke a credential
// Body: { reason? }
router.post('/:id/revoke', authenticate, requireRole('verifier'), (req, res) => {
  try {
    const cred = CredService.revokeCredential(req.params.id, req.body.reason);
    if (!cred) return R.notFound(res, 'Credential not found');
    return R.ok(res, cred, 'Credential revoked');
  } catch (err) {
    return R.serverError(res, err);
  }
});

// Get pending credential submissions queue
router.get('/submissions/pending', authenticate, requireRole('verifier'), (req, res) => {
  try {
    const pending = CredService.getPendingCredentials();
    return R.ok(res, pending);
  } catch (err) {
    return R.serverError(res, err);
  }
});

export default router;
