const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

let products = [];
let nextId = 1;

function setNotice(req, message) {
  req.app.locals.notice = message;
}

app.use((req, res, next) => {
  res.locals.notice = req.app.locals.notice || null;
  req.app.locals.notice = null;
  next();
});

function findProduct(id) {
  return products.find((product) => product.id === id);
}

app.get('/', (req, res) => {
  res.redirect('/products');
});

app.get('/products', (req, res) => {
  res.render('products/index', { products });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/products/new', (req, res) => {
  res.render('products/new', { product: { name: '' }, errors: [] });
});

app.post('/products', (req, res) => {
  const now = new Date();
  const product = {
    id: nextId,
    name: req.body.name || '',
    created_at: now,
    updated_at: now
  };

  nextId += 1;
  products.push(product);

  setNotice(req, 'Product was successfully created.');
  res.redirect(`/products/${product.id}`);
});

app.get('/products/:id', (req, res, next) => {
  const product = findProduct(Number(req.params.id));
  if (!product) return next();
  res.render('products/show', { product });
});

app.get('/products/:id/edit', (req, res, next) => {
  const product = findProduct(Number(req.params.id));
  if (!product) return next();
  res.render('products/edit', { product, errors: [] });
});

app.post('/products/:id', (req, res, next) => {
  const product = findProduct(Number(req.params.id));
  if (!product) return next();

  product.name = req.body.name || '';
  product.updated_at = new Date();

  setNotice(req, 'Product was successfully updated.');
  res.redirect(`/products/${product.id}`);
});

app.post('/products/:id/delete', (req, res, next) => {
  const id = Number(req.params.id);
  const product = findProduct(id);
  if (!product) return next();

  products = products.filter((item) => item.id !== id);

  setNotice(req, 'Product was successfully deleted.');
  res.redirect('/products');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.resetStore = () => {
  products = [];
  nextId = 1;
  app.locals.notice = null;
};

module.exports = app;

// Custom 404 page
app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — Lost Puppy</title>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: "Segoe UI", system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; text-align: center; }
    .container { max-width: 500px; }
    .code { font-size: 120px; font-weight: bold; color: #f0883e; margin: 0; line-height: 1; }
    .puppy { font-size: 80px; margin: 20px 0; }
    h1 { color: #c9d1d9; font-size: 24px; }
    p { color: #8b949e; }
    a { color: #58a6ff; text-decoration: none; }
    .btn { display: inline-block; background: #238636; color: #fff; padding: 10px 24px; border-radius: 6px; margin-top: 20px; text-decoration: none; }
    .btn:hover { background: #2ea043; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .puppy { animation: bounce 1s ease-in-out infinite; }
  </style>
</head>
<body>
  <div class="container">
    <div class="code">404</div>
    <div class="puppy">🐶</div>
    <h1>This puppy got lost!</h1>
    <p>The page you're looking for doesn't exist. Maybe it ran away to chase a squirrel.</p>
    <a href="/products" class="btn">← Take me home</a>
  </div>
</body>
</html>`);
});
