/**
 * admin.routes.js
 * Maps to: /api/admin/*
 *
 * Endpoints consumed by frontend adminService.js:
 *   GET  /api/admin/stats   → dashboard statistics (verifier only)
 */

import { Router } from 'express';
import { mockAdminStats, mockCredentials, mockUsers } from '../data/mock-data.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import * as R from '../utils/response.js';

const router = Router();

// ─── GET /api/admin/stats ─────────────────────────────────────────────────
// Returns the 4 stat cards shown on AdminDashboard
// The mock data matches the exact shape adminService.js expects
router.get('/stats', authenticate, requireRole('verifier'), (req, res) => {
  try {
    // Optionally compute live counts from in-memory data for realism
    const liveStats = [
      {
        ...mockAdminStats[0],
        value: mockCredentials.filter((c) => c.status === 'active').length.toString(),
      },
      {
        ...mockAdminStats[1],
        value: mockCredentials
          .filter((c) => c.issuedDate?.startsWith(new Date().toISOString().slice(0, 10)))
          .length.toString(),
      },
      {
        ...mockAdminStats[2],
        value: mockCredentials.filter((c) => c.status === 'pending').length.toString(),
      },
      {
        ...mockAdminStats[3],
        value: mockUsers.length.toString(),
      },
    ];

    return R.ok(res, liveStats);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// ─── GET /api/admin/users ────────────────────────────────────────────────
// List all users (verifier only) - useful for issuer portal
router.get('/users', authenticate, requireRole('verifier'), (req, res) => {
  try {
    const safeUsers = mockUsers.map(({ password, twoFactorCode, ...u }) => u);
    return R.ok(res, safeUsers);
  } catch (err) {
    return R.serverError(res, err);
  }
});

// ─── GET /api/admin/users/lookup?email=... ───────────────────────────────
// Look up a student by email to get their userId + DID for credential issuance
router.get('/users/lookup', authenticate, requireRole('verifier'), (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return R.fail(res, 'email query param required');
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return R.notFound(res, 'No user found with that email');
    const { password, twoFactorCode, ...safeUser } = user;
    return R.ok(res, safeUser);
  } catch (err) {
    return R.serverError(res, err);
  }
});

export default router;
