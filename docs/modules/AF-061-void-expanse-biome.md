# AF-061 — VOID EXPANSE BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-060 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/VOID_EXPANSE_BIOME.md` + implementation (`src/game/biomes/voidExpanseBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

61

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-060 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Void Expanse Biome.

The Void Expanse is not empty space.

It is a region where reality has begun to collapse.

The laws of physics become unstable.

Time.

Gravity.

Light.

Space.

All behave unpredictably.

Players should feel like they are exploring the edge of existence itself.

The Void must be mysterious rather than horrifying.

Beautiful rather than grotesque.

==================================================
CORE PHILOSOPHY
==================================================

Mystery.

Isolation.

Wonder.

Instability.

Ancient secrets.

Every journey into the Void should feel like entering somewhere no civilisation was ever meant to survive.

==================================================
BIOME IDENTITY
==================================================

Theme:

Collapsed star systems.

Reality fractures.

Black holes.

Dark nebulae.

Gravitational anomalies.

Impossible geometry.

Silent galaxies.

Dimensional scars.

Every environment feels physically impossible.

==================================================
VISUAL LANGUAGE
==================================================

Deep blacks.

Violet energy.

Gravitational lensing.

Floating debris.

Reality fractures.

Warped starlight.

Impossible horizons.

Dark plasma.

Movement itself should appear distorted.

==================================================
ENVIRONMENT
==================================================

Support:

Collapsed Stars

Reality Tears

Gravitational Fields

Dark Nebulae

Black Hole Systems

Void Temples

Dimensional Bridges

Collapsed Civilisations

Silent Planets

Singularity Wells

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Void Storms

Reality Pulses

Gravitational Waves

Dark Matter Clouds

Temporal Echoes

Spatial Distortion

Quantum Rain

Weather reinforces instability.

Never compromises readability.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Gravity Wells

Reality Tears

Temporal Fields

Void Zones

Dark Energy Bursts

Moving Singularities

Collapsing Space

Phase Hazards

Hazards require intelligent positioning.

==================================================
MISSION TYPES
==================================================

Support:

Seal Reality Breaches

Investigate Anomalies

Recover Lost Expeditions

Destroy Void Beacons

Rescue Survivors

Study Singularities

Retrieve Ancient Technology

Stabilise Reality

The biome emphasises discovery and survival.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Void Swarm

The Eclipsed

Ancient Custodians

Rare Celestial Entities

Occasional Machine Expeditions

The Void dominates every encounter.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Void Matter

Reality Fragments

Singularity Cores

Dark Plasma

Ancient Relics

Quantum Dust

Dimensional Samples

Legendary Research Materials

Resources support endgame progression.

==================================================
POINTS OF INTEREST
==================================================

Support:

Reality Anchors

Collapsed Gateways

Void Archives

Ancient Monoliths

Singularity Chambers

Dimensional Bridges

Lost Fleets

Quantum Beacons

Exploration rewards courage.

==================================================
BIOME EVENTS
==================================================

Support:

Reality Collapse

Void Expansion

Temporal Echo

Dark Energy Surge

Black Hole Awakening

Dimensional Convergence

Ancient Signal

Gravitational Cascade

Events transform the battlefield.

==================================================
EXPLORATION
==================================================

Players may discover:

Lost Civilisations

Ancient Warnings

Prototype Research

Impossible Structures

Reality Archives

Legendary Relics

Unknown Species

Hidden Gateways

Every discovery raises new questions.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Reality Devourer

Void Leviathan

Singularity Monarch

Ancient Rift Guardian

Dimensional Intelligence

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Void Expanse teaches:

The origin of the Void.

The first Collapse.

Ancient precursor failures.

Reality manipulation.

The limits of science.

The greatest mystery in the Afterlight universe.

The player should realise the galaxy is far older and stranger than previously imagined.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced distortion mode

Reduced gravity effects

Hazard indicators

High Contrast

Colour-blind support

Photosensitivity mode

Readable anomaly markers

==================================================
PERFORMANCE
==================================================

Pool distortion effects.

Optimise gravity calculations.

Reuse anomaly shaders.

Stream environmental changes.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Reality Stability

Gravity Strength

Void Activity

Hazard Density

Exploration %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Void Expanse Biome.

