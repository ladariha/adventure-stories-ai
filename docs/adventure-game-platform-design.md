# Story to Adventure Game Platform

## Product and Technical Design

Version 1.0
Status: Baseline design for implementation
Primary audience: Product owner, game designer, and software engineers

## 1. Executive Summary

This project will provide a reusable, browser-based platform that turns a supplied story or fairy tale into a playable point-and-click adventure for young children. The platform is not one game and is not tied to one AI vendor. Its product is the combination of a deterministic game engine, portable schemas, an asset catalog, validators, authoring tools, and documented agent workflows.

The game world will render with Canvas 2D in a fixed logical coordinate system. HTML and CSS will provide surrounding interface elements such as inventory, menus, settings, accessibility controls, and optional captions. TypeScript will implement the engine and tools. React may be used for the editor and user interface, but it will not render the game world.

Game creation will use a two-stage pipeline. First, an agent adapts a story into a reviewable game plan. After approval, an agent resolves reusable assets, generates only what is missing, produces a valid game definition, and runs deterministic validation and automated playthrough checks. Target age and educational intent are required inputs because they affect puzzle structure, scene density, instructions, hints, inventory, and expected memory.

The first release should optimize for reliable completion, touch-friendly play, offline playback, Czech speech, and easy correction of AI-generated scenes. Advanced pathfinding, procedural background composition, semantic embeddings, and multiple portrait-specific layouts can follow later.

## 2. Product Goals

### 2.1 Goals

- Turn a prose story or fairy tale into a coherent interactive adventure.
- Support children approximately 3 to 8 years old without requiring reading.
- Produce games that are safe to explore and cannot enter an unwinnable state.
- Reuse visual and audio assets across games and supported art styles.
- Work across desktop, tablet, and phone screen sizes.
- Run entirely in the browser with no runtime backend requirement.
- Save one local progress position per game.
- Allow humans to inspect and correct generated plans and scene geometry.
- Keep agent workflows portable across Codex, Claude Code, Gemini CLI, and similar tools.
- Make generated games testable through schemas, semantic validators, and simulated playthroughs.

### 2.2 Non goals for the first release

- A general-purpose game engine for action, physics, 3D, or multiplayer games.
- Arbitrary user scripting inside games.
- A full visual programming environment.
- Perfect automatic composition of scenes from reusable objects.
- Real-time cloud asset generation during play.
- Multiple user profiles, cloud synchronization, or a backend content service.
- Free-form natural-language dialogue with characters at runtime.

## 3. Core Product Principles

1. Story first. The author supplies a story, not scene coordinates or internal JSON.
2. Plan before production. Expensive asset and audio generation begins only after a game plan is reviewed.
3. Engine and content remain separate. A game is data interpreted by the engine.
4. Search before generation. Existing catalog assets are preferred when their concept, style, and semantic properties fit.
5. Child-safe failure. Incorrect actions give feedback but do not punish, destroy progress, or lose required items.
6. Speech and visuals carry essential meaning. Reading is optional unless explicitly requested for older children.
7. Deterministic validation surrounds probabilistic generation.
8. AI vendor independence. Schemas, command-line tools, and repository instructions are the contract.
9. Editable output. Generated geometry and logic must be inspectable and correctable without rewriting engine code.
10. Learning belongs inside the story. Educational tasks should arise naturally from goals and environments.

## 4. Target Users and Creation Inputs

The primary player is a child aged 3 to 8. A parent, teacher, or developer supplies the story and creation settings. A coding agent performs planning and generation.

Required creation inputs:

- Source story or fairy tale
- Target age or age range
- Desired play length
- Language and voice requirements
- Entertainment mode: pure entertainment, light educational, or explicitly educational
- Preferred art style

Optional inputs:

- Educational focus such as colors, counting, shapes, matching, spatial relations, memory, or basic logic
- Preferred characters, themes, or interests
- Content boundaries and tone
- Target device emphasis
- Desired puzzle density
- Existing assets that must be used

Example request:

