---
name: design-adventure
description: Adapt a supplied story into a reviewable adventure game plan for children, or revise an existing plan. Use for story, scene, puzzle, age, and educational design; stop before producing the playable game or assets.
---

# Design Adventure

Turn a story into a game plan that a person can inspect and revise before production. The plan describes the intended experience and required content; it does not contain final scene coordinates, generated assets, or engine code.

## Inputs

Collect the source story, target age or age range, desired play length, language and voice requirements, entertainment mode, and preferred art style. Ask for a missing input when choosing it would materially change the game. Educational focus, device priority, content boundaries, desired puzzle density, and required existing assets are optional. Preserve explicit user choices and distinguish any design assumptions from them.

Read `docs/adventure-game-platform-design.md`, especially sections 3–5, 10–11, and 15–16. Use the repository's difficulty profile and `game-plan.schema.json` when they exist; the schema defines the file format. Do not invent required schema fields or treat examples in the design document as the schema.

## Plan the game

1. Identify the story's core events, characters, places, emotional tone, and ending. Keep enough of the source story that the adaptation remains recognizable; explain any substantial change.
2. Choose the matching age profile. Set scene count, puzzle steps, active inventory, relevant objects per scene, memory demands, and hint timing within that profile. Record explicit exceptions for human review.
3. Outline a route from introduction to completion. For each scene, name the child's goal, the story event, important characters and objects, required interactions, items gained or used, and the transition to the next scene. Add at least four visible false-interaction objects per scene. For each, describe the attempted interaction and a brief, funny Czech response that clearly indicates it will not help. These interactions must not consume items, alter progress, or suggest a hidden requirement. Count them toward the age profile's scene-density limit.
4. Plan both navigation options across the game: movement between points within a scene, and authored exits to specified entry points in other scenes. Record each exit's destination and any condition. An individual scene need not offer both options; check that required routes remain available and that return paths exist where needed.
5. Specify what the player needs to see or hear to understand each essential action. Mark important Czech dialogue and instructions, including false-interaction responses, for Czech speech. Include replay and visual alternatives for essential sound clues.
6. If an educational focus is requested, place it inside a story goal. Describe the concept practiced and how the puzzle can be solved without reading. Do not add unrelated exercises.
7. Check that required items can be obtained before use, mistakes cannot permanently block completion, and hints can lead the child forward. Identify subjective choices or unresolved source-story details for review.

## Deliver and review

Produce `game-plan.json` in the location requested by the user or the game's existing folder, plus a concise summary of scenes, goals, age fit, educational elements, assumptions, and open decisions. If both the plan schema and validator are present, validate the file with the repository command and repair any failures. If either is absent, present the plan as a draft and state that machine validation is pending; do not claim it passed.

Present the plan for human review. Apply requested revisions to the plan and revalidate when possible. Stop at the approved plan: creating `game.json`, sourcing or generating assets, and generating ElevenLabs speech belong to later workflows and require an approved plan.