Every future anomaly, singularity, reality fracture and cosmic mystery extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Void Expanse missions.

Review exploration.

Review environmental storytelling.

Review anomaly mechanics.

Review hazards.

Review events.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-060.

Adjust anomaly frequency.

Adjust hazard balance.

Adjust exploration rewards.

Remove repetitive environmental layouts.

Ensure the Void Expanse becomes one of the most memorable locations in Afterlight by combining awe, mystery and strategic gameplay without sacrificing readability or fairness.

Repeat until the Void Expanse Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-061.

---

## Foundation / AF-000–060 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058/059/060 content-module shape, applied to the edge of existence.** `VOID_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: THREE AF-035 hazard zones expressing "the laws of physics become unstable" through engines the game already owns — a statusless heavy Gravity Well (positioning is the counterplay), a Reality Tear leaking AF-021's corruption status (AF-049's signature, the Void's own doctrine), and a Temporal Field applying AF-052's stasis root (time misbehaving as stolen seconds). Three weathers with real AF-020 forces (Void Storms, visibility-reducing Dark Matter Clouds, Gravitational Waves with the strongest wind of any authored biome), four weighted events led by `voidBreach`, and AF-023 smart-loot weights biased toward endgame progression (researchSample/relic/ancientArtifact highest of any biome). Both vocabulary mappings (7 weather names, 8 event names) are total onto the locked shelves.
- **"Mysterious rather than horrifying" is tone; "the edge of existence" is numbers:** `threatModifier: 1.35` — the deepest authored biome, asserted strictly above AF-060's 1.25 — natives hardened through AF-036's live `enemyBuff` hook (`shieldCapacity +14`, reality bends around them), and `hazardImmunities: ["corruption"]` — the Void does not corrupt what is already its own. All asserted, not intended.
- **Enemy Presence follows the spec exactly:** the full six-def AF-049 Void Swarm roster primary (the Void dominates every encounter), three Eclipsed (lost scout, broken pilot, memory warden — they drift where their fleets fell), two Ancient Custodians (still guarding something at the centre), one rare Celestial (solar spark), one occasional Machine expedition (sniper unit). Every id resolution-tested across five rosters. `bossId: null` is honest — the five void boss kinds (Rift Guardian and the Void Avatar already AF-049 roster vocabulary) bind as `BossDef`s when authored.
- **Hollow Crown joins the galaxy additively:** a new `voidExpanse` region and system (threat 5 — the highest in the galaxy — Void Swarm dominant, reached past even Forge Primus: three real travel hops, no Fast Travel gate) carrying `biomeId: "void-expanse"` through AF-058's registry — the fourth consumer of AF-038's field — with an ancient-monolith POI (`unknownSignals` kind) discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the Hollow Crown void archive discovers `LORE_VOID_EXPANSE_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-void-expanse` entry (cross-referencing AF-049's corruption doctrine AND the Eclipsed — the Void, what it does, and what it leaves behind taught as one chain) with zero Missing Links. A Reality Anchor uses the `triggerEvent` interaction kind ("Stabilise Reality" made literal) and a Hidden Gateway gives the `unlockSecret` interaction kind its FIRST producer since AF-036 registered it — "Hidden Gateways" from §Exploration, playable.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the five-faction enemy-presence structure (≥6 Void primary + all four guest presences), all three real hazard ticks including the corruption and stasis status assertions, the edge-of-existence assertions (corruption immunity, live buff hook, threat strictly above AF-060's), real `GalaxyRuntime` travel through Hollow Drift and Forge Primus to Hollow Crown resolving the Expanse `biomeId` at threat 5, `BiomeRuntime` integration (weather/events only from the Void's own pools across 4,000 steps), the void-archive discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Void's hazards always fire ("reality never stops collapsing", literally asserted). **Live in the browser:** travelled Lucent Gate → Hollow Drift → Forge Primus → Hollow Crown via three real travel buttons, launched, and the Void ran live — `biome Hollow Crown · weather voidLightning (7s) · hazards 3` and `galaxy Hollow Crown (voidExpanse)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the fourth biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; one dormant interaction kind given its first producer). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/VOID_EXPANSE_BIOME.md`, `src/game/biomes/voidExpanseBiome.ts`.
