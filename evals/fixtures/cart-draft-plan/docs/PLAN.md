# Plan: enforce the discount cap

> Goldfish: NOT RUN

Draft. Research and design are complete; the goldfish gates have not been
run yet.

## Roadmap

### M0 — Correctness clamp (S)

- [ ] `M0-T1` — In `src/cart/limits.js`, add `clampDiscount(percent)` that returns
      `Math.min(percent, config.maxDiscountPct)` `VERIFIED: src/cart/config.js:8`.
- [ ] `M0-T2` — In `src/cart/PriceCalculator.js`, call `clampDiscount` inside
      `applyDiscount` before the subtraction.
- Exit: `applyDiscount(100, 80)` returns `50`.

### M1 — Walking skeleton: per-channel caps (M)

- [ ] `M1-T1` — In `src/cart/PriceCalculator.js`, read the cap from
      `config.discountCapPercent` instead of the hard-coded clamp, and
      return the capped total from `applyDiscount`.
- Exit: changing `discountCapPercent` to `20` changes the result of
  `applyDiscount(100, 80)` to `80`.

## Corrections

- None yet.
