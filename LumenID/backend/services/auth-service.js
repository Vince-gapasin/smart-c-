/**
 * auth-service.js
 * Core authentication logic — isolated from Express so it's easy to unit-test
 * and swap in a real DB later (just replace the mock array lookups).
 *
 * Blockchain hook-point:
 *   When wallet-based auth is added, generateDID() and signChallenge() go here.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from '../data/mock-data.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lumenid_dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Strip password before returning user to client */
const sanitize = (user) => {
  const { password, twoFactorCode, ...safe } = user;
  return safe;
};

/** Sign a JWT containing the minimal claims needed by the frontend */
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// ─── Service Methods ────────────────────────────────────────────────────────

/**
 * Standard customer login
 * @param {{ email: string, password: string, role?: string }} credentials
 * @returns {{ token: string, user: object }}
 */
export const login = async ({ email, password, role }) => {
  const user = mockUsers.find((u) => u.email === email);

  if (!user) throw new Error('Invalid email or password');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Invalid email or password');

  // If frontend sends a role, validate it matches
  if (role && user.role !== role) {
    throw new Error('Account role mismatch');
  }

  const token = signToken(user);
  const safeUser = sanitize(user);

  // Embed token inside user so apiClient's sessionStorage pattern works
  return { token, user: { ...safeUser, token } };
};

/**
 * Verifier login — requires 2FA code
 * @param {{ email: string, password: string, twoFactorCode: string }} credentials
 */
export const verifierLogin = async ({ email, password, twoFactorCode }) => {
  const user = mockUsers.find((u) => u.email === email && u.role === 'verifier');

  if (!user) throw new Error('Invalid credentials');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Invalid credentials');

  if (!twoFactorCode || twoFactorCode !== user.twoFactorCode) {
    throw new Error('Invalid 2FA code');
  }

  const token = signToken(user);
  const safeUser = sanitize(user);

  return { token, user: { ...safeUser, token } };
};

/**
 * Register a new customer
 * @param {{ email: string, password: string, name?: string, fullName?: string }} data
 */
export const signup = async ({ email, password, name, fullName }) => {
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) throw new Error('Email already registered');

  const displayName = fullName || name || email.split('@')[0];
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: `user-${uuidv4()}`,
    fullName: displayName,
    email,
    password: hashedPassword,
    role: 'customer',
    did: `did:lumen:student:${displayName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    walletAddress: null,
    profileComplete: false,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser); // persists for the lifetime of the Node process

  const token = signToken(newUser);
  const safeUser = sanitize(newUser);

  return { token, user: { ...safeUser, token } };
};

/**
 * Get user by id (used by /auth/me)
 * @param {string} userId
 */
export const getUserById = (userId) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  return sanitize(user);
};

/**
 * Mock password-reset — just returns success (email sending not implemented)
 * @param {string} email
 */
export const requestPasswordReset = (email) => {
  // TODO: integrate email service (SendGrid / Nodemailer)
  const user = mockUsers.find((u) => u.email === email);
  // Don't reveal whether email exists — always succeed
  return { message: 'If that email is registered, a reset link has been sent.' };
};

/**
 * Mock verifier access request
 * @param {{ institutionName: string, email: string, reason: string }} data
 */
export const requestVerifierAccess = (data) => {
  // TODO: persist to DB, notify admin
  console.log('[Access Request]', data);
  return { message: 'Access request submitted. You will be contacted within 2–3 business days.' };
};
