function validateCap(cap) {
  if (!Number.isFinite(cap) || cap < 0) {
    throw new RangeError('Invalid discount cap');
  }
  return cap;
}

module.exports = { validateCap };
