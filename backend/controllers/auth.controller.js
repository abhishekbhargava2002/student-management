const { success } = require('../helper/response.helper');
const { requireFields, validateEmail } = require('../utils/validation');
const authService = require('../services/auth.service');

async function login(req, res) {
  requireFields(req.body, ['email', 'password']);
  validateEmail(req.body.email);

  const data = await authService.login(req.body.email, req.body.password);
  return success(res, 'Login successful', data);
}

module.exports = { login };
