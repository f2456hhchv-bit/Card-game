# AF-051 — BIO-ENGINEERED XENOMORPH ENEMY FRAMEWORK

**Module status:** Complete (framework specified; evolution/network-link engine implemented and tested; a live Hive governs the Director's HunterPack wave end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-050 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/XENOMORPH_HIVE_FRAMEWORK.md` + implementation (`src/game/enemies/xenoData.ts`, `HiveEvolution.ts`)

---

*(Module catalogued verbatim below.)*

51

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-050 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Bio-Engineered Xenomorph Framework.

The Xenomorph Hive is not an alien civilisation.

It is a constantly evolving biological superorganism.

Every organism exists solely to ensure the survival and expansion of the Hive.

Unlike the Machine Collective, adaptation occurs through biological evolution rather than computation.

Players should feel like they are fighting a living ecosystem that continuously learns through evolution.

==================================================
CORE PHILOSOPHY
==================================================

Evolution.

Adaptation.

Growth.

Predation.

Survival.

The Hive never wastes biomass.

Every death strengthens future generations.

==================================================
FACTION IDENTITY
==================================================

Theme:

Bio-engineered apex predators.

Living biotechnology.

Genetic perfection.

Parasitic reproduction.

Hive intelligence.

Adaptive evolution.

Organic warfare.

Every organism serves the Hive.

==================================================
VISUAL LANGUAGE
==================================================

Organic armour.

Bone plating.

Living muscle.

Bioluminescent veins.

Adaptive tissue.

Spines.

Organic weapons.

Living tendrils.

Movement appears unnaturally fluid.

==================================================
CORE UNITS
==================================================

Support:

Hive Drone

Hunter

Stalker

Spitter

Brood Carrier

Parasite

Hive Guard

Crusher

Biomass Collector

Nest Builder

Evolution Node

Hive Queen Guard

Genetic Overseer

Living Titan

Future organisms extend naturally.

==================================================
COMBAT STYLE
==================================================

The Hive favours:

Swarming

Ambush

Flanking

Overwhelming Numbers

Evolution

Biological Synergy

Rapid Reinforcement

Close-Range Pressure

The battlefield should feel alive.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Nest Construction

Egg Clusters

Parasitic Infection

Biomass Harvesting

Rapid Evolution

Organic Regeneration

Burrowing

Wall Traversal

Acid Blood

Adaptive Mutation

Mechanics reinforce biological warfare.

==================================================
EVOLUTION SYSTEM
==================================================

Hive organisms adapt using:

Encounter Duration

Hive Biomass

Nearby Deaths

Environmental Conditions

Player Behaviour

Difficulty

Research Level

Evolution remains deterministic.

==================================================
HIVE NETWORK
==================================================

Nearby organisms share:

Biomass

Healing

Target Information

Mutation Progress

Aggression

Reinforcement Calls

Destroying Hive Nodes weakens surrounding organisms.

==================================================
BIOLOGICAL TERRAIN
==================================================

The Hive may create:

Organic Walls

Living Nests

Acid Pools

Growth Chambers

Biomass Fields

Spore Clouds

Regeneration Zones

Organic terrain becomes part of combat.

==================================================
ELITE VARIANTS
==================================================

Elite Hive organisms gain:

Rare Mutations

Unique Evolution

Adaptive Armour

Acid Enhancements

Legendary Biomass

Unique Visual Forms

Exceptional Rewards

Each Elite should appear biologically evolved.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Brood Mother

Hive Tyrant

Evolution Core

Biomass Leviathan

Ancient Queen

Alpha Predator

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Hive organisms interact with:

Organic Biomes

Living Worlds

Ancient Ruins

Corrupted Ecosystems

Crystal Growth

Void Corruption

Planetary Nests

Entire environments may become infested.

==================================================
LOOT
==================================================

Possible rewards:

Adaptive Tissue

Genetic Samples

Biomass Cores

Evolution Materials

Organic Blueprints

Research Samples

Legendary Mutagens

Rare Relics

==================================================
CODEX
==================================================

Record:

Species

Mutation Trees

Hive Biology

Evolution Stages

Nest Structures

Known Queens

Planetary Infestations

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Nest indicators

Mutation indicators

Distinct biological audio

High Contrast

Colour-blind support

Reduced organic effects

Clear acid hazard indicators

==================================================
PERFORMANCE
==================================================

Pool organisms.

Optimise swarm AI.

Reuse biological shaders.

Pool organic growth.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Hive Strength

Evolution Stage

Biomass

Mutation State

Nest Count

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Bio-Engineered Xenomorph Enemy Framework.

Every future Hive organism, biological ecosystem, adaptive mutation and organic expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Hive encounters.

Review swarm behaviour.

Review evolution.

Review nest mechanics.

Review biological terrain.

Review Elite encounters.

Review rewards.

Review Codex progression.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-050.

Adjust evolution speed.

Adjust swarm behaviour.

Adjust mutation frequency.

Remove repetitive encounters.

Ensure the Hive feels like an intelligent biological superorganism that overwhelms players through adaptation, cooperation and relentless evolution while remaining mechanically fair, readable and rewarding to overcome.

Repeat until the Bio-Engineered Xenomorph Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-051.

---

## Foundation / AF-000–050 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Hive unit is a plain AF-033 `EnemyDef` — zero schema changes, zero seventh enemy engine.** Six of the fourteen registered Core Unit kinds carry full sandbox defs (Hive Drone, Spitter, Stalker, Evolution Node, Crusher, Elite Living Titan), every one using the dormant `swarm` family — registered since AF-033, unused by any def until now — which makes cross-faction fingerprint collision with the base roster or any of the five prior factions structurally impossible. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Xenomorph Hive".
- **The Hive is the second faction with zero prior lore investment, by design — matching AF-049's precedent exactly.** Its own spec opens with "The Xenomorph Hive is not an alien civilisation" — no government, no economy, no reputation, so this module adds no `FactionDef`. Its Codex entry (`codex-xenomorph-hive`) cross-references AF-049's `codex-void-corruption` as the galaxy's other explicitly-non-civilisation threat, an honest structural echo rather than an invented relationship.
- **Evolution is the deliberate sixth doctrine — and the first with no way down at all.** Outlaw scatter times out (AF-046), Machine services degrade (AF-047), Crystal strength recomputes down with a dying node count (AF-048), Void corruption decays once contained (AF-049), Ancient alert de-escalates and its very ceiling shrinks (AF-050) — every prior doctrine has some form of decrease. `HiveEvolutionRuntime.biomass` has none: it climbs from encounter duration (`update(dtMs)`) and from every death, hive or otherwise (`notifyDroneDestroyed`), and is monotonically non-decreasing by construction — "the Hive never wastes biomass, every death strengthens future generations" is implemented literally, verified across 100,000 accumulated update-and-kill ticks in `tests/xeno.test.ts` without a single decrease.
- **The fairness discipline continues, applied to the first monotonic number in the series.** `HIVE_EVOLUTION_TUNING.maxBiomass = 1` still hard-caps `biomass` even though it can never fall — "evolution remains deterministic" is satisfied by a numeric ceiling exactly like every prior doctrine's cap, not by any assumption that unbounded growth would stay fair on its own.
- **The Hive Node's network link composes AF-047's exact discrete-flag technique onto this new monotonic axis**, resolving what could look like a spec contradiction ("never wastes biomass" vs. "destroying Hive Nodes weakens surrounding organisms") cleanly: a Node's death still feeds Biomass like any death (nothing is wasted) AND severs `nodeLinked` immediately, zeroing the three mechanically-live, stage-stepped Hive Network traits — Healing, Target Information, Aggression — for the current encounter, without ever lowering Biomass itself. Verified live: a hive's Evolution Node died and `severed` appeared on the debug overlay in the same tick, while biomass kept climbing afterward exactly as before.
- **Rapid Reinforcement (stage 2+, linked) is a fifth reuse of AF-047's Drone Factory cadence-gate-and-lifetime-cap shape**, after Crystal's Growth Seeder, Void's zone-seeder, and Ancient's Guardian Deployment — manufacturing one real Hive Drone through the shared spawn path once evolution and the network link both allow it.
- **Acid Pools are AF-035's hazard-zone engine's fourth reuse**, following AF-046's mines, AF-048's Crystal Growth, and AF-049's Corruption Zones, and give AF-021's dormant `poison` `StatusKind` its first producer via the Spitter's Acid Spit and the Living Titan's Acid Barrage. AF-033's dormant `burrow` and `wallCrawling` movement behaviours also gain their first EnemyDef producers (Hive Drone and Stalker respectively) — genuine mechanical firsts, not vocabulary-only claims, verified against the entire five-faction prior roster in `tests/xeno.test.ts`.
- **The Director gained one new wave-type claim, `HunterPack`** — a hunting pack fits Swarming/Flanking/Overwhelming Numbers closely enough that reusing a combat-focused wave (rather than AF-049/050's zero-footprint `EnvironmentalEventTriggered` route) was the better thematic fit this time; `EnemyDirector.ts`/`directorTuning.ts` remain otherwise byte-for-byte unmodified, and `AmbientPatrol`/`SwarmWave` remain unclaimed for future factions.
- **Self-review executed:** 21 new tests — vocabulary registration (including the five evolution stages), AF-033-vocabulary conformance, the six-faction no-overlap law, the `swarm`-family-exclusivity check, readable-telegraph floors, the `poison` first-producer assertion, the `burrow`/`wallCrawling` first-producer assertions checked against every prior faction's roster, the Elite pipeline for the Living Titan, the full evolution lifecycle (monotonic growth from both time and death, the fairness cap at 100,000 ticks, the Node-kill link-severance without any biomass decrease, member-vs-node kill distinction, discrete stage-stepped bonuses zeroing on severance, Rapid Reinforcement's cadence-and-cap), Acid Pools against the real `stepHazardZone` carrying the newly-live `poison` status, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which biomass never decreases and every hive reaches elimination. Live in the browser: a hive spawned via `HunterPack`-equivalent (the dev key), biomass climbed from 0% through the "adapting" stage threshold at 20%, and the Evolution Node's death registered as an immediate `severed` link state without halting biomass growth — zero page errors throughout.

**Review verdict:** ALIGNED (zero enemy-schema changes, one new wave-type claim consistent with three prior factions' precedent, zero new loot/elite systems, and the second deliberate non-extension of AF-039's faction-profile system, justified the same way AF-049 was). `HiveEvolutionRuntime` is the only genuinely new mechanical surface, and a monotonic-only meter is meaningfully distinct from every prior doctrine's some-form-of-decrease shape. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/XENOMORPH_HIVE_FRAMEWORK.md`, `src/game/enemies/xenoData.ts` + `HiveEvolution.ts`.
