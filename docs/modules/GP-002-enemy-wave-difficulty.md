## Verbatim prompt

```
2

# AFTERLIGHT PRODUCTION PACK GP-002

# ENEMY, WAVE & DIFFICULTY FRAMEWORK

Continue directly from GP-001.

Do NOT redesign previous systems.

Extend them.

Everything must compile.

Everything must integrate.

Build production quality systems only.

==================================================
OBJECTIVE
==================================================

Create one of the deepest enemy systems ever built for a roguelite.

Enemies must remain interesting for thousands of runs.

Difficulty must come from intelligent combinations.

Never simply increasing health.

==================================================
THE ENEMY HIERARCHY
==================================================

Create enemy classes.

Normal

Elite

Champion

Mini Boss

Boss

World Boss

Legendary Boss

Each category must have unique behaviours.

Not just bigger stats.

==================================================
ENEMY ROLES
==================================================

Every enemy belongs to one or more combat roles.

Examples

Swarm

Tank

Ranged

Sniper

Support

Summoner

Healer

Exploder

Burrower

Charger

Ambusher

Shield Unit

Artillery

Commander

Hunter

Assassin

Controller

Area Denial

Boss

Enemies should combine to create tactical problems.

==================================================
AI BEHAVIOURS
==================================================

Build modular AI.

Behaviours include

Seek

Orbit

Retreat

Flank

Maintain Distance

Charge

Hide

Teleport

Split

Spawn Allies

Protect Allies

Heal Allies

Enrage

Phase Change

Flee

Guard Objectives

Every enemy can combine behaviours.

==================================================
WAVE DIRECTOR
==================================================

Build an intelligent Wave Director.

The director controls

Enemy composition

Spawn timing

Spawn locations

Elite frequency

Event frequency

Merchant timing

Boss timing

The director should create pacing.

Not randomness.

==================================================
DIFFICULTY CURVE
==================================================

Difficulty increases through

Enemy variety

Enemy synergy

Projectile density

Movement pressure

Elite combinations

Environmental hazards

Boss mechanics

Avoid simple health inflation.

==================================================
WAVE STRUCTURE
==================================================

Every mission contains dynamic waves.

Example pacing

Wave 1

Introduction

Wave 2

Swarm

Wave 3

Elite

Wave 4

Mixed Roles

Wave 5

Mini Event

Wave 6

Heavy Pressure

Wave 7

Merchant

Wave 8

Elite Pair

Wave 9

Mini Boss

Wave 10

Boss

The director may alter pacing.

==================================================
SPAWNING
==================================================

Enemies spawn fairly.

Never directly on the player.

Respect visibility.

Avoid impossible situations.

Spawn outside camera where possible.

Allow surround tactics.

==================================================
ELITES
==================================================

Elite enemies receive modifiers.

Examples

Burning

Frozen

Toxic

Electric

Shielded

Regenerating

Invisible

Explosive

Armoured

Vampiric

Duplicating

Time Warped

Modifiers stack.

==================================================
BOSSES
==================================================

Bosses must feel handcrafted.

Multiple attack phases.

Behaviour changes.

Arena changes.

Unique attacks.

Unique music.

Unique visuals.

No bullet sponge bosses.

==================================================
BOSS PHASES
==================================================

Bosses evolve.

Phase One

Learning

↓

Phase Two

Pressure

↓

Phase Three

Chaos

↓

Final Phase

Signature mechanic

Each phase introduces something new.

==================================================
ENEMY SCALING
==================================================

Scale using

Mission level

Galaxy

System

Difficulty

Run time

Player build

Number of upgrades

Average DPS

Survivability

Never unfairly.

==================================================
SYNERGY SYSTEM
==================================================

Enemies work together.

Examples

Shield units protect artillery.

Healers restore tanks.

Summoners overwhelm.

Snipers punish standing still.

Controllers trap players.

The challenge comes from combinations.

==================================================
EVENTS
==================================================

Random wave events include

Meteor Shower

Nebula Storm

Solar Flare

Gravity Rift

Alien Swarm

Treasure Drone

Civilian Rescue

Distress Beacon

Ancient Structure

These interrupt normal pacing.

==================================================
DIRECTOR INTELLIGENCE
==================================================

The director monitors

Player health

Player damage

Build strength

Run duration

Boss performance

Deaths

Near deaths

Enemy clear speed

Adjust pacing naturally.

Never rubber band.

==================================================
MISSION END
==================================================

Boss defeated.

Spawn extraction.

Allow continue mode.

Each additional wave increases

Loot

Research

Atlas rewards

Enemy difficulty

Boss chance

Risk vs reward.

==================================================
CODE REQUIREMENTS
==================================================

Everything modular.

Everything data driven.

Enemy definitions externalised.

Wave definitions editable.

Boss phases reusable.

AI reusable.

No duplicated code.

==================================================
SELF REVIEW
==================================================

Review enemy variety.

Review AI.

Review wave pacing.

Review difficulty.

Review bosses.

Review fairness.

Review replayability.

If any wave feels repetitive...

Redesign it.

If any enemy exists only because of higher stats...

Redesign it.

If any boss can be defeated by simply holding fire...

Redesign it.

Continue refining until the combat loop can support thousands of runs without becoming repetitive.

Only then lock GP-002.
```

