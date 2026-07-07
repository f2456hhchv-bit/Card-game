# AF-054 — CELESTIAL CONCLAVE ENEMY FRAMEWORK

**Module status:** Complete (framework specified; constellation-graph engine implemented and tested; a live formation governs an AF-017 EnvironmentalEvent outcome end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-053 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CELESTIAL_CONCLAVE_FRAMEWORK.md` + implementation (`src/game/enemies/celestialData.ts`, `CelestialConstellation.ts`)

---

*(Module catalogued verbatim below.)*

54

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-053 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Celestial Conclave Enemy Framework.

The Celestial Conclave are not biological.

They are not machines.

They are conscious stellar-energy entities born from stars, quasars and ancient cosmic phenomena.

Some view younger civilisations as insignificant.

Others exist only to preserve the balance of the universe.

Every encounter should feel like fighting living astronomical phenomena rather than conventional enemies.

==================================================
CORE PHILOSOPHY
==================================================

Majestic.

Ancient.

Intelligent.

Cosmic.

Elegant.

Their power comes from manipulating the fundamental forces of the universe.

==================================================
FACTION IDENTITY
==================================================

Theme:

Living stars.

Solar consciousness.

Quantum plasma.

Cosmic intelligence.

Gravity manipulation.

Universal equilibrium.

Astronomical evolution.

Every entity is billions of years old.

==================================================
VISUAL LANGUAGE
==================================================

Solar plasma.

Golden-white energy.

Nebula clouds.

Orbiting particles.

Solar flares.

Gravitational lensing.

Constellation patterns.

Halo effects.

Movement appears graceful and effortless.

==================================================
CORE UNITS
==================================================

Support:

Solar Spark

Photon Warden

Stellar Sentinel

Nebula Weaver

Gravity Oracle

Pulsar Hunter

Corona Guardian

Quasar Shepherd

Nova Herald

Event Horizon Keeper

Constellation Avatar

Celestial Arbiter

Living Supernova

Future entities extend naturally.

==================================================
COMBAT STYLE
==================================================

The Celestial Conclave favours:

Orbital Movement

Gravity Control

Solar Radiation

Energy Waves

Long-range Precision

Celestial Summons

Constellation Patterns

Area Manipulation

Combat should feel elegant rather than aggressive.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Solar Flares

Gravity Wells

Photon Beams

Orbital Constructs

Plasma Storms

Constellation Networks

Light Bridges

Solar Winds

Magnetic Fields

Energy Collapse

Every mechanic reflects astrophysical phenomena.

==================================================
CELESTIAL NETWORK
==================================================

Nearby entities share:

Solar Energy

Shield Strength

Orbital Awareness

Healing

Constellation Links

Ability Synchronisation

Destroying anchor entities destabilises nearby formations.

==================================================
COSMIC MANIPULATION
==================================================

Celestial entities may:

Alter gravity

Redirect projectiles

Create orbital hazards

Generate miniature stars

Manipulate solar winds

Distort light

Create safe zones

Collapse unstable energy

Mechanics remain fully readable.

==================================================
ELITE VARIANTS
==================================================

Elite Celestials gain:

Rare Stellar Forms

Unique Constellations

Enhanced Solar Cores

Astronomical Abilities

Ancient Star Memory

Exceptional Rewards

Every Elite should resemble a unique cosmic phenomenon.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Nova Guardian

Pulsar Monarch

Quasar Intelligence

Solar Leviathan

Celestial Prime

Living Constellation

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Celestial entities interact with:

Stars

Nebulae

Black Holes

Solar Systems

Ancient Observatories

Galaxy Events

Energy Anomalies

Entire star systems become battlefields.

==================================================
LOOT
==================================================

Possible rewards:

Stellar Essence

Solar Cores

Photon Crystals

Gravity Shards

Celestial Blueprints

Astronomical Data

Legendary Relics

Starforged Materials

==================================================
CODEX
==================================================

Record:

Celestial Classes

Astronomical Origins

Known Constellations

Energy Biology

Universal History

Stellar Evolution

Observed Behaviour

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Solar hazard indicators

Gravity visuals

Reduced bloom mode

Photosensitivity mode

High Contrast

Colour-blind support

Clear celestial telegraphs

==================================================
PERFORMANCE
==================================================

Pool plasma effects.

Optimise gravity systems.

Reuse stellar shaders.

Pool orbital particles.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Solar Activity

Gravity State

Constellation Links

Energy Density

Orbital Systems

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Celestial Conclave Enemy Framework.

Every future stellar civilisation, cosmic entity, astronomical anomaly and celestial expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Celestial Conclave encounters.

Review gravity mechanics.

Review solar abilities.

Review constellation systems.

Review orbital combat.

Review Elite encounters.

Review rewards.

Review Codex progression.

Review battlefield readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-053.

Adjust gravity strength.

Adjust energy mechanics.

Adjust encounter pacing.

Remove repetitive celestial behaviours.

Ensure the Celestial Conclave feels ancient, intelligent and awe-inspiring, challenging players through mastery of cosmic forces while remaining fair, readable and deeply memorable.

Repeat until the Celestial Conclave Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-054.

---

## Foundation / AF-000–053 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Celestial unit is a plain AF-033 `EnemyDef` — zero schema changes, zero tenth enemy engine.** Six of the thirteen registered Core Unit kinds carry full sandbox defs (Solar Spark, Pulsar Hunter, Gravity Oracle, Constellation Avatar, Corona Guardian, Elite Living Supernova). Like AF-052/053, this module reuses already-used families — every fingerprint checked individually against the base roster and all eight prior factions. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Celestial Conclave", the first content to use the `orbital` `WeaponCategory`.
- **This is the fourth faction with zero prior lore investment, by design — matching AF-049/051/053's precedent exactly.** The Conclave are ancient cosmic consciousness — no government, no economy, no reputation — so this module adds no `FactionDef`. Its Codex entry (`codex-celestial-conclave`) cross-references AF-053's `codex-paragon-protocol` as another explicitly-non-civilisation threat, extending the same honest chain AF-051→AF-049 and AF-053→AF-051 already established.
- **The Constellation graph is the deliberate ninth doctrine — the first whose bonus is LOCAL rather than global.** Every prior doctrine computes ONE shared value or flag for the entire squad: AF-046's scatter timer, AF-047's per-service flags, AF-048's recomputed count, AF-049's decaying level, AF-050's escalating ladder, AF-051's monotonic ratchet, AF-052's earned economy, AF-053's threshold event. `CelestialConstellationRuntime` instead stores an explicit adjacency graph (an edge list, not a hub-and-spoke set) and computes `linkCountFor(droneId)` per entity — `damageBonusFor`, `incomingDamageReductionFor`, and `healPerSecondFor` all read from that per-entity number. Two members of the same formation can carry different bonus magnitudes simultaneously, verified explicitly in `tests/celestial.test.ts` (`damageBonusFor("hub")` > `damageBonusFor("oracle")` at the same instant) — a genuinely new shape none of the eight prior doctrines could produce with their single shared number.
- **"Destroying anchor entities destabilises nearby formations" needed zero special-cased logic.** The Constellation Avatar is simply wired as the graph's highest-degree point at spawn time (linked to every other member) — an "anchor" by construction, not a flag. Its death removes edges from every neighbour at once, and each neighbour's `linkCountFor` recomputes down accordingly on the very next read — no bespoke "anchor destroyed" branch was needed in the runtime at all, only in `notifyDroneDestroyed`'s uniform edge-removal. Verified live and unusually vividly: in the browser pass, the Avatar died to real combat before the first debug-overlay read, and its former neighbours' link counts matched the graph model exactly — 0 for pure spokes, 1 for the two units sharing the sandbox's one extra edge.
- **The fairness discipline continues, applied to a per-entity number instead of a single global one.** `CONSTELLATION_TUNING.maxContributingLinks` caps how many surviving links can ever contribute to any one entity's bonus, verified at a ten-node, fully-connected test graph in `tests/celestial.test.ts` — density beyond the cap simply stops mattering, the same "adapts without becoming unfair" discipline every prior doctrine's cap enforced.
- **Gravity Wells are AF-035's hazard-zone engine's sixth reuse**, following AF-046's mines, AF-048's Crystal Growth, AF-049's Corruption Zones, AF-051's Acid Pools, and AF-053's Singularity Charges — seeded on the Gravity Oracle's own cadence through the unchanged `stepHazardZone`/`isInsideHazard` functions.
- **The Director gained zero new claims, continuing AF-049/050/053's zero-footprint precedent a fourth time.** Formations enter through a new listener on AF-017's existing `EnvironmentalEventTriggered`/`SolarFlare` fact — a perfect thematic fit needing no invention. `EnemyDirector.ts`/`directorTuning.ts` remain byte-for-byte unmodified, and `SwarmWave` remains the only fully unclaimed `WaveType` for any future faction.
- **AF-021's dormant `shieldBreak` status gains its first producer**, via the Pulsar Hunter's Pulsar Beam — a beam that strips shielding rather than dealing conventional damage, exactly matching "Long-range Precision".
- **Self-review executed:** 17 new tests — vocabulary registration, AF-033-vocabulary conformance, the nine-faction no-overlap law, readable-telegraph floors, the `shieldBreak` first-producer assertion, the Elite pipeline for the Living Supernova, the full constellation lifecycle (per-entity link counts from a fixed graph pattern, differing bonus magnitudes for different members at the same instant, the anchor-death cascade costing every neighbour a link at once, a leaf-death only affecting its direct neighbour, the fairness cap at a ten-node dense graph, healing/shield-reduction scaling per-entity the same way), Gravity Wells against the real `stepHazardZone`, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which every remaining member's link count stays within `[0, maxContributingLinks]` regardless of kill order. Live in the browser: a formation's Constellation Avatar died to real combat within the first observation window, and its former neighbours' link counts visibly dropped to exactly what the graph predicts — a real cascade, not a scripted one — zero page errors throughout.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes — the fourth faction to use the zero-footprint `EnvironmentalEventTriggered` route, zero new loot/elite systems, and the fourth deliberate non-extension of AF-039's faction-profile system, justified the same way AF-049/051/053 were). `CelestialConstellationRuntime` is the only genuinely new mechanical surface, and per-entity bonuses computed from a graph's local structure are meaningfully distinct from every prior doctrine's single-shared-number shape. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CELESTIAL_CONCLAVE_FRAMEWORK.md`, `src/game/enemies/celestialData.ts` + `CelestialConstellation.ts`.
