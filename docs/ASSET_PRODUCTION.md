# AFTERLIGHT — Design System & Asset Production Framework

**Authority:** Produced output of AF-006. Extends AF-000 → AF-005 and the Master Constitution. Every asset ever created for Afterlight is produced, named, organised, validated, and maintained under this framework; it is extended, never replaced.
**Binding rule of the whole document:** every asset exists exactly once, everything else references it — and no asset enters the game without passing validation.

---

## 1. Pipeline shape (stack-native)

Afterlight is a TypeScript/WebGL project (AF-001), so the pipeline is **source → build → runtime**:

1. **Source assets** live in `assets/` (authoring formats: SVG/PNG art, WAV audio, TTF/WOFF2 fonts), each with a sidecar **manifest** (§5).
2. **Build tooling** (`tools/`) validates manifests, packs textures into atlases, compresses audio, and emits runtime bundles into `src/generated/` + `dist/` — never hand-edited.
3. **Runtime** loads only generated, optimised bundles through the AF-001 asset loader (async, placeholder-on-missing).

Engine-generic categories follow AF-001 §2's mapping: *Prefabs* = entity archetypes in `src/data/`; *Scenes* = managed game states; *Materials/Shaders* = shader modules in `src/engine/render/shaders/`.

## 2. Naming convention (binding)

`CATEGORY_IDENTITY_VARIANT` — SCREAMING_SNAKE_CASE, no spaces, globally unique (the validator enforces uniqueness across the whole project, not per folder).

| Prefix | Category | Example |
|---|---|---|
| `SHIP_` | Player ships | `SHIP_SCOUT_MK1` |
| `ENEMY_` | Enemies | `ENEMY_VOID_SWARMER` |
| `BOSS_` | Bosses | `BOSS_CRYSTAL_GUARDIAN` |
| `WPN_` | Weapons | `WPN_PLASMA_CANNON` |
| `PROJ_` | Projectiles | `PROJ_PLASMA_BOLT` |
| `ICON_` | Icons | `ICON_CRITICAL_DAMAGE` |
| `UI_` | UI assets | `UI_BUTTON_PRIMARY` |
| `HUD_` | HUD assets | `HUD_SHIELD_ARC` |
| `VFX_` | Visual effects | `VFX_EXPLOSION_SMALL` |
| `SFX_` | Sound effects | `SFX_SHIELD_BREAK` |
| `MUS_` | Music | `MUS_EXPEDITION_VOID` |
| `FONT_` / `ANIM_` / `SHDR_` / `CONCEPT_` | Fonts / animations / shaders / concept art | |

Approved abbreviations are documented here and nowhere else (`WPN`, `PROJ`, `VFX`, `SFX`, `MUS`, `SHDR`, `HUD`, `UI`, `MK`); any new abbreviation requires adding it to this table. Asset names are permanent once shipped (data tables and saves reference them — AF-001 §6 ID law applies).

## 3. Folder structure

Adopts AF-006's category tree inside AF-001 §4's locked layout (extension, not redesign):

```
assets/
├── art/          ships/ enemies/ bosses/ weapons/ projectiles/
│                 particles/ vfx/ ui/ icons/ hud/ concept/
├── audio/        sfx/ music/
├── fonts/
└── manifests/    (only if a sidecar can't live beside its asset)

src/data/         entity archetypes, balance tables, localization/   (AF-001)
src/engine/render/shaders/                                           (AF-001)
src/generated/    atlases, packed bundles, generated indices — never hand-edited
tools/            validation, atlas packing, audio pipeline, reports
docs/             this framework, design boards, asset sheets
```

One asset, one home: the validator rejects art in audio folders, gameplay sprites in UI folders, and anything in `src/generated/` that wasn't generated.

## 4. Version control

- Git for everything; **Git LFS** for binary assets (PNG, WAV, WOFF2, PSD/AFDESIGN sources) — configured via `.gitattributes` when the first binary lands.
- Branch workflow: feature branches per module → main; release branches at release milestones; hotfix branches from releases. (Current phase: the designated module branch serves as the feature branch.)
- Traceability: every asset's manifest carries version + author + review history (§5), and git history carries the rest. No untracked production assets, ever.

## 5. Asset manifests (stack-native "import settings")

Every source asset ships with a sidecar `NAME.meta.json`, schema-validated by tooling (AF-001 Data Registry pattern). Required fields:

```json
{
  "name": "ENEMY_VOID_SWARMER",
  "category": "enemy",
  "purpose": "Void faction basic swarm enemy",
  "usage": ["expedition combat"],
  "dependencies": ["VFX_VOID_TRAIL"],
  "resolution": { "w": 128, "h": 128 },
  "pivot": { "x": 0.5, "y": 0.5 },
  "sortingLayer": "enemies",
  "collision": { "type": "circle", "r": 0.4 },
  "compression": "atlas-rgba",
  "version": 1,
  "author": "…",
  "reviewStatus": "draft | reviewed | approved",
  "reviewHistory": [],
  "notes": ""
}
```

Category-specific schemas add fields (audio: loudness target, loop points; fonts: subsets, license; animations: frame timing per §8). **Only `approved` assets are packed into release builds**; dev builds warn on anything less.

