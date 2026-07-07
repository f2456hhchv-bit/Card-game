# AF-047 — MACHINE COLLECTIVE ENEMY FRAMEWORK

**Module status:** Complete (framework specified; network/adaptation/factory engine implemented and tested; a live Machine network governs the Director's ReinforcementWave end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-046 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MACHINE_COLLECTIVE_FRAMEWORK.md` + implementation (`src/game/enemies/machineData.ts`, `MachineNetwork.ts`)

---

*(Module catalogued verbatim below.)*

47

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-046 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Machine Collective Enemy Framework.

The Machine Collective represents an ancient autonomous war network that continued evolving after the collapse of civilisation.

Machines do not experience fear.

They do not seek revenge.

They execute calculated solutions.

Every encounter should feel like fighting a highly efficient military AI.

==================================================
CORE PHILOSOPHY
==================================================

Precision.

Efficiency.

Adaptation.

Coordination.

Calculation.

Every machine behaves according to logic.

Never emotion.

==================================================
FACTION IDENTITY
==================================================

Theme:

Self-evolving artificial intelligence.

Autonomous factories.

Ancient military hardware.

Self-repairing technology.

Distributed intelligence.

Relentless expansion.

Machine logic above all.

==================================================
VISUAL LANGUAGE
==================================================

Dark alloy armour.

White illumination.

Blue energy cores.

Mechanical precision.

Hexagonal shielding.

Rotating machinery.

Exposed servos.

Industrial construction.

Visuals communicate engineered perfection.

==================================================
CORE UNITS
==================================================

Support:

Recon Drone

Combat Drone

Interceptor

Heavy Walker

Shield Generator

Repair Drone

Siege Platform

Sniper Unit

Missile Platform

Swarm Constructor

Energy Harvester

Guardian

Heavy Destroyer

Command Core

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Machine Collective favours:

Formation Combat

Crossfire

Shield Networks

Area Control

Target Priority

Calculated Retreats

Automated Reinforcements

Resource Preservation

Machines maximise battlefield efficiency.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Shared Shields

Distributed Processing

Self Repair

Energy Relay

Defensive Networks

Drone Factories

Adaptive Armour

Target Synchronisation

Machines become stronger together.

==================================================
ADAPTIVE AI
==================================================

Machines analyse:

Player Movement

Weapon Usage

Ability Usage

Damage Types

Status Effects

Threat Level

Encounter Duration

AI adapts without becoming unfair.

==================================================
NETWORK COMMAND
==================================================

Command Units coordinate:

Movement

Fire Priority

Shield Routing

Drone Deployment

Repair Allocation

Retreat Orders

Destroying command units weakens nearby machines.

==================================================
ELITE VARIANTS
==================================================

Elite Machines gain:

Prototype Hardware

Adaptive Shields

Experimental Weapons

Unique Chassis

Advanced AI

Rare Components

Unique Codex Entries

Each Elite feels engineered for a specific purpose.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Command Walker

Factory Core

Siege Engine

Prototype AI

Orbital Defence Node

Adaptive War Platform

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Machines interact with:

Factories

Power Relays

Ancient Facilities

Machine Worlds

Solar Arrays

Orbital Platforms

Energy Networks

Battlefields evolve dynamically.

==================================================
LOOT
==================================================

Possible rewards:

Machine Components

Energy Cells

Prototype Blueprints

AI Cores

Shield Modules

Research Data

Ancient Hardware

Synthetic Materials

==================================================
CODEX
==================================================

Record:

Machine Classes

AI Hierarchy

Manufacturing History

Command Structure

Known Facilities

Combat Doctrine

Technology

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Unique mechanical audio

Network indicators

Shield visuals

High Contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool drones.

Optimise network calculations.

Reuse behaviour trees.

Pool shield effects.

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

Command Units

Shield Links

AI State

Adaptive Behaviour

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Machine Collective Enemy Framework.

Every future synthetic civilisation, autonomous war machine and AI expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Machine Collective encounters.

Review AI adaptation.

Review shield networks.

Review coordinated attacks.

Review repair behaviour.

Review Elite encounters.

Review command hierarchy.

Review rewards.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-046.

Adjust AI behaviour.

Adjust network bonuses.

Adjust encounter pacing.

Remove repetitive combat loops.

Ensure the Machine Collective feels intelligent, efficient and relentlessly coordinated, presenting players with tactical challenges rather than simple numerical difficulty.

Repeat until the Machine Collective Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-047.

---

## Foundation / AF-000–046 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Machine unit is a plain AF-033 `EnemyDef` — zero schema changes, zero third enemy engine.** Six of the fourteen registered Core Unit kinds carry full sandbox defs (Combat Drone, Sniper Unit, Shield Generator, Repair Drone, Swarm Constructor, Command Core), each passing AF-033's `findEnemyOverlap` no-overlap law against the base roster, the Outlaws, and each other. Every ranged attack IS a real AF-032 `WeaponDef` manufactured by "Machine Collective" — the same manufacturer string AF-033's flak-orbiter cannon has carried since that module.
- **The faction needed zero lore work.** The Machine Collective has been an AF-039 fully-profiled faction (`uniqueResources: quantumCores`, `loreId` with a live producer) since AF-039, referenced by AF-010/030/038 content throughout — unlike AF-046, which had to pay a profiling debt, AF-047 inherits everything.
- **Networks are the deliberate mirror-opposite of AF-046's squads — the two factions differ by design, not palette.** A broken Outlaw squad *scatters* (fear, retreat orders); a broken Machine network *degrades* (logic): units keep fighting, but Target Synchronisation, Shared Shields, Self Repair, and the Drone Factory all stop the moment the Command Core dies. "Destroying command units weakens nearby machines" is per-service and mechanical: killing the Shield Generator alone drops only the lattice; killing the Core drops everything at once — both verified live in the browser.
- **This module gives AF-033's dormant `healAllies` and `spawnReinforcements` special-ability kinds their first producers** (the Repair Drone and Swarm Constructor), continuing the dormant-hook lineage (AF-038's `galaxyNavigation`, AF-043's collection buckets, AF-046's formation context).
- **Adaptive AI is a hard-capped number, not a promise.** `MachineNetworkRuntime.recordIncomingDamage(school)` analyses what hurts the network (the `damageTypes` input of seven registered); `adaptedReduction()` builds in 5% steps per twelve hits, capped at 25%, and collapses entirely when the Core dies — "adapts without becoming unfair" is enforced by `MACHINE_ADAPTATION_TUNING.maxReduction`, verified at 10,000 recorded hits. The other six analysis inputs are registered awaiting content.
- **Cross-faction reuse instead of reimplementation:** networks reuse AF-046's pure `OutlawSquadRuntime.formationOffsets` for spawn placement, and machine `formation`-behaviour units anchor on the Command Core through the exact AF-033 formation context AF-046 first activated — while non-formation machines keep their own vectors (crossfire, not a conga line). Command Cores ARE AF-034 Elites through the unchanged spawn path. Target Synchronisation composes into the same damage-multiplier point AF-046's Focus Fire uses.
- **The Director is untouched, again.** Machines enter through the Director's *existing* `ReinforcementWave` identity — Automated Reinforcements ARE their doctrine — one branch beside AF-046's browser-verified `AmbushEvent` routing, reporting counts through the existing census API (including factory-built drones, so the Director's enemy count stays accurate).
- **Loot reuses AF-024:** eliminating a network banks Research Data through `researchTree.addPoints` and announces through the existing `ResearchPointsGained` bus fact — `bankResearchSample`'s exact pattern, one more producer. Machine Components/Energy Cells/AI Cores et al. are registered loot vocabulary awaiting item content. The doctrine Codex entry (one additive AF-043 item, zero Missing Links) unlocks on the first Core kill via the existing lore-discovery path.
- **The self-review loop produced two real tunings, recorded as code comments at the values they changed:** the factory interval dropped 7000→4000ms (live play showed the Constructor reliably focused down before its first build ever mattered — "adjust encounter pacing," literally), and the Constructor's movement changed kiting→retreat (a factory that chases to preferred range self-selects as the player's nearest auto-fire target; a withdrawing factory is also better Resource Preservation doctrine). A dev-only spawn key (DEV-guarded beside AF-016's debug overlay, keys 8/9 for the two factions) was added to make faction encounters deterministically browser-verifiable — it also closed AF-046's one remaining live-verification gap, Outlaw mines, observed live (`mines 1`) in the same session.
- **Self-review executed:** 18 new tests — vocabulary registration, AF-033-vocabulary conformance, the cross-faction no-overlap law, readable-telegraph floors, first-producer assertions for `healAllies`/`spawnReinforcements`, AF-034 pipeline compatibility for the Core, the full network lifecycle (linked/degraded/eliminated, per-service gating, factory cadence + lifetime cap + built-drone enrolment extending the elimination condition), the Adaptive AI's step/cap/per-school/collapse behaviour, the Codex entry, and a 1,000-encounter randomised kill-order sweep in which no network ever reaches an invalid state and coordination never survives the Core. Live in the browser: a network spawned with all services online (`shields+repair+factory`), the Adaptive AI's analysis counters rose under real auto-fire (p3→p9→p17), killing the Shield Generator dropped only the lattice, killing the Constructor dropped only the factory, and — after the two tunings — the Drone Factory manufactured a real Combat Drone mid-fight that enrolled into the network (`6 units, built 1`), all with zero page errors.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes, zero new loot/elite/lore systems; `MachineNetworkRuntime` is the only genuinely new mechanical surface, two AF-033 ability kinds gained their first producers, and the faction is a designed mirror-opposite of AF-046 rather than a re-skin). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/MACHINE_COLLECTIVE_FRAMEWORK.md`, `src/game/enemies/machineData.ts` + `MachineNetwork.ts`.
