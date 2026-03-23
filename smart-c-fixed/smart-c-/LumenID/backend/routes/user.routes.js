import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { mockUsers } from '../data/mock-data.js';
import * as R from '../utils/response.js';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticate, (req, res) => {
  const user = mockUsers.find((u) => u.id === req.user.id);
  if (!user) return R.notFound(res, 'User profile not found');
  const { password, twoFactorCode, ...safeUser } = user;
  return R.ok(res, safeUser, 'Profile retrieved');
});

// PATCH /api/users/profile
router.patch('/profile', authenticate, (req, res) => {
  const userIdx = mockUsers.findIndex((u) => u.id === req.user.id);
  if (userIdx === -1) return R.notFound(res, 'User not found');

  // Allowed fields to update (never let client change id, role, password, did)
  const allowed = [
    'fullName', 'phone', 'dateOfBirth', 'nationality',
    'address', 'city', 'country', 'postalCode',
    'institution', 'degree', 'fieldOfStudy', 'graduationDate',
    'studentId', 'linkedinUrl', 'portfolioUrl', 'bio',
  ];

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      mockUsers[userIdx][field] = req.body[field];
    }
  });

  mockUsers[userIdx].profileComplete = true;

  const { password, twoFactorCode, ...safeUser } = mockUsers[userIdx];
  return R.ok(res, safeUser, 'Profile updated');
});

export default router;
