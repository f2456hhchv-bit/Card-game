# Visual Direction Framework (AF-092)

Extends AF-002/007/008's design-doc canon (visual language, iconography, colour system) into real, testable code for the first time. Zero changes to any locked module.

## What's new

- **Colour Language** — `FACTION_COLOUR_SIGNATURES`, 6 factions × 7 elements. `colourSignaturesAreDistinct()` is the ninth identity-uniqueness axis (AF-085→090's chain), proven disjoint from AF-007's locked `RARITY_TABLE` hex ladder too.
- **Biome Visual Language** — `biomeVisualIdentityFor` follows AF-091's hand-authored-plus-generated-fallback pattern: 2 hand-authored biomes, every other id gets a deterministic generated identity.
- **Material System / Cinematic Presentation** — realisation-map bindings onto real systems (AF-025, AF-044, AF-089, AF-016, AF-045, AF-068, AF-072, AF-087, AF-090, AF-038/041).
- **VFX System** — `VFX_MIN_PRIORITY`, a minimum-priority table so gameplay-critical VFX (boss mechanics, hazards) are never culled before ambient filler — the visual analogue of AF-091's Combat Audio priority table.
- **Lighting / Camera / Photo Mode / Accessibility / Performance** — registered with honest live/future flags. 2 accessibility surfaces already live via AF-044's `highContrast`/`colourBlindMode`; 1 lighting theme (weather) and 1 camera kind (gameplay) already live.

## Live

The biome debug overlay line now appends real lighting/skybox text from `biomeVisualIdentityFor`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 8 tests, suite at 1087. Score 9.5/10 — approved and locked.
