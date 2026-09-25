---
name: code-authoring
description: Implement and revise application code with simple, maintainable designs, feature-oriented organization, and meaningful Vitest coverage. Use for coding tasks in this repository; do not treat it as a substitute for project-specific architecture or security guidance.
---

# Code Authoring

Use this skill when implementing or modifying code in the repository. Optimize for code that is easy to understand, change, and test without adding abstractions that do not earn their cost.

## Design principles

- Prefer YAGNI: implement the behavior required now, not speculative future flexibility.
- Prefer KISS: choose the simplest design that satisfies the requirements and fits existing project conventions.
- Do not overengineer. Avoid wrapper layers, indirection, configuration, or generic frameworks that provide no concrete benefit.
- Before adding an abstraction, identify the repeated behavior or decision it centralizes. If there is no meaningful reuse or policy, keep the code local.
- Put genuinely reusable code in a reusable location that is not coupled to one feature. Keep feature-specific code inside the feature that owns it.
- add inline documentation for important code

## Project organization

- Use a feature-oriented folder structure. Group a feature's component, logic, styles, tests, and nearby helpers together when that matches the repository's conventions.
- For example, a Button feature may live under `src/components/Button/` with its component code and related tests together.
- Choose names and paths that communicate ownership and responsibility. Do not create broad `utils`, `common`, or `shared` locations for code that only serves one feature.
- When code is used by multiple unrelated features and has a stable, general purpose, move it to an appropriately reusable location.

## Consistency and scope

- Inspect nearby code and existing project conventions before choosing an implementation pattern.
- Follow the repository's established coding style, naming, formatting, TypeScript, React, and error-handling conventions.
- Keep the diff focused on the requested behavior. Avoid unrelated refactors, formatting churn, and dependency changes.
- Prefer extending a clear existing pattern when it is appropriate; do not introduce a competing pattern without a concrete reason.
- Avoid adding a dependency when the platform or existing project code already solves the problem.

- for TypeScript and JavaScript code
  - use empty lines as separator for between method declarations
  - use arrow function, not method declaration
  - prefer string enums over constant types
  - use type aliases such as `type UserId = string`
  - when function takes more than 4 arguments, use settings object parameter

## Runtime behavior

- Handle expected failures explicitly and preserve useful context for callers and users.
- Do not silently swallow errors or add broad fallback behavior without understanding the failure mode.
- Keep domain logic separate from UI, transport, and persistence concerns when that separation improves clarity or testability.
- Validate data at external boundaries such as user input, network responses, and configuration.

## Tests

- Write tests with Vitest when adding or changing meaningful behavior.
- Cover realistic user or system paths, important state transitions, and failure behavior that callers need to handle.
- Prefer tests that verify observable behavior over implementation details.
- Do not chase 100% coverage or add tests for every rare, contrived case. Use judgment about risk and the value of the behavior being protected.
- Keep tests close to the feature when the repository's structure supports it, and follow existing test naming and setup conventions.
- test code at its lowest boundary, do not use component tests to test utility methods

## UI quality

For UI changes, check the behavior a user can observe:

- Use semantic HTML and accessible labels.
- Support keyboard interaction and visible focus where applicable.
- Preserve sensible loading, empty, success, and error states.
- Follow existing localization and responsive-layout conventions.

## Validation

- Run the narrowest relevant tests first.
- Run the repository's standard checks before finishing, such as `npm run lint:fix`, `npm run test`, `npm run typecheck`, or `npm run build`.
- Use only commands that exist in the repository's package scripts; inspect `package.json` when needed.
- If a check cannot run or fails for an unrelated reason, report the exact command and failure.

## Completion check

Before finishing, review the change:

- Is the implementation the smallest clear solution that meets the requirements?
- Did any new abstraction earn its complexity through real reuse or a concrete policy?
- Is each file located with the feature or reusable concern it owns?
- Do Vitest tests cover the meaningful, realistic paths without overfitting to internals?
- Did you run the relevant tests and standard repository checks, and report any limitation or failure?
- For UI changes, did you check accessibility and the important loading, empty, success, and error states?
