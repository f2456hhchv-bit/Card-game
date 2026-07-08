# AFTERLIGHT — Frozen Reach Biome

**Authority:** Produced output of AF-064. Extends AF-000 → AF-063 — above all AF-036's unchanged biome engine, AF-021's status registry, and AF-058's biome registry. Every future cryogenic world, frozen civilisation and preservation system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Reach contrasts every previous region through calm, restraint and overwhelming stillness — and stillness is mechanical, asserted against all six prior biomes: the slowest hazards, the sparsest events, the lowest elite chance, the gentlest winds. Peaceful yet unforgiving: quiet is not safe.

---

## 1. Identity & Lore — suspension over escape

Winterline's colonies saw the Collapse coming and chose suspension: kilometres under the ice, the preservation systems still run, the instruments still record. The Codex entry unlocks by activating the cryo vault in the field and cross-references the Eclipsed and the Human Alliance — the colonies that chose to wait were human, and what became of them is drifting overhead. Whether suspension was wisdom or surrender is the question the ice preserves.

## 2. The biome is data on the locked engine

`FROZEN_REACH_BIOME` is a plain AF-036 `BiomeDef`: a Cryogenic Field rooting intruders with AF-021's freeze status (its FIRST producer — the preservation system does not distinguish visitors from specimens), a heavy statusless Ice Crack, and a Frozen Gas Cloud dragging at engines with AF-021's slow status (also its FIRST producer) — three AF-035 zones, every tick ≥1300ms; Ice Fog (the longest weather def yet, 13s of visibility-reducing drift), Crystal Hail (real downward force through `meteorActivity`), and a pure-light Aurora (AF-020 forces); THREE weighted events — the sparsest pool of any biome — led by `lostExpedition` for the first time anywhere; advanced research/crafting loot weights.

## 3. Stillness is mechanical

Asserted against all six prior authored biomes: hazard ticks ≥1300ms (planning, not reflexes), events ≤ every prior biome's pool (silence between them), eliteChance 0.06 strictly below all six ("encounters remain deliberate rather than overwhelming"), every wind axis ≤0.3 (winds never rise above a drift). And still: `threatModifier: 1.2` mid-ladder between the Expanse and the Forge, asserted from both sides — quiet is not safe.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds are registered. `bossId: null` is honest — the reach bosses bind as `BossDef`s when authored.

## 5. Enemy Presence — deliberate, never overwhelming

The Eclipsed primary (≥4 defs asserted — frozen former humans above frozen former colonies, the biome and its faction one image), Ancient Custodians, Machine Collective, CRYOGENIC WILDLIFE resolved as AF-051 organisms adapted to the ice (the spec's wildlife is the game's existing fauna, not a new roster), rare Void — every id resolution-tested across five rosters, natives buffed through AF-036's live hook (`shieldCapacity +10`) and immune to freeze AND slow: they froze a long time ago, and the cold has nothing left to take.

## 6. Galaxy integration

Winterline (new `frozenReach` region, threat 3, THE ECLIPSED dominant — the first system they hold — no Fast Travel gate) lies past the Human Frontier on the galaxy's dark edge, two real travel hops, carrying `biomeId: "frozen-reach"` through AF-058's registry — the seventh consumer of AF-038's field — with a frozen-fleet POI giving `abandonedFleets` its first authored use.

---

## Internal review loop (AF-064, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary; freeze and slow given their first producers. ✔
- **Stillness asserted, not intended** — tick floors, pool sparsity, elite-chance minimum, and wind ceilings all tested against every prior authored biome; a 1,000-mission sweep asserts hazards ALWAYS fire ("even the stillness has teeth", literally). ✔
- **Quiet is not safe, by assertion** — threat bounded mid-ladder from both sides, live enemy buff, dual freeze+slow native immunity are tests, not intentions. ✔
- **Reachable, live** — real travel Lucent Gate → Meridian Rest → Winterline, launch, the Reach on the overlay (`Winterline · weather meteorActivity · hazards 3` — Crystal Hail falling), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Reach's own pools across 4,000 steps; the cryo vault discovers in range; the Codex entry gates on it with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the deep-blue/white-ice/aurora visual language bind at future mission, boss, and asset modules.**
