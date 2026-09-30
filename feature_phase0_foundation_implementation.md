# Phase 0 Foundation Implementation Plan

## Summary

Complete the content contract before building the Canvas player. A two-scene rabbit plan and game must pass deterministic validation, while deliberately broken versions produce useful errors or warnings. This plan covers repository setup, four small schemas, a validation CLI, fixtures, tests, and repository guidance. It does not implement rendering, real asset generation, or the ElevenLabs adapter.

## User-Facing Behavior

- `pnpm validate` checks the valid rabbit plan, game, and selected age profile and prints a concise success report.
- `pnpm test` proves that the valid fixture passes and the four required defects produce the expected diagnostics.
- The CLI accepts explicit plan, game, and profile paths so another author or agent can validate a new game. Errors include file path, JSON path, severity, and repair guidance. Warnings do not cause a nonzero exit code.
- Czech dialogue has an audio reference in the fixture. Referenced graphics and audio are placeholders at this phase; no real files or provider calls are required.

## Repository and Architecture Notes

The repository currently has the platform design and six new game workflow skills under `.agents/skills/`. `AGENTS.md` and `README.md` are empty. There are no package files, schemas, source packages, fixtures, or tests to preserve. The design defines pnpm, TypeScript, JSON Schema 2020-12 with Ajv, separate structural and semantic validation, and a small rabbit example. The approved changes require four harmless Czech false interactions per scene and two navigation modes across a game. Phase 0 represents positions, interaction points, entry points, and scene exits in data; movement and walkability checks belong to the Phase 1 player.

## Relevant Files

| Path | Purpose |
|---|---|
| `docs/adventure-game-platform-design.md` | Scope and product rules, especially sections 8–11, 15–16, 20–21, and 25 |
| `.agents/skills/design-adventure/SKILL.md` | Planning workflow for another game |
| `.agents/skills/validate-adventure/SKILL.md` | Validation workflow and required reporting |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json` | Workspace and reproducible commands |
| `packages/schemas/*.schema.json` | Machine-readable plan, game, profile, and asset contracts |
| `packages/validators/src/` | Structural checks, semantic checks, diagnostics, and CLI |
| `games/examples/rabbit-phase0/` | Valid plan, game, age profile, and invalid fixtures |
| `AGENTS.md`, `README.md` | Entry points for agents and developers |

## Proposed Implementation

1. Establish a pnpm workspace with `packages/schemas`, `packages/validators`, and `games/examples/rabbit-phase0`. Configure future `apps/*` workspace discovery without scaffolding a player. Pin TypeScript, Ajv, tsx, Vitest, and Node types in the lockfile. Prefer `const` declarations over function declarations in TypeScript.
2. Write JSON Schema 2020-12 contracts for the game plan, difficulty profile, and asset metadata. Keep the plan focused on approved story decisions, not coordinates. Give the rabbit a 4–5 age profile with an object-density limit that can accommodate four false interactions plus required story objects.
3. Write the smallest useful `game.schema.json`: one or more scenes; entry points; positioned entities with rectangle or circle hit areas and interaction points; items; boolean flags; dialogue and audio references; a completion condition; `hasItem`, `flagEquals`, `all`, `any`, `not` conditions; and `addItem`, `removeItem`, `setFlag`, `hideEntity`, `playDialogue`, `transitionScene` actions. A false interaction is an ordinary entity marked with `interactionRole: "falseInteraction"`; it has no special engine action. An exit uses `transitionScene` with a destination scene and entry point. Do not add arbitrary scripting, pathfinding, animation, or catalog search to this contract.
4. Author the valid rabbit plan and game. Home: Mother gives the rabbit a basket. Forest path: the rabbit finds an acorn and gives it to the squirrel. Include one scene exit, a completion condition, eight Czech false-interaction lines total, and placeholder audio and graphic references. Reuse the same stable IDs across plan, game, and manifests.
5. Implement an Ajv-based CLI for structural validation and TypeScript semantic passes. Semantic checks cover duplicate IDs, broken references and transitions, missing Czech audio references, four false interactions per scene with no state-changing actions, profile target-size warnings, and required items never granted in any potentially reachable scene. Keep the initial reachability analysis deliberately conservative; full state-graph exploration is a later phase. Produce diagnostics with file path, JSON path, severity, and message.
6. Add distinct invalid fixtures for missing entity reference, missing Czech audio, undersized hit area, and unobtainable required item. Test expected diagnostic codes or messages and exit behavior, then document how to create and validate another two-scene game.

## Data Flow or Control Flow

```text
rabbit-plan.json ──┐
rabbit-game.json ──┼─> CLI ─> Ajv structural checks ─> TypeScript semantic checks ─> diagnostics + exit code
age-profile.json ──┘
```

The CLI validates explicit input paths, loads the matching schemas, then runs semantic checks only on structurally valid documents. It prints warnings separately from errors; errors fail the command. `pnpm validate` points to the valid example, while `pnpm test` exercises valid and invalid fixtures. The CLI checks that an audio reference exists, not that Phase 0 placeholder files are present on disk.

## Risks and Mitigations

- Four false interactions can crowd a young child's scene. The rabbit profile and fixture must count them toward the object-density limit; keep required objects and exits visually distinct.
- Schema and TypeScript checks can drift. Compile all schemas in tests and use the same schema files in the CLI. Keep cross-file rules only in semantic code.
- Static obtainability is not a full proof of game completion. Require clear failure for a never-granted item and defer exhaustive route exploration to Phase 3.
- Placeholder audio can mask missing speech. Require each Czech dialogue to reference an audio manifest entry, while labeling file-existence and playback checks as pending for later phases.
- The current terminal exposes `pnpm` but not `node` directly. Executor tasks should run Node tools through pnpm after workspace setup; dependency installation may need normal network approval.

## Testing Strategy

- Unit tests compile all four schemas under Ajv 2020-12 and check representative valid and invalid data.
- CLI tests check valid plan/game/profile input and readable diagnostics for each deliberately invalid fixture.
- `pnpm validate` passes on the valid rabbit example; `pnpm test` passes all schema, semantic, and CLI tests.
- Manually inspect the fixture against the plan, and follow `AGENTS.md` to validate a second minimal two-scene example or a temporary variant.

## Acceptance Criteria

- Workspace and lockfile exist; `pnpm validate` and `pnpm test` run from the repository root.
- All four schemas compile under JSON Schema 2020-12 and the valid rabbit plan/game/profile pass.
- The rabbit game has two scenes, four Czech false interactions in each, inventory and flag actions, dialogue/audio references, an authored exit, and a completion condition.
- Missing entity reference, missing Czech audio reference, and unobtainable required item each fail with a readable path and message; undersized hit area emits an age-profile warning.
- `AGENTS.md` explains layout, schemas, skills, commands, and how a fresh agent can add another valid two-scene game.
- No player, real artwork, real audio files, ElevenLabs calls, or full route-exploration engine is required.

## Open Questions

None for Phase 0. The exact JSON property names can be settled while writing the schemas, provided the CLI, fixtures, tests, and documentation use the same contract.
