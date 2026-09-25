# Typescript best practices

## Abstract
Focus on:
1. **Type Safety**
2. **Correctness of Types**
3. **Maintainability & Readability**
4. **Proper Use of TypeScript Features (not just JS with types)**


## Core Review Rules

### 1. Avoid Unsafe Types
**Impact: Critical**
Flag:

- `any` (explicit or implicit)
- Excessive `unknown` without narrowing
- Type assertions (`as`) that bypass safety

Prefer:

- Proper type definitions
- Type guards
- Narrowing logic

---

### 2. Enforce Precise Typing
**Impact: High**
Check for:

- Overly broad types (`string` instead of union, `object`, `{}` etc.)
- Missing generics
- Loss of inference

Prefer:

- Literal types
- Union types
- Discriminated unions
- Well-defined interfaces/types

---

### 3. Proper Null / Undefined Handling
**Impact: Critical**
Under `strictNullChecks`:

- No unsafe optional chaining without fallback
- No assumptions that values exist

Prefer:

- Explicit checks
- Safe narrowing
- Defensive coding

---

### 4. Function Signatures
**Impact: Critical**
Check:

- Missing return types (especially public functions)
- Implicit `any` in params
- Overloaded or unclear signatures

Prefer:

- Explicit return types for exported functions
- Clear input/output contracts

---

### 5. Correct Use of Generics
**Impact: Medium**
Flag:

- Generics that add no value
- Overcomplicated generics
- Missing generics where needed

Prefer:

- Simple, meaningful generics
- Constrained generics (`<T extends ...>`)

---

### 6. Avoid Type Abuse
**Impact: High**
Flag:

- Excessive `as` casting
- Double assertions (`as unknown as X`)
- Forcing types to “make it compile”
- Ad hoc DOM/component casts such as `HTMLElement & { prop?: T }`
- Optional structural properties added only to silence missing framework element types

These are strong signals of design issues.

For DOM, custom element, and test page-object code, prefer generated component element types, explicit helper types with required properties, or runtime tag/type guards before a narrow cast. Report selectors that need unsafe casts separately from selector fragility.

---

### 7. Data Modeling Quality
**Impact: Medium**
Evaluate:

- Are types expressive and domain-driven?
- Are enums/unions used appropriately?
- Are objects loosely shaped instead of well-defined?

Prefer:

- Explicit domain models
- Discriminated unions for state
- Reusable types

---

### 8. Immutability & Intent
**Impact: Medium**
Check:

- Mutating objects where unnecessary
- Missing `readonly` where applicable

Prefer:

- `readonly` properties
- Immutable patterns where practical

---

### 9. Inference vs Explicitness
**Impact: Medium**
Balance:

- Let TS infer when safe
- Be explicit when it improves clarity or contracts

Flag:

- Lost inference due to bad patterns
- Over-annotation that adds noise

---

### 10. Alignment with Strict Mode Philosophy
**Impact: Critical**
Overall principle:

> If TypeScript cannot guarantee safety at compile time, it should be addressed—not bypassed.

---

## Anti-Patterns to Call Out Explicitly
**Impact: High**
- “Just cast it” (`as Something`)
- Using `any` to fix errors
- Ignoring null/undefined cases
- Treating TS as optional documentation instead of enforcement

## Important

- Be direct and technical, not verbose
- Do not explain basic TypeScript concepts
- Focus only on meaningful issues
- Avoid style-only comments unless they impact correctness or maintainability
