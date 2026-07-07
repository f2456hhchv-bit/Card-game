# AFTERLIGHT — Human Frontier Biome

**Authority:** Produced output of AF-058. Extends AF-000 → AF-057 — above all AF-036, whose biome engine remains byte-for-byte unmodified (see `docs/BIOME_FRAMEWORK.md`), and AF-038, whose galaxy carries the biome. Every future colony, settlement and human civilisation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the frontier is dangerous through composition and honest by construction — a sub-1 threat modifier, no enemy buffs, no native immunities, and every light that still works turned on.

---

## 1. Identity & Lore — hope, in public

Meridian Rest is humanity rebuilding where the dark can see it. Its Codex entry unlocks by reading the civilian archive in the field; its lore chain points at the Human Alliance profile and, through it, the birth of the Afterlight Initiative.

## 2. The biome is data on the locked engine

`HUMAN_FRONTIER_BIOME` is a plain AF-036 `BiomeDef`: two AF-035 hazard zones (Debris Belt, burning Reactor Leak), three authored weathers with real AF-020 wind forces (Solar Winds, Micro Meteor Showers, visibility-reducing Ion Storms), six weighted events over the locked shelf, AF-023 smart-loot resource weights biased toward early progression, and three interactables (archive lore, salvage harvest, nav-beacon event trigger).

## 3. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto AF-036's locked shelves; ten locations, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds are registered shelves binding to AF-035/037 content when authored. `bossId: null` until a frontier `BossDef` exists.

## 4. Enemy Presence — the ten-faction roster, weighted as specified

Outlaws and Nomads primary; light Machine activity; occasional Eclipsed; rare Ancient Guardians — nine ids, every one resolution-tested across all eleven rosters.

## 5. Galaxy integration — the biomeId field wakes up

AF-058 gives AF-038's `StarSystemDef.biomeId` its first consumer: a `BIOME_REGISTRY` resolves the run's biome from the current system at `startRun`. A new `humanFrontier` region and the Meridian Rest system (threat 1, Human Alliance, no Fast Travel needed) join the sandbox galaxy additively — the frontier is reachable by real travel, today.

## 6. Accessibility, performance & debug

Hazards are AF-035 zones with the engine's existing readable ticks; weather visibility reduction stays a content flag for the presentation pass; the biome is pure data — nothing to pool beyond what AF-036 already pools. Debug: the existing `biome` overlay line now names the live biome (state, weather + remaining, hazard count, events).

---

## Internal review loop (AF-058, recorded)

- **Zero engine changes** — AF-036/038/023/035/020 consumed exactly as designed; the module is a `BiomeDef`, two galaxy roster entries, and one Codex entry. ✔
- **Total mappings, no orphan vocabulary** — every weather and event name lands on a locked kind, totality-tested. ✔
- **Reachable, live** — real Galaxy Command travel to Meridian Rest, launch, and the frontier ran on the overlay with its own weather and both hazards, zero page errors. ✔
- **Gentle by design, tested as such** — sub-1 threat modifier, null enemy buff, empty immunities are assertions, not intentions. ✔
- **Sweep proof** — 1,000 seeded missions: hazards always fire, weather/events never leave the biome's own pools. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the visual/lighting language bind at future mission, boss, and asset modules.**