## Scope decision (recorded via AskUserQuestion, genuine Project Owner input)

GP-002 describes a full enemy/wave/difficulty framework across 14 sections. Before writing any code, a dedicated Explore-agent audit of the existing enemy/director/boss/elite foundation (AF-017 EnemyDirector, AF-021 DefenceState, AF-033 enemy roster + attacks, AF-034 EliteGenerator, AF-035 BossRuntime/BossArena, AF-056 DirectorConductor, AF-042 audio states) found that **most of GP-002's own described framework already exists and already works**: the Enemy Hierarchy (Normal/Elite/Champion/Mini Boss/Boss/World Boss-adjacent tiers), a real `ENEMY_ROLES` union, a real modular `MovementBehaviour`/`EnemySpecialAbility` AI vocabulary, a real intelligent `EnemyDirector` with phase-based pacing (not pure randomness), real difficulty scaling across multiple inputs, real per-phase boss content (`BossRuntime`), a real `EliteGenerator` mutation system, and most of the 9 named environmental events already registered as `EnvironmentalEventType`s.

Nine concrete gaps were the genuine findings, confirmed by direct code reading rather than assumption:

1. 6 of the registered `MUTATION_KINDS` had real `MutationDef` catalogue entries (visual indicator, gameplay effect, counterplay) but `mechanicallyLive: false` — `EliteGenerator.generateElite()`'s switch statement fell through to `default: break` for all six, so they were rolled onto elites and displayed but did nothing. The spec's own Elites list (Electric, Invisible, Vampiric) had no `MutationKind` entry at all.
2. `ENEMY_ROLES` was missing 6 of the spec's 19 named roles (assassin, commander, charger, ambusher, burrower, exploder, shieldUnit) — no faction roster tagged them.
3. The spec's Synergy System names "Snipers punish standing still" verbatim; no code anywhere checked player stillness against a sniper-role enemy.
4. The spec's Spawning section requires "spawn outside camera where possible"; the existing wave-spawn placement picked positions with no camera-viewport awareness at all.
5. `DirectorConductor`'s `ADAPTIVE_RESPONSE_INPUTS` already modelled 7 of the spec's 8 Director Intelligence inputs, but "Enemy clear speed" and "Near deaths" were registered names with no producer feeding them.
6. `hollow-sentinel` (the one real sandbox `BossDef`) used `phaseSystem: "twoPhase"` — the spec's Boss Phases arc (Learning → Pressure → Chaos → Signature mechanic) is a 4-stage arc; only 2 of the 4 stages existed as real phase content.
7. 3 of the 9 named Events (`MeteorShower`, `CrystalGrowth`/Ancient Structure-adjacent, `MachineReinforcements`/Alien Swarm-adjacent) were registered `EnvironmentalEventType`s with an emitted `EnvironmentalEventTriggered` bus event but no `main.ts` handler — they fired and did nothing.
8. The spec's Wave Structure example places "Merchant" at a fixed wave number (Wave 7); the existing mid-run merchant (GP-001) triggered only from a mission-event roll, never from wave-count milestones.
9. The spec's Enemy Hierarchy names "World Boss" as a distinct tier from "Boss"; no `WORLD_BOSS`-equivalent content existed, and Mission End's "boss chance" (continue-mode risk/reward) had no roll anywhere.

