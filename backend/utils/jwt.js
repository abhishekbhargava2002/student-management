const crypto = require('crypto');

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is missing');

  const expiresIn = Number(process.env.JWT_EXPIRES_IN_SECONDS || 86400);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const finalPayload = { ...payload, iat: now, exp: now + expiresIn };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(finalPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');

  return `${data}.${signature}`;
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is missing');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

module.exports = { signToken, verifyToken };
