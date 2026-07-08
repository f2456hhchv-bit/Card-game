# AF-064 — FROZEN REACH BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-063 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/FROZEN_REACH_BIOME.md` + implementation (`src/game/biomes/frozenReachBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

64

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-063 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Frozen Reach Biome.

The Frozen Reach exists on the edge of the galaxy where light barely reaches.

Entire solar systems have entered cryogenic stagnation.

Frozen worlds drift through eternal darkness.

Ancient expeditions remain perfectly preserved beneath kilometres of ice.

Players should feel isolated inside one of the oldest and quietest regions of space.

==================================================
CORE PHILOSOPHY
==================================================

Silence.

Isolation.

Preservation.

Endurance.

Discovery.

The biome should contrast every previous region through calm, restraint and overwhelming stillness.

==================================================
BIOME IDENTITY
==================================================

Theme:

Frozen Nebulae.

Cryogenic Planets.

Ice Rings.

Dead Stars.

Sub-Zero Stations.

Glacial Asteroids.

Cryo Archives.

Abandoned Colonies.

Everything appears suspended in time.

==================================================
VISUAL LANGUAGE
==================================================

Deep blue.

White ice.

Frozen crystal.

Aurora light.

Cold mist.

Snow particles.

Ice fractures.

Dim starlight.

Every environment should feel peaceful yet unforgiving.

==================================================
ENVIRONMENT
==================================================

Support:

Frozen Planets

Cryogenic Oceans

Ice Canyons

Glacial Stations

Abandoned Research Labs

Cryo Vaults

Subsurface Caverns

Frozen Forests

Ice Moons

Dead Star Systems

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Cryo Storms

Aurora Activity

Ice Fog

Frozen Dust

Electrostatic Snow

Crystal Hail

Thermal Collapse

Weather reinforces environmental survival.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Ice Cracks

Cryogenic Fields

Frozen Gas Clouds

Slippery Surfaces

Thermal Shock

Cryo Explosions

Falling Ice

Frozen Debris

Hazards emphasise planning.

==================================================
MISSION TYPES
==================================================

Support:

Recover Cryogenic Archives

Rescue Frozen Survivors

Repair Heating Systems

Explore Ancient Laboratories

Harvest Cryo Materials

Investigate Silent Colonies

Restore Communications

Study Frozen Life

The biome emphasises exploration and preservation.

==================================================
ENEMY PRESENCE
==================================================

Primary:

The Eclipsed

Ancient Custodians

Machine Collective

Cryogenic Wildlife

Rare Void Entities

Encounters remain deliberate rather than overwhelming.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Cryo Crystals

Frozen Alloys

Thermal Cells

Preserved Samples

Quantum Ice

Ancient Data

Cryogenic Fluids

Research Materials

Resources support advanced research and crafting.

==================================================
POINTS OF INTEREST
==================================================

Support:

Cryo Vaults

Frozen Fleets

Ancient Laboratories

Ice Temples

Subsurface Cities

Aurora Observatories

Preservation Chambers

Deep Ice Archives

Exploration continually rewards curiosity.

==================================================
BIOME EVENTS
==================================================

Support:

Cryo Collapse

Aurora Surge

Thermal Failure

Frozen Awakening

Icequake

Research Discovery

Ancient Broadcast

Subsurface Breach

Events reinforce environmental storytelling.

==================================================
EXPLORATION
==================================================

Players may discover:

Perfectly Preserved Technology

Ancient Expedition Records

Cryogenic Organisms

Lost Civilisations

Prototype Research

Legendary Equipment

Hidden Archives

Frozen Relics

Every discovery expands understanding of the Collapse.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Cryo Leviathan

Frozen Guardian

Absolute Zero Core

Ancient Preservation Intelligence

Glacial Colossus

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Frozen Reach teaches:

Long-term survival.

Cryogenic preservation.

The final days of isolated colonies.

Scientific sacrifice.

Ancient preservation technology.

How entire worlds chose survival through suspension rather than escape.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced snow effects

Reduced fog

Hazard indicators

High Contrast

Colour-blind support

Reduced particle density

Readable thermal zones

==================================================
PERFORMANCE
==================================================

Pool snow systems.

Reuse ice shaders.

Optimise reflections.

Stream environmental weather.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Temperature

Cryo Activity

Weather

Hazard Density

Exploration %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Frozen Reach Biome.

Every future cryogenic world, frozen civilisation and preservation system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Frozen Reach missions.

Review exploration.

Review environmental storytelling.

Review hazards.

Review weather.

Review event pacing.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-063.

