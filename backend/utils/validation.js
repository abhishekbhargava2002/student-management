const AppError = require('../errors/AppError');

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length) {
    throw new AppError('Validation failed', 400, missing.map((field) => `${field} is required`));
  }
}

function validateEmail(email, fieldName = 'email') {
  if (!email) return;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new AppError('Validation failed', 400, [`${fieldName} must be a valid email`]);
}

function validateId(value, fieldName = 'id') {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(`${fieldName} must be a positive integer`, 400);
  return id;
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null || value === '') return null;
  return String(value).trim();
}

module.exports = { requireFields, validateEmail, validateId, normalizeOptionalString };
