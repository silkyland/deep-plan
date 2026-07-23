// Cart configuration.
//
// NOTE (eval answer key): `discountCapPercent` is the planted HALF-WIRED
// value — it is exported here and surfaced in the admin UI, but nothing in
// PriceCalculator.js ever reads it. deep-plan's Phase 1 inventory should
// classify it half-wired, citing this line as "collected" and
// PriceCalculator.js as "never consumed".
module.exports = {
  currency: 'EUR',
  discountCapPercent: 50,
};
