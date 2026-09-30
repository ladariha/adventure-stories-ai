---
name: test-adventure
description: Test a playable adventure through state exploration, authored scenarios, browser interaction, and device checks; report completion traces and failures. Use when checking gameplay behavior after content validation, not for schema-only validation.
---

# Test Adventure

Show that a child can play the approved game from its start to every intended ending, and that interactions behave as designed. Keep test evidence separate from the content validator's structural findings.

## Prepare

Read `docs/adventure-game-platform-design.md` sections 9, 10, 11, 15, and 24, the approved plan, current game definition, age profile, and any authored scenarios. Run the available content validation first. If the player is not implemented yet, run only the state-level tests that exist and report browser and visual checks as pending; do not describe the game as playable.

## Exercise game state

1. Run the repository's state exploration tool when available. Confirm a route from the start to every intended ending. Record an interaction trace for each ending and the exploration limit used. Report required states, scenes, or items that are unreachable, as well as any routes that trap the player or remove a required item too early.
2. Execute authored scenarios for each puzzle and important branch. Cover movement between walkable points within scenes, exits to other scenes and their entry points, conditional exits, and return routes where the story needs them. Confirm a tap or click produces timely feedback and a repeated tap does not duplicate a one-time effect.
3. Exercise all four false interactions in every scene. Each should play its intended funny Czech line, remain safe on repeated taps, and leave inventory and progress unchanged. Check that optional targets do not obstruct required targets.

## Exercise the player

When the browser player exists, test mouse and touch input at representative desktop, tablet landscape, and phone portrait sizes. Check scaling, pointer hit testing, scene transitions, inventory, Czech speech replay, captions, independent volume controls, reduced motion, offline reload, and save and resume. The release matrix includes Chrome, Edge, Firefox, and Safari; record which browsers or engines were actually run rather than claiming untested browsers passed. Visually inspect the game at those sizes for cropped essentials, overlapping hit areas, and unclear puzzle cues.

## Report

Provide the commands and environments used, ending traces, scenarios covered, failures with reproduction steps and expected versus actual behavior, and checks that could not run. Distinguish content defects from player or engine defects. Treat the test as passed only when the tested routes complete and required interactions behave correctly; do not infer a pass from schema validation alone. Repair defects only when the user asked for a fix, then rerun the affected tests.
