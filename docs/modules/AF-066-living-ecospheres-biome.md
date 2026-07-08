# AF-066 — LIVING ECOSPHERES BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-065 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/LIVING_ECOSPHERES_BIOME.md` + implementation (`src/game/biomes/livingEcospheresBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

66

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-065 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Living Ecospheres Biome.

The Living Ecospheres are not ordinary planets.

Entire worlds have evolved into single interconnected superorganisms.

Mountains breathe.

Forests communicate.

Oceans react.

Atmospheres learn.

Players should feel like they are travelling across the body of a living planet.

Everything is alive.

==================================================
CORE PHILOSOPHY
==================================================

Life.

Evolution.

Symbiosis.

Adaptation.

Balance.

Nothing exists independently.

Everything serves the planetary organism.

==================================================
BIOME IDENTITY
==================================================

Theme:

Living planets.

Planetary nervous systems.

Organic megaflora.

Bioengineered forests.

Sentient oceans.

Massive root networks.

Symbiotic ecosystems.

Ancient biological engineering.

The entire biome behaves like one organism.

==================================================
VISUAL LANGUAGE
==================================================

Gigantic trees.

Living roots.

Bioluminescent plants.

Organic rivers.

Breathing terrain.

Living spores.

Massive flowers.

Natural architecture.

Everything grows naturally.

==================================================
ENVIRONMENT
==================================================
Support:

Living Forests

Root Networks

Organic Mountains

Sentient Rivers

Spore Fields

Symbiotic Valleys

Bioengineered Jungles

Planetary Hearts

Living Caverns

Evolution Gardens

Future environments extend naturally.

==================================================
WEATHER
==================================================

Support:

Spore Storms

Pollen Clouds

Bioluminescent Rain

Living Fog

Photosynthetic Bloom

Seed Winds

Organic Lightning

Weather supports ecosystem behaviour.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Carnivorous Flora

Toxic Spores

Living Vines

Root Traps

Acid Sap

Spore Bursts

Collapsing Growth

Organic Ambushes

Hazards emerge naturally from biology.

==================================================
MISSION TYPES
==================================================

Support:

Study Ecosystems

Protect Researchers

Harvest Samples

Destroy Parasites

Restore Balance

Investigate Evolution

Recover Ancient Seeds

Rescue Explorers

The biome rewards scientific curiosity.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Bio-Engineered Hive

Crystal Ascendancy

Environmental Wildlife

Rare Void Corruption

Occasional Ancient Custodians

The ecosystem itself influences combat.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Organic Tissue

Genetic Samples

Living Fibres

Biomass

Evolution Catalysts

Ancient Seeds

Research Specimens

Rare Biological Materials

Resources support advanced biological technologies.

==================================================
POINTS OF INTEREST
==================================================

Support:

Planetary Heart

Evolution Pools

Ancient Bio Labs

Living Temples

Seed Vaults

Symbiosis Chambers

Organic Archives

Gigantic Root Systems

Exploration constantly rewards observation.

==================================================
BIOME EVENTS
==================================================

Support:

Mass Bloom

Migration

Predator Emergence

Planetary Pulse

Spore Season

Evolution Surge

Symbiosis Shift

Ancient Awakening

Events reinforce planetary intelligence.

==================================================
EXPLORATION
==================================================

Players may discover:

Unknown Species

Ancient Genetic Records

Evolution Experiments

Lost Research Teams

Prototype Organisms

Planetary Memories

Legendary Seeds

Living Relics

Every discovery expands biological understanding.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Planetary Heart

Hive Sovereign

Ancient Bloom

World Root Guardian

Evolution Colossus

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Living Ecospheres teach:

Planetary evolution.

Artificial biology.

Ancient genetic engineering.

Symbiotic intelligence.

The ethics of creating life.

The possibility that planets themselves can become conscious.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced foliage density

Hazard outlines

Reduced spores

High Contrast

Colour-blind support

Photosensitivity mode

Readable environmental indicators

==================================================
PERFORMANCE
==================================================

Pool vegetation.

Reuse biological shaders.

Optimise procedural growth.

Stream ecosystem regions.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Planetary Health

Growth Rate

Spore Density

Wildlife Activity

Exploration %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Living Ecospheres Biome.

Every future living world, bioengineered civilisation and planetary ecosystem extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Living Ecosphere missions.

Review exploration.

Review environmental storytelling.

Review ecosystem interactions.

Review hazards.

Review event pacing.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-065.

Adjust ecosystem behaviour.

Adjust biological density.

