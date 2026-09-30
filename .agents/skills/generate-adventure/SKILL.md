---
name: generate-adventure
description: Turn an approved adventure game plan into schema-valid game content, resolved asset references, and an offline audio manifest. Use for production of game definitions; use design-adventure when the story or plan still needs design review.
---

# Generate Adventure

Build game content from an approved `game-plan.json`. Preserve the reviewed story, age profile, language, educational goals, and art style. Produce content the engine can load and validators can inspect, with a clear report of anything still missing.

## Before production

Read `docs/adventure-game-platform-design.md`, the approved plan, the current `game.schema.json`, difficulty profile, and any existing game files. The schemas and repository commands define the supported format; do not add fields or action types based only on design examples. If the game schema is absent, provide a content mapping and missing-tooling report instead of inventing a production `game.json`. Confirm the plan was approved for production. If approval or a material design choice is missing, resolve that with the user before generating assets or audio. Preserve user edits in an existing game.

Check the plan against current repository rules. If requirements disagree, report the conflict and follow a decision already made for this game.

## Produce the game

1. Map each approved scene to its entry point, entities, interaction points, hit areas, dialogue, inventory changes, conditions, action sequences, transitions, and completion path. Support movement between walkable points within a scene and authored exits to specified entry points in other scenes. Individual scenes need only the navigation options planned for them. Use only actions supported by the current schema and engine. Give stable IDs to scenes, entities, items, and dialogue.
2. Make required items obtainable before use. Keep mistakes recoverable, repeated interactions safe, and instructions understandable through speech and visuals. Apply the selected age profile to target sizes, scene density, puzzle steps, and hints.
3. Implement at least four false interactions per scene as ordinary clickable entities and dialogue sequences. Preserve their short, funny Czech lines, connect them to Czech speech, and ensure the interactions leave inventory and progress unchanged. Count these objects in scene density and keep their hit areas clear of required targets.
4. List every graphic, animation, sound, and speech need. Search the asset catalog and existing game assets before requesting new ones. Reuse only assets whose concept, art style, technical properties, and usage rights fit. Record unresolved needs in a manifest; generate or commission only what is missing through the available asset workflow.
5. For Czech speech, keep stable dialogue IDs and one stable voice ID per character. Use the configured ElevenLabs adapter during content production when available, then package generated audio files and their manifest for offline play. Do not put credentials or provider calls in `game.json` or the player. If audio generation is unavailable, leave an explicit unresolved audio request and do not claim the speech requirement is met.
6. Write `game.json` and the asset and audio manifests in the user-selected or existing game folder. Resolve paths relative to the packaged game. Do not overwrite existing assets merely to make filenames consistent.


## Validate and hand off

Run the repository's structural and semantic validation commands and the available game tests. Repair content errors and rerun the failed checks. Review movement within scenes, all authored exits and return routes, the start-to-ending route, four false interactions per scene, age fit, required audio coverage, and offline references. If a validator or runtime is not implemented yet, state exactly which checks could not run; do not describe the game as playable or complete on that basis.

Deliver the game definition, manifests, reused and newly created asset list, validation results, and any unresolved decisions or resources. Further story changes go back through plan review before production content is revised.
