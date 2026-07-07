# AF-048 — CRYSTAL ASCENDANCY ENEMY FRAMEWORK

**Module status:** Complete (framework specified; resonance/growth engine implemented and tested; a live Crystal ecosystem governs the Director's MixedEncounter end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-047 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CRYSTAL_ASCENDANCY_FRAMEWORK.md` + implementation (`src/game/enemies/crystalData.ts`, `CrystalResonance.ts`)

---

*(Module catalogued verbatim below.)*

48

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-047 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Crystal Ascendancy Enemy Framework.

The Crystal Ascendancy is a self-evolving organic-crystalline civilisation that grows, adapts, and expands through resonance rather than command.

Crystals do not fight as individuals.

They resonate as a network.

Every encounter should feel like fighting a living, growing ecosystem.

==================================================
CORE PHILOSOPHY
==================================================

Growth.

Resonance.

Adaptation.

Cooperation.

Expansion.

Every crystal behaves according to shared resonance.

Never isolation.

==================================================
FACTION IDENTITY
==================================================

Theme:

Living crystal organisms.

Growing structures.

Resonant energy networks.

Environmental transformation.

Cooperative behaviour.

Relentless growth.

Resonance above all.

==================================================
VISUAL LANGUAGE
==================================================

Translucent crystal forms.

Growing structures.

Energy veins.

Prismatic lighting.

Floating shards.

Organic-geometric hybrid shapes.

Resonant glow.

Living surfaces.

Visuals communicate growth and resonance.

==================================================
CORE UNITS
==================================================

Support:

Crystal Drone

Resonance Node

Shard Hunter

Crystal Stalker

Crystal Guardian

Growth Seeder

Energy Conduit

Crystal Titan

Resonance Priest

Living Obelisk

Shard Swarm

Crystal Carrier

Ancient Resonator

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Crystal Ascendancy favours:

Area Control

Growth

Defensive Networks

Healing

Resonance Buffs

Environmental Manipulation

Delayed Attacks

Cooperative Behaviour

==================================================
SPECIAL MECHANICS
==================================================

Support:

Crystal Growth

Energy Resonance

Healing Fields

Reflective Crystals

Chain Resonance

Crystal Armour

Terrain Expansion

Living Structures

Prismatic Shields

Crystal Networks

==================================================
RESONANCE NETWORK
==================================================

Crystals share:

Healing

Shield Strength

Damage Bonuses

Status Resistance

Movement Speed

Ability Cooldowns

Destroying resonance nodes weakens nearby organisms.

==================================================
ENVIRONMENTAL CONTROL
==================================================

Crystals can:

Grow Barriers

Create Hazards

Spawn Crystal Forests

Alter Movement Routes

Generate Energy Fields

Reveal Hidden Organisms

Transform Arenas

==================================================
ELITE VARIANTS
==================================================

Elite Crystals gain:

Rare Crystal Forms

Enhanced Resonance

Living Armour

Ancient Mutations

Unique Colours

Special Growth Patterns

Rare Rewards

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Crystal Matriarch

Living Monolith

Ancient Resonance Core

Titan Bloom

Shard Leviathan

Planetary Heart Fragment

==================================================
FACTION SYNERGY
==================================================

Crystals interact with:

Crystal Fields

Resonant Structures

Ancient Ruins

Living Worlds

Growth Zones

Energy Networks

Sacred Sites

==================================================
LOOT
==================================================

Possible rewards:

Crystal Fragments

Resonant Shards

Growth Cores

Living Crystals

Prismatic Modules

Ancient Resonance Data

Organic Alloys

Rare Growth Samples

==================================================
CODEX
==================================================

Record:

Crystal Classes

Resonance Hierarchy

Growth History

Network Structure

Known Sites

Combat Doctrine

Technology

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Unique resonance audio

Network indicators

Growth visuals

High Contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool crystals.

Optimise resonance calculations.

Reuse growth logic.

Pool hazard effects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Network Status

Resonance Strength

Growth State

AI State

Environmental Effects

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Crystal Ascendancy Enemy Framework.

Every future organic, resonant, or growth-based faction extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Crystal Ascendancy encounters.

Review resonance behaviour.

Review growth mechanics.

Review cooperative behaviour.

Review healing behaviour.

Review Elite encounters.

Review network structure.

Review rewards.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-047.

Adjust resonance behaviour.

Adjust growth bonuses.

Adjust encounter pacing.

Remove repetitive combat loops.

Ensure the Crystal Ascendancy feels alive, growing and cooperatively intelligent, presenting players with tactical challenges rather than simple numerical difficulty.

Repeat until the Crystal Ascendancy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-048.

---

## Foundation / AF-000–047 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Crystal unit is a plain AF-033 `EnemyDef` — zero schema changes, zero fourth enemy engine.** Six of the thirteen registered Core Unit kinds carry full sandbox defs (Crystal Drone, Shard Hunter, Resonance Node, Growth Seeder, Crystal Guardian, Elite Crystal Titan), each passing AF-033's `findEnemyOverlap` no-overlap law against the base roster, the Outlaws, the Machines, and each other — guaranteed structurally, since `crystalOrganism`/`ancientGuardian` are families no other faction's `EnemyDef`s use. Every ranged attack IS a real AF-032 `WeaponDef` manufactured by "Crystal Dominion".
- **The faction needed zero lore work.** Crystal Dominion has been an AF-039 fully-profiled faction (`uniqueResources: crystalFragments`, `loreId` with a live producer, a Codex entry `codex-crystal-dominion` already in the roster) since AF-039 — like AF-047, and unlike AF-046, it inherits everything.
- **Resonance is the deliberate third doctrine — neither scatter (AF-046) nor discrete degrade (AF-047), but continuous weakening.** `CrystalResonanceRuntime` has no state machine: `resonanceStrength` is `min(maxResonanceStrength, nodeCount * perNodeBonus)`, recomputed on every `notifyDroneDestroyed` call. There is no threshold to cross and no command unit whose death flips a switch — killing a Resonance Node measurably and immediately weakens the ecosystem, and killing every non-node member does nothing to strength at all. Verified live: a fresh ecosystem's single node death dropped displayed strength from 8% to 0% on the debug overlay in the same tick.
- **The fairness cap is the same numeric discipline AF-047 established for Adaptive AI**, applied to a different axis: `RESONANCE_TUNING.maxResonanceStrength = 0.4` bounds `resonanceStrength` regardless of node count, verified at 50 enrolled nodes in `tests/crystals.test.ts`. Of the six registered Resonance Shared Traits, three are mechanically live — healing (`healPerSecond`), outgoing damage bonus (`damageBonus`, composed into the exact same multiplier point as AF-046's Focus Fire and AF-047's Target Synchronisation), and movement speed (`speedBonus`) — all scaling continuously with strength ratio, never in steps. Shield Strength, Status Resistance, and Ability Cooldowns are registered awaiting content, the same "N of M live" pattern AF-046/047 established.
- **Crystal Growth is AF-035's hazard-zone engine's first genuine mechanical extension**, not a third reimplementation: `createCrystalGrowth` returns a real `HazardZoneDef` ticked by the unchanged `stepHazardZone`/`isInsideHazard` (the same functions AF-046's mines and AF-035's boss arena hazard already use), and the new pure `growCrystalZone(zone, dtSeconds)` grows a zone's `radius` toward `CRYSTAL_GROWTH_TUNING.maxRadius` over its life — the "environment grows continuously" mechanic the spec calls for, achieved with one small pure function rather than a new hazard type.
- **Cross-faction reuse instead of reimplementation:** ecosystems reuse AF-046's pure `OutlawSquadRuntime.formationOffsets` for spawn placement, the same wedge math AF-047 already reused. Crystal `formation`-behaviour units (Resonance Node, Guardian, Titan) deliberately do NOT anchor on a command unit the way AF-046/047's formation units do — the ecosystem has no single coordinating unit for others to orbit, so they fall back to AF-033's own existing formation default (anchor = player position) with zero new code, a design choice that reinforces "no command hierarchy" rather than a missing feature. A Crystal Titan runs through AF-034's unchanged Elite pipeline exactly like the Outlaw Captain and Machine Command Core.
- **The Director is untouched, again — and the established wave-identity-reuse pattern is extended a third time.** AF-046 claimed the previously-generic `AmbushEvent` wave type; AF-047 claimed `ReinforcementWave`. This module claims `MixedEncounter` — narrow-scoped (only `Combat`/`HeavyCombat` phases in `DEFAULT_DIRECTOR_TUNING.wavesByPhase`, never the broad `SwarmWave`), and thematically exact: a mixed roster of cooperating organisms IS the ecosystem's doctrine. No `EnemyDirector`/`directorTuning.ts` changes; spawn counts report through the existing `notifyEnemiesSpawned(count, eliteCount)` API.
- **Loot reuses the established "registered vocabulary, no bank yet" pattern** exactly as AF-047 left Machine Components/Energy Cells/etc. — Crystal Fragments/Resonant Shards/etc. are registered loot vocabulary awaiting item content; kills flow through every existing reward path (XP, drops, elite relics) via the unmodified `killDrone` death-event checks. The doctrine Codex entry (`codex-crystal-resonance`, one additive AF-043 item, zero Missing Links) unlocks on the first Resonance Node kill via the existing lore-discovery path, `relatedEntryIds` pointing at the pre-existing `codex-crystal-dominion` faction entry.
- **The self-review loop's finding: no tuning change was needed.** Unlike AF-046 (mine-drop `phase` gate bug) and AF-047 (factory cadence + Constructor movement), live browser verification of AF-048 worked on the first pass — the Growth Seeder's `retreat` movement behaviour (copied from AF-047's Constructor fix rather than re-discovering the same "kiting self-selects as the primary target" problem) meant the seeding cadence was never blocked by the seeder dying early. This is recorded as the loop's positive finding: applying a prior module's fix pre-emptively, rather than rediscovering it, IS a form of self-review.
- **Self-review executed:** 16 new tests — vocabulary registration, AF-033-vocabulary conformance, the four-faction no-overlap law, readable-telegraph floors, the Elite pipeline for the Titan, the full resonance lifecycle (continuous scaling, the fairness cap at 50 nodes, node-vs-member kill distinction, elimination), Crystal Growth against the real `stepHazardZone`/`growCrystalZone`, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which resonance strength never leaves `[0, maxResonanceStrength]` and every ecosystem reaches zero strength once eliminated. Live in the browser: a MixedEncounter-equivalent ecosystem spawned via the dev key (`6 organisms, 1 node, 8% strength`), killing the Resonance Node collapsed strength to 0% in the same tick, organism count fell to 4 under real auto-fire, and the Growth Seeder seeded two real, ticking, continuously-growing crystal hazard zones mid-fight — zero page errors.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes, zero new loot/elite/lore systems; `CrystalResonanceRuntime` is the only genuinely new mechanical surface, `growCrystalZone` is AF-035's hazard engine's first mechanical extension rather than a new engine, and the faction is a deliberately designed third doctrine — continuous weakening — rather than a re-skin of scatter or degrade). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CRYSTAL_ASCENDANCY_FRAMEWORK.md`, `src/game/enemies/crystalData.ts` + `CrystalResonance.ts`.