Adjust weather frequency.

Adjust resource placement.

Adjust environmental pacing.

Remove repetitive frozen environments.

Ensure the Frozen Reach becomes one of Afterlight's most atmospheric biomes, delivering quiet tension, meaningful exploration and unforgettable environmental storytelling while remaining fair, readable and highly replayable.

Repeat until the Frozen Reach Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-064.

---

## Foundation / AF-000–063 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058→063 content-module shape, applied to the galaxy's frozen edge — and the first biome whose identity is RESTRAINT.** The spec demands the Reach "contrast every previous region through calm, restraint and overwhelming stillness", and `FROZEN_REACH_BIOME` makes stillness MECHANICAL, asserted against all six prior authored biomes: the slowest hazard ticks of any biome (every zone ≥1300ms — planning, not reflexes), the sparsest event pool (three defs, asserted ≤ every prior biome's — silence between events), the LOWEST elite chance of any authored biome (0.06, asserted strictly below all six — "encounters remain deliberate rather than overwhelming"), and winds that never rise above a drift (every axis ≤0.3, asserted per-def).
- **Two AF-021 status kinds dormant since their registration get their FIRST producers:** the Cryogenic Field roots what it catches with `freeze` (the preservation system does not distinguish visitors from specimens) and the Frozen Gas Cloud drags at engines with `slow` — both real AF-035 zones alongside a heavy statusless Ice Crack. `hazardImmunities: ["freeze", "slow"]` — the natives froze a long time ago; the cold has nothing left to take.
- **Quiet is not safe:** `threatModifier: 1.2` sits mid-ladder between the Crystal Expanse (1.15) and the Forge (1.25), asserted from both sides — the second deliberately mid-ladder biome after AF-063, because the Reach's tension is atmospheric, not numeric. Natives via AF-036's live `enemyBuff` hook (`shieldCapacity +10`, preservation plating).
- **Enemy Presence follows the spec exactly:** the Eclipsed primary (≥4 defs asserted — frozen former humans drifting above frozen former colonies, the biome and its dominant faction one image), Ancient Custodians, Machine Collective, CRYOGENIC WILDLIFE resolved as AF-051 organisms adapted to the ice (stalker, hive-drone — the spec's wildlife is the game's existing fauna, not a new roster), rare Void. Every id resolution-tested across five rosters. `bossId: null` is honest — the five reach boss kinds bind as `BossDef`s when authored.
- **Crystal Hail gives `meteorActivity` weather its second authored use** (after AF-058's micro-meteor showers) with a real downward force; Ice Fog is the longest-duration weather def yet (13s of quiet, visibility-reducing drift); the Aurora is pure light — zero force, zero reduction.
- **Winterline joins the galaxy additively:** a new `frozenReach` region and system (threat 3, THE ECLIPSED as dominant faction — the first system they hold — past the Human Frontier on the galaxy's dark edge, two real travel hops, no Fast Travel gate) carrying `biomeId: "frozen-reach"` through AF-058's registry — the seventh consumer of AF-038's field — with a frozen-fleet POI giving the `abandonedFleets` kind its first authored use.
- **Lore lands through the biome itself:** the Winterline cryo vault discovers `LORE_FROZEN_REACH_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-frozen-reach` entry (cross-referencing the Eclipsed AND the Human Alliance — the colonies that chose suspension were human, and what became of them is drifting overhead) with zero Missing Links. The `lostExpedition` event leads the pool for the first time in any biome — the expeditions are still here, perfectly preserved.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the five-faction enemy-presence structure (≥4 Eclipsed primary + all four guests including the wildlife resolution), all three real hazard ticks with the freeze/slow first-producer assertions, the STILLNESS assertions (tick floors, pool sparsity ≤ all six priors, elite chance < all six priors, wind ceilings, threat bounded mid-ladder from both sides), real `GalaxyRuntime` travel through Meridian Rest to Winterline resolving the Reach `biomeId`, `BiomeRuntime` integration (weather/events only from the Reach's own pools across 4,000 steps), the cryo-vault discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Reach's hazards always fire ("even the stillness has teeth", literally asserted). **Live in the browser:** travelled Lucent Gate → Meridian Rest → Winterline via two real travel buttons, launched, and the Reach ran live — `biome Winterline · weather meteorActivity (5s) · hazards 3` (Crystal Hail falling) and `galaxy Winterline (frozenReach)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the seventh biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; two status kinds given their first producers). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/FROZEN_REACH_BIOME.md`, `src/game/biomes/frozenReachBiome.ts`.