```yaml
story: stories/little-rabbit.md
targetAge: [4, 5]
estimatedMinutes: 25
language: cs-CZ
mode: light-educational
educationalFocus: [colors, counting]
artStyle: comic-soft
devicePriority: tablet
```

## 5. End to End Creation Workflow

```text
Story and creation settings
        |
        v
Game design agent
        |
        v
game-plan.json
        |
        v
Human review and revision
        |
        v
Game generation agent
        |
        +----> Asset catalog search
        |          |
        |          +----> reuse matching assets
        |          |
        |          +----> request missing assets
        |
        v
game.json, assets, and Czech audio
        |
        v
Schema and semantic validation
        |
        v
Automated playthrough and visual checks
        |
        v
Playable offline game
```

The workflow must support stopping after the planning stage. A user can revise scenes, puzzles, characters, tone, length, or educational focus before production begins.

## 6. Proposed Architecture

### 6.1 Major components

| Component | Responsibility | Initial technology |
|---|---|---|
| Runtime engine | Scene lifecycle, rendering, movement, interaction, actions, dialogue, audio, inventory, save | TypeScript |
| Canvas renderer | Backgrounds, sprites, animation, effects, z-order, debug overlays | Canvas 2D |
| DOM interface | Inventory, menus, settings, captions, accessibility controls | React and CSS |
| Content model | Portable definitions for games, plans, scenes, entities, actions, conditions, assets | JSON Schema |
| Asset catalog | Search, resolution, metadata, variants, families, geometry, styles | Files plus generated index |
| Validators | Structural, semantic, accessibility, asset, audio, and reachability checks | TypeScript command-line tools |
| Scene editor | Visual placement, polygons, anchors, hit areas, walkable areas, preview | React plus Canvas |
| Agent workflows | Repeatable design, generation, validation, asset, and test procedures | Portable Markdown skills |
| Build system | Validated content packaging and offline output | Node.js tooling |

### 6.2 Suggested repository structure

```text
adventure-stories-ai
  /src/apps/
    player/
    scene-editor/
  /src/packages/
    engine/
      renderer/
      movement/
      interaction/
      inventory/
      story/
      dialogue/
      audio/
      save/
      debug/
    schemas/
      game.schema.json
      game-plan.schema.json
      asset.schema.json
      style.schema.json
      difficulty-profile.schema.json
    validators/
    asset-catalog/
    test-runner/
    shared/
  /src/assets/
    catalog/
    styles/
  /src/games/
    examples/
  /src/stories/
  skills/
    design-adventure/
    generate-adventure/
    resolve-assets/
    create-game-assets/
    validate-adventure/
    test-adventure/
  tools/
  AGENTS.md
  README.md
```

Use a monorepo so the player, editor, schemas, and command-line tools share types while retaining clear package boundaries.

## 7. Rendering and Responsive Layout

### 7.1 Canvas and DOM split

Canvas 2D renders the game world:

- Backgrounds and foreground layers
- Characters, objects, items, and animations
- Movement, transitions, highlights, particles, and effects
- Depth sorting and debug geometry
- Pointer hit testing in world coordinates

HTML and CSS render interface elements:

- Inventory
- Menus and settings
- Save and resume controls
- Volume and accessibility controls
- Optional captions and dialogue presentation
- Developer tools outside the scene

### 7.2 Logical coordinate system

Every scene uses a stable logical size, initially 1920 by 1080. Content definitions always use logical coordinates. The renderer scales the logical viewport into the available CSS area while accounting for device pixel ratio.

```ts
const scale = Math.min(
  viewportWidth / logicalWidth,
  viewportHeight / logicalHeight,
);
```

Pointer input must pass through a single conversion path:

```text
client coordinates
  -> canvas content rectangle
  -> logical scene coordinates
  -> ordered hit testing
```

The first release uses a 16:9 logical viewport with configurable fit behavior:

- `contain`: show the complete scene with letterboxing
- `cover`: fill the viewport and crop nonessential edges