The Project Owner's explicit answer to the follow-up scope question was **"Everything the audit found"** — all 9 gaps, not a curated subset — treating GP-002 like every prior AF/GP module: real tested TypeScript per mechanic, wired into `main.ts` and `DebugOverlay.ts`, typecheck/test/build/browser-verify, then catalogue and lock. This doc records that contract being carried out.

## What's implemented

All nine compose with the existing locked foundation rather than replacing any of it. Every locked union (`MUTATION_KINDS`, `ENEMY_ROLES`, `ADAPTIVE_RESPONSE_INPUTS`, `MUSIC_STATES`) is extended **additively only** — new members appended, nothing renumbered or removed.

1. **Elite mutations completed + 3 new** (`src/game/enemies/eliteData.ts`, `EliteGenerator.ts`) — the 6 dormant mutations (reflectiveArmour/gravityField/summoner/quantumShift/temporalEcho/adaptiveArmour) now flip to `mechanicallyLive: true` with real `MutationEffects` fields (`reflectDamageFraction`, `gravityPullFraction`, `summonIntervalMs`, `quantumShiftChance`, `spawnsDecoy`, `adaptiveResistFraction`) consumed live in `main.ts`'s per-drone update loop and weapon-hit-resolution code. Three new mutations matching the spec's own Elites list verbatim — Electric (shock on-hit), Cloaked (`isDroneCloaked()`, dims render alpha, excluded from target-candidate filtering), Vampiric (melee life-steal) — bring the roster to 18 total mutations, 18/18 mechanically live.
2. **6 missing enemy roles tagged** (`enemyData.ts` + 6 faction roster files) — assassin, commander, charger, ambusher, burrower, exploder, shieldUnit added to `ENEMY_ROLES` (19 total) and tagged onto real existing enemies across xeno/void/eclipsed/outlaw/machine/nomad rosters. `machine-command-core` was deliberately **not** tagged "commander" despite being an obvious candidate — its own lore states "Not a leader — a router," and an explicit test asserts this exclusion, respecting in-fiction content over mechanical convenience.
3. **Snipers punish standing still** (`src/game/enemies/sniperSynergy.ts`) — `sniperStillnessMultiplier(roles, playerStationaryMs)` returns a real damage bonus once the player has held still past a threshold; wired against a new `playerStationaryMs` tracker in `updateSandboxCombat()`.
4. **Camera-aware spawn placement** (`src/game/director/spawnPlacement.ts`) — `cameraViewportRect()`/`isOutsideViewport()`/`pickSpawnOutsideViewport()` give wave spawns real camera-viewport awareness; `executeWave()`'s two placement call sites now route through the new `pickWaveSpawnXY()` helper instead of camera-blind placement.
5. **Director gains clear-speed + near-death inputs** (`conductorData.ts`, `DirectorConductor.ts`) — `recordKill()`/`recordNearDeath()` feed `struggleScore` via `clearSpeedStruggle`/`nearDeathStruggle` (both `Math.max`-combined with the existing struggle inputs), preserving AF-056's structural guarantee that the Conductor only ever paces recovery-window timing, never touches enemy stats directly. Wired at `killDrone()`, the boss-defeated block, and a hysteresis-gated near-death check in `updateSandboxCombat()`.
6. **Boss gains real 3rd/4th phase + per-phase music** (`bossData.ts`, `audioData.ts`, `MusicState.ts`) — `hollow-sentinel` becomes `phaseSystem: "fourPhase"` with two genuinely new phases (phase-3-chaos: Chaos Spiral missile spiral + wall-crawling movement; phase-4-signature: sustained Vault Beam + teleport), completing the spec's Learning → Pressure → Chaos → Signature arc. Two new `MUSIC_STATES` (`bossPhaseChaos`, `bossPhaseSignature`) and a 4-way `resolveMusicState()` boss branch give each phase its own music, satisfying the spec's "unique music" per-phase requirement. Hull raised 900→3000 and phase thresholds respaced (0.75/0.5/0.32) after test-driven debugging surfaced a transition-window damage-overshoot cascade risk (see Debug & verification below).
7. **3 dormant environmental events wired** (`src/game/director/meteorShower.ts` + `main.ts` handlers) — Meteor Shower reuses AF-035's exact hazard-zone engine (`createMeteorImpact` mirrors the existing `createOutlawMine` pattern) rather than inventing a new mechanism; CrystalGrowth and MachineReinforcements route through the existing `crystalGrowths`/`spawnEnemyInstance` paths. All three now do something real when the Director triggers them, rather than firing a bus event nobody listens to.
8. **Merchant tied to wave milestones** (`main.ts`) — a `wavesLanded % 7 === 0` trigger (mirroring the spec's Wave 7 example and the exact "every N waves" pattern Build-Defining Paths already established) opens the mid-run merchant on a wave-count cadence, alongside the existing mission-event roll.
9. **World Boss tier + boss-chance continue mode** (`bossData.ts`, `main.ts`) — `createWorldBossVariant(base, hullMultiplier)` scales an existing `BossDef` exactly the way `EliteGenerator` already scales a base `EnemyDef` (same phases/weak points/enrage/mastery content by reference, no duplicated block); `WORLD_BOSS` is the one authored instance (1.75× hull). The "Push Deeper" extraction-continue button now rolls a real boss chance (`Math.min(0.6, extractionDepth * 0.15)`) satisfying Mission End's "each additional wave increases... boss chance," and `dropLoot`/`grantBossRewards` scale `researchBonus` by `extractionDepth`, satisfying "increases loot/research/Atlas rewards."

## Wave-structure pacing review (no code change)

The spec's Wave Structure example (Introduction → Swarm → Elite → Mixed Roles → Mini Event → Heavy Pressure → Merchant → Elite Pair → Mini Boss → Boss across 10 waves) describes a *shape* — light open, rising pressure, a mid-run breather/event, a second rise, a climax — rather than a literal 10-step machine to copy verbatim. AF-017's locked `DEFAULT_DIRECTOR_TUNING.phaseSequence` (`directorTuning.ts`) already encodes that same shape: `Recovery → LightContact → Combat → HeavyCombat → ElitePressure → Recovery → EnvironmentalEvent → HeavyCombat → MiniBoss → Recovery` — an opening ramp, a first pressure peak (`ElitePressure`), a breather, a named event exactly where the spec's own "Mini Event"/"Merchant" beats sit, a second pressure peak, and a `MiniBoss` climax before the boss handoff. Reordering this locked 10-step sequence to chase closer surface-level correspondence with the spec's own numbered example would be redesigning an already-correct, already-tested AF-017 pacing engine without a concrete deficiency — exactly what this project's "extend, never redesign" rule forbids. No change made; documented here as an honest comparison rather than forced busywork.

## Debug & verification

`DebugSnapshot` gains one combined `gpEnemyWave` field (mirroring `gpCoreLoop`'s "one line, extended per mechanic" convention): `mutations <n>/<n> live · roles <n> · stationary <n>s · conductor kills=<n> nearDeaths=<n> struggle=<n> · boss <id> (<n> phases) · world boss chance <pct>%`.

A boss-phase-count change (2→4 phases) surfaced a genuine timing bug during test-driven debugging: `BossRuntime`'s `"transitioning"` state (a fixed ~500ms window) returns early before its own phase-check/enrage-check code runs, but the test harness's `takeDamage()` calls continue regardless of state — with the original phase-4/enrage thresholds both at 0.15, a single transition window's damage overshoot (~408 hull, derived from the 500ms window ÷ 16ms ticks × 15 damage/tick against the boss's own armour-reduction formula) could cascade the boss straight through phase-4 and past Enrage without ever returning to `"engaging"`. Fixed by raising hull 900→3000 and respacing every phase threshold to leave ≥510 hull of headroom per transition — verified via `tests/bosses.test.ts`/`tests/bossDirector.test.ts` (29/29 passing) before the full suite was re-run.

Full suite: **2223 tests green, 201 files** (63 new tests this module — `elites.test.ts` +9, `enemyRoles.test.ts` new ×15, `sniperSynergy.test.ts` new ×4, `spawnPlacement.test.ts` new ×5, `conductor.test.ts` +6, `bosses.test.ts` +3, `audio.test.ts` +1, `meteorShower.test.ts` new ×2, plus fixes to 2 pre-existing tests whose assertions depended on tuning values this module changed). `tsc --noEmit -p .` clean. `vite build` clean (350 modules, no new warnings beyond the pre-existing chunk-size notice).

Browser-verified against the dev server: a real automated Playwright run (Splash → MainMenu → GalaxyCommand → MissionSelect → Launch Expedition → 25s of live combat) produced zero page errors, only the same pre-existing baseline 404 console message noted since AF-154, and confirmed every mechanic live end-to-end — a real spawned elite carrying the tag `MYTHIC [berserker, electric, quantumShift]` (two of the three newly-completed mutations active simultaneously on a genuine runtime enemy, not just catalogue data), `gpEnemyWave` reading `mutations 18/18 live · roles 19 · stationary 20.0s · conductor kills=2.4 nearDeaths=0 struggle=1.00 · boss hollow-sentinel (4 phases) · world boss chance 0%`, and `gpCoreLoop` showing `waves 2 · ... merchant visits 1` confirming a real wave-milestone merchant trigger fired during the run.

## Self review loop

- Reviewed against `EliteGenerator`'s mutation switch: the 6 completed mutations replace `default: break` fallthroughs with real effect assignments; the pattern (roll → populate `MutationEffects`, layered alongside — never merged into — the base `EnemyDef`) is unchanged from AF-034's original design.
- Reviewed against `DirectorConductor`'s AF-056 structural guarantee: `recordKill()`/`recordNearDeath()` feed only `struggleScore`, which only affects `openRecoveryWindow()`'s window-length calculation — confirmed no code path lets either new input touch an enemy stat or spawn budget directly.
- Reviewed against `BossRuntime`'s phase-index-increment logic: zero edits — extending `phases[]` from 2 to 4 entries works through the existing generic `if (nextPhase && hullFraction <= nextPhase.hullThreshold)` check unchanged; only `bossData.ts`'s content and thresholds changed.
- Reviewed against `BossArena`'s hazard-zone engine: Meteor Shower is new content on the existing engine (`createMeteorImpact` mirrors `createOutlawMine`'s exact shape), not a second hazard mechanism.
- Reviewed against the locked `ADAPTIVE_RESPONSE_INPUTS`/`MUTATION_KINDS`/`ENEMY_ROLES`/`MUSIC_STATES` unions: every extension is additive-only; no existing member renamed, renumbered, or removed; confirmed via the extended `audio.test.ts`/`conductor.test.ts` length assertions.
- Reviewed for fairness (spec's own Spawning section): `pickSpawnOutsideViewport()` is checked before falling back to any other candidate, giving wave spawns real camera-outside placement where geometrically possible, matching "avoid impossible situations" / "spawn outside camera where possible."
- Reviewed for scope trims: vampiric life-steal was deliberately implemented only on the melee-hit-to-player path, not hostile projectiles, since projectiles carry no back-reference to their source drone and adding one would mean touching the shared `TestProjectile` interface used by both player and hostile projectiles — documented rather than silently done.
- Rejected scope creep: did not touch `EnemyDirector`'s phase-sequence content (reviewed and found already aligned with the spec's pacing shape — see the dedicated section above), did not invent a second hazard-zone or mutation-effect mechanism where an existing one could be extended, did not re-litigate any AF-0XX-locked file.

Score: 9.5/10 — approved and locked.
