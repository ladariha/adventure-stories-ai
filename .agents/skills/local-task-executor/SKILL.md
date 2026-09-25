---
name: local-task-executor
description: Use when the user asks to execute, run, implement, continue, resume, or apply a specific task from a feature task Markdown file using an interactive coding agent.
---

# Local Task Executor

Use this skill when the user wants to implement one planned task from `feature_*_tasks.md`.

## Workflow

1. Identify the feature and task.
   - Parse prompts like `implement feature FEATURE_NAME task TXXX`.
   - Prefer an explicitly named `feature_*_tasks.md` file when provided.
   - Otherwise locate `feature_FEATURE_NAME_tasks.md`.
   - Ask the user to choose only when multiple task files are plausible.

2. Validate the task file:
   - `node .agents/skills/local-task-executor/scripts/validate-task-file.js feature_FEATURE_NAME_tasks.md`

3. Read only the context needed for the selected task:
   - the selected task JSON
   - files listed in `readFiles`
   - files listed in `editFiles`
   - `feature_FEATURE_NAME_implementation.md` only when useful

4. Implement the selected task only.
   - Do not continue to later tasks.
   - Do not edit files outside the task's `editFiles` unless the user approves.

5. Run the selected task's `verify` commands.

6. Check changed files:
   - `git diff --name-only`
   - Report any file outside the selected task's `editFiles`.

7. Summarize:
   - completed task id and title
   - changed files
   - verification results
   - blockers or follow-up tasks, if any

## When To Ask The User

Ask the user before continuing if:
- requirements are ambiguous
- required files are missing
- the selected task depends on incomplete prior work
- verification fails and the repair needs a product or architecture decision
- implementation requires editing files outside `editFiles`

## Execution Rules

- Prefer one task at a time.
- Keep the implementation narrowly scoped to the selected task.
- Respect repository instructions and existing patterns.
- Always prefer const over function in TypeScript.