Safe areas must identify content that may not be cropped. A separate portrait composition is a later capability, not an initial requirement.

### 7.3 Depth

Static layers may define an explicit depth. Moving characters default to `z = footAnchorY`, which makes characters lower in the scene appear in front. A scene may add an offset for bridges, foreground foliage, or special compositions.

## 8. Runtime Domain Model

### 8.1 Game

A game definition contains:

- Metadata, schema version, language, art style, and target profile
- Start scene and start entry point
- Scene registry
- Item and character definitions
- Dialogue and audio references
- State variables and default values
- Save compatibility version
- Asset manifest
- Hint policy

### 8.2 Scene

A scene contains:

- Logical dimensions and responsive fit policy
- Background and optional foreground layers
- Entry points
- Entities
- Walkable areas and obstacles
- Scene-level triggers
- Ambient audio
- Transitions
- Optional camera constraints

### 8.3 Entity

A hot zone is not merely an invisible clickable region. It belongs to a semantic entity that can define:

- Identity and concept
- Visual asset or animation family
- Position, scale, anchor, and depth
- Hit area
- Interaction point where the player should stand
- Conditions controlling visibility or interactivity
- Actions produced by interaction
- Cursor, highlight, and spoken prompt behavior

Example:

```json
{
  "id": "apple-1",
  "kind": "item",
  "concept": "apple",
  "assetRef": "apple-red-001",
  "transform": {
    "x": 620,
    "y": 650,
    "scale": 0.8
  },
  "hitArea": {
    "type": "circle",
    "x": 0,
    "y": -25,
    "radius": 55
  },
  "interactionPoint": {
    "x": 620,
    "y": 735
  },
  "onInteract": [
    { "type": "moveToInteractionPoint" },
    { "type": "playSpeech", "dialogueId": "rabbit-found-apple" },
    { "type": "addItem", "itemId": "apple" },
    { "type": "hideEntity", "entityId": "apple-1" }
  ]
}
```

Hit areas support rectangles, circles, ellipses, polygons, and composites. If absent, the resolver may derive a default from catalog metadata or sprite bounds and expand it using the age profile.

### 8.4 Conditions and actions

Conditions should be declarative and composable:

- State flag or variable comparisons
- Inventory contains or count
- Entity visibility or interaction state
- Completed objective
- All, any, and not composition

Initial actions:

- Play speech or sound
- Start dialogue
- Move character
- Add, remove, or transform inventory item
- Set or increment state
- Show, hide, enable, or disable entity
- Play animation
- Transition scene
- Complete objective
- Start hint timer

Avoid arbitrary JavaScript inside game content. Add engine capabilities as versioned, validated action types.

### 8.5 State and saving

Game state contains:

- Current scene and entry point
- Inventory and item counts
- Flags and numeric or enumerated variables
- Completed objectives
- Entity overrides
- Hint progress
- Game and schema version

The first release stores one save slot per game in IndexedDB or localStorage. Saves occur at safe checkpoints and after meaningful state changes. Migrations are required when a shipped game changes its save model.

## 9. Movement, Navigation, and Interaction

The player taps or clicks a destination or entity. For an entity interaction, the engine moves the character to its interaction point and then runs the action sequence.

Initial navigation:

- Walkable polygons
- Straight-line movement when the segment remains inside a walkable region
- Clamp ordinary destination taps to the nearest valid point
- Authored waypoints for known obstacles and passages

Later navigation can introduce a navigation mesh and A-star pathfinding. Full pathfinding should not block the first playable release.

Interaction rules:

- Touch and mouse use the same logical hit-testing system.
- Overlapping candidates are ordered by interaction priority, depth, and distance.
- Required targets receive generous hit areas based on age profile.
- Tapping an interactive entity gives immediate visible or audible acknowledgment.
- Repeated taps must not duplicate non-idempotent actions.
- Input locks only for the shortest necessary part of a sequence.

## 10. Dialogue, Speech, Audio, and Accessibility

