# Phase 0 Foundation Tasks

## Overview

Run one task at a time and review its diff and verification result before starting the next. The order is workspace, schemas, valid content, validator layers, negative fixtures, commands, then guidance. Paths under `packages/` and `games/` are created by the listed task; do not infer additional files or implement the Canvas player here.

| Task | Reviewable result |
|---|---|
| T001 | Reproducible pnpm workspace |
| T002 | Plan schema |
| T003 | Difficulty and asset schemas |
| T004 | Minimal game schema |
| T005 | Valid two-scene rabbit content |
| T006 | Structural validation CLI |
| T007 | Reference and Czech audio checks |
| T008 | False-interaction and age-profile checks |
| T009 | Required-item obtainability check |
| T010 | Four invalid fixtures and diagnostic tests |
| T011 | Root validation and test commands |
| T012 | Agent and developer guidance |

```json
{
  "feature": "phase0_foundation",
  "tasks": [
    {
      "id": "T001",
      "title": "Set up the pnpm workspace",
      "objective": "Create the package boundaries and reproducible development dependencies without implementing application behavior.",
      "readFiles": ["docs/adventure-game-platform-design.md", "feature_phase0_foundation_implementation.md", "AGENTS.md", "README.md"],
      "editFiles": ["package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml", "tsconfig.base.json", "packages/schemas/package.json", "packages/validators/package.json", "packages/validators/tsconfig.json"],
      "instructions": ["Configure pnpm workspaces for packages/*, apps/*, and games/*; the apps need no scaffold yet.", "Add TypeScript, Ajv, tsx, Vitest, and Node type dependencies needed by the later tasks; pin them in pnpm-lock.yaml.", "Create minimal schema and validator package manifests and a TypeScript config. Do not add success-only placeholder validate or test scripts.", "Prefer const over function declarations in TypeScript added later."],
      "verify": ["pnpm install --frozen-lockfile", "pnpm -r list --depth -1"],
      "expected": "Dependencies install from the lockfile and pnpm recognizes the schema and validator packages.",
      "rollback": "Remove only the workspace and package files created by T001 if setup cannot be repaired; preserve existing repository files."
    },
    {
      "id": "T002",
      "title": "Define the game-plan schema",
      "objective": "Make the reviewed story plan machine-checkable before game production.",
      "readFiles": ["docs/adventure-game-platform-design.md", ".agents/skills/design-adventure/SKILL.md", "packages/schemas/package.json"],
      "editFiles": ["packages/schemas/game-plan.schema.json", "packages/schemas/test/game-plan.test.ts"],
      "instructions": ["Use JSON Schema 2020-12 for required story, target age, length, locale and voice requirements, mode, art style, scenes, and goals.", "Represent planned false interactions and scene exits without final coordinates or asset filenames.", "Test one realistic valid plan and failures for missing required creation inputs; keep identifiers stable."],
      "verify": ["pnpm exec vitest run packages/schemas/test/game-plan.test.ts"],
      "expected": "Ajv 2020-12 compiles the schema; valid and invalid plan cases behave as specified.",
      "rollback": "Revert only the plan schema and its test if the contract needs redesign."
    },
    {
      "id": "T003",
      "title": "Define difficulty and asset schemas",
      "objective": "Validate the selected age profile and placeholder asset metadata independently of game logic.",
      "readFiles": ["docs/adventure-game-platform-design.md", "packages/schemas/game-plan.schema.json"],
      "editFiles": ["packages/schemas/difficulty-profile.schema.json", "packages/schemas/asset.schema.json", "packages/schemas/test/supporting-schemas.test.ts"],
      "instructions": ["Use JSON Schema 2020-12 and stable IDs.", "Include age range, minimum target size, maximum relevant objects per scene, inventory and puzzle limits, and hint timing in the difficulty profile.", "Include asset concept, type, style where visual, file reference, technical metadata, and source or usage metadata; permit Phase 0 placeholder references without claiming files exist.", "Test valid examples and meaningful missing-field or type failures."],
      "verify": ["pnpm exec vitest run packages/schemas/test/supporting-schemas.test.ts"],
      "expected": "Both schemas compile and reject malformed profile or asset data.",
      "rollback": "Revert only the two supporting schemas and their tests if their fields need revision."
    },
    {
      "id": "T004",
      "title": "Define the minimal game schema",
      "objective": "Establish the small executable content contract the future Canvas player will load.",
      "readFiles": ["docs/adventure-game-platform-design.md", "feature_phase0_foundation_implementation.md", "packages/schemas/game-plan.schema.json", "packages/schemas/difficulty-profile.schema.json"],
      "editFiles": ["packages/schemas/game.schema.json", "packages/schemas/test/game-schema.test.ts"],
      "instructions": ["Use JSON Schema 2020-12 with one or more scenes, start scene and entry point, entity positions and interaction points, rectangle or circle hit areas, items, boolean flags, dialogue references, audio manifest entries with locale, voice ID and placeholder file path, and a completion condition.", "Support only hasItem, flagEquals, all, any, not conditions and addItem, removeItem, setFlag, hideEntity, playDialogue, transitionScene actions.", "Mark harmless decoy entities with interactionRole falseInteraction; use ordinary playDialogue actions. Encode exits as transitionScene actions with destination scene and entry point.", "Test valid minimal content and rejection of an unsupported action or malformed hit area; leave cross-file references to semantic validation."],
      "verify": ["pnpm exec vitest run packages/schemas/test/game-schema.test.ts"],
      "expected": "The schema compiles, accepts supported content, and rejects unsupported action shapes.",
      "rollback": "Revert only the game schema and its test if the initial contract needs redesign."
    },
    {
      "id": "T005",
      "title": "Author the valid rabbit fixtures",
      "objective": "Exercise the schemas with one reviewable two-scene plan and game.",
      "readFiles": ["docs/adventure-game-platform-design.md", ".agents/skills/design-adventure/SKILL.md", "packages/schemas/game-plan.schema.json", "packages/schemas/game.schema.json", "packages/schemas/difficulty-profile.schema.json"],
      "editFiles": ["games/examples/rabbit-phase0/rabbit-plan.json", "games/examples/rabbit-phase0/rabbit-game.json", "games/examples/rabbit-phase0/age-profile.json", "packages/schemas/test/rabbit-fixture.test.ts"],
      "instructions": ["Use the Home and Forest path story from section 20: Mother gives a basket; rabbit finds an acorn and gives it to the squirrel.", "Give each scene four ordinary false-interaction entities with short, funny Czech text and placeholder Czech audio references; count them in the 4–5 age profile's scene-density limit.", "Include inventory, boolean flags, conditions, hideEntity, an authored exit with destination entry point, and a completion condition. Use placeholder asset and speech paths only.", "Validate all three JSON documents against their schemas in the fixture test."],
      "verify": ["pnpm exec vitest run packages/schemas/test/rabbit-fixture.test.ts"],
      "expected": "The plan, game, and profile are structurally valid and visibly cover the Phase 0 story contract.",
      "rollback": "Revert only the three rabbit JSON files and fixture test if their mapping conflicts with the schemas."
    },
    {
      "id": "T006",
      "title": "Build the structural validation CLI",
      "objective": "Validate explicit plan, game, and profile paths with readable Ajv diagnostics.",
      "readFiles": ["packages/schemas/game-plan.schema.json", "packages/schemas/game.schema.json", "packages/schemas/difficulty-profile.schema.json", "games/examples/rabbit-phase0/rabbit-plan.json", "games/examples/rabbit-phase0/rabbit-game.json", "games/examples/rabbit-phase0/age-profile.json"],
      "editFiles": ["packages/validators/src/cli.ts", "packages/validators/src/structural.ts", "packages/validators/src/diagnostics.ts", "packages/validators/test/structural.test.ts"],
      "instructions": ["Accept --plan, --game, and --profile file paths; load and compile the JSON Schema 2020-12 files with Ajv2020.", "Run semantic checks only after the relevant documents pass structural validation. Use a semantic hook that later tasks can populate without printing success before all checks finish.", "Emit severity, source file, JSON path, and repair message. Exit nonzero on errors, zero on warnings only.", "Test a valid invocation and a structural failure; do not check placeholder asset file existence in Phase 0."],
      "verify": ["pnpm exec vitest run packages/validators/test/structural.test.ts", "pnpm exec tsx packages/validators/src/cli.ts --plan games/examples/rabbit-phase0/rabbit-plan.json --game games/examples/rabbit-phase0/rabbit-game.json --profile games/examples/rabbit-phase0/age-profile.json"],
      "expected": "Valid content exits successfully; malformed structure reports its source path and fails.",
      "rollback": "Revert only the CLI, structural validator, diagnostics, and their test if the interface needs revision."
    },
    {
      "id": "T007",
      "title": "Check IDs, references, and Czech audio",
      "objective": "Catch invalid links between scenes, entities, items, dialogue, and audio.",
      "readFiles": ["packages/validators/src/cli.ts", "packages/validators/src/diagnostics.ts", "packages/schemas/game.schema.json", "games/examples/rabbit-phase0/rabbit-game.json"],
      "editFiles": ["packages/validators/src/semantic/index.ts", "packages/validators/src/semantic/references.ts", "packages/validators/src/cli.ts", "packages/validators/test/references.test.ts"],
      "instructions": ["Check duplicate IDs, missing start scene or entry point, broken entity/item/dialogue/audio references, and transitionScene destinations and entry points.", "Require every Czech dialogue to have a reference to a declared Czech audio entry; actual Phase 0 audio files remain placeholders.", "Use the shared diagnostic format, connect this pass to the CLI, and test missing entity and Czech audio cases with exact paths."],
      "verify": ["pnpm exec vitest run packages/validators/test/references.test.ts", "pnpm exec tsx packages/validators/src/cli.ts --plan games/examples/rabbit-phase0/rabbit-plan.json --game games/examples/rabbit-phase0/rabbit-game.json --profile games/examples/rabbit-phase0/age-profile.json"],
      "expected": "The valid rabbit fixture passes; broken references and missing Czech audio references fail with repairable paths.",
      "rollback": "Revert only this semantic pass, its CLI wiring, and its tests."
    },
    {
      "id": "T008",
      "title": "Check false interactions and target size",
      "objective": "Enforce the approved four-decoy rule and the chosen age profile's target warning.",
      "readFiles": ["docs/adventure-game-platform-design.md", "packages/validators/src/semantic/index.ts", "packages/validators/src/diagnostics.ts", "packages/schemas/game.schema.json", "games/examples/rabbit-phase0/age-profile.json"],
      "editFiles": ["packages/validators/src/semantic/experience.ts", "packages/validators/src/semantic/index.ts", "packages/validators/test/experience.test.ts"],
      "instructions": ["Require at least four interactionRole falseInteraction entities per scene; each must play Czech dialogue and have no inventory, flag, visibility, or transition side effects.", "Count those entities toward maximum relevant objects per scene.", "Warn when a rectangular target's width or height or a circular target's diameter is below minimumTargetSize; include scene and entity path.", "Keep warnings nonfatal and test both valid and undersized cases."],
      "verify": ["pnpm exec vitest run packages/validators/test/experience.test.ts", "pnpm exec tsx packages/validators/src/cli.ts --plan games/examples/rabbit-phase0/rabbit-plan.json --game games/examples/rabbit-phase0/rabbit-game.json --profile games/examples/rabbit-phase0/age-profile.json"],
      "expected": "Valid scenes have four harmless Czech false interactions; undersized hit areas yield a readable warning without failing the CLI.",
      "rollback": "Revert only this experience pass, its registration, and its tests."
    },
    {
      "id": "T009",
      "title": "Check required-item obtainability",
      "objective": "Reject a required item that no reachable action can grant.",
      "readFiles": ["docs/adventure-game-platform-design.md", "packages/validators/src/semantic/index.ts", "packages/validators/src/diagnostics.ts", "packages/schemas/game.schema.json", "games/examples/rabbit-phase0/rabbit-game.json"],
      "editFiles": ["packages/validators/src/semantic/obtainability.ts", "packages/validators/src/semantic/index.ts", "packages/validators/test/obtainability.test.ts"],
      "instructions": ["Collect items required by conditions and completion; conservatively traverse authored scene transitions from the start without assuming conditions are solvable, then look for addItem actions in potentially reachable scenes.", "Report an error only when a required item is never granted in those scenes; avoid claiming full state-graph proof in this phase.", "Test a reachable basket/acorn case and a declared but never-obtainable required item."],
      "verify": ["pnpm exec vitest run packages/validators/test/obtainability.test.ts", "pnpm exec tsx packages/validators/src/cli.ts --plan games/examples/rabbit-phase0/rabbit-plan.json --game games/examples/rabbit-phase0/rabbit-game.json --profile games/examples/rabbit-phase0/age-profile.json"],
      "expected": "The rabbit game passes; a never-granted required item produces an error with a usable path.",
      "rollback": "Revert only the obtainability pass, its registration, and its tests."
    },
    {
      "id": "T010",
      "title": "Add the four invalid fixtures",
      "objective": "Make every required Phase 0 diagnostic reproducible from a file.",
      "readFiles": ["games/examples/rabbit-phase0/rabbit-game.json", "games/examples/rabbit-phase0/age-profile.json", "packages/validators/src/cli.ts", "packages/validators/src/semantic/index.ts"],
      "editFiles": ["games/examples/rabbit-phase0/invalid/missing-entity.json", "games/examples/rabbit-phase0/invalid/missing-czech-audio.json", "games/examples/rabbit-phase0/invalid/undersized-target.json", "games/examples/rabbit-phase0/invalid/unobtainable-item.json", "packages/validators/test/invalid-fixtures.test.ts"],
      "instructions": ["Make each invalid file a complete game definition derived from the valid fixture with one intentional defect.", "Test the CLI against each file using the valid plan and profile; assert the expected diagnostic path, message or code, and exit status.", "Missing entity, missing Czech audio, and unobtainable item must error; undersized target must warn and exit successfully."],
      "verify": ["pnpm exec vitest run packages/validators/test/invalid-fixtures.test.ts"],
      "expected": "Each invalid fixture demonstrates exactly its intended failure or warning with readable diagnostics.",
      "rollback": "Revert only the invalid fixture files and their integration test."
    },
    {
      "id": "T011",
      "title": "Wire root commands and run the complete suite",
      "objective": "Make Phase 0 verifiable from the repository root.",
      "readFiles": ["package.json", "packages/validators/src/cli.ts", "games/examples/rabbit-phase0/rabbit-plan.json", "games/examples/rabbit-phase0/rabbit-game.json", "games/examples/rabbit-phase0/age-profile.json", "feature_phase0_foundation_implementation.md"],
      "editFiles": ["package.json"],
      "instructions": ["Set pnpm validate to run the CLI against the valid rabbit plan, game, and profile; set pnpm test to run the Vitest suite.", "Run all schema and validator tests, the valid CLI path, and TypeScript typecheck. Fix only root script configuration in this task; report defects in earlier-task files for separate repair."],
      "verify": ["pnpm validate", "pnpm test", "pnpm exec tsc -p packages/validators/tsconfig.json --noEmit", "git diff --check"],
      "expected": "Both root commands pass, the validator package typechecks, and no whitespace defects remain.",
      "rollback": "Restore only the previous root package scripts if the commands cannot be repaired within T011."
    },
    {
      "id": "T012",
      "title": "Document the Phase 0 workflow",
      "objective": "Let a fresh agent create and validate another small game using the repository contract.",
      "readFiles": ["AGENTS.md", "README.md", "docs/adventure-game-platform-design.md", ".agents/skills/design-adventure/SKILL.md", ".agents/skills/validate-adventure/SKILL.md", "packages/schemas/game-plan.schema.json", "packages/schemas/game.schema.json", "package.json"],
      "editFiles": ["AGENTS.md", "README.md"],
      "instructions": ["Explain the repository layout, which schema and skill to use for planning versus production, and the exact pnpm validate and pnpm test commands.", "Give a short recipe for making another two-scene plan/game from the rabbit fixture and checking it with explicit CLI paths; follow that recipe on a temporary variant as a manual smoke check.", "State that Phase 0 graphics and speech paths are placeholders and that the player, real assets, and ElevenLabs adapter come later. Preserve user edits and schema compatibility."],
      "verify": ["pnpm validate", "pnpm test", "git diff --check"],
      "expected": "Commands still pass, and a new agent can follow AGENTS.md without guessing paths or validation arguments.",
      "rollback": "Restore only AGENTS.md and README.md to their pre-task contents if the documentation is incorrect."
    }
  ]
}
```
