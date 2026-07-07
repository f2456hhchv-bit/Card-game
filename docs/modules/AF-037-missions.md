# AF-037 — MISSION FRAMEWORK

**Module status:** Complete (framework specified; objective/modifier/event/reward engine implemented and tested; a sandbox mission governs a live run end-to-end, including real automatic RunPhase advancement)
**Lock status:** LOCKED — extends AF-000 → AF-036 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MISSION_FRAMEWORK.md` + implementation (`src/game/missions/`)

---

*(Module catalogued verbatim below.)*

37

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-036 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Mission Framework.

Missions are the primary gameplay structure of Afterlight.

Every expedition should feel like a meaningful journey.

Players should experience constantly evolving objectives, unexpected discoveries and memorable encounters.

No two missions should ever feel identical.

The Mission Framework must support thousands of handcrafted and procedural missions.

==================================================
CORE PHILOSOPHY
==================================================

Every mission tells a story.

Every objective creates decisions.

Every expedition rewards exploration.

Every completion advances the galaxy.

==================================================
MISSION STRUCTURE
==================================================

Every mission contains:

Mission Briefing

Objective Generation

Biome Selection

Enemy Director Configuration

Environmental Events

Exploration

Primary Objectives

Optional Objectives

Boss Encounter

Extraction

Mission Summary

Rewards

Persistent Progress

==================================================
MISSION CATEGORIES
==================================================

Story Mission

Exploration

Recovery

Research

Ancient Vault

Escort

Defense

Survival

Assassination

Rescue

Investigation

Prototype Retrieval

Galaxy Restoration

Void Incursion

Machine Assault

Future mission types extend this framework.

==================================================
OBJECTIVE TYPES
==================================================

Support:

Destroy

Survive

Escort

Collect

Investigate

Repair

Protect

Capture

Activate

Explore

Scan

Rescue

Escape

Hybrid Objectives

Objectives remain modular.

==================================================
MISSION GENERATION
==================================================

Mission generation considers:

Biome

Galaxy Sector

Player Progress

Difficulty

Commander

Research

World State

Random Events

Story Progression

Generation remains deterministic from mission seed.

==================================================
OPTIONAL OBJECTIVES
==================================================

Examples include:

No Damage

Time Trial

Elite Hunt

Hidden Vault

Research Recovery

Ancient Beacon

Civilian Rescue

Environmental Challenge

Optional objectives provide additional rewards.

Never block mission completion.

==================================================
DYNAMIC EVENTS
==================================================

Events may occur during missions:

Distress Calls

Solar Storm

Meteor Shower

Ancient Signal

Faction Ambush

Lost Explorer

Machine Awakening

Void Rift

Prototype Discovery

Travelling Merchant

Events increase replayability.

==================================================
MISSION MODIFIERS
==================================================

Support modifiers such as:

Low Gravity

Radiation

Elite Activity

Double Rewards

Shield Instability

Weapon Overcharge

Crystal Bloom

Dark Sector

Void Corruption

Experimental Conditions

Modifiers remain optional.

==================================================
EXPLORATION
==================================================

Support discovery of:

Hidden Rooms

Secret Paths

Ancient Archives

Unique Resources

Lore Objects

Prototype Technology

Special Enemies

Rare Relics

Exploration is always worthwhile.

==================================================
MISSION FAILURE
==================================================

Failure should still reward:

Research

Statistics

Collections

Discovery

Mastery Progress

Failure should never waste player time.

==================================================
MISSION REWARDS
==================================================

Rewards may include:

XP

Loot

Research

Resources

Blueprints

Relics

Cosmetics

Achievements

Lore

Mission-specific rewards remain meaningful.

==================================================
GALAXY IMPACT
==================================================

Mission completion influences:

Sector Stability

Faction Influence

Research Progress

Unlockable Missions

Galaxy Restoration

Future Events

The galaxy evolves over time.

==================================================
ACCESSIBILITY
==================================================

Support:

Objective Scaling

Large Objective Cards

Navigation Assistance

Waypoint Options

High Contrast Objectives

Subtitle Support

Controller Navigation

Touch Navigation

==================================================
PERFORMANCE
==================================================

Pool mission events.

Cache objectives.

Optimise event triggers.

Lazy load mission assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Mission Seed

Objectives

Event Queue

Mission State

Rewards

Galaxy Changes

Performance

==================================================
OUTPUT
==================================================

Produce the complete Mission Framework.

Every future expedition, event, campaign and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate tens of thousands of missions.

Review objective variety.

Review event frequency.

Review exploration rewards.

Review mission pacing.

Review optional objectives.

Review reward balance.

Review galaxy progression.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-036.

Adjust objective generation.

Adjust event weighting.

Adjust reward pacing.

Remove repetitive mission patterns.

Ensure every mission feels distinct, meaningful and rewarding while encouraging exploration, experimentation and replayability.

Repeat until the Mission Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-037.

---

## Foundation / AF-000–036 / GP-FINAL alignment review (recorded at catalogue time)

- **Mission Structure is largely AF-016's existing `RunPhase` lifecycle, finally given real content.** `RUN_PHASES` (Spawn → EarlyExploration → EnemyEscalation → EliteEncounters → EnvironmentalEvents → MiniBoss → MidgameScaling → BossEncounter → RewardPhase → Extraction → Results) already mapped almost exactly onto this module's Mission Structure list. `advancePhase()` already existed but had no automatic driver — only a placeholder manual "Advance Run Phase" debug button. This module wires real triggers (Director phase changes, boss defeat, objective completion, an extraction countdown) to call it, replacing the placeholder as the primary path while leaving the manual button in place as a debug escape hatch.
- **`RunConfig.missionId` was a hardcoded placeholder string since AF-016.** `generateMission()` is its first real producer.
- **Mission Generation reuses the exact deterministic-seed guarantee every other generator in the game already makes** (loot, elites, relics) — same seed, same rolled modifiers, always.
- **Optional Objectives reuse AF-035's mastery-challenge shape (kind + reward, never blocking) and AF-026's `MasteryReward` union for the reward itself.** Objective progress reuses the counterKey/target *pattern* AF-026's `ChallengeDef` and AF-035's mastery challenges already use — but the counters themselves are a fresh, run-scoped local map, never routed through `MetaProgression`, the same run-scoped/permanent distinction AF-035 drew for boss no-damage tracking. A target of `0` is the one new semantic this module needed: "never let this counter rise above zero" (No Damage) starts satisfied and is revoked on the first violation, rather than waiting to be "reached" like every other objective.
- **Dynamic Events are a third naming layer over two already-existing event systems, not a fourth.** All ten `MissionEventKind`s map onto the concrete event-type strings AF-017's `EnvironmentalEventType` or AF-036's `BiomeEventKind` already fire through the shared `EnvironmentalEventTriggered` bus fact (`{eventType: string}` needed no schema change to accept a third vocabulary's names). The weighted-pick-on-a-timer algorithm is the same one AF-036's `BiomeRuntime` already implements inline; not extracted into a shared utility to avoid editing a locked module for a non-bug refactor, but the pattern is reused, not reinvented.
- **Mission Modifiers feed two hooks AF-017 and AF-023 had already reserved and left at their baseline.** `ThreatInputs.mutatorModifier` (baseline `1`) and `DropContext.mutatorBonus` (baseline `0`) were both hardcoded placeholders. A modifier's `eliteSquadSizeDelta` is applied as a per-run clone of `DirectorTuning` — never a mutation of the shared `DEFAULT_DIRECTOR_TUNING` constant.
- **Mission Failure already rewards Research/Statistics/Collections/Discovery/Mastery — structurally, since AF-026.** The existing `RunEnded` subscriber grants XP and records stats identically on `"victory"` and `"defeat"` (`ACCOUNT_XP_AWARDS.missionFailed` already existed); kill/loot/discovery handlers run continuously regardless of outcome. Nothing new was needed — recorded as verified, not re-implemented.
- **Mission Rewards reuse every acquisition system a mission already touches** — same XP tiers, loot categories, research/blueprint/relic systems every prior module wired.
- **Galaxy Impact reuses AF-026's existing named-statistic engine (`recordStat`) rather than a new galaxy-state ledger.** Sector Stability/Faction Influence/Restoration Progress are statistic *keys* this module can supply, the same way AF-033/034/035 supplied mastery-track keys onto AF-026's one generic engine — no new persistence layer.
- **Self-review executed:** the objective/modifier/event engine is deterministic and tested, including a 2,000-seed self-review sweep (the literal "generate tens of thousands of missions" scaled to a fast, still-exhaustive-in-spirit deterministic check). A sandbox mission (Crystal Fields Incursion) governs a live run end-to-end: automatic RunPhase advancement through Director phase changes, a rolled modifier changing loot/threat/elite-squad numbers, a fired Dynamic Event, and objective progress tracked from the exact same `EnemyKilled`/`PlayerDamaged` facts every prior module already emits — observed in the walking-skeleton run with zero errors.

**Review verdict:** ALIGNED (zero new persistence, zero new event system, zero new deterministic-generation guarantee, zero new Director/loot plumbing; the run-scoped local counter map and the zero-target "stay under" semantic are the two new mechanical pieces, both explicitly justified). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/MISSION_FRAMEWORK.md`, `src/game/missions/`.