All important instructions and story dialogue must have Czech speech for Czech games. Playback must work offline after build. Text captions may be available to adults and beginning readers but cannot carry essential information alone.

Requirements:

- Stable dialogue identifiers separate text from audio files.
- A voice manifest defines speaker, locale, voice, text, duration, and file.
- Speech can be replayed.
- Speech, music, and effects have independent volume controls.
- Background music ducks during speech.
- Essential sound-only clues have a visual alternative.
- Reduced motion mode suppresses unnecessary screen shake and particles.
- Color tasks include a secondary distinguishing cue when color-vision accessibility is enabled.
- Interactive targets are touch-friendly and scale according to the difficulty profile.

## 11. Age and Difficulty System

Target age is a required creation input. Difficulty is represented as an explicit profile rather than a vague prompt. Profiles are product defaults and must be refined through playtesting and consultation with child-development or early-learning specialists; they are not diagnostic claims about individual children.

| Profile | Typical task structure | Inventory | Memory and reasoning | Hint behavior |
|---|---|---:|---|---|
| 3 to 4 | One action and one concept; recognition, matching, colors, simple shapes, counting usually up to 5 | 0 to 2 active items | No required memory across scenes | Early visual cue, repeated spoken instruction, explicit solution available |
| 4 to 5 | One or two steps; combine object with color or small count; simple cause and effect | Up to 3 | Short local sequences | Visual and spoken hints with generous timing |
| 5 to 6 | Two or three causal steps; sorting, patterns, comparisons, simple inventory use | Up to 4 | Limited cross-scene memory with reminders | Progressive hints from cue to explanation |
| 6 to 8 | Multi-scene adventure puzzles, simple deduction, sequences, basic number tasks | Up to 6 | Earlier clues and moderate planning | Less immediate hints, but no permanent dead ends |

The generator may override individual values for a child or context, but the override must be explicit.

Example profile:

```json
{
  "id": "preschool-3-4",
  "ageRange": [3, 4],
  "maxPuzzleSteps": 1,
  "maxActiveInventoryItems": 2,
  "maxRelevantObjectsPerScene": 6,
  "concepts": {
    "colors": true,
    "shapes": true,
    "countingMax": 5,
    "matching": true,
    "sorting": true,
    "patterns": false,
    "spatialRelations": "basic",
    "causalReasoning": "direct",
    "memoryAcrossScenes": false
  },
  "hints": {
    "visualAfterSeconds": 15,
    "spokenAfterSeconds": 30,
    "explicitSolutionAfterSeconds": 55
  },
  "minimumTargetSize": 96
}
```

### 11.1 Natural educational mechanics

Examples for the youngest players:

- Object recognition: find the apple named by a character.
- Color recognition: choose the red flower.
- Counting: collect three carrots, with the allowed maximum driven by profile.
- Shape recognition: fit a shape into its matching opening.
- Matching: find the second identical sock.
- Sorting: place fruit and toys into separate containers.
- Size comparison: choose the largest bear.
- Spatial language: find the key under the table.
- Simple sequence: order three visible story events.
- Sound recognition: hear an animal and select it, with a visual replay option.

Tasks should serve the story. A rabbit needing three carrots is preferred to an unrelated counting worksheet.

### 11.2 Difficulty adaptation example

The same story event can become:

- Age 3: choose the red apple from three large objects.
- Age 5: find and collect three apples in one scene.
- Age 7: infer that apples are needed, find a basket, visit the orchard, and solve a simple reachability problem.

## 12. Asset Catalog

### 12.1 Purpose

The asset catalog prevents repeated generation and makes art style consistency measurable. It is multimodal and stores graphics, animations, sounds, music, and metadata.

Asset classes include:

- Generic object
- Vegetation
- Animal
- Environment element
- Effect
- User interface
- Generic character
- Story-specific character
- Location
- Story object
- Sound
- Music

Generic assets normally enter the reusable catalog. Named characters and unique locations normally remain game-specific. The generator must make this decision explicitly.

### 12.2 Asset metadata

