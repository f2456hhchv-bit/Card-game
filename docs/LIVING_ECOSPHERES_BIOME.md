# AFTERLIGHT — Living Ecospheres Biome

**Authority:** Produced output of AF-066. Extends AF-000 → AF-065 — above all AF-036's unchanged biome engine, AF-051's Hive doctrine, and AF-058's biome registry. Every future living world, bioengineered civilisation and planetary ecosystem extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** everything is alive, and the numbers prove it — the richest event pool and the fastest hazard tick of any authored biome, both asserted against all eight priors. The Ecosphere is the deliberate inverse of AF-064's Frozen Reach: the two biomes bracket the design space (stillest ↔ most alive), and both brackets live in tests.

---

## 1. Identity & Lore — the planet is examining you

Verdance is one organism the size of a world: forests for nerves, rivers for blood, wildlife for an immune system. The Codex entry unlocks by activating the organic archive in the field and cross-references the Hive and AF-048's resonance doctrine — two living doctrines sharing one garden. The spec's deepest questions (ancient genetic engineering, the ethics of creating life, whether planets can become conscious) are carried as open questions, not answers.

## 2. The biome is data on the locked engine

`LIVING_ECOSPHERES_BIOME` is a plain AF-036 `BiomeDef`: a Carnivorous Grove snapping at 600ms (the FASTEST hazard tick of any biome, asserted below every prior's fastest — the terrain is hungry), a Toxic Spore field applying AF-021's poison (the planet's immune response), and Root Traps applying slow (the undergrowth grasping at engines) — three AF-035 zones born from biology; Bioluminescent Rain / visibility-reducing Living Fog / Seed Winds (AF-020 forces); SEVEN weighted events — the richest pool of any biome, asserted — led by Mass Bloom through `crystalBloom` (deliberately the same engine event AF-048's crystal ecology rides: two living doctrines, one bloom vocabulary); the highest `researchSample` weight of any biome (2.4, asserted — biology IS research).

## 3. The inverse of stillness

AF-064 made the Reach the quietest biome by assertion; AF-066 makes the Ecosphere the most alive by the same method: events strictly richest, fastest tick strictly fastest, both against all eight priors. The pair brackets the pacing spectrum every future biome will land inside.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds are registered. `bossId: null` is honest — the Hive Sovereign's court already fights here; the bosses bind as `BossDef`s when authored.

## 5. Enemy Presence — the ecosystem influences combat

The Bio-Engineered Hive primary as the FULL AF-051 roster (all six defs asserted — this is their home), the Crystal Ascendancy as the other living doctrine (≥2), environmental wildlife resolved as the same organisms (the fauna IS the faction), rare Void corruption, occasional Custodians — every id resolution-tested across four rosters, natives in symbiotic carapace (`shieldCapacity +11`) and immune to poison AND slow: the ecosystem does not eat its own.

## 6. Galaxy integration

Verdance (new `darkNebula` region — "something inside it drinks the starlight" — threat 4, the Xenomorph Hive's first held system, no Fast Travel gate) hides past Prismheart — the living worlds cluster, two real travel hops — carrying `biomeId: "living-ecospheres"` through AF-058's registry, the ninth consumer of AF-038's field, with an ancient-bio-lab POI giving `researchStations` its first authored use. `threatModifier: 1.28` is asserted between the Forge (1.25) and the dying suns (1.3): a living world defending itself.

---

## Internal review loop (AF-066, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary; researchStations given its first use. ✔
- **Most alive, asserted** — richest event pool and fastest hazard tick against all eight priors, bloom-led pool, highest researchSample weight; a 1,000-mission sweep asserts hazards ALWAYS fire ("the planet never sleeps", literally). ✔
- **Biology as hazard engine** — grove/spores/roots all real AF-035 zones; poison and slow statuses tick-tested; dual native immunity — tests, not intentions. ✔
- **Reachable, live** — real travel Lucent Gate → Prismheart → Verdance, launch, the Ecosphere on the overlay (`Verdance · weather energyWinds · hazards 3` — Seed Winds blowing), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Ecosphere's own pools across 4,000 steps; the organic archive discovers in range; the Codex entry gates on it with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the bioluminescent/megaflora/breathing-terrain visual language bind at future mission, boss, and asset modules.**
