---
name: feature-planner
description: Use when the user asks to implement, add, build, modify, or design a feature in a code repository and the work should first be planned into implementation and task Markdown files for later local agent execution.
---

# Feature Planner

Use this skill when the user asks to implement a feature, add functionality, modify behavior, or make a non-trivial code change.

## Workflow

Planning only. Do not implement feature code unless the user explicitly says to skip planning.

1. Inspect repository guidance:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `README.md`
   - package files
   - docs
   - relevant source files
   - existing tests and architecture patterns

2. Read `.agents/skills/feature-planner/references/planner-prompt.md` if it exists.
   - Treat it as the canonical planning template.
   - If it conflicts with this skill, prefer the repository-specific planner prompt.

3. Ask refining questions if requirements are unclear.

4. When ready, create exactly two files:
   - `feature_FEATURE_NAME_implementation.md`
   - `feature_FEATURE_NAME_tasks.md`

   Optional helper:
   - `node .agents/skills/feature-planner/scripts/create-feature-files.js FEATURE_NAME`

5. The implementation file is read-only planning material:
   - architecture understanding
   - relevant files
   - proposed approach
   - risks
   - testing strategy
   - acceptance criteria

6. The tasks file is for a second coding agent:
   - tasks must be sequential
   - each task must be small
   - each task must list files to read
   - each task must list files allowed to edit
   - each task must include verification commands
   - include a machine-readable JSON block matching `.agents/skills/local-task-executor/references/task-schema.json`

7. Respect project style rules.
   - Always prefer const over function in TypeScript.
