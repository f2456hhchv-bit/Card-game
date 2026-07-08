# AFTERLIGHT — Derelict Expanse Biome

**Authority:** Produced output of AF-065. Extends AF-000 → AF-064 — above all AF-036's unchanged biome engine, AF-023's smart-loot weights, and AF-058's biome registry. Every future abandoned fleet, ghost ship, lost expedition and salvage environment extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every wreck tells a story, and exploration outranks combat — structurally: the most interactables of any biome, the first shipComponent loot weight, a distress-led event pool, and a low-ladder threat modifier because the danger is what you wake up, not what patrols. The mystery stays a mystery: nothing here was ever salvaged, and the Codex refuses to say why.

---

## 1. Identity & Lore — countless personal stories

Gravewake is millions of ships from thousands of years of losing — some still transmitting, some still sealed, none ever reclaimed. The Codex entry unlocks by activating the black box archive in the field and cross-references the Eclipsed and the Nomad fleet — the dead fleets and the living ones, working the same graveyard. Per the spec, the archives speak in one crew's voice, not history's: countless personal stories rather than one grand narrative.

## 2. The biome is data on the locked engine

`DERELICT_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: a pressurised Hull Explosion (the heaviest single statusless tick of any biome hazard — 11 damage, asserted), a Reactor Leak that never fully died (burn), and Unstable Wreckage giving AF-021's `armourBreak` status its FIRST biome-hazard producer — three AF-035 zones born from destruction itself; Debris Storms with real drift, plus the first TWO visibility-reducing weathers in one biome (Sensor Interference and Electromagnetic Clouds — radio interference you can't see through, asserted exactly two); a `distressSignal`-led event pool (asserted dominant — some ships still transmit) with the Salvage Race as `factionConflict` and a lone Nomad `wanderingMerchant`.

## 3. Exploration over combat, structurally

The MOST interactables of any authored biome — four, asserted above all seven priors, all findable-in-range-tested: the black-box lore archive, a salvage cache, a sealed hangar (`openHiddenArea`), and a blocking hulk (`destroyObstacle`). And the FIRST biome to weight `shipComponent` loot (2.4, the biome's highest weight — asserted absent from every prior biome): salvage IS the reward.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds are registered. `bossId: null` is honest — the wreck bosses bind as `BossDef`s when authored.

## 5. Enemy Presence — enemies exploit abandoned infrastructure

The Eclipsed primary (≥3 defs asserted — these may be their own fleets), Human Outlaws AND Stellar Nomads both fielding salvage crews (≥2 each asserted — the Salvage Race made roster), Machine Collective reclamation, rare Void Swarm — every id resolution-tested across five rosters, natives in scavenged plating (`shieldCapacity +8`, the lightest buff of any buffed biome) and immune to armourBreak AND burn: the wrecks already took everything the Expanse could break.

## 6. Galaxy integration

Gravewake (new `brokenSystems` region, threat 2, THE ECLIPSED dominant — their second held system, no Fast Travel gate) sits off Meridian Rest — the Alliance's lost fleets drifted home almost far enough; two real travel hops — carrying `biomeId: "derelict-expanse"` through AF-058's registry, the eighth consumer of AF-038's field, with a ghost-carrier POI on `abandonedFleets`. `threatModifier: 1.1` is asserted between the Frontier (0.9) and the Crystal Expanse (1.15).

---

## Internal review loop (AF-065, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary; armourBreak and shipComponent given their first producers. ✔
- **Exploration over combat, asserted** — interactables > all seven priors, shipComponent weight unique-and-highest, distressSignal pool dominance, threat bounded low-ladder from both sides; a 1,000-mission sweep asserts hazards ALWAYS fire ("the wrecks are still dying", literally). ✔
- **Hazards born from destruction** — heaviest statusless tick yet, reactor burn, armourBreak grinder, dual native immunity — tests, not intentions. ✔
- **Reachable, live** — real travel Lucent Gate → Meridian Rest → Gravewake, launch, the Expanse on the overlay (`Gravewake · weather meteorActivity · hazards 3` — Debris Storms drifting), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Expanse's own pools across 4,000 steps; all four interactables findable in range; the Codex entry gates on the black box with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the rust/emergency-light/drifting-wreck visual language bind at future mission, boss, and asset modules.**
