# AF-007 — ICONOGRAPHY & SYMBOL LANGUAGE FRAMEWORK

**Module status:** Complete (specification produced; live icon review binds every future content module)
**Lock status:** LOCKED — extends AF-000 → AF-006 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/ICONOGRAPHY.md` (the binding iconography and symbol language of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-006 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Iconography and Symbol Language Framework.

Icons are one of the most viewed assets in Afterlight.

Players should identify information instantly without reading text.

Every icon should communicate purpose in under one second.

The icon system must remain scalable to thousands of assets.

==================================================
CORE PHILOSOPHY
==================================================

Simple.

Readable.

Recognisable.

Consistent.

Scalable.

Universal.

Every icon should communicate gameplay first.

Decoration is secondary.

==================================================
ICON CATEGORIES
==================================================

Weapons

Equipment

Relics

Ships

Commanders

Enemies

Bosses

Abilities

Ultimate Abilities

Status Effects

Research

Crafting

Loot

Currencies

Resources

Mission Types

Biomes

Galaxy Events

Achievements

Collections

Settings

Developer Tools

Future Expansions

==================================================
ICON DESIGN RULES
==================================================

Every icon must have:

Strong silhouette

Single focal point

Consistent perspective

Consistent lighting

Consistent border

Consistent spacing

Consistent line weight

Minimal unnecessary detail

No text embedded in icons.

==================================================
ICON SIZES
==================================================

Support:

16px

24px

32px

48px

64px

96px

128px

Icons remain readable at every size.

==================================================
RARITY LANGUAGE
==================================================

Every rarity has a unique identity.

Damaged

Grey

----------------

Common

White

----------------

Improved

Green

----------------

Rare

Blue

----------------

Epic

Purple

----------------

Legendary

Gold

----------------

Ancient

Crimson Gold

----------------

Mythic

White Gold

Animated

----------------

Singularity

Animated Violet

Dynamic Energy

Every rarity includes:

Border

Glow

Background

Pickup Beam

Inspection Card

Inventory Border

Collection Frame

==================================================
SYMBOL LANGUAGE
==================================================

Damage

Sword

Shield

Shield

Health

Heart

Energy

Lightning

Movement

Thruster

Critical

Starburst

XP

Constellation

Research

Atom

Crafting

Forge

Blueprint

Blueprint Scroll

Galaxy

Spiral Galaxy

Mission

Beacon

Commander

Helmet

Ship

Starship

Boss

Crown

Elite

Diamond

Status effects receive unique symbols.

==================================================
STATUS EFFECT ICONS
==================================================

Burn

Freeze

Shock

Poison

Corruption

Shielded

Regeneration

Overload

Slow

Stasis

Bleed (future)

Every status icon remains identifiable without text.

==================================================
ABILITY ICONS
==================================================

Every Commander Ability

Every Ship Ability

Every Ultimate

Every Weapon Evolution

Every Relic Effect

Requires:

Unique silhouette

Consistent framing

Readable colours

No duplicated visual concepts

==================================================
ANIMATION
==================================================

Animated icons reserved for:

Legendary

Ancient

Mythic

Singularity

Ultimate Ready

Research Complete

Major Achievements

Animation should enhance recognition.

Never distract.

==================================================
ACCESSIBILITY
==================================================

Support:

High Contrast

Colour Blind Modes

Alternative icon shapes

Scalable sizes

Outline Mode

Icons should never rely solely on colour.

==================================================
DOCUMENTATION
==================================================

Every icon documents:

Purpose

Category

Usage

Size

Animation

Colour Variant

Associated System

Version

==================================================
PERFORMANCE
==================================================

Use texture atlases.

Reuse shared materials.

Minimise draw calls.

Vector assets where appropriate.

Support:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Loaded Icons

Missing Icons

Atlas Usage

Animation Count

Memory Usage

Performance

==================================================
OUTPUT
==================================================

Produce the complete Iconography and Symbol Language Framework.

Every future icon extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every icon category.

Review every rarity.

Review every symbol.

Review every animation.

Review every inventory icon.

Review every HUD icon.

Review readability at every supported size.

Review colour-blind compatibility.

Review consistency.

Review scalability.

Review performance.

Remove duplicated concepts.

Strengthen silhouettes.

Ensure every icon communicates its purpose within one second without relying on text.

Repeat until the entire icon system feels unified, instantly recognisable and uniquely identifiable as Afterlight.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-006 alignment review (recorded at catalogue time)

- Icon design rules extend AF-002 §8 (24px grid, 16px-first, single light direction, no excessive detail) and AF-005 §1 tokens; size ladder adds **128px** to AF-005's 16–96px set — superset, permitted. "No text embedded in icons" also serves localisation (AF-001 data architecture).
- **Rarity system — AUTHORISED SUPERSESSION:** AF-007 defines a nine-tier rarity ladder (Damaged → Singularity) replacing the provisional five-tier ramp in locked AF-002 §3 and resolving AF-003's flagged Mythic tier. As a Project-Owner-issued module, AF-007 constitutes the explicit authorisation the Constitution requires to amend a locked output. AF-002's ramp line is amended to reference the canonical ladder; token bindings recorded in `docs/ICONOGRAPHY.md` §4 (Improved = `vitality.green`, Rare = `shield.blue` — the 2026-07-05 palette extension slots in directly; new tokens minted for Damaged/Common/Ancient/Mythic/Singularity). The former "uncommon = crystal.teal" tier no longer exists.
- Rarity-purple (Epic) vs Void-purple (`energy.violet` faction meaning): disambiguated by context — rarity purple appears only inside rarity framing (borders/glows/beams), never as a threat colour; Singularity's animated violet is distinct through motion. Recorded in output §4.
- Symbol language (sword/shield/heart/atom/forge/…) is new canon — one concept, one symbol, everywhere. Boss = Crown and Elite = Diamond join AF-004's boss/elite feedback identity.
- Status effect roster (Burn, Freeze, Shock, Poison, Corruption, Shielded, Regeneration, Overload, Slow, Stasis, +future Bleed) is new canon and pre-commits future combat modules to these names.
- Animated icons reserved for top tiers + major moments: consistent with AF-002 "glow is earned" and the Constitution's reward philosophy (legendary moments remain rare).
- Accessibility adds **Outline Mode** and alternative icon shapes — superset of the Constitution set, consistent with the never-colour-alone law (AF-002/AF-004).

**Review verdict:** ALIGNED (one authorised supersession, recorded). Internal quality score 9.5/10 — approved. Produced output: `docs/ICONOGRAPHY.md`; amendment applied to `docs/VISUAL_LANGUAGE.md` §3.