```json
{
  "id": "oak-tree-003-summer",
  "familyId": "oak-tree-003",
  "type": "graphic",
  "class": "vegetation",
  "concept": "oak-tree",
  "tags": ["tree", "oak", "forest", "deciduous", "summer"],
  "style": "comic-soft",
  "file": "graphics/vegetation/oak-tree-003-summer.webp",
  "dimensions": { "width": 740, "height": 1024 },
  "transparent": true,
  "anchor": { "x": 0.5, "y": 0.96 },
  "defaultHitArea": {
    "type": "ellipse",
    "cx": 0.5,
    "cy": 0.5,
    "rx": 0.47,
    "ry": 0.48
  },
  "suggestedInteractionRadius": 1.5,
  "license": {
    "source": "generated",
    "usage": "project"
  }
}
```

Geometry in catalog metadata is normalized to the asset. Scene placement converts it into logical coordinates.

### 12.3 Asset families and variants

Families group semantically related variants:

- Oak tree: summer, autumn, winter, snow, and night
- Fox: idle, walking, sitting, happy, sad, and talking
- Door: closed, opening, and open

A family must describe compatible anchors, scales, animation timing, and naming.

### 12.4 Search and resolution

The resolver follows a strict policy:

1. Search the catalog.
2. Require an exact art-style match unless an approved conversion exists.
3. Rank concept, required tags, variant, technical suitability, and license.
4. Reuse a strong match.
5. Otherwise create an asset request.
6. Validate and process generated output.
7. Add generic output to the reusable catalog or keep unique output with the game.

Initial search is deterministic metadata scoring. Embeddings may be added when catalog scale justifies them.

Example command:

```bash
npm run assets:search -- --concept apple --style comic-soft --tags red,food
```

### 12.5 Art styles

The platform initially supports a small curated set, for example:

- comic-soft
- watercolor
- colored-pencil
- storybook
- paper-cut

Each style has a versioned specification, generation instructions, technical constraints, palette guidance, line and shading rules, character proportions, and canonical reference assets.

```text
assets/styles/comic-soft/
  style.json
  generation.md
  references/
```

A game's `artStyle` is top-level and applies to every selected or generated visual asset. The build fails on incompatible style use unless an explicit exception is approved.

## 13. Asset Generation Abstraction

Image, speech, and sound capabilities vary by tool and vendor. Game content therefore requests assets through a portable manifest rather than invoking a provider directly.

```ts
interface AssetGenerator {
  generateImage(request: ImageRequest): Promise<GeneratedAsset>;
  generateSpeech(request: SpeechRequest): Promise<GeneratedAsset>;
  generateSound(request: SoundRequest): Promise<GeneratedAsset>;
}
```

Example manifest request:

```json
{
  "id": "fox-happy",
  "type": "image",
  "concept": "friendly-fox",
  "style": "comic-soft",
  "purpose": "character-state",
  "prompt": "Friendly young fox, happy expression, full body, transparent background",
  "dimensions": { "width": 1024, "height": 1024 },
  "transparent": true,
  "reusable": true
}
```

Provider adapters may translate the manifest. Generated assets pass technical checks for dimensions, alpha, crop, anchor, style, naming, and required animation frames before use.

## 14. Scene Editor and Debug Mode

The developer-only scene editor is essential for correcting generated content.

Editor capabilities:

- Load a game and scene definition.
- Show the logical canvas with responsive preview sizes.
- Select, position, scale, and depth-order entities.
- Draw and edit walkable polygons, obstacles, hit areas, and safe areas.
- Drag character entry and interaction points.
- Preview movement, interaction, dialogue, and transitions.
- Inspect state conditions and action sequences.
- Validate the current scene and show errors at their source.
- Save deterministic JSON with stable ordering.

Runtime debug mode should visualize:

- Walkable areas and obstacles
- Hit areas by interaction type
- Anchors and interaction points
- Entity identifiers and z values
- Current pointer world coordinates
- Navigation path
- State flags, inventory, and active objective

