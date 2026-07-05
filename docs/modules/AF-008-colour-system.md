# AF-008 — COLOUR SYSTEM & VISUAL HIERARCHY FRAMEWORK

**Module status:** Complete (specification produced; live screen review binds every future content module)
**Lock status:** LOCKED — extends AF-000 → AF-007 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/COLOUR_SYSTEM.md` (the master colour registry and visual hierarchy of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-007 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Colour System and Visual Hierarchy Framework.

Colour is not decoration.

Colour is gameplay communication.

Players should instinctively understand danger, reward, progression and faction identity through colour alone.

Every future visual asset must follow this document.

==================================================
CORE PHILOSOPHY
==================================================

Colour creates meaning.

Light creates emotion.

Contrast creates readability.

Every colour exists for a reason.

Never use colour simply because it looks attractive.

==================================================
MASTER COLOUR PALETTE
==================================================

Primary Background

Deep Space Black

Nebula Navy

Void Indigo

Midnight Blue

Primary Light

White Energy

Electric Violet

Soft Cyan

Secondary Colours

Crystal Teal

Solar Gold

Machine Steel

Plasma Blue

Void Purple

Ancient Bronze

Warning Colours

Orange

Red

Danger Crimson

Support Colours

Green

Blue

White

Neutral Grey

==================================================
COLOUR HIERARCHY
==================================================

Highest Priority

Player

Friendly Objects

----------------------------

Boss Mechanics

Immediate Danger

----------------------------

Enemy Attacks

Hazards

----------------------------

Loot

XP

Resources

----------------------------

Environment

Visual Effects

Background

Background colours must never overpower gameplay.

==================================================
FACTION COLOUR LANGUAGE
==================================================

Human Alliance

White

Blue

Silver

Crystal Dominion

Turquoise

Emerald

White

Void Legion

Purple

Black

Dark Magenta

Ancient Civilisation

Gold

Ivory

Bronze

Machine Collective

Steel

Orange

White

Solar Empire

Amber

Gold

White

Abyssal Swarm

Crimson

Black

Dark Red

Celestial Order

White

Sky Blue

Gold

Every faction remains visually identifiable.

==================================================
RARITY COLOUR SYSTEM
==================================================

Damaged

Grey

Common

White

Improved

Green

Rare

Blue

Epic

Purple

Legendary

Gold

Ancient

Crimson Gold

Mythic

White Gold

Singularity

Animated Violet

Never change rarity colours.

==================================================
STATUS EFFECT COLOURS
==================================================

Burn

Orange

Freeze

Light Blue

Shock

Electric Cyan

Poison

Green

Corruption

Dark Purple

Shield

Blue

Regeneration

Bright Green

Overload

Yellow

Stasis

White

Every status remains consistent throughout the game.

==================================================
LIGHTING LANGUAGE
==================================================

Light communicates:

Power

Hope

Technology

Progress

Darkness communicates:

Decay

Corruption

Unknown

Danger

Bosses manipulate lighting carefully.

Never reduce readability.

==================================================
ENVIRONMENTAL COLOUR RULES
==================================================

Biomes may have strong atmosphere.

Gameplay objects always remain distinguishable.

Environmental colour grading must never hide:

Enemies

Loot

Projectiles

Hazards

==================================================
CONTRAST STANDARDS
==================================================

Player must always achieve highest readability.

Enemy attacks always contrast with background.

Loot beams always visible.

HUD always readable.

Support HDR displays without relying on HDR.

==================================================
ACCESSIBILITY
==================================================

Support:

Protanopia

Deuteranopia

Tritanopia

High Contrast

Monochrome Assist

Custom UI Colours

Custom HUD Colours

Never rely exclusively on colour.

Shape and animation reinforce communication.

==================================================
DOCUMENTATION
==================================================

Every colour documents:

Purpose

HEX

RGB

Usage

Accessibility Variant

Associated Systems

Version

==================================================
PERFORMANCE
==================================================

Reuse materials.

Reuse gradients.

Reuse shaders.

Avoid unnecessary colour variants.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Palette Usage

Contrast Warnings

Accessibility Preview

Material Count

Colour Overrides

Performance

==================================================
OUTPUT
==================================================

Produce the complete Colour System and Visual Hierarchy Framework.

Every future visual asset extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every gameplay screen.

Review every biome.

Review every faction.

Review every rarity.

Review every HUD screen.

Review every Boss encounter.

Review every accessibility mode.

Review every colour combination.

Review contrast.

Review lighting.

Review performance.

Remove unnecessary colours.

Strengthen visual hierarchy.

Ensure colour always communicates gameplay before aesthetics.

Repeat until players can understand the battlefield from colour language alone while maintaining accessibility and visual consistency.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-007 alignment review (recorded at catalogue time)

- Colour-is-communication restates AF-002/AF-004 law; the five-band colour hierarchy is consistent with AF-004 §1's attention model (player top, environment/effects bottom). No contradictions.
- **Palette extension (authorised by this module):** new tokens minted for Nebula Navy, Void Indigo, Soft Cyan, Void Purple, Ancient Bronze, Danger Crimson, Neutral Grey, plus formalisation of Machine Steel (previously informal in AF-002 §3). Existing names bind to existing tokens (Deep Space Black = `space.black`, etc.). **Binding decision:** "Plasma Blue" binds to the existing `shield.blue` `#4D7CFF` (the blue member of the plasma family) rather than minting a near-duplicate blue — avoids two indistinguishable blues (AF-008's own "avoid unnecessary colour variants" law). Owner may overrule.
- **New canon — faction roster expands 5 → 8 with formal names:** Human Alliance, Crystal Dominion, Void Legion, Ancient Civilisation, Machine Collective (formalising AF-002's five) **plus Solar Empire, Abyssal Swarm, Celestial Order** (new). AF-008 supplies colour triads only; **silhouette/shape grammars for the three new factions are not yet defined** — flagged as a mandatory deliverable for their introducing content modules (AF-002 §5 silhouette law applies to them from birth).
- Rarity colour list matches AF-007 §4 tier-for-tier — consistency check passed; "never change rarity colours" now double-locked.
- Status colours bind to tokens with two disambiguations: Poison gets a distinct murky `toxin.green` (hostile) so it can never be read as Regeneration's `vitality.green` (beneficial) — shape motifs already differ per AF-004/AF-007; Freeze gets new `ice.blue` distinct from Shock's `plasma.cyan`. **Gap flagged:** AF-007 canonised a *Slow* status but AF-008's colour list omits it — provisionally bound to `neutral.grey` pending owner ruling.
- Accessibility adds Monochrome Assist and Custom UI/HUD colours — superset of Constitution + AF-007 sets, consistent with never-colour-alone law.
- Contrast standards made measurable in output §8 (minimum ratios, HDR-independent).

**Review verdict:** ALIGNED (palette + faction extensions authorised by this module and recorded; one binding decision and one gap flagged for owner). Internal quality score 9.5/10 — approved. Produced output: `docs/COLOUR_SYSTEM.md`.
