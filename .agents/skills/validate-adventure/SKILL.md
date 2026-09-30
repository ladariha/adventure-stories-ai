---
name: validate-adventure
description: Validate an adventure plan or game definition against its schemas, references, game logic, age profile, audio, assets, and offline packaging; repair content errors and report remaining findings. Use after creating or editing game content, not as a substitute for player playthrough tests.
---

# Validate Adventure

Check whether a game plan or game definition meets the repository's current content contract. Use machine-readable schemas and validators as the source of truth, and report each check that cannot yet run.

## Scope and inputs

Read `docs/adventure-game-platform-design.md` sections 8–11 and 15, `AGENTS.md`, the relevant JSON schemas, the selected difficulty profile, and the content being checked. Identify whether the target is a Phase 0 fixture with placeholder asset paths or a production game expected to run offline. Preserve the approved story and user edits while repairing content defects; a repair that changes the story or puzzle design needs plan review.

## Check and repair

1. Run the repository's validation command and relevant fixture tests when available. Check structural validity first, including schema version, required fields, supported condition and action types, and property types. Keep source file, JSON path, severity, and a clear repair message for each finding.
2. Check unique IDs and every reference: start scene, exits and their destination entry points, entities, items, dialogues, audio, and assets. Verify that within-scene destinations are walkable and required interaction points can be reached. Check that authored exits support the required routes without trapping the player.
3. Check game state and completion: required items can be obtained before use, conditions can become true, transitions lead to existing scenes, and at least one valid route reaches each intended ending. Flag items that can be lost before use and action sequences that duplicate effects on repeated taps. Leave exhaustive playthrough traces to `test-adventure` when that workflow is available.
4. Check the selected age profile: target size, object density, puzzle steps, inventory load, memory demands, and hints. Every scene needs at least four false interactions. Each must use a valid Czech dialogue and speech reference, remain harmless on repeated use, and leave inventory and progress unchanged. Count their objects toward scene density.
5. Check accessibility and resources: important instructions and story dialogue have speech, sound-only clues have a visual alternative, color tasks have a secondary cue where required, assets match the approved art style and usage rights, and production audio and visual files exist in the offline package. A Phase 0 fixture may use placeholder asset paths only where its schema and test contract explicitly allow them; report that runtime asset checks remain pending.
6. Repair content errors within the approved design and rerun affected checks. Do not weaken a schema, suppress an error, or add a made-up file merely to obtain a pass. Record warnings and any explicit, approved profile exceptions.

## Result

Report what passed, what failed, what was repaired, and what was not checked because the validator, player, or assets do not exist yet. Include actionable paths and messages for remaining findings. Mark the content validated only for the layers that actually ran; do not call a production game complete while required audio, assets, navigation, or completion checks remain unverified.