## 15. Validation and Testing

### 15.1 Validation layers

1. Schema validation checks structure, types, identifiers, and allowed action forms.
2. Reference validation checks scenes, entities, assets, dialogue, and transitions.
3. Asset validation checks files, dimensions, transparency, style, anchors, audio, and licenses.
4. Semantic validation checks reachability, item lifecycle, state transitions, and objectives.
5. Child-experience validation checks target size, scene density, puzzle steps, hints, and reading dependence against the selected profile.
6. Accessibility validation checks speech coverage, sound alternatives, reduced motion, captions, and color-only tasks.
7. Build validation checks offline packaging and missing runtime resources.

Example findings:

```text
ERROR scene:grandmas-house
Requires inventory.basket, but no reachable state contains basket.

WARNING scene:river entity:stone-3
Hit area is 19 x 24 logical pixels; profile minimum is 96.

ERROR dialogue:squirrel-intro
Czech speech file is missing.
```

### 15.2 Automated playthrough

The test runner models game state as a graph and explores valid interactions. It should:

- Confirm at least one route from start to ending.
- Detect required states or items that cannot be reached.
- Detect required items that can be removed too early.
- Detect transitions with no return when return is required.
- Detect action sequences that are not safely repeatable.
- Record an interaction trace for every ending.
- Enforce a configurable state exploration limit.

Not every spatial or visual puzzle can be proved automatically. Each game also requires authored test scenarios and visual review in the player.

### 15.3 Runtime and device testing

Minimum test matrix:

- Mouse and touch input
- Current Chrome, Edge, Firefox, and Safari
- Desktop 16:9
- Tablet landscape
- Phone portrait using contain or cover behavior
- Low device pixel ratio and high device pixel ratio
- Offline reload
- Save, close, resume, and save migration
- Reduced motion and caption settings

## 16. Agent Skills and Repository Guidance

The repository must teach any capable coding agent how to work with it. Skills are Markdown procedures backed by schemas and commands; they are not the source of truth for the content format.

### 16.1 Skill design rules

- Keep each skill focused on one workflow and give it clear triggers.
- State required inputs and stop when a material input is missing.
- Separate planning from production.
- Require catalog search before generation.
- Run deterministic commands rather than visually guessing validity.
- Define artifacts produced and acceptance criteria.
- Avoid vendor-specific tool names in the portable core.
- Put provider-specific adapters in optional integration sections.
- Include a repair loop: generate, validate, fix, and validate again.
- Require human review at costly or subjective gates.

### 16.2 Required initial skills

| Skill | Trigger and responsibility | Main outputs |
|---|---|---|
| `design-adventure` | Adapt a supplied story using age, length, language, mode, and style; ask for missing required inputs | `game-plan.json`, plan summary, open decisions |
| `generate-adventure` | Convert an approved plan into game content; orchestrate asset resolution, dialogue, and scene definitions | `game.json`, game assets, audio manifest |
| `resolve-assets` | Query and rank the catalog for every manifest need before generation | Resolution report and missing-asset manifest |
| `create-game-assets` | Generate only unresolved images, animations, speech, or sound; process and classify them | Validated assets and catalog additions |
| `validate-adventure` | Run all structural, semantic, accessibility, and age-profile checks; repair content defects | Validation report and corrected definitions |
| `test-adventure` | Explore story paths, execute authored scenarios, run player checks, and report failures | Test traces and test report |

### 16.3 Later skills

- `edit-scene`: make targeted geometry or interaction changes without redesigning the game.
- `add-art-style`: define, reference, validate, and register a new style.
- `catalog-asset`: import an existing asset with metadata, geometry, and license.
- `localize-adventure`: add a language while preserving dialogue identifiers and timing.
- `migrate-game-schema`: upgrade game content and save compatibility.
- `review-child-experience`: structured expert or playtest review against the target profile.

### 16.4 Example skill outline

