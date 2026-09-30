---
name: resolve-assets
description: Match a planned game's image, animation, sound, music, and speech needs to existing catalog or game assets; report reusable matches and unresolved requests before any new asset generation. Use when preparing or revising an adventure asset manifest.
---

# Resolve Assets

Resolve each asset need to a suitable existing file or a precise request for later creation. This skill searches and records decisions; it does not generate assets or add files to the catalog.

## Inputs and sources

Read `docs/adventure-game-platform-design.md` sections 10, 12, and 13, the approved game plan or current `game.json`, the game's asset requests, art style, language, and age profile. Include assets needed for all scenes and interactions, including exit paths and the four false interactions per scene. Use the current asset schema and catalog search command when they exist. If no manifest or catalog tooling exists yet, inventory the available game and catalog files and report the missing inputs or tooling; do not invent an asset ID or claim a match you cannot verify.

## Resolve each need

1. Give each need a stable request ID and record its purpose, concept, required tags and variant, style, technical constraints, and where the game uses it. For speech, record the exact dialogue ID, text, locale, voice identity, and any delivery direction.
2. Search the reusable catalog and the game's existing assets before requesting new work. Use deterministic metadata search when available. Inspect candidate metadata and confirm that the referenced file exists.
3. Reject candidates that fail a required property. Visual assets need the game's exact art style unless an approved conversion exists. Check concept, variant, dimensions, transparency, anchors, animation family compatibility, and usage rights as applicable. Audio needs the correct language, voice, text or sound role, playable format, and usage rights. Do not treat a similar Czech speech line as an exact match when the text or voice differs.
4. Rank viable candidates by concept, required tags, variant, and technical suitability. Record the selected asset ID, file path, reason for reuse, and any approved exception. If no candidate is strong enough, mark the need unresolved and state what the new asset must provide.
5. Classify unresolved requests as reusable or game-specific. Generic objects and sounds may be catalog candidates; named characters, unique locations, and story-specific dialogue normally stay with the game. Preserve the approved plan's intent and do not substitute a merely available asset that changes the story or art style.

## Output and handoff

Produce a resolution report that accounts for every request ID as reused or unresolved, with rejected candidates and reasons where useful. Produce a missing-asset manifest for the next creation workflow, using the repository schema if present. Keep provider-specific generation details out of the portable manifest; ElevenLabs voice IDs may be retained as speech metadata for later generation. Do not create placeholder files or mark a request resolved because a filename has been proposed.

Check that all referenced files exist, no request was skipped, and selected assets meet the required style, locale, and usage rights. Report any unsupported checks or missing metadata. Hand unresolved requests to the asset-creation workflow; do not call a generation provider from this skill.