## 6. Art standards

Binding, inherited: readability first (AF-004), strong silhouettes surviving the black-silhouette test (AF-002 §5), single top-left light direction (AF-002 §8), consistent world scale (one unit = one ship-length; per-category size bands documented in each content module's asset sheet), simple geometry with premium finish (clean edges, controlled glow — glow is earned, AF-002 §4), no unnecessary detail — detail that doesn't survive gameplay scale is deleted, not shipped.

## 7. UI assets

Dark theme is the native theme (the game *is* dark space); high-contrast variants generated via the AF-002 §11 token swaps; light theme variants remain a future flag (manifest field `themes: ["dark"]` today). UI art is **SVG-first** (vector where appropriate), rasterised at build for each supported scale so pixel-perfect rendering holds at every UI-scale setting and resolution; 9-slice borders for panels.

## 8. Animation standards

Canonical state names (data keys, matched to archetype states): `idle` · `move` · `attack` · `charge` · `cast` · `boost` · `hit` · `death` · `ultimate`, plus the `loop` flag. Every animation's manifest documents frame count, frame timing (ms), loop points, and gameplay-readable moments (e.g. which frame is the `attack` commit — this frame must line up with the AF-004 telegraph anatomy). Combat-critical animations obey readability timing: windups visible, hits immediate.

## 9. File optimisation

- **Atlases mandatory** for gameplay sprites (packed per draw-layer/scene by tooling; AF-001 batching depends on them); max texture size 2048×2048 (mobile-safe); oversized sources are downscaled at build, never at runtime.
- Audio: WAV sources → Opus/AAC at build; music streamed, SFX pre-decoded into pooled buffers.
- Fonts subset to used glyph ranges per language; WOFF2.
- Shaders and materials are shared modules (AF-001) — the validator flags near-duplicate shaders.
- Budgets (enforced at QA, visible in debug): texture memory ≤ 256MB desktop / ≤ 128MB mobile; initial load small enough for fast first-play (PWA promise).

## 10. Quality control & automation

**Every asset passes six validations before merge:** naming · resolution/size · visual (silhouette + scale band + lighting direction) · performance (budget impact) · readability (AF-004 §10 five questions) · brand (AF-002 §13 checklist, including "could it exist in another game?"). Failures return for revision — tracked in the manifest's review history.

**Automated (`tools/validate-assets`, run locally + as CI gate):** missing references (manifest dependencies that don't exist) · incorrect names (§2 grammar + uniqueness) · wrong resolutions (schema + scale-band mismatch) · duplicate assets (name collisions **and** content-hash duplicates) · unused assets (nothing references them — warn, then prune) · broken links (data tables referencing missing assets) · oversized files. The build fails on errors; warnings surface in the report. Human review covers only what machines can't judge (visual, readability, brand).

## 11. Performance

Inherited targets bind: fast async loading (AF-001 §10 — expeditions never hitch), minimal memory, efficient atlases, shared materials, GPU-friendly rendering (batched draws, no per-sprite state changes). 60 FPS floor desktop and mobile, 120 preferred desktop. Asset-side budgets in §9 exist so the runtime targets are winnable by construction.

## 12. Debug support (dev builds)

Asset panel in the debug overlay (extends AF-001/AF-003/AF-005 panels): loaded asset count by category · texture memory live total vs budget · atlas usage maps (wasted space visible) · missing-reference log (placeholder assets currently on screen) · duplicate-asset report · import/validation errors · per-category load timing.

## 13. Standing review obligations (bind every future content module)

Per AF-006's self-review loop — at every content module's QA stage and every playable milestone: audit folders, names, manifests, texture sizes, atlas efficiency, animation timing docs, and automation coverage; delete duplicates and unused assets; simplify any workflow step that produced ambiguity; verify a new contributor could create, import, and maintain an asset without asking a question. The pipeline must stay organised at hundreds of thousands of assets — validated by the automation staying green as content scales.

---

## Internal review loop (AF-006, recorded)

- **Folders** — AF-006 categories adopted inside locked AF-001 layout; one-asset-one-home enforced by validator. ✔
- **Naming** — one grammar, documented abbreviations only, global uniqueness, permanent shipped names. ✔
- **Import settings** — translated to schema-validated manifests carrying every required field incl. author and review status; approval gates release builds. ✔
- **Art/UI/animation standards** — inherit AF-002/AF-004 laws; scale bands, SVG-first UI, telegraph-aligned animation timing. ✔
- **Automation** — all seven required checks specified as real tooling with a CI gate; human review reserved for judgement calls. ✔
- **Scalability** — content-hash dedup, atlas tooling, per-category budgets, and generated indices keep the pipeline flat as asset count grows. ✔
- **Performance** — build-time optimisation (never runtime), budgets that make the FPS floors winnable. ✔
- **Simplification pass** — rejected per-asset README files (manifest fields carry documentation; one file per asset, not two); collapsed "Materials" as a separate category into shared shader modules (AF-001 mapping); deferred light-theme variants to a flag rather than doubling every UI asset now. ✔

**Internal quality score: 9.5/10 — approved; validation tooling is a required deliverable of the first code module.**
