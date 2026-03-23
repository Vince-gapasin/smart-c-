/**
 * auth.routes.js
 * Maps to: /api/auth/*
 *
 * Endpoints consumed by frontend apiClient / authService.js:
 *   POST   /api/auth/login
 *   POST   /api/auth/signup
 *   POST   /api/auth/verifier-login
 *   GET    /api/auth/me
 *   POST   /api/auth/logout
 *   POST   /api/auth/forgot-password
 *   POST   /api/auth/request-access
 */

import { Router } from 'express';
import * as AuthService from '../services/auth-service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import * as R from '../utils/response.js';

const router = Router();

// ─── POST /api/auth/login ─────────────────────────────────────────────────
// Body: { email, password, role? }
// Returns: { success, data: { token, user } }
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return R.fail(res, 'Email and password are required');

    const result = await AuthService.login({ email, password, role });
    return R.ok(res, result, 'Login successful');
  } catch (err) {
    return R.fail(res, err.message, 401);
  }
});

// ─── POST /api/auth/verifier-login ────────────────────────────────────────
// Body: { email, password, twoFactorCode }
// Returns: { success, data: { token, user } }
router.post('/verifier-login', async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    if (!email || !password || !twoFactorCode) {
      return R.fail(res, 'Email, password, and 2FA code are required');
    }

    const result = await AuthService.verifierLogin({ email, password, twoFactorCode });
    return R.ok(res, result, 'Verifier login successful');
  } catch (err) {
    return R.fail(res, err.message, 401);
  }
});

// ─── POST /api/auth/signup ────────────────────────────────────────────────
// Body: { email, password, name?, fullName? }
// Returns: { success, data: { token, user } }
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, fullName } = req.body;
    if (!email || !password) return R.fail(res, 'Email and password are required');

    const result = await AuthService.signup({ email, password, name, fullName });
    return R.ok(res, result, 'Account created successfully', 201);
  } catch (err) {
    if (err.message.includes('already registered')) return R.fail(res, err.message, 409);
    return R.serverError(res, err);
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
// Header: Authorization: Bearer <token>
// Returns: { success, data: user }
router.get('/me', authenticate, (req, res) => {
  try {
    const user = AuthService.getUserById(req.user.id);
    return R.ok(res, user);
  } catch (err) {
    return R.notFound(res, err.message);
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────
// (Stateless JWT — client discards token; endpoint exists for future blocklist)
router.post('/logout', (req, res) => {
  return R.ok(res, null, 'Logged out successfully');
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────
// Body: { email }
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return R.fail(res, 'Email is required');
  const result = AuthService.requestPasswordReset(email);
  return R.ok(res, null, result.message);
});

// ─── POST /api/auth/request-access ───────────────────────────────────────
// Body: { institutionName, email, reason, ... }
router.post('/request-access', (req, res) => {
  const result = AuthService.requestVerifierAccess(req.body);
  return R.ok(res, null, result.message);
});

export default router;
