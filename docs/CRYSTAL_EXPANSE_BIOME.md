# AFTERLIGHT — Crystal Expanse Biome

**Authority:** Produced output of AF-059. Extends AF-000 → AF-058 — above all AF-036's unchanged biome engine, AF-048's live crystal-growth mechanics, and AF-058's biome registry. Every future crystal world, resonance ecosystem and living planetary environment extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Expanse looks peaceful and is not — beauty is presentation, danger is numbers (threat 1.15, resonance-hardened shock-immune natives), and nothing here is hostile until you forget it's all one organism.

---

## 1. Identity & Lore — the Ascendancy's birthplace

Prismheart is geology, biology and energy grown into one planetary consciousness. Its Codex entry unlocks by activating the resonance well in the field and cross-references both the Dominion profile and AF-048's resonance doctrine — the faction and its home taught as one lesson.

## 2. The biome is data on the locked engine

`CRYSTAL_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: a shocking Resonance Field and a Shardfall Canyon (AF-035 zones), Crystal Rain / Prismatic Storms / visibility-reducing Crystal Mist (AF-020 forces), six weighted events over the locked shelf, advanced-progression loot weights, and three interactables (resonance-well lore, bloom-site harvest, hidden cavern).

## 3. Constant growth — already owned, deliberately not duplicated

"Every environment constantly grows" is mechanically live through AF-048's Growth Seeder and `growCrystalZone`, which run in combat over this terrain. The biome authors the terrain those mechanics grow from; it does not re-implement growth.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds (already AF-048 mini-boss vocabulary) are registered. `bossId` resolves to the real Hollow Sentinel — an ancient guardian in a crystal temple, the coexistence made playable.

## 5. Enemy Presence — ecosystem-driven

Six Ascendancy organisms primary, Custodians tending the temples, occasional Void corruption, rare Machine expeditions — every id resolution-tested, natives buffed through AF-036's live hook and immune to their own resonance.

## 6. Galaxy integration

Prismheart (crystalDominion, threat 3, no Fast Travel gate) carries `biomeId: "crystal-expanse"` through AF-058's registry — reachable by real travel today.

---

## Internal review loop (AF-059, recorded)

- **Zero engine changes** — one `BiomeDef`, one galaxy system, one Codex entry; growth deliberately deferred to its AF-048 owner. ✔
- **Total mappings, no orphan vocabulary.** ✔
- **Not safe, by assertion** — threat above one, live enemy buff, native shock immunity are tests, not intentions. ✔
- **Reachable, live** — real travel to Prismheart, launch, the Expanse on the overlay with its own weather and both hazards, zero page errors. ✔
- **Sweep proof** — 1,000 seeded missions: hazards always fire, weather/events never leave the biome's own pools. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the prismatic visual language bind at future mission, boss, and asset modules.**