Adjust exploration rewards.

Remove repetitive organic environments.

Ensure the Living Ecospheres become one of Afterlight's most immersive and believable alien environments, where every organism contributes to a living planetary superorganism while remaining readable, mechanically engaging and endlessly replayable.

Repeat until the Living Ecospheres Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-066.

---

## Foundation / AF-000–065 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058→065 content-module shape, applied to worlds that became single organisms — and the deliberate INVERSE of AF-064's stillness, asserted against all eight prior authored biomes.** Where the Reach is the quietest biome, the Ecosphere is the most ALIVE: the RICHEST event pool of any biome (seven defs, asserted strictly above every prior — a living planet is always doing something) and the FASTEST hazard tick of any biome (the Carnivorous Grove snapping at 600ms, asserted strictly below every prior biome's fastest — the terrain is hungry). The two biomes bracket the design space between them, and both bracket assertions live in tests.
- **Hazards emerge naturally from biology:** the statusless snapping Grove, a Toxic Spore field applying AF-021's poison (the planet's immune response), and Root Traps applying slow (the undergrowth grasping at engines). `hazardImmunities: ["poison", "slow"]` — the ecosystem does not eat its own.
- **"Everything serves the planetary organism" includes the loot table:** the highest `researchSample` weight of any authored biome (2.4, asserted strictly above every prior's — biology IS research, and "the biome rewards scientific curiosity" is a number). Mass Bloom leads the pool (asserted ≥ every other weight) through AF-036's `crystalBloom` — the same engine event AF-048's living crystal ecology already rides, deliberately shared: two living doctrines, one bloom vocabulary.
- **Enemy Presence follows the spec exactly:** the Bio-Engineered Hive primary as the FULL AF-051 roster (all six defs, asserted — this is their home, the Hive Sovereign's court already fights here), the Crystal Ascendancy as the other living doctrine (≥2), ENVIRONMENTAL WILDLIFE resolved as the same organisms — the fauna IS the faction, exactly as AF-064 resolved cryogenic wildlife — rare Void corruption, occasional Custodians. Every id resolution-tested across four rosters. `bossId: null` is honest — the five ecosphere boss kinds bind as `BossDef`s when authored.
- **A living world defending itself:** `threatModifier: 1.28` sits between the Forge (1.25) and the dying suns (1.3), asserted from both sides. Natives via AF-036's live `enemyBuff` hook (`shieldCapacity +11`, symbiotic carapace — the planet armours what belongs to it). A Symbiosis Chamber uses `triggerEvent` — provoke the planet and see what it answers with.
- **Verdance joins the galaxy additively:** a new `darkNebula` region def ("the nebula does not block the starlight — something inside it drinks the starlight") and system (threat 4, Xenomorph Hive dominant — the first system THEY hold — hidden past Prismheart: the living worlds cluster, two real travel hops, no Fast Travel gate) carrying `biomeId: "living-ecospheres"` through AF-058's registry — the ninth consumer of AF-038's field — with an ancient-bio-lab POI giving the `researchStations` kind its first authored use.
- **Lore lands through the biome itself:** the Verdance organic archive discovers `LORE_LIVING_ECOSPHERES_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-living-ecospheres` entry (cross-referencing the Hive AND AF-048's resonance doctrine — two living doctrines sharing one garden) with zero Missing Links. The entry carries the spec's deepest lore threads — ancient genetic engineering, the ethics of creating life, whether planets can become conscious — as open questions, not answers.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the enemy-presence structure (FULL Hive roster asserted, Ascendancy ≥2, Void, Ancients), all three real hazard ticks with the fastest-tick-of-any-biome assertion against all eight priors plus the poison/slow assertions, the MOST-ALIVE assertions (event pool strictly richest, researchSample strictly highest, bloom-led pool, threat bounded from both sides), real `GalaxyRuntime` travel through Prismheart to Verdance resolving the Ecosphere `biomeId`, `BiomeRuntime` integration (weather/events only from the Ecosphere's own pools across 4,000 steps), the organic-archive discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Ecosphere's hazards always fire ("the planet never sleeps", literally asserted). **Live in the browser:** travelled Lucent Gate → Prismheart → Verdance via two real travel buttons, launched, and the Ecosphere ran live — `biome Verdance · weather energyWinds (6s) · hazards 3` (Seed Winds blowing) and `galaxy Verdance (darkNebula)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the ninth biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; researchStations POI given its first use). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/LIVING_ECOSPHERES_BIOME.md`, `src/game/biomes/livingEcospheresBiome.ts`.
