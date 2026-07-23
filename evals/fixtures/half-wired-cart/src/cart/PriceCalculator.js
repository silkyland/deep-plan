const config = require('./config');

// Applies a percentage discount to a line total.
//
// NOTE (eval answer key): the planted CORRECTNESS DEFECT is that
// `discountPercent` is applied with no upper bound — `config.discountCapPercent`
// is never consulted, so a caller can pass 90 and blow past the 50% cap the
// business intends. deep-plan's Phase 3 audit should flag this at the
// `applyDiscount` line, and Phase 4 should record the gap as BROKEN
// (cap defined but not enforced) feeding into the MISSING rule-engine wiring.
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
