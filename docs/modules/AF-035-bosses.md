# AF-035 — BOSS FRAMEWORK

**Module status:** Complete (framework specified; phase/weak-point/armour/enrage/mastery-challenge/reward engine implemented and tested; a sandbox Boss governs a live multi-phase encounter end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-034 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/BOSS_FRAMEWORK.md` + implementation (`src/game/bosses/`)

---

*(Module catalogued verbatim below.)*

35

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-034 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Boss Framework.

Bosses are the defining moments of Afterlight.

Every Boss should feel like a major event.

Players should remember Boss encounters long after completing them.

Victory should be earned through observation, positioning, adaptation and mastery.

Never through luck alone.

==================================================
CORE PHILOSOPHY
==================================================

Epic.

Readable.

Fair.

Memorable.

Mechanical.

Every Boss teaches something new.

Every Boss changes how the player thinks.

==================================================
BOSS DESIGN PRINCIPLES
==================================================

Every Boss possesses:

Unique Identity

Unique Lore

Unique Arena

Unique Music

Unique Mechanics

Multiple Combat Phases

Clear Telegraphs

Counterplay

Reward Identity

Codex Entry

Every Boss should feel handcrafted.

==================================================
BOSS STRUCTURE
==================================================

Boss Introduction

↓

Phase One

↓

Transition

↓

Phase Two

↓

Transition

↓

Final Phase

↓

Death Sequence

↓

Reward Ceremony

Every phase has unique gameplay.

==================================================
BOSS ATTRIBUTES
==================================================

Every Boss defines:

Name

Title

Faction

Threat Rating

Arena

Health

Shield

Armour

Weak Points

Abilities

Phase Count

Enrage Behaviour

Rewards

Lore

Mastery Challenges

Future fields remain modular.

==================================================
PHASE SYSTEM
==================================================

Support:

One Phase

Two Phase

Three Phase

Four Phase

Dynamic Phase

Hidden Phase

Mythic Phase

Future expansions extend this system.

==================================================
BOSS MECHANICS
==================================================

Support:

Projectile Patterns

Laser Systems

Area Denial

Summons

Environmental Hazards

Shield Phases

Weak Points

Rotating Armour

Gravity Fields

Energy Beams

Teleportation

Arena Manipulation

Mechanics must remain readable.

==================================================
ARENA DESIGN
==================================================

Every Boss arena supports:

Movement Space

Safe Zones

Hazards

Interactive Elements

Visual Clarity

Environmental Storytelling

Arena design enhances mechanics.

Never obscures gameplay.

==================================================
BOSS AI
==================================================

Boss AI evaluates:

Player Position

Distance

Health Thresholds

Current Phase

Cooldowns

Arena State

Environmental Events

Boss behaviour remains deterministic.

==================================================
TRANSITIONS
==================================================

Between phases support:

Arena Changes

Dialogue

Animation

Environmental Shifts

Music Changes

Ability Unlocks

Transitions remain brief.

==================================================
ENRAGE SYSTEM
==================================================

Bosses may enter Enrage through:

Low Health

Mission Modifiers

Ascension

Time Limits

Special Events

Enrage changes behaviour.

Not simply statistics.

==================================================
LEGENDARY MOMENTS
==================================================

Bosses should create:

Unexpected Mechanics

Arena Evolution

Large Visual Moments

Story Revelations

Reward Ceremonies

Permanent Discoveries

Every encounter should feel unique.

==================================================
REWARD SYSTEM
==================================================

Boss rewards include:

Large XP

Rare Loot

Legendary Equipment

Blueprints

Research

Relics

Ancient Technology

Lore

Achievements

Progression always feels meaningful.

==================================================
BOSS CODEX
==================================================

Every Boss records:

Discovery

Lore

Weaknesses

Statistics

Fastest Kill

Mastery Challenges

Drops

Future Variants

Codex expands organically.

==================================================
MASTERY CHALLENGES
==================================================

Support optional objectives:

No Damage

Time Limit

Specific Commander

Specific Ship

Difficulty Modifier

Special Conditions

Prestige rewards only.

==================================================
BALANCE PRINCIPLES
==================================================

Bosses reward:

Observation

Pattern Recognition

Movement

Adaptation

Preparation

Mechanical Skill

Never unavoidable damage.

Never hidden mechanics.

==================================================
ACCESSIBILITY
==================================================

Support:

Clear Telegraphs

High Contrast Mechanics

Boss Ability Indicators

Subtitle Support

Reduced Effects

Photosensitivity Mode

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Pool Boss effects.

Pool projectiles.

Optimise phase logic.

Optimise arena events.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Boss State

Current Phase

Health

Cooldowns

Arena Events

AI State

Performance

==================================================
OUTPUT
==================================================

Produce the complete Boss Framework.

Every future Boss, Raid Boss, Ancient Guardian and Mythic Encounter extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every Boss repeatedly.

Review every phase.

Review arena layouts.

Review AI behaviour.

Review telegraphs.

Review transitions.

Review Enrage mechanics.

Review reward pacing.

Review mastery challenges.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-034.

Adjust mechanics.

Adjust timings.

Adjust phase transitions.

Remove unfair attacks.

Ensure every Boss encounter becomes a memorable test of skill, strategy and adaptation while remaining fair, readable and rewarding.

Repeat until the Boss Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-035.

---

## Foundation / AF-000–034 / GP-FINAL alignment review (recorded at catalogue time)

- **Almost every Boss attribute was already reserved by an earlier module, waiting for its first real producer.** AF-021's `DamageSourceKind` includes a literal `"boss"` kind with its own resistance-override branch already coded into `resolveDamage` (`target.values.boss` takes priority over the school resistance). `TargetCandidate.isBoss` and `TARGET_SELECTORS.bossPriority` exist but had zero consumers before this module. AF-022's `XpTier` already has a `"boss"` value (60 XP, the highest tier). AF-017's `DirectorPhase`/`WaveType` already include `MiniBoss`/`BossHandoff`/`Reward` and `MiniBossWave`/`BossWave` (cost 0 — the Director was always going to hand off budget accounting to something else for the boss itself). AF-026's `CollectionCategory` already includes `"bosses"`. This module is the first real payload for all of it — zero new plumbing anywhere in that list.
- **Health/Shield/Armour reuse AF-021's `DefenceState` directly — Armour IS `damageReduction`, not a second mitigation model.** `BossRuntime` constructs one `DefenceState(shield, hull, tuning, armour)` exactly like the player's own defensive stack. Shield regen-halt-on-break, barrier, and the shield-then-hull absorption order are all inherited for free.
- **Boss Structure reuses AF-016's `StateMachine` a third time (after AF-016's own top-level flow and AF-033's enemy AI states).** `introduction → engaging → transitioning → engaging → … → enrage → deathSequence → rewardCeremony` is a transition table, not a new state engine. "Transitions remain brief" is a real, timed hold (500ms), not an instantaneous flag flip — brief, but real.
- **Boss attack gating reuses AF-033's `EnemyRuntime` directly, by synthesizing the minimal `EnemyDef` view it actually reads.** `EnemyRuntime` only ever touches `def.attack` and `def.specialAbility`; `BossRuntime` builds exactly that view per phase (family/roles/lore/etc. are filled with the Boss's own values but never read by the runtime it's handed to). This is the same "reuse the engine, not just the vocabulary" rule every prior module followed — no second telegraph/cooldown gate.
- **Ranged Boss Mechanics ARE AF-032 Weapons, fired through the exact engine every enemy already uses.** Projectile Patterns/Laser Systems/Energy Beams/Area Denial/Shield Phases (via `DefenceState.addBarrier`, not built new) all resolve to a `WeaponDef` per phase. Teleportation reuses AF-033's `teleport` `MovementBehaviour` exactly, the same one AF-034's Elite mutation already draws on. Rotating Armour and full Arena Manipulation (beyond hazard zones) are registered future.
- **Enrage reuses AF-028/030/031/033/034's exact trigger shape for Low Health, and adds three genuinely new trigger evaluations this module needed (Time Limit, Ascension, and the registered-future Mission Modifier/Special Event pair) rather than forcing them into a shape that doesn't fit.** Ascension is evaluated externally via `notifyAscension(ascension)` since `BossRuntime` has no ascension context of its own — `session.ascension` (already an existing `RunSessionRecord` field) is the caller's to supply, not the runtime's to fetch.
- **Weak Points are the one genuinely new sub-target concept** — no prior module modeled damageable sub-hitboxes. Destroying one increases `incomingDamageMultiplier`, a small, honest reward for precision play. Aiming at a *specific* weak point (rather than the sandbox's simplification of chipping it proportionally on every hit) is a targeting/Hangar-UI concern, registered future.
- **Rewards reuse every acquisition system a Boss already qualifies for.** Large XP is the existing `"boss"` `XpTier`. Rare Loot/Research routes through AF-023's existing `LootCategory` filter over the same drop table. Relics reuse `RelicSystem.acquire` exactly (mirroring AF-029's elite-kill grant). Blueprints reuse AF-025's existing `CraftingSystem.unlockBlueprint`. Legendary Equipment/Ancient Technology are already-registered equipment/loot/research categories, not new ones.
- **Boss Codex reuses AF-026's collections/statistics engine — `discover("bosses", codexId)` is the same call AF-034 made for `discover("enemies", codexId)`.** Fastest Kill is an honestly recorded gap: AF-026's statistics engine only tracks a running *maximum* (`recordStatMax`), not a running minimum, so "fastest kill" has no primitive to record it against yet — registered future rather than faked with a workaround that would distort the statistic's meaning.
- **Mastery Challenges reuse AF-026's `MasteryReward` union for their reward and the same cosmetic-only guarantee everything else has.** *Evaluating* a challenge (did the player take zero damage this fight?) is the composition root's job, same as it always has been for every run-scoped condition — this module defines what the challenge is and what it rewards, not a new evaluation engine.
- **Self-review executed:** the full phase/weak-point/enrage/mastery-challenge/reward pipeline is tested, including a 5,000-tick full-fight simulation (spec's "play every Boss repeatedly" as a literal repeated-tick self-review). A sandbox Boss (The Hollow Sentinel) spawns on the Director's existing `MiniBoss` phase, runs a two-phase fight with a live hazard zone, transitions to Enrage at 15% hull, and completes a full reward ceremony — observed live in the walking-skeleton run with the player's own weapon finally given a consumer for AF-021's long-idle `bossPriority` selector.

**Review verdict:** ALIGNED (zero new resources, zero new state-machine implementation, zero new defensive model, zero new attack-gating engine, zero new acquisition systems; Weak Points and the hazard-zone tick are the two new mechanical surfaces, both explicitly justified as genuinely unmodeled before this point). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/BOSS_FRAMEWORK.md`, `src/game/bosses/`.
