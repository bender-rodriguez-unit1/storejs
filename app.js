
// Basic rate limiting
const rateLimit = {};
app.use((req, res, next) => {
  const ip = req.ip;
  rateLimit[ip] = (rateLimit[ip] || 0) + 1;
  next();
});
