const AppError = require('../errors/AppError');
const { verifyToken } = require('../utils/jwt');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = verifyToken(token);

  if (!payload) return next(new AppError('Unauthorized or expired token', 401));

  req.user = payload;
  return next();
}

module.exports = authenticate;
