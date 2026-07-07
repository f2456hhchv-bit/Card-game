# AF-059 — CRYSTAL EXPANSE BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-058 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CRYSTAL_EXPANSE_BIOME.md` + implementation (`src/game/biomes/crystalExpanseBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

59

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-058 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Crystal Expanse Biome.

The Crystal Expanse is the birthplace of the Crystal Ascendancy.

It is not simply a planet covered in crystals.

It is a living planetary ecosystem where geology, biology and energy have evolved together into a single planetary consciousness.

Players should feel they are walking through a living organism on a planetary scale.

==================================================
CORE PHILOSOPHY
==================================================

Beauty.

Growth.

Harmony.

Evolution.

Living ecosystems.

The biome should appear peaceful while remaining highly dangerous.

==================================================
BIOME IDENTITY
==================================================

Theme:

Living crystal forests.

Prismatic valleys.

Floating crystal islands.

Energy rivers.

Planetary resonance.

Ancient crystal temples.

Organic mineral life.

Every environment constantly grows.

==================================================
VISUAL LANGUAGE
==================================================

Translucent crystals.

Rainbow refraction.

Floating shards.

Living crystal roots.

Energy veins.

Prismatic fog.

Reflective terrain.

Light diffraction.

Visuals should communicate constant growth.

==================================================
ENVIRONMENT
==================================================

Support:

Crystal Forests

Resonance Fields

Prismatic Canyons

Floating Crystal Islands

Living Caverns

Energy Rivers

Ancient Crystal Temples

Resonance Towers

Crystal Gardens

Planetary Hearts

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Crystal Rain

Prismatic Storms

Energy Winds

Resonance Pulses

Light Bloom

Crystal Mist

Solar Refraction

Weather enhances atmosphere.

Never gameplay confusion.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Growing Crystal Walls

Reflective Shards

Energy Eruptions

Resonance Fields

Crystal Explosions

Collapsing Formations

Prismatic Lasers

Living Terrain

Hazards become part of combat.

==================================================
MISSION TYPES
==================================================

Support:

Study Resonance

Recover Crystal Cores

Destroy Growth Nodes

Escort Scientists

Stabilise Resonance

Explore Ancient Temples

Harvest Resources

Defeat Crystal Guardians

The biome emphasises exploration.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Crystal Ascendancy

Ancient Custodians

Occasional Void Corruption

Rare Machine Expeditions

Environmental Lifeforms

Every encounter feels ecosystem-driven.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Crystal Essence

Resonance Shards

Living Minerals

Prismatic Dust

Energy Crystals

Ancient Components

Research Samples

Rare Evolution Materials

Crystal resources enable advanced progression.

==================================================
POINTS OF INTEREST
==================================================

Support:

Resonance Wells

Living Monoliths

Ancient Crystal Archives

Energy Bridges

Crystal Bloom Sites

Hidden Caverns

Planetary Heart Chambers

Prismatic Sanctuaries

Exploration always rewards curiosity.

==================================================
BIOME EVENTS
==================================================

Support:

Crystal Bloom

Planetary Resonance

Energy Surge

Living Forest Expansion

Ancient Temple Activation

Resonance Cascade

Prismatic Eclipse

Crystal Migration

The biome constantly evolves.

==================================================
EXPLORATION
==================================================

Players may discover:

Hidden Crystal Species

Ancient Records

Prototype Technology

Resonance Experiments

Living Relics

Rare Organisms

Planetary Memories

Secret Pathways

Every discovery expands the Codex.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Crystal Matriarch

Living Monolith

Prismatic Leviathan

Planetary Heart Guardian

Ancient Resonator

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Crystal Expanse teaches:

Crystal evolution.

Planetary consciousness.

Resonance biology.

Ancient coexistence.

Energy ecology.

The origin of the Crystal Ascendancy.

It greatly expands the player's understanding of life beyond humanity.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced bloom mode

Reduced refraction

Hazard outlines

High Contrast

Colour-blind support

Photosensitivity mode

Readable resonance indicators

==================================================
PERFORMANCE
==================================================

Pool crystal growth.