```markdown
# Design Adventure

## Trigger
Use when a user asks to turn a story into a game or revise a game plan.

## Required inputs
- Story
- Target age
- Length
- Language
- Entertainment or educational mode
- Art style

## Workflow
1. Validate the inputs.
2. Identify core characters, locations, events, and emotional tone.
3. Select the difficulty profile.
4. Adapt events into child-appropriate goals and interactions.
5. Integrate educational focus naturally.
6. Check puzzle steps and scene density against the profile.
7. Produce game-plan.json.
8. Validate it.
9. Present the plan for approval.

## Stop condition
Do not generate production assets or game.json before plan approval.
```

### 16.5 Repository instruction files

`AGENTS.md` is the neutral entry point. It should explain:

- Project purpose and architecture
- Where schemas and examples live
- Which skill to read for each task
- Commands for format, test, validate, build, and preview
- Rules protecting schema compatibility and catalog integrity
- Requirement to preserve user edits and avoid regenerating existing assets

`CLAUDE.md` and other vendor-specific files should remain thin pointers to `AGENTS.md` and the portable skills. Do not duplicate policies across files.

## 17. Schemas and Versioning

Use JSON Schema as the machine-readable contract. Generate TypeScript types from schemas or validate that handwritten types remain equivalent; do not maintain two independent definitions manually.

Every major artifact includes:

- `schemaVersion`
- Stable IDs
- Optional `generator` metadata
- Creation and update metadata where useful

Versioning policy:

- Patch: clarifications and compatible validator changes
- Minor: backward-compatible optional fields or action types
- Major: incompatible structure or semantic changes

Games declare the engine compatibility range. Migration tools upgrade older definitions. Saved game state has a separate version because content and runtime saves evolve differently.

## 18. Security and Content Safety

- Game definitions cannot execute arbitrary code.
- Asset paths are confined to the built game package.
- User-supplied story text is treated as data.
- Generated dialogue and imagery receive age-appropriate content review.
- External assets require source and usage metadata.
- No analytics, camera, microphone, location, account, or network access is required for play.
- Local save data contains no sensitive personal information.

## 19. Performance Requirements

Initial performance targets:

- First scene becomes interactive within 3 seconds on a representative mid-range tablet after local assets are available.
- Input acknowledgment begins within 100 milliseconds.
- Animation targets 60 frames per second and remains usable at 30.
- Decode large backgrounds before transition when possible.
- Use WebP or AVIF for appropriate still images and compressed audio suitable for speech.
- Load the current scene and likely next scene rather than the whole game.
- Maintain an asset memory budget and release scene-specific resources.

Exact budgets should be measured during the engine prototype and then promoted to build checks.

## 20. First Example Game

Use a small rabbit adventure as the reference implementation:

1. Home: Mother gives the rabbit a basket and asks for berries.
2. Forest path: Help a squirrel find an acorn and receive a rope.
3. Berry clearing: Collect the requested number or color of berries according to age profile.
4. Stream: Use the rope to solve a simple crossing problem.
5. Grandma's cottage: Give the basket to Grandma and play the ending.

This example exercises dialogue, Czech speech, inventory, collection, conditions, scene transitions, asset reuse, one multi-step puzzle, hints, saving, and completion.

The same story should have at least two difficulty variants to prove that gameplay is derived from the profile rather than hard-coded for one age.

## 21. Implementation Roadmap

### Phase 0 Foundation

- Choose monorepo tooling and coding standards.
- Write initial schemas for game plan, game, scene, entity, action, condition, asset, style, and difficulty profile.
- Create representative valid and invalid fixtures.
- Implement schema validation commands.
- Draft `AGENTS.md` and the first six skills.

Exit criterion: an agent can create and validate a plan and a small hand-written game definition without rendering.

### Phase 1 Playable vertical slice

- Implement Canvas viewport, scaling, pointer conversion, and render loop.
- Render background and sprite entities with anchors and depth.
- Add scene loading, simple movement, hit testing, action sequencing, inventory, dialogue audio, transitions, and one save slot.
- Build the rabbit example with placeholder assets.
- Add debug geometry.

