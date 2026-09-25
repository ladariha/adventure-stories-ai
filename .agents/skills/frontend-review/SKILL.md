---
name: frontend-review
description: Review (P)React + TypeScript changes in the current branch. Focus on accessibility, localization, performance, modern APIs, and code simplicity. If some commands fail, report the error with full output.
triggers:
 - review my branch
 - frontend review
 - react review
 - a11y review
 - ts review
 - do a review
 - review commit *
allowed-tools:
 - Bash(git diff*)
 - Bash(git fetch*)
 - Bash(cat*)
 - Bash(cd*)
 - npm
 - yarn
---

# Frontend Code Review Skill

You are a senior frontend engineer performing a code review.

Your job is to analyze the current git branch compared with `main` or a specific commit.

If you are reviewing a specific commit, you will be given the commit SHA. In such case, print message "Reviewing commit <commit-sha>" at the beginning of the review.

## Delegation Authorization Gate

This review requires subagents for the repo-policy pass,  Code Structure And Duplication Pass and referenced-rule passes.

## Step 0: Repo Policy Pass
Spawn this step to a subagent.

Before reviewing changed frontend files, discover and read local project rules that apply to frontend code. At minimum:
- Read AGENTS.md or any injected repo instructions.
- Read frontend/style docs referenced by those instructions.
- For changed TSX/CSS files, extract a short checklist of project-specific naming, component, CSS, accessibility, localization, and testing rules.

During final review, report project guideline violations as findings even when they are not functional bugs. Do not collapse them into general suggestions if the repo uses mandatory
language such as "required", "must", "should", or "do not".

For changed component-local CSS/TSX, explicitly check:
- TSX/component filenames match project convention.
- CSS filenames match the owning TSX entrypoint.
- CSS selector structure follows the project style guide.
- Custom values use approved design tokens or project variables.

Before finalizing, verify every item in the repo policy checklist has either:
- no issue found, or
- a finding with file/line reference.

## Step 1: Commit messages check
Check that commit messages are clear, descriptive. Each commit message should start with a verb in the present tense (e.g. "Add", "Fix", "Update") and be concise. Report any issues as low priority issues but continue with the review. Example of a good commit message:
"Add user authentication flow with JWT"
"Issue #123: Fix button alignment on mobile"

## Step 2: Collect Changes

Run the diff collector from the repo root:

`./.agents/skills/frontend-review/scripts/collect-diff.sh`

Do not run `scripts/collect-diff.sh`; script paths in this skill are relative to this skill directory.

or if asked for a review of a commit, run instead:

`./.agents/skills/frontend-review/scripts/collect-diff.sh <commit-sha>`

This returns:

- list of changed files
- git diff

Focus primarily on:

- `.ts`
- `.tsx`
- `.js`
- `.jsx`
- `.css`

Ignore build artifacts.

Then do a broader context pass for each changed source file. Do not review only the modified diff lines. Inspect the current file around every changed hunk, including imports, nearby helpers/types, component state, adjacent event handlers, related tests/page objects, and any code that consumes or is consumed by the modified code. For small and medium files, read the whole changed file. For large files, read at least 80-120 lines of context around each hunk plus the top-level imports/types.

Useful command for a first broader pass:

```bash
git diff --unified=100 origin/main...HEAD -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.css'
```

Then run a type-safety assertion sweep on changed TypeScript files:

```bash
changed_ts_files=$(git diff --name-only origin/main...HEAD -- '*.ts' '*.tsx')
if [ -n "$changed_ts_files" ]; then
  printf '%s\n' "$changed_ts_files" | xargs rg -n "\\bas\\b|!\\.|HTMLElement &|as any|as unknown as"
fi
```

Review each hit before finalizing. Report casts or assertions that bypass available framework/component types, weaken nullability, invent optional DOM properties, or hide unsafe selector assumptions.

For changed production TypeScript or TSX outside generated code, read
`docs/typescript-quality.md`. Perform a
distinct pass for contract ownership, runtime narrowing, failure and fallback
policy, duplicated representations, and unnecessary indirection. Report
concrete violations.


## Step 2.5: Code Structure And Duplication Pass
Spawn this step to a subagent.

Run:

```bash
changed_source_files=$(git diff --name-only origin/main...HEAD -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.css')
if [ -n "$changed_source_files" ]; then
  printf '%s\n' "$changed_source_files" | xargs wc -l
fi

git diff --numstat origin/main...HEAD -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.css'
```

Review and report as findings, not suggestions, when applicable:

