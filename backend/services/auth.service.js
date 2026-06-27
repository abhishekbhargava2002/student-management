const AppError = require('../errors/AppError');
const userModel = require('../models/user.model');
const { verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

async function login(email, password) {
  const user = await userModel.findByEmail(email);

  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };
