const config = require('./config');

// Applies a percentage discount to a line total.
function applyDiscount(lineTotal, discountPercent) {
  const factor = (100 - discountPercent) / 100;
  return Math.round(lineTotal * factor * 100) / 100;
}

function cartTotal(lines) {
  return lines.reduce(
    (sum, l) => sum + applyDiscount(l.total, l.discountPercent || 0),
    0,
  );
}

module.exports = { applyDiscount, cartTotal, currency: config.currency };