- TSX component files over 300 lines, or files that grew substantially and now mix page orchestration, data shaping, forms, dialogs, and rendering.
- CSS files over 300 lines, especially when they style multiple logical components that should have owner-local stylesheets.
- Production/test duplication of large fixtures, translation bundles, mock data, or repeated UI structures.
- Repeated form/card/dialog/table markup that would be clearer as focused components.
- Files where unrelated responsibilities make targeted testing hard.

Before finalizing, include either:

- one or more code-structure findings with file/line references, or
- `Code structure pass: no oversized-file, mixed-responsibility, or duplication issues found.`

---

## Step 3: Perform Code Review

Print message to output "⚙️ Performing code review..."

Analyze the diff carefully. and thoroughly review the code changes:

Focus on these areas:
- review the modified files broadly, not only added/removed lines; issues in nearby unchanged code should be reported when the branch makes them relevant or more risky
- explicitly check changed TypeScript for unsafe assertions (`as`, `as any`, `as unknown as`, non-null assertions, `HTMLElement & {...}`), especially in tests and page objects

For each referenced rule file below, perform a distinct review pass. Do not treat these files as optional background material. Each reference file contains a brief explanation of why it matters, incorrect and correct examples, and additional review context. Spawn one agent per rule file, wait for all of them, and summarize the result for each point.

- `references/react.md`: React/Preact behavior, hooks, async/data flow, component simplicity, modern Web APIs, bundle/performance concerns.
- `references/code-structure.md`: file size, mixed responsibility, duplication, testability, overengineering, consistency with project patterns.
- `references/typescript.md`: unsafe types, type assertions, nullability, public contracts, generics, data modeling.
- `references/a11y.md`: keyboard access, labels, accessible names, semantics, ARIA correctness, focus, dynamic state announcements.
- `references/css.md`: class naming, RTL/logical properties, token/variable usage, specificity, global leakage, responsive layout.

Before finalizing, confirm each referenced-rule pass produced either:

- a finding with file/line references, or
- an explicit no-issue note for that pass.

Before writing the final review, do a separate type-safety pass: selector fragility and unsafe TypeScript assertions are distinct issues and should be reported separately when both apply.

Before writing the final review, verify every loaded reference produced an explicit pass:

- React/Preact behavior
- TypeScript/type assertions
- Accessibility
- CSS/style guide
- Code structure: file size, responsibility boundaries, duplication, testability
- Repo policy checklist

Include concise `Reference pass notes` in the final review for any referenced-rule pass that produced no findings, so the reader can see that the pass was performed.


---

## Step 4: Output Format

Return structured review, order by severity - critical issues first, then high, medium and low, finally report improvements, then suggestions
For each issue, include:
  - File(s) where it occurs
  - Problem description
  - Category (e.g., Accessibility, TypeScript, React, CSS, Code Structure)
  - Explanation of why it's an issue
  - Suggestions for improvement (if applicable)

After findings and open questions, include concise `Reference pass notes` covering any referenced rule files that produced no findings. Keep these notes short; they are an audit trail, not a second review.

State whether subagents were used. If they were not used, state whether the user declined subagents or the environment lacked subagent support.

Use following output style when reporting issues:

```
Critical Issues:

1. File: src/components/Button.tsx, line 45
Problem: Missing ARIA label on button element
Category: Accessibility
Explanation: This can cause accessibility issues for screen reader users, as they won't be able to understand the purpose of the button.
Suggestion: Add an appropriate ARIA label to the button element, such

High Issues:

1. File: src/components/Button.tsx, line 45
Problem: Missing ARIA label on button element
Category: Accessibility
Explanation: This can cause accessibility issues for screen reader users, as they won't be able to understand the purpose of the button.
Suggestion: Add an appropriate ARIA label to the button element, such

Medium Issues:

1. File: src/components/Button.tsx, line 45
Problem: Missing ARIA label on button element
Category: TypeScript
Explanation: This can cause accessibility issues for screen reader users, as they won't be able to understand the purpose of the button.
Suggestion: Add an appropriate ARIA label to the button element, such

Low Issues:

1. File: src/components/Button.tsx, line 45
Problem: Missing ARIA label on button element
Category: React
Explanation: This can cause accessibility issues for screen reader users, as they won't be able to understand the purpose of the button.
Suggestion: Add an appropriate ARIA label to the button element, such
```


# References

- `references/react.md` for React and Preact best practices
- `references/code-structure.md` for generic code structure best practices
- `references/typescript.md` for TypeScript best practices
- `references/a11y.md` for accessibility best practices
- `references/css.md` for CSS best practices
