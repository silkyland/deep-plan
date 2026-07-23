// Vendored "framework" stub, present so deep-plan's Phase 2 can establish
// ground truth from LOCAL VENDOR SOURCE (not memory) and cite this exact
// file path.
//
// NOTE (eval answer key): the rule engine's contract is that every rule
// implements `match(scope)` returning a boolean, and `apply(scope)` mutates
// the scope in place. A deep-plan run that claims the rule engine works some
// other way (e.g. "rules return the modified value") without citing this file
// has sourced its facts from memory — a Phase 2 failure.

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
