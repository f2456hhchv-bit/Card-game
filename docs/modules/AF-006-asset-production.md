# AF-006 — DESIGN SYSTEM & ASSET PRODUCTION FRAMEWORK

**Module status:** Complete (specification produced; validation tooling builds with the first code module)
**Lock status:** LOCKED — extends AF-000 → AF-005 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/ASSET_PRODUCTION.md` (the binding asset production framework of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-005 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Design System and Asset Production Framework.

This document defines how every asset within Afterlight is created, named, organised, imported, versioned and maintained.

Every artist, designer and developer should be able to create content that immediately feels like it belongs in Afterlight.

The production pipeline must remain scalable for years of development.

==================================================
CORE PHILOSOPHY
==================================================

Consistency.

Modularity.

Reusability.

Scalability.

Readability.

Automation.

Every asset should exist only once.

Everything else references it.

==================================================
ASSET CATEGORIES
==================================================

Concept Art

Gameplay Sprites

Ships

Enemies

Bosses

Weapons

Projectiles

Particles

Visual Effects

Animations

Icons

UI

HUD

Fonts

Audio

Music

Shaders

Materials

Prefabs

Scenes

Documentation

Tools

==================================================
NAMING CONVENTIONS
==================================================

Every asset uses a consistent naming system.

Examples

SHIP_SCOUT_MK1

ENEMY_VOID_SWARMER

BOSS_CRYSTAL_GUARDIAN

WPN_PLASMA_CANNON

ICON_CRITICAL_DAMAGE

UI_BUTTON_PRIMARY

VFX_EXPLOSION_SMALL

SFX_SHIELD_BREAK

No spaces.

No abbreviations unless documented.

No duplicate names.

==================================================
VERSION CONTROL
==================================================

Support:

Git

Git LFS

Branch workflow

Feature branches

Release branches

Hotfix branches

Every production asset must be traceable.

==================================================
FOLDER STRUCTURE
==================================================

Assets/

Art/

Ships/

Enemies/

Bosses/

Weapons/

Projectiles/

UI/

Icons/

Particles/

Shaders/

Audio/

Music/

Fonts/

Localization/

Scenes/

Prefabs/

Documentation/

Tools/

Generated/

Never mix unrelated assets.

==================================================
IMPORT RULES
==================================================

Every imported asset must define:

Resolution

Compression

Pivot

Collision

Sorting Layer

Naming

Metadata

Version

Author

Review Status

==================================================
ART STANDARDS
==================================================

Gameplay assets prioritise:

Readability

Strong silhouettes

Consistent lighting

Consistent scale

Simple geometry

Premium finish

Avoid unnecessary detail.

==================================================
UI ASSETS
==================================================

Every UI asset supports:

Light theme variants (future)

Dark theme

High contrast

Multiple resolutions

Vector where appropriate

Pixel-perfect rendering

==================================================
ANIMATION STANDARDS
==================================================

Animation naming:

Idle

Move

Attack

Charge

Cast

Boost

Hit

Death

Ultimate

Loop

Every animation has documented timing.

==================================================
FILE OPTIMISATION
==================================================

Compress appropriately.

Avoid oversized textures.

Use atlases.

Reuse materials.

Reuse shaders.

Minimise memory usage.

==================================================
QUALITY CONTROL
==================================================

Every asset must pass:

Naming validation

Resolution validation

Visual validation

Performance validation

Readability validation

Brand validation

Assets failing review return for revision.

==================================================
AUTOMATION
==================================================

Support automated validation for:

Missing references

Incorrect names

Wrong resolutions

Duplicate assets

Unused assets

Broken links

Oversized files

==================================================
DOCUMENTATION
==================================================

Every asset includes:

Purpose

Usage

Dependencies

Version

Creator

Review History

Future Notes

==================================================
PERFORMANCE
==================================================

Target:

Fast loading.

Minimal memory usage.

Efficient atlases.

Shared materials.

GPU-friendly rendering.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Asset Count

Texture Memory

Atlas Usage

Missing References

Duplicate Assets

Import Errors

Performance

==================================================
OUTPUT
==================================================

Produce the complete Design System and Asset Production Framework.

Every future asset extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every folder.

Review every asset.

Review every naming convention.

Review every import setting.

Review texture sizes.

Review atlas usage.

Review animation standards.

Review documentation.

Review automation.

Review scalability.

Review performance.

Remove duplicate assets.

Simplify production workflows.

Ensure every new asset can be created, imported and maintained without ambiguity.

Repeat until the asset pipeline is capable of supporting hundreds of thousands of assets while remaining organised and maintainable.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-005 alignment review (recorded at catalogue time)

- Every-asset-exists-once restates the Constitution's no-duplication law at the asset level; consistent with AF-005's no-bespoke-components rule. No contradictions.
- Folder structure is reconciled with AF-001 §4 (which is locked): AF-006's `Assets/` tree maps onto AF-001's `assets/` (source art/audio/fonts) with AF-006's subcategory detail adopted inside it; engine-generic entries (Prefabs, Scenes, Materials) follow AF-001 §2's terminology mapping (archetypes in data, managed game states, shader modules). Extension, not redesign — recorded in output §3.
- Unity-style "import settings" become **asset manifests** (sidecar metadata validated by tooling) — same guarantees (resolution, pivot, sorting layer, author, review status), stack-native mechanism.
- Art/UI/animation standards restate AF-002 (silhouettes, lighting, 24px icon grid) and AF-004 (readability, identity law); dark theme is the product's native theme, high-contrast variants per AF-002 §11; "light theme variants (future)" catalogued as future-flag only.
- Automation maps to `tools/` Node scripts + CI gate per AF-001 §2/§4; debug asset panel extends the AF-001 debug overlay.
- Naming examples surface new canon candidates (SHIP_SCOUT_MK1, ENEMY_VOID_SWARMER, BOSS_CRYSTAL_GUARDIAN, WPN_PLASMA_CANNON) — catalogued as illustrative examples, not committed content; content modules will define the real rosters.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved. Produced output: `docs/ASSET_PRODUCTION.md`.
