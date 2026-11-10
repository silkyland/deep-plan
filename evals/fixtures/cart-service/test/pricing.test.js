const test = require('node:test');
const assert = require('node:assert/strict');
const { applyDiscount } = require('../src/cart/PriceCalculator');
const { validateCap } = require('../src/cart/validateCap');

test('current discount arithmetic', () => {
  assert.equal(applyDiscount(100, 20), 80);
});
test('invalid cap uses the existing error contract', () => {
  assert.throws(() => validateCap(-1), { name: 'RangeError', message: 'Invalid discount cap' });
});
