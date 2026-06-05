const { metrics } = require('@opentelemetry/api');

const meter = metrics.getMeter('storejs-business');

const productsCreated = meter.createCounter('store.products.created', {
  description: 'Total number of products created',
});

const productsDeleted = meter.createCounter('store.products.deleted', {
  description: 'Total number of products deleted',
});

const productsTotal = meter.createUpDownCounter('store.products.total', {
  description: 'Current number of products in the store',
});

module.exports = { productsCreated, productsDeleted, productsTotal };
