# Code structure best practices

## Abstract
Focus on:
1. **code maintainability - avoid huge files, decompose code/components to smaller chunks and files **
2. **consistency**
3. **Testability**


## Core Review Rules

### 1. Code maintainability
**Impact: Critical**
Flag:

- files with large number of lines that could be split/decomposed to smaller files
- files that mix responsibilities unless it is generic utils file
- files mixing test and application code
- never check for test environment in application code
- duplication of code
- overengineered code
- each function should have a single purpose, avoid mutating parameters or side effects


Prefer:

- smaller files / UI components in separate files
- no overloaded file with hundreds of lines of code
- refactor to avoid duplicated code, do not repeat yourself
- keep it stupid single

### 2. Consistency
**Impact: High**
Flag:

- using legacy code unless needed (e.g. promises)
- using unusual coding style

Prefer:

- coding style should match rest of the project

### 3. Testability
**Impact: High**
Flag:

- hard to test code with bad structure

Prefer:

- smaller functions or components for easier testing

---
