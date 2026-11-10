// rule-engine 2.3.0 — base contract every rule implements.

class RuleInterface {
  // Return true if this rule should fire for the given scope.
  match(scope) {
    throw new Error('not implemented');
  }

  // Mutate `scope` in place when the rule fires. Returns nothing.
  apply(scope) {
    throw new Error('not implemented');
  }
}

module.exports = { RuleInterface };
