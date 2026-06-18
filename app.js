
// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
