function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  if (error.code === '23505') {
    return res.status(409).json({
      status: false,
      message: 'Duplicate record found',
      details: error.detail,
    });
  }

  if (error.code === '23503') {
    return res.status(400).json({
      status: false,
      message: 'Invalid relationship reference',
      details: error.detail,
    });
  }

  return res.status(statusCode).json({
    status: false,
    message: error.message || 'Internal server error',
    details: error.details || null,
  });
}

module.exports = errorHandler;
