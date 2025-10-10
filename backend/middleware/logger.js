const logger = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

module.exports = logger;