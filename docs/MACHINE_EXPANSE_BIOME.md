# AFTERLIGHT — Machine Expanse Biome

**Authority:** Produced output of AF-060. Extends AF-000 → AF-059 — above all AF-036's unchanged biome engine, AF-047's Machine Collective doctrine, and AF-058's biome registry. Every future machine world, automated megastructure and industrial civilisation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the biome itself behaves like a living machine — its dangers ARE the factory (three working hazard lines, the most of any authored biome), its natives are factory-maintained (live buff, dual immunity), and nothing here exists naturally (threat 1.25, the deepest authored biome, asserted).

---

## 1. Identity & Lore — the Collective's industrial heart

Forge Primus is a planet-sized machine that has continued manufacturing itself for thousands of years without human oversight. Its Codex entry unlocks by activating the AI archive in the field and cross-references both the Collective profile and AF-047's network doctrine — the faction, its doctrine, and its home taught as one chain.

## 2. The biome is data on the locked engine

`MACHINE_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: a shocking Laser Grid, a burning Molten Channel and a heavy Press Line (three AF-035 zones — the factory itself is the hazard system), Electrical Storms / visibility-reducing EMP Waves / Magnetic Winds with real wind force (AF-020 forces), four weighted events over the locked shelf, and engineering-progression loot weights (craftingMaterial, blueprint, researchSample, equipment, weapon).

## 3. Infiltration made literal

Three interactables: the AI archive (lore), an assembly cache (harvest), and a security node using the `disableHazard` interaction kind — the spec's "infiltration and sabotage" emphasis expressed through an interaction verb the engine has carried since AF-036.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds (Adaptive War Platform already AF-047 mini-boss vocabulary) are registered. `bossId: null` is honest — the forge bosses bind as `BossDef`s when authored.

## 5. Enemy Presence — mechanical superiority

The full six-def AF-047 Collective roster primary (this is their home), Paragon Protocol prototypes (the abandoned experiments among the machines that kept running), an Ancient Custodian watcher, occasional Outlaw salvage raids, rare Void corruption — every id resolution-tested, natives buffed through AF-036's live hook (`shieldCapacity +12`) and immune to shock AND burn: the foundry does not harm its own machines.

## 6. Galaxy integration

Forge Primus (new `machineExpanse` region, threat 4, no Fast Travel gate) is reached through Hollow Drift's contested space — two real travel hops — carrying `biomeId: "machine-expanse"` through AF-058's registry, the third consumer of AF-038's field, with a machine-foundry POI discovering lore through AF-038's existing path.

---

## Internal review loop (AF-060, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary. ✔
- **The factory is the danger** — three real hazard zones tick-tested; a 1,000-mission sweep asserts hazards ALWAYS fire ("the factory never stops working", literally). ✔
- **Nothing natural, by assertion** — threat strictly above AF-059's 1.15, live enemy buff, dual shock+burn native immunity are tests, not intentions. ✔
- **Reachable, live** — real travel Lucent Gate → Hollow Drift → Forge Primus, launch, the Forge on the overlay (`Forge Primus · weather ionClouds · hazards 3`), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Forge's own pools across 4,000 steps; the AI archive discovers in range; the Codex entry gates on it with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the dark-steel/white-light/blue-energy visual language bind at future mission, boss, and asset modules.**
