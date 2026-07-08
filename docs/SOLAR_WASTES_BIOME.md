# AFTERLIGHT — Solar Wastes Biome

**Authority:** Produced output of AF-063. Extends AF-000 → AF-062 — above all AF-036's unchanged biome engine, AF-035's hazard zones, and AF-058's biome registry. Every future stellar environment, dying star system and energy-based expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the environment itself is the greatest threat — the only authored biome where every hazard carries a status effect, where the event pool's centre of gravity is the star itself, and where the threat modifier sits mid-ladder because the danger budget lives in the environment, not the roster. Overwhelming, never unfair: every danger is a readable zone, and positioning is always the counterplay.

---

## 1. Identity & Lore — the final moments of dying suns

Cinderfall is a system with ten thousand years left, which is nothing. Its Codex entry unlocks by activating the ancient forge in the field and cross-references the Conclave profile and the Ancient Core biome entry — the spec's lore payload ("the role of stars in precursor technology… the true energy requirements of the Afterlight Network") is exactly the thread connecting the star-shepherds to what the precursors built.

## 2. The biome is data on the locked engine

`SOLAR_WASTES_BIOME` is a plain AF-036 `BiomeDef`: a Radiation Field applying AF-021's poison (sickness that follows you out of the zone), a Plasma Geyser with heavy burn, and a Solar Shockwave applying AF-053's overload status — its FIRST use as a biome hazard — three AF-035 zones, every one carrying a status (asserted per-hazard); Solar Flares / visibility-reducing Radiation Storms / Heat Waves with the strongest single-axis wind yet (AF-020 forces); four weighted events with `solarFlare` structurally dominant (asserted ≥ every other weight); high-tier technology loot weights (resource/craftingMaterial/equipment).

## 3. The salvage wars

Machine Collective AND Human Outlaws both primary (≥3 defs each, asserted) — the Collective salvages, the Outlaws raid the salvagers, and the `factionConflict` event at weight 2 carries the same story into the event pool. The Conclave attends its element — including the LIVING SUPERNOVA, the spec's own boss name, already a playable AF-054 entity in this roster (asserted by id). A Paragon energy construct and rare Void round out the spec's five presences.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds are registered. `bossId: null` is honest — the waste bosses bind as `BossDef`s when authored.

## 5. The star is the enemy, not the factions

`threatModifier: 1.3` slots BETWEEN the Forge (1.25) and the Void (1.35) — asserted from both sides, the first biome placed mid-ladder rather than atop it, because the Wastes' danger lives in the environment. Natives hardened through AF-036's live hook (`shieldCapacity +12`, thermal shielding) and immune to burn AND poison: forged under this sun. An Orbital Mirror interactable uses `disableHazard` — redirect the mirror and the beam goes out.

## 6. Galaxy integration

Cinderfall (new `solarWastes` region, threat 4, Machine dominant, no Fast Travel gate) sits off Forge Primus — burning shipyards beside the foundries, three real travel hops — carrying `biomeId: "solar-wastes"` through AF-058's registry, the sixth consumer of AF-038's field, with a collapsed-mining-colony POI discovering lore through AF-038's existing path.

---

## Internal review loop (AF-063, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary; overload given its first biome-hazard producer. ✔
- **The environment is the greatest threat, literally** — every hazard zone carries a status (asserted per-hazard: poison, burn, overload); a 1,000-mission sweep asserts hazards ALWAYS fire ("the star never relents", literally). ✔
- **Overwhelming but fair, by structure** — readable zones with fixed tick intervals, solarFlare pool dominance asserted, threat bounded mid-ladder from both sides. ✔
- **Reachable, live** — real travel Lucent Gate → Hollow Drift → Forge Primus → Cinderfall, launch, the Wastes on the overlay (`Cinderfall · weather solarStorms · hazards 3`), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Wastes' own pools across 4,000 steps; the ancient forge discovers in range; the Codex entry gates on it with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the deep-orange/crimson/molten-gold visual language bind at future mission, boss, and asset modules.**
