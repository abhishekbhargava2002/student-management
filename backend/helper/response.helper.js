function success(res, message, data = null, statusCode = 200, meta = null) {
  const payload = { status: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
}

module.exports = { success };
