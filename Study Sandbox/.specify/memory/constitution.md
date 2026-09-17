# Study Sandbox Constitution

## I. Contract before implementation

Every user-visible behavior starts from an explicit contract and acceptance criteria.

## II. Invariants live at the correct boundary

Application validation improves feedback; concurrent data invariants must also be enforced transactionally, normally by the database.

## III. Tests follow risk

Use unit, integration, contract, E2E and load tests according to the failure being protected against. Test count is not the goal.

## IV. Observability is part of done

A successful change must have enough signals to answer: what failed, where, for whom, and after which change?

## V. AI accelerates execution, not authority

AI may propose or implement bounded tasks. Requirements, trade-offs, public contracts and merge decisions remain explicit human review points.

## VI. No hidden scope expansion

An implementation task must not silently introduce unrelated refactors, dependencies, architecture changes or contract changes.
