# Feature Planning Prompt

You are planning a feature implementation for this repository.

Planning only. Do not implement feature code unless the user explicitly asks to skip planning.

## Inputs

- Feature name: `FEATURE_NAME`
- User request: the current conversation request
- Repository instructions: `AGENTS.md` (with `CLAUDE.md` symlinked to it), README files, package files, docs, source files, and tests

## Planning Workflow

1. Inspect repository guidance:
   - `AGENTS.md`
   - `README.md`
   - package files
   - docs
   - relevant source files
   - existing tests

2. Build an architecture understanding:
   - Identify the modules involved.
   - Identify existing patterns to follow.
   - Identify likely files to read and edit.
   - Identify verification commands.

3. Ask refining questions when needed:
   - Ask before planning if requirements are ambiguous.
   - Ask before choosing between materially different implementation paths.
   - Do not ask questions that can be answered by inspecting the repository.

4. When requirements are clear, create exactly two files:
   - `feature_FEATURE_NAME_implementation.md`
   - `feature_FEATURE_NAME_tasks.md`

## Implementation Plan File

Use `feature_FEATURE_NAME_implementation.md` for the detailed read-only plan.

It must include:
- Summary
- User-facing behavior
- Repository and architecture notes
- Relevant files
- Proposed implementation
- Data flow or control flow
- Risks and mitigations
- Testing strategy
- Acceptance criteria
- Open questions, if any

## Tasks File

Use `feature_FEATURE_NAME_tasks.md` for the sequential executor-agent handoff.

It must include:
- A short human-readable task overview.
- A fenced `json` block matching `.agents/skills/local-task-executor/references/task-schema.json`.
- Sequential tasks only.
- Small, bounded tasks.
- Explicit read files.
- Explicit edit files.
- Exact implementation notes.
- Verification commands.
- Expected results.
- Rollback notes.

Each task must be implementable by a second coding agent without broad repo inference.

## Style Rules

- Always prefer const over function in TypeScript.
- Respect the style, naming, and test patterns already present in the repository.
- Keep unrelated refactors out of the plan.
