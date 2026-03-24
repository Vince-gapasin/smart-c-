/**
 * auth.middleware.js
 * JWT verification middleware.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler)
 *   router.get('/verifier-only', authenticate, requireRole('verifier'), handler)
 */

import jwt from 'jsonwebtoken';
import * as R from '../utils/response.js';

/**
 * Verifies the Bearer token and attaches req.user = { id, email, role }
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return R.unauthorized(res, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lumenid_dev_secret');
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return R.unauthorized(res, 'Token expired');
    }
    return R.unauthorized(res, 'Invalid token');
  }
};

/**
 * Role guard — must be used AFTER authenticate
 * @param  {...string} roles  e.g. requireRole('verifier')
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return R.unauthorized(res);
  if (!roles.includes(req.user.role)) {
    return R.forbidden(res, 'Access restricted to: ' + roles.join(', '));
  }
  next();
};
