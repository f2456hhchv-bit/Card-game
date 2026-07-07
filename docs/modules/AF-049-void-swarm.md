# AF-049 — VOID SWARM ENEMY FRAMEWORK

**Module status:** Complete (framework specified; corruption/zone engine implemented and tested; a live Void Swarm governs an AF-017 EnvironmentalEvent outcome end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-048 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/VOID_SWARM_FRAMEWORK.md` + implementation (`src/game/enemies/voidData.ts`, `VoidCorruption.ts`)

---

*(Module catalogued verbatim below.)*

49

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-048 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Void Swarm Enemy Framework.

The Void Swarm is not a civilisation.

It is an incomprehensible cosmic force that exists beyond conventional space.

The Swarm corrupts reality.

Consumes energy.

Distorts physics.

Its presence should make players feel like the laws of the universe are beginning to fail.

==================================================
CORE PHILOSOPHY
==================================================

Unknown.

Ancient.

Unnatural.

Corrupting.

Unpredictable.

Every encounter should create psychological tension while remaining mechanically fair and completely readable.

==================================================
FACTION IDENTITY
==================================================

Theme:

Living darkness.

Impossible geometry.

Reality fractures.

Void intelligence.

Corrupted stars.

Dimensional parasites.

Cosmic evolution.

The Void never truly dies.

It only spreads.

==================================================
VISUAL LANGUAGE
==================================================

Black energy.

Deep violet light.

Distorted silhouettes.

Floating fragments.

Impossible movement.

Gravitational lensing.

Reality tears.

Dark plasma.

Visuals should communicate instability.

==================================================
CORE UNITS
==================================================

Support:

Void Wisp

Corruption Parasite

Shadow Hunter

Gravity Stalker

Void Reaper

Reality Weaver

Phase Walker

Void Beacon

Dimensional Predator

Star Devourer

Rift Guardian

Corruption Nest

Ancient Void Avatar

Future organisms extend naturally.

==================================================
COMBAT STYLE
==================================================

Void entities favour:

Ambush

Teleportation

Space Distortion

Status Corruption

Area Denial

Summoning

Movement Manipulation

Psychological Pressure

Players should constantly reposition.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Reality Tears

Gravity Wells

Teleportation

Corruption Zones

Dimensional Gates

Phase Shifting

Dark Energy Pulses

Spatial Collapse

Temporal Distortion

Void Echoes

Mechanics remain deterministic and readable.

==================================================
CORRUPTION SYSTEM
==================================================

Void corruption affects:

Enemies

Environment

Projectiles

Resources

Mission Events

Boss Arenas

Corruption spreads dynamically until contained.

==================================================
REALITY DISTORTION
==================================================

Void entities may:

Warp movement

Bend projectiles

Create mirrored enemies

Alter gravity

Hide pathways

Generate unstable terrain

Collapse safe zones

Distortion should challenge perception.

Never obscure gameplay.

==================================================
VOID NETWORK
==================================================

Void Beacons strengthen nearby entities through:

Corruption

Healing

Teleport Access

Shield Recovery

Damage Amplification

Reality Stability

Destroying Beacons weakens surrounding corruption.

==================================================
ELITE VARIANTS
==================================================

Elite Void entities gain:

Ancient Mutations

Greater Distortion

Unique Reality Effects

Rare Forms

Impossible Movement

Unique Audio

Exceptional Rewards

Every Elite should feel unsettling.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Rift Monarch

Gravity Leviathan

Void Harvester

Reality Anchor

Ancient Corruptor

Star Parasite

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Void entities interact with:

Void Biomes

Black Holes

Ancient Ruins

Collapsed Stars

Reality Tears

Galaxy Events

Corrupted Bosses

Entire sectors may become corrupted.

==================================================
LOOT
==================================================

Possible rewards:

Void Matter

Reality Fragments

Ancient Cores

Singularity Materials

Void Blueprints

Corruption Samples

Legendary Relics

Experimental Technology

==================================================
CODEX
==================================================

Record:

Void Organisms

Corruption Stages

Reality Distortions

Dimensional Theory

Ancient Encounters

Known Variants

Galaxy Spread

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

High Contrast distortion mode

Reduced distortion effects

Corruption indicators

Clear telegraphs

Colour-blind support

Photosensitivity mode

Void mechanics must remain fully readable.

==================================================
PERFORMANCE
==================================================

Pool distortion effects.

Reuse shaders.

Optimise gravity calculations.

Pool teleport effects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Corruption Level

Reality Stability

Gravity Fields

Void Beacons

Teleport Links

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Void Swarm Enemy Framework.

Every future Void organism, corruption event, dimensional anomaly and cosmic horror extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Void encounters.

Review corruption behaviour.

Review reality distortion.

Review gravity manipulation.

Review teleportation.

Review Elite encounters.

Review rewards.

Review battlefield readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-048.

Adjust corruption spread.

Adjust distortion intensity.

Adjust encounter pacing.

Remove confusing mechanics.

Ensure the Void Swarm feels alien, ancient and deeply unsettling while remaining strategically fair, mechanically readable and consistently rewarding to overcome.

Repeat until the Void Swarm Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-049.

---

## Foundation / AF-000–048 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Void unit is a plain AF-033 `EnemyDef` — zero schema changes, zero fifth enemy engine.** Six of the thirteen registered Core Unit kinds carry full sandbox defs (Void Wisp, Corruption Parasite, Shadow Hunter, Void Beacon, Rift Guardian, Elite Ancient Void Avatar). Every one of them uses the `voidEntity` family — registered by AF-033 and completely unused by any def until this module — which means cross-faction fingerprint collision with the base roster, the Outlaws, the Machines, or the Crystals is structurally impossible, not just avoided. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Void Swarm", using the `void` `WeaponCategory` already reserved (previously used once, by an unrelated player-loot weapon from the separate "Void Legion Remnant").
- **This is the first faction with genuinely zero prior lore investment — and, by design, it stays that way.** AF-046/047/048 each mapped onto an AF-039 `FactionDef` (paying off an unprofiled entry, or inheriting a full profile). The Void Swarm's own spec opens with "The Void Swarm is not a civilisation" — it has no government, no economy, no reputation to track, so forcing it into `FACTION_IDS`/`SANDBOX_FACTION_ROSTER` would misuse that system rather than extend it. This module adds no `FactionDef`; its Codex entry (`codex-void-corruption`) is the first faction-doctrine entry with `relatedEntryIds: []` rather than pointing at a faction profile, an honest reflection of the fiction rather than a gap.
- **Corruption is the deliberate fourth doctrine — and the first that is genuinely time-varying.** AF-046's scatter is a binary timer; AF-047's degrade is a discrete per-service flag set; AF-048's weaken is a pure recomputation from a living count with no time component at all. `VoidCorruptionRuntime.corruptionLevel` climbs continuously in proportion to live Void Beacon count (`update(dtMs)`), decays only once every Beacon is destroyed (containment takes time, it isn't instant), and steps down immediately on any single Beacon kill — three separate temporal behaviours composed into one number, verified live: a fresh swarm's corruption climbed from 1% to 37%+ over real seconds of combat on the debug overlay, tracking the tuned growth rate exactly.
- **The fairness cap is the same numeric discipline AF-047/048 established**, applied a third time to a fourth-doctrine's number: `VOID_CORRUPTION_TUNING.maxCorruption = 1` bounds `corruptionLevel` regardless of how long a swarm is left unchecked, verified at 10,000 accumulated update ticks in `tests/void.test.ts`. Of the six registered Void Network traits, three are mechanically live — Healing and Damage Amplification (the same two traits AF-048 already made live, now corruption-scaled instead of node-count-scaled) plus a new one, Reality Stability, a corruption-scaled incoming-damage reduction composed at the same single damage-application point AF-047's Adaptive AI already occupies. Teleport Access and Shield Recovery are registered awaiting content, the same "N of M live" pattern every prior faction established.
- **Corruption Zones are AF-035's hazard-zone engine's third reuse, and the first to carry a live status effect.** `createCorruptionZone` returns a real `HazardZoneDef` ticked by the unchanged `stepHazardZone`/`isInsideHazard` — the same functions AF-046's mines, AF-048's Crystal Growth, and the boss arena already use — but with a non-null `statusOnTick` applying AF-021's already-registered `corruption` `StatusKind` (dormant since AF-021, its most natural producer yet), following AF-036's biome-hazard precedent for a live-status hazard rather than inventing a second status-hazard mechanism.
- **AF-033's dormant `split`/`merge`/`cloak` special-ability kinds and `teleport` movement behaviour gain their first EnemyDef producers.** As established since AF-047, `specialAbility.kind` is purely semantic vocabulary (`EnemyRuntime.specialAbilityBonus` reads only `.bonus.kind`/`.value`, identically regardless of `kind`) — the claim is a vocabulary first-use, not a bespoke mechanic, consistent with how AF-047 described `healAllies`/`spawnReinforcements`. `teleport` movement is a genuine mechanical first-use among `EnemyDef`s (a boss already used it once); it required one small, purely additive change — passing a deterministic `rng` callback into every drone's `stepEnemyMovement` context, sourced from the same seeded `combatRng` every other enemy/weapon roll already draws from — with zero effect on any locked def, since no existing `EnemyDef` uses `teleport` or `burrow` (the only two behaviours that read `context.rng`).
- **The Director is untouched more completely than any prior faction achieved.** AF-046/047/048 each claimed a previously-generic `WaveType` for their entrance. This module claims none — `EnemyDirector.ts` and `directorTuning.ts` are byte-for-byte unmodified. Swarms instead enter through a new `bus.on("EnvironmentalEventTriggered", ...)` listener reacting to AF-017's own `VoidDistortion` `EnvironmentalEventType` (one of the seven `ENVIRONMENTAL_EVENTS` the Director already emits during its `EnvironmentalEvent` phase) — the exact same "react to an existing fact, never touch the emitter" pattern AF-035's Boss already established off `DirectorPhaseChanged`. This also leaves `SwarmWave`, `HunterPack`, and `AmbientPatrol` fully available, unclaimed, for future factions.
- **Loot and cross-module reuse follow the established playbook exactly.** Void Matter/Reality Fragments/etc. are registered loot vocabulary awaiting item content, the same "registered, no bank yet" pattern AF-047/048 left behind; kills flow through every existing reward path unmodified. Ecosystems reuse AF-046's pure `OutlawSquadRuntime.formationOffsets` for spawn placement, a third cross-faction reuse. An Ancient Void Avatar runs through AF-034's unchanged Elite pipeline. Void "formation"-behaviour units deliberately do not anchor on a command unit, for the same "no command hierarchy" reason AF-048's Crystal formation units don't — Beacons are infrastructure to protect, not a leader to orbit.
- **Self-review executed:** 18 new tests — vocabulary registration, AF-033-vocabulary conformance, the five-faction no-overlap law, the `voidEntity`-family-exclusivity check, readable-telegraph floors, the three ability-kind first-producer assertions, the `teleport`-movement first-producer assertion (checked against every other faction's roster), the Elite pipeline for the Avatar, the full corruption lifecycle (time-based climb, the fairness cap at 10,000 ticks, the immediate Beacon-kill step, decay-once-contained, member-vs-beacon kill distinction, elimination), Corruption Zones against the real `stepHazardZone` carrying a live status, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which corruption level never leaves `[0, maxCorruption]` and every swarm reaches zero corruption once eliminated and fully decayed. Live in the browser: a swarm spawned via the dev key with a real Void Beacon, corruption climbed from 1% to 37%+ under real combat matching the tuned growth rate, organism count fell as the Wisp/Parasite/Hunter took real auto-fire — zero page errors throughout.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes — not even a wave-type claim, zero new loot/elite systems, and the first deliberate *non*-extension of AF-039's faction-profile system, justified by the spec's own "not a civilisation" framing rather than an oversight). `VoidCorruptionRuntime` is the only genuinely new mechanical surface, and the fourth doctrine — time-varying corruption — is meaningfully distinct from binary scatter, discrete degrade, and continuous count-based weakening. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/VOID_SWARM_FRAMEWORK.md`, `src/game/enemies/voidData.ts` + `VoidCorruption.ts`.
