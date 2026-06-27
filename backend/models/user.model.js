const db = require('../config/db');

async function findByEmail(email) {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, is_active
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail };
