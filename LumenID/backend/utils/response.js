/**
 * response.js
 * Standardized JSON response helpers.
 * Every endpoint uses these so the shape is always consistent.
 */

export const ok = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const created = (res, data, message = 'Created') =>
  ok(res, data, message, 201);

export const fail = (res, message = 'Bad request', statusCode = 400) =>
  res.status(statusCode).json({ success: false, message, data: null });

export const unauthorized = (res, message = 'Unauthorized') =>
  fail(res, message, 401);

export const forbidden = (res, message = 'Forbidden') =>
  fail(res, message, 403);

export const notFound = (res, message = 'Not found') =>
  fail(res, message, 404);

export const serverError = (res, err) => {
  console.error('[LumenID Error]', err);
  return res
    .status(500)
    .json({ success: false, message: 'Internal server error', data: null });
};
