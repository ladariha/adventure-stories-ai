---
name: create-game-assets
description: Create and check only the unresolved visual and audio assets for an approved adventure game, then place reusable assets in the catalog and story-specific assets with the game. Use after asset resolution; do not use for finding existing assets or designing the story.
---

# Create Game Assets

Fill the missing-asset manifest produced by asset resolution. Preserve the approved game plan, art style, dialogue text, and asset IDs. The result is real, validated files with metadata that the game can package for offline play.

## Inputs and scope

Read `docs/adventure-game-platform-design.md` sections 10, 12, and 13, the approved plan, the resolution report, the missing-asset manifest, and the current asset and audio schemas. Create only requests marked unresolved. If a required request lacks a clear purpose, style, technical specification, dialogue text, voice, or destination, resolve that gap before generating it. Do not replace or regenerate a matched asset without a specific reason and authorization.

If the catalog or validation tooling is not implemented yet, keep new files with the game and record the pending catalog or validation work. Do not invent a passing result.

## Create and process

1. Group related requests so shared characters, backgrounds, and animation frames use consistent references, proportions, anchors, and naming. Follow the game's versioned art-style specification. Use the repository's asset-generation interface or available generation tools; keep provider details outside the portable request manifest.
2. Generate the required images, animations, sounds, and music. Inspect each output against its request. Check dimensions, transparency, crop, style, file format, visual age fit, animation frames, and practical scene placement where applicable. Correct failed outputs and repeat these checks.
3. Generate each unresolved speech line from its exact dialogue ID and text. Preserve one stable voice ID per character, the requested locale, and any delivery direction. For Czech games, this includes instructions and the funny responses to all four false interactions in each scene. Listen for clear Czech pronunciation, natural delivery, and consistent character voices; correct lines that fail review.
4. Store the accepted files in the game package or reusable catalog according to the resolution report. Keep named characters, unique locations, and story-specific dialogue with the game unless an explicit reuse decision says otherwise. Record source, provider, generation settings needed for reproduction, voice identity for speech, format, duration where applicable, and usage rights in metadata. Do not store credentials in the repository.
5. Update the asset and audio manifests with actual file paths and stable IDs. Ensure every referenced file exists and that speech files can play from local game assets without network access. Do not use a proposed filename or a placeholder as proof that a request is complete.

## Speech provider: ElevenLabs

ElevenLabs is the initial speech adapter. Use the repository's provider interface when available and package its generated MP3 or Ogg files; the player must not contact ElevenLabs at runtime. Keep the game's dialogue manifest provider-independent while recording the provider voice ID and generation metadata with the produced audio. Use a plan and voice rights suitable for the game's intended use, and record the rights in asset metadata. If the adapter, credentials, or suitable rights are unavailable, leave those requests unresolved and report why.

## Handoff

Run available asset, audio, schema, and offline-package checks. Report accepted files by request ID, catalog additions, game-local files, failed or unresolved requests, and checks that could not run. Do not mark the asset set complete while a required asset or Czech speech line is missing.