Reuse resonance shaders.

Optimise reflections.

Stream large crystal formations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Resonance Level

Crystal Growth

Weather State

Environmental Hazards

Discovery %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Crystal Expanse Biome.

Every future crystal world, resonance ecosystem and living planetary environment extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Crystal Expanse missions.

Review exploration.

Review environmental storytelling.

Review crystal growth.

Review hazards.

Review events.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-058.

Adjust resonance frequency.

Adjust resource distribution.

Adjust environmental pacing.

Remove repetitive crystal formations.

Ensure the Crystal Expanse becomes one of the most visually distinctive and mechanically unique locations in Afterlight, combining breathtaking beauty with meaningful exploration and dynamic ecosystem-driven gameplay.

Repeat until the Crystal Expanse Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-059.

---

## Foundation / AF-000–058 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-058's exact content-module shape, applied to the Ascendancy's birthplace.** `CRYSTAL_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: two AF-035 hazard zones (a shocking Resonance Field and a Shardfall Canyon), three weathers with real AF-020 forces (Crystal Rain — the locked shelf's own kind, coined for exactly this biome; Prismatic Storms; visibility-reducing Crystal Mist), six weighted events, AF-023 smart-loot weights biased toward advanced progression (craftingMaterial/relic/ancientArtifact/researchSample), and three interactables including the resonance-well lore discovery. Both vocabulary mappings (7 weather names, 8 event names) are total onto the locked shelves.
- **"Peaceful while remaining highly dangerous" is numbers, not intentions:** `threatModifier: 1.15`, resonance-hardened natives through AF-036's live `enemyBuff` hook (`shieldCapacity +10` — the same hook the sandbox biome proved), and `hazardImmunities: ["shock"]` — the ecosystem does not shock itself. All asserted in tests.
- **Enemy Presence is exactly the spec's ecosystem:** six Crystal Ascendancy organisms primary (drone, shard hunter, resonance node, growth seeder, guardian, titan — the AF-048 roster in its home biome), Ancient Custodians (sentinel, defence drone — "ancient coexistence"), occasional Void (wisp), rare Machine expeditions (sniper unit) — every id resolution-tested. **"Every environment constantly grows" is already mechanically true here:** AF-048's Growth Seeder and `growCrystalZone` run live in combat over this terrain; the biome's static formations are what those mechanics grow from, and the review records that link rather than duplicating a growth system.
- **`bossId` resolves to a REAL BossDef** — the Hollow Sentinel, an ancient guardian in a temple, exactly the coexistence the lore teaches; the five Expanse boss kinds (Crystal Matriarch et al., already registered as AF-048 mini-boss vocabulary) bind as `BossDef`s when authored.
- **Prismheart joins the galaxy additively:** a crystalDominion system (threat 3, no Fast Travel gate) carrying `biomeId: "crystal-expanse"` through AF-058's registry — the second consumer of AF-038's field — with a crystal-temple POI discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the resonance well discovers `LORE_CRYSTAL_EXPANSE_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-crystal-expanse` entry (cross-referencing the Dominion profile AND AF-048's resonance doctrine) with zero Missing Links.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity including the real-BossDef resolution, the ecosystem enemy-presence structure (≥5 Ascendancy primary + all three guest factions), real hazard ticks, the not-safe assertions (threat > 1, shock immunity, live buff hook), real `GalaxyRuntime` travel to Prismheart resolving the Expanse `biomeId`, `BiomeRuntime` integration (weather/events only from the Expanse's own pools across 4,000 steps), the resonance-well discovery, the Codex entry, and a 1,000-mission seeded sweep in which the ecosystem's hazards always fire. **Live in the browser:** travelled Lucent Gate → Prismheart via the real travel button, launched, and the Expanse ran live — `Prismheart · weather solarStorms · hazards 2` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the second biome through AF-058's registry, one galaxy system and one Codex entry added in the established additive class; crystal growth deliberately NOT re-implemented — AF-048 already owns it live). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CRYSTAL_EXPANSE_BIOME.md`, `src/game/biomes/crystalExpanseBiome.ts`.
