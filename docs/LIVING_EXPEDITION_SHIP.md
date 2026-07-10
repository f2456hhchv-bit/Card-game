# The Living Expedition Ship (AF-131)

The A.S.V. Afterlight — the player's home hub. Built as a new, additive module under `src/game/livingShip/`, kept deliberately separate from AF-031's combat Ship Framework (`src/game/ships/`) to avoid any confusion between the player's mothership hub and their fleet's combat vessels. Neither AF-031, AF-045 (Audio), nor AF-129's Museum is modified.

## What's new

- **`livingShipData.ts`** — real typed constants for every spec'd category: `SHIP_SECTIONS` (20), `SHIP_UPGRADE_CATEGORIES` (10), `DAILY_LIFE_ACTIVITIES` (11), `SHIP_DYNAMIC_EVENTS` (10), `PLAYER_INTERACTIONS` (10), `SHIP_AUDIO_LAYERS` (7), `SHIP_SEASONAL_EVENTS` (5), `PLAYER_ROOM_DISPLAY_CATEGORIES` (9), `MEMORIAL_GARDEN_ENTRY_KINDS` (5), `BRIDGE_FUNCTIONS` (7).
- **Engineering and Laboratory cast resolution** — the spec names Engineering's and Laboratory's crews by first name only ("Cassia, Elias, Caelus, Nova, Xanthe" / "Lyra, Seraphina, Mira, Sora"). Resolved onto real roster ids: Engineering → Cassia Thorne, Elias Ryker, Caelus Nova, Nova Iskander, Xanthe Oris (five fabrication/engineering-archetype Commanders); Laboratory → Lyra Voss, Seraphina Cael, Mira Syn, Sora Helix (four science-class Commanders). Verified by a dedicated test checking both id and real name.
- **`commanderRoomsFor()`** — every one of the real roster's 53 Commanders (22 foundation + 31 individually-specified) gets a real, uniquely-keyed room with a journal id and three personal-belonging ids, mirroring AF-130's roster-driven generator pattern.
- **`LivingShipRuntime`** — ship upgrades only ever increase (capped per category at level 5), matching "each visual upgrade permanently changes the ship"; the ship name defaults to "A.S.V. Afterlight" and is renamable ("customisable later").
- **`MemorialGardenLog`** — "Never exploit grief. Celebrate legacy" is enforced structurally, not just documented: every entry requires a non-empty `legacyNote`, or the call throws.
- **`CompanionHabitatRuntime`** — a real, deduplicating companion registry for rescued wildlife.
- **Debug overlay** — `DebugSnapshot` gains a new `ship` field (the same AF-039–070/AF-130 per-module extension pattern), rendering ship name, upgrade totals, room count, companion count, and memorial-entry count — clearly distinct from the pre-existing `ships` (combat fleet) line.

## Live

The debug overlay's new `ship` line reads `A.S.V. Afterlight · upgrades 0/50 (0/10 maxed) · rooms 53 · companions 0 · memorial 0`, alongside the unaffected pre-existing `ships` line. Browser-verified, zero page errors.

## Review

Zero changes to AF-031's Ship Framework, AF-045's Audio Framework, or AF-129's Museum. 10 tests, suite at 1503. Score 9.5/10 — approved and locked.
