function notFound(req, res) {
  return res.status(404).json({
    status: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
