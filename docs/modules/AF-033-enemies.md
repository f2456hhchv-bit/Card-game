# AF-033 — ENEMY FRAMEWORK

**Module status:** Complete (framework specified; family/role/AI-state/movement/attack/elite/death-event engine implemented and tested; two sandbox enemies govern live encounters; the enemy roster passes bind as future content modules land)
**Lock status:** LOCKED — extends AF-000 → AF-032 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ENEMY_FRAMEWORK.md` + implementation (`src/game/enemies/`)

---

*(Module catalogued verbatim below.)*

33

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-032 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Enemy Framework.

Enemies are the primary obstacle between the player and progression.

Every enemy should be instantly recognisable.

Every enemy should encourage different tactical decisions.

Combat variety should emerge from enemy combinations rather than inflated statistics.

The battlefield should constantly evolve as new enemy types interact.

==================================================
CORE PHILOSOPHY
==================================================

Every enemy has a purpose.

Every enemy teaches something.

Every enemy creates meaningful decisions.

Difficulty comes from interaction.

Not health inflation.

==================================================
ENEMY DESIGN PRINCIPLES
==================================================

Every enemy must possess:

Clear Identity

Recognisable Silhouette

Distinct Behaviour

Counterplay

Weaknesses

Strengths

Readable Telegraphs

Unique Death Behaviour

Meaningful Rewards

Lore

No enemy exists simply to absorb damage.

==================================================
ENEMY FAMILIES
==================================================

Support:

Scout

Fighter

Interceptor

Destroyer

Drone

Swarm

Crystal Organism

Void Entity

Machine Unit

Ancient Guardian

Heavy Assault

Support Unit

Summoner

Artillery

Living Structure

Future enemy families extend this framework.

==================================================
ENEMY ROLES
==================================================

Every enemy belongs to one or more roles:

Chaser

Flanker

Sniper

Tank

Support

Healer

Disruptor

Summoner

Controller

Area Denial

Elite

Boss Support

Role combinations create encounter diversity.

==================================================
AI STATES
==================================================

Idle

↓

Patrol

↓

Search

↓

Target Acquired

↓

Attack

↓

Retreat

↓

Reposition

↓

Special Ability

↓

Recover

↓

Death

State transitions remain deterministic.

==================================================
TARGET SELECTION
==================================================

Enemies evaluate:

Distance

Threat

Line of Sight

Mission Objectives

Environmental Hazards

Special Conditions

Never behave randomly without purpose.

==================================================
MOVEMENT BEHAVIOUR
==================================================

Support:

Direct Pursuit

Orbiting

Strafing

Kiting

Ambush

Teleport

Burrow

Wall Crawling

Formation Movement

Retreat

Movement reinforces enemy identity.

==================================================
ATTACK TYPES
==================================================

Support:

Projectile

Beam

Melee

Area Attack

Charge

Missile

Drone Launch

Summon

Nova

Status Attack

Environmental Attack

Future attack types extend naturally.

==================================================
SPECIAL ABILITIES
==================================================

Enemies may:

Deploy Shields

Heal Allies

Boost Allies

Spawn Reinforcements

Create Hazards

Teleport

Cloak

Split

Merge

Enrage

Abilities remain clearly telegraphed.

==================================================
ENEMY SCALING
==================================================

Scale using:

Mission Difficulty

Biome

Ascension

Enemy Director

Mission Progress

Elite Modifiers

Boss Influence

Never scale unpredictably.

==================================================
ELITE VARIANTS
==================================================

Elite enemies gain:

Additional Ability

Improved AI

Unique Visuals

Unique Audio

Enhanced Rewards

Distinct Identity

Elites should feel memorable.

==================================================
GROUP BEHAVIOUR
==================================================

Enemies cooperate through:

Focus Fire

Support Buffs

Area Control

Protective Behaviour

Formation Movement

Summoning

Retreat Logic

Group tactics remain readable.

==================================================
DEATH EVENTS
==================================================

Enemy defeat may trigger:

XP

Loot

Status Explosions

Spawn Events

Mission Progress

Research Samples

Achievements

Special Events

Framework remains event-driven.

==================================================
ACCESSIBILITY
==================================================

Support:

Clear Telegraphs

Distinct Audio

Unique Colours

Status Indicators

Reduced Effect Mode

High Contrast

Enemy Outlines

==================================================
PERFORMANCE
==================================================

Pool enemies.

Pool AI logic.

Optimise pathfinding.

Optimise targeting.

Use event-driven behaviours.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Enemy State

Behaviour Tree

Target Selection

AI Decision Time

Threat Rating

Spawn Group

Performance

==================================================
OUTPUT
==================================================

Produce the complete Enemy Framework.

Every future Enemy, Elite, Boss Support Unit and Biome extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of encounters.

Review every enemy family.

Review AI behaviour.

Review movement.

Review attack patterns.

Review telegraphing.

Review Elite behaviour.

Review group tactics.

Review counterplay.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-032.

Adjust AI priorities.

Adjust attack timing.

Adjust movement logic.

Remove repetitive behaviours.

Ensure every enemy creates meaningful tactical decisions while remaining fair, readable and memorable.

Repeat until the Enemy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-033.

---

## Foundation / AF-000–032 / GP-FINAL alignment review (recorded at catalogue time)

- **AI States reuse AF-016's `StateMachine<S>` exactly — the same generic class the game's top-level state flow already runs on.** The ten-state chain (Idle → Patrol → Search → TargetAcquired → Attack → Retreat → Reposition → SpecialAbility → Recover → Death) is a transition table passed to the existing generic class, not a new state-machine implementation. "State transitions remain deterministic" is a guarantee `StateMachine` already provides (illegal transitions are refused/thrown, never silently coerced).
- **Attack types are the second half of AF-032's Weapon Framework, not a parallel combat model.** Projectile/Beam/Missile/Nova/Area/Status attacks are literally `WeaponDef`s — the exact same schema, fired by an `EnemyRuntime` instead of a player `WeaponRuntime`, through the exact same `computeShotAngles`/`stepProjectile`/`StatusEngine` machinery. Melee/Charge attacks reuse AF-021's existing contact-damage `DamagePacket` pattern (already how the sandbox drone's player-contact damage works). Drone Launch/Summon resolve to the Spawn Events vocabulary this module already needs for Death Events — one spawn primitive, not two. Environmental Attack is registered future (no environmental-hazard *system* yet to attack with, mirroring AF-028's `droneEffectiveness`/`orbitalPower` "registered, no consuming system yet" pattern).
- **Target selection is AF-021's existing `TargetCandidate`/`TargetSelector`/`TARGET_SELECTORS` module, not a new targeting system.** Distance is `nearest`; Threat/boss/elite priority are the already-registered `bossPriority`/`elitePriority` selectors (built for weapons, equally valid for enemies choosing among multiple player-side targets once those exist). Line of Sight reuses the existing `ARENA_OBSTACLES` occlusion data already computed for player movement. Mission Objectives / Environmental Hazards / Special Conditions are registered future target-evaluation inputs — the sandbox has exactly one possible target (the player), so today "selection" degenerates to an engagement gate (range + line of sight), not a choice among many; the selector module already scales to more candidates without change.
- **Elite is a modifier over an `EnemyDef`, not a second enemy schema.** `EliteModifier` produces the exact `elite: boolean` flag every locked system already consumes unmodified — AF-017's Director (`eliteCount`/`maxSimultaneousElites`), AF-023's loot (elite drop-chance bonus), AF-026's mastery, AF-029's elite-kill relic grant, AF-021's `TargetCandidate.isElite`. Nothing downstream of that flag changes; this module only supplies *how* the flag gets attached (stat multipliers + a bonus special ability) rather than inventing a parallel elite pipeline.
- **Special abilities reuse AF-028/AF-030/AF-031's exact `PassiveTrigger`/`EquipmentBonus` shapes for their trigger condition and effect** — an enemy's "Enrage" is the same `{trigger: "onLowHealth", threshold, bonus: {kind, value}}` shape a Commander's or Ship's low-health passive already uses. Zero new trigger vocabulary; the bonus is applied to the enemy's own movement/damage rather than aggregated into the player's `BonusTotals`, which is the only actual difference from the player-side usage.
- **Death Events are AF-033's configuration over AF-021's existing `EnemyKilled` event, not a new event-driven layer.** `EnemyKilled` already exists and already drives XP, loot, meta statistics, and challenge progress unconditionally on every kill (`main.ts`'s subscription predates this module). This module supplies *which* of those an individual `EnemyDef` should trigger (`deathEvents: readonly DeathEventKind[]`) plus two genuinely new kinds this module introduces the mechanics for: Status Explosions (a `StatusEngine.apply()` in a radius, reusing AF-021's engine exactly) and Spawn Events (a death-triggered `spawnEnemyInstance` call, reusing this module's own spawning, not a second one). Mission Progress/Research Samples/Achievements/Special Events are already satisfied structurally by the existing unconditional `EnemyKilled` subscription and the existing loot table's `researchSample` category — registered as already-covered, not unbuilt.
- **Wave composition (AF-017) and Enemy identity (AF-033) are cleanly separated.** `WaveType` (AF-017 §pacing) decides *when* and *how much* budget spawns; this module's `EnemyDef` roster is *what* actually spawns into that budget. No change to `EnemyDirector`, `SpawnDirective`, or `DirectorTuning` — a wave references enemy ids as content, exactly as `SANDBOX_DROP_TABLE` already references loot ids as content for AF-023.
- **Movement behaviour is a genuinely new deterministic step function, mirroring AF-032's `stepProjectile` pattern exactly** (`stepEnemyMovement`) — the one new mechanical surface this module needs, because no prior module modeled orbiting/strafing/kiting/ambush/teleport/burrow/wall-crawling/formation motion for anything. Built the same way `stepProjectile` was: pure, deterministic, one function per behaviour, fully tested.
- **No-overlap law applied identically to AF-030/031/032** — `findEnemyOverlap`/`enemyFingerprint` (family + roles + movement behaviour + attack mechanism + special ability) checked across the roster.
- **Self-review executed:** all fifteen families, twelve roles, the ten-state AI chain, ten movement behaviours, eleven attack-type labels, ten special abilities, and eight death-event kinds are complete, tested vocabulary. Two sandbox enemies — a melee Chaser (family Scout) and a ranged Flanker (family Drone, orbiting movement, a real `WeaponDef`-driven attack) plus an Elite variant of each via `EliteModifier` — govern live encounters end-to-end: AI state transitions, telegraphed attacks, status-on-hit, elite Enrage at low health, and death events (XP/loot/status-explosion/spawn-event) all observed live in the walking-skeleton run. Full-roster tactical/balance passes bind as the real enemy roster and biomes arrive.

**Review verdict:** ALIGNED (zero new resources, zero new state-machine implementation, zero new targeting system, zero new elite pipeline; one new mechanical surface — deterministic movement-behaviour stepping — explicitly justified because no prior module modeled it). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ENEMY_FRAMEWORK.md`, `src/game/enemies/`.