Exit criterion: the rabbit game is playable from start to finish on desktop and tablet.

### Phase 2 Catalog and generation workflow

- Implement asset schema, index, deterministic search, resolver, and manifests.
- Define two art styles with reference assets.
- Integrate one image and one speech adapter behind portable interfaces.
- Enforce search-before-generation and catalog admission rules.

Exit criterion: a second game reuses catalog assets and generates only missing ones.

### Phase 3 Reliability

- Add semantic graph validation and automated playthrough.
- Add age-profile and accessibility checks.
- Add offline build validation, browser tests, save migration, and performance budgets.

Exit criterion: deliberate unreachable-state, missing-audio, tiny-target, and lost-item defects are caught automatically.

### Phase 4 Editor

- Create visual scene editing for transforms, polygons, anchors, interaction points, and previews.
- Connect validator findings to selected scene objects.

Exit criterion: a generated scene can be corrected and saved without manual coordinate editing.

### Phase 5 Expansion

- Additional styles, localization, improved navigation, animation families, portrait layouts, richer catalog search, and structured playtest feedback.

## 22. Initial Engineering Decisions

These decisions are accepted for the baseline:

- Canvas 2D renders the world; DOM renders interface and accessibility controls.
- The logical scene size starts at 1920 by 1080.
- TypeScript is the primary implementation language.
- React is appropriate for player chrome and editor, not per-frame world rendering.
- Content is declarative JSON validated by JSON Schema.
- Plans and production games are separate artifacts.
- Age and educational mode are mandatory generation inputs.
- Czech speech is required for important content in Czech games.
- Asset style is a top-level game property.
- Assets are searched before generated.
- Generic generated assets may enter the global catalog; story-specific assets remain local by default.
- One local save slot per game is sufficient initially.
- Straight-line movement with authored walkable areas and waypoints precedes full pathfinding.
- A scene editor and debug overlays are required, but the editor follows the vertical slice.
- Agent skills remain portable Markdown workflows backed by repository commands.

## 23. Open Decisions

Resolve these during Phase 0 or the vertical slice:

- Monorepo tool: npm workspaces, pnpm, or another choice.
- Player framework and bundler.
- Exact contain versus cover default by device category.
- IndexedDB versus localStorage for the first save implementation.
- Audio file format and voice generation provider adapters.
- Animation representation: sprite sheets, frame atlases, skeletal animation, or a constrained mix.
- Exact art-style names and initial reference sets.
- Catalog storage format and index generation.
- Threshold for accepting a catalog match.
- How plan approval is recorded for automated workflows.
- Whether difficulty variants live in one game definition or separate built games.
- Playtest process and expert review criteria for age profiles.

## 24. Definition of Done for a Generated Game

A generated game is complete only when:

- The game plan has been approved.
- All JSON passes schema validation.
- All identifiers and referenced resources resolve.
- At least one complete path reaches every intended ending.
- No required item can be permanently lost before use.
- Puzzle complexity, scene density, targets, and hints satisfy the selected profile or have documented exceptions.
- Important instructions have speech in the selected language.
- The visual style is consistent.
- Existing suitable assets were reused.
- New generic assets were evaluated for catalog admission.
- Mouse and touch playthroughs pass.
- Save and resume work.
- The offline build contains every required resource.
- The game has been visually reviewed at representative desktop, tablet, and phone sizes.

## 25. Recommended First Coding Task

Start with schemas and fixtures before building the renderer. Implement:

1. `game-plan.schema.json`
2. `game.schema.json` with one scene, entity, conditions, and core actions
3. `difficulty-profile.schema.json`
4. `asset.schema.json` and `style.schema.json`
5. One valid rabbit plan and one minimal valid playable definition
6. Invalid fixtures for missing references, unreachable requirements, tiny hit areas, and missing speech
7. `npm run validate` with readable diagnostics

This creates the contract that the engine, editor, catalog, and agent skills can share and reduces costly rewrites later.
