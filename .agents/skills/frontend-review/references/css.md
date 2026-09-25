# CSS best practices

## Core Review Rules
Do NOT suggest outdated patterns or legacy browser hacks.
Focus on:

1. **Maintainability & Scalability**
2. **Consistency & Naming**
3. **Layout Robustness (including RTL)**
4. **Modern CSS Practices**

## Core Review Rules

### 1. Enforce Naming Conventions
**Impact: Critical**
Require:

- **kebab-case for all class names and selectors**

Flag:

- camelCase (`.myComponent`)
- PascalCase (`.ButtonPrimary`)
- inconsistent naming patterns

Prefer:

- `.user-card`
- `.nav-item-active`

---

### 2. No Vendor Prefixes
**Impact: Critical**
Flag any:

- `-webkit-`
- `-moz-`
- `-ms-`

Rationale:

- Handled by build tools (e.g. Autoprefixer)
- Manual prefixes are outdated and error-prone

---

### 3. RTL (Right-to-Left) Compatibility
**Impact: Critical**
Check for layout assumptions that break in RTL.

Flag:

- `margin-left`, `padding-right`, `left`, `right`
- directional positioning without logical properties

Prefer:

- `margin-inline-start / end`
- `padding-inline-start / end`
- `inset-inline-start / end`
- `text-align: start / end`

Ensure layouts flip correctly in RTL contexts.

---

### 4. Avoid Global Leakage
**Impact: Critical**
Flag:

- overly generic selectors (`div`, `span`, `*`)
- deep nesting that leaks styles
- unintended overrides

Prefer:

- scoped classes
- predictable selector structure

---

### 5. Specificity Control
**Impact: Medium**
Flag:

- overly specific selectors (`.a .b .c .d`)
- use of `!important`

Prefer:

- flat, predictable specificity
- composable class-based styling

---

### 6. Modern Layout Techniques
**Impact: High**
Prefer:

- Flexbox
- CSS Grid

Flag:

- float-based layouts
- clearfix hacks
- unnecessary positioning (`absolute` when layout tools suffice)

---

### 7. Avoid Magic Numbers
**Impact: Critical**
Flag:

- unexplained hardcoded values (`top: 37px`)
- layout hacks

Prefer:

- spacing systems
- variables / tokens
- relative units where appropriate

---

### 8. Use Logical & Scalable Units
**Impact: High**
Prefer:

- `rem` for typography and spacing
- `%`, `flex`, `grid` for layout

Flag:

- excessive `px` usage for scalable layouts
- inconsistent unit usage

---

### 9. Reusability & Duplication
**Impact: Critical**
Flag:

- duplicated styles across selectors
- copy-paste blocks

Prefer:

- shared utility classes
- variables (CSS custom properties)

---

### 10. CSS Variables (Custom Properties)
**Impact: Critical**
Encourage:

- use of `--variables` for:
  - colors
  - spacing
  - typography

Flag:

- hardcoded repeated values

---

### 11. Responsive Design
**Impact: Medium**
Check:

- lack of responsiveness
- fixed widths that break layouts

Prefer:

- fluid layouts
- mobile-first approach
- consistent breakpoints

---

### 12. Clean Structure
**Impact: High**
Flag:

- disorganized property order
- mixed concerns in one block

Prefer:

- logical grouping:
  - layout
  - spacing
  - typography
  - visual styles

---

## Anti-Patterns to Call Out Explicitly

- Using `!important` to override poor structure
- Pixel-perfect hacks instead of flexible layout
- Directional CSS that breaks RTL
- Manual vendor prefixing
- Deep selector nesting as a crutch
