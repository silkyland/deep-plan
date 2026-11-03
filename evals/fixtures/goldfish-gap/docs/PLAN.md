# Plan: enforce the discount cap

Draft, written after Phases 0–6. Everything here looks complete to its
author — which is the point of the fixture.

## Roadmap

### Phase 0 — Correctness clamp (S)

- [ ] In `src/cart/limits.js`, add `clampDiscount(percent)` that returns
      `Math.min(percent, config.maxDiscountPct)` `VERIFIED: src/cart/config.js:8`.
- [ ] In `src/cart/PriceCalculator.js`, call `clampDiscount` inside
      `applyDiscount` before the subtraction.
- Exit: `applyDiscount(100, 80)` returns `50`.

### Phase 1 — Walking skeleton: per-channel caps (M)

- [ ] In `src/cart/PriceCalculator.js`, read the cap from
      `config.discountCapPercent` instead of the hard-coded clamp, and
      return the capped total from `applyDiscount`.
- Exit: changing `discountCapPercent` to `20` changes the result of
  `applyDiscount(100, 80)` to `80`.

## Corrections

- None yet.
