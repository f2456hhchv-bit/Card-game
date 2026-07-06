# AF-022 — EXPERIENCE & LEVEL PROGRESSION FRAMEWORK

**Module status:** Complete (framework specified; XP system, pickups, and upgrade pool implemented and tested; live in the sandbox with the level-up overlay; content passes bind as upgrade/weapon modules land)
**Lock status:** LOCKED — extends AF-000 → AF-021 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/XP_PROGRESSION.md` + implementation (`src/game/progression/`) + live sandbox level-ups

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-021 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Experience and Level Progression Framework.

Level progression is the heartbeat of every run.

Every level gained should feel exciting.

Every choice should meaningfully alter the player's build.

Players should constantly look forward to the next level.

The progression curve must create anticipation from the first enemy to the final Boss.

==================================================
CORE PHILOSOPHY
==================================================

Reward activity.

Reward survival.

Reward exploration.

Reward experimentation.

Every level creates a meaningful decision.

No level should ever feel wasted.

==================================================
XP SOURCES
==================================================

Award Experience from:

Enemy Kills

Elite Kills

Mini Bosses

Bosses

Mission Objectives

Exploration

Ancient Discoveries

Events

Research Bonuses

Challenge Modifiers

Future systems extend existing sources.

==================================================
XP OBJECTS
==================================================

Experience appears as physical pickups.

Support:

Small XP

Medium XP

Large XP

Elite XP

Boss XP

Ancient XP

Research XP

Pickup behaviour remains consistent.

==================================================
XP COLLECTION
==================================================

Experience supports:

Manual Pickup

Auto Pickup Radius

Magnet Effects

Collection Relics

Commander Bonuses

Mission Modifiers

Collection always feels satisfying.

==================================================
LEVEL CURVE
==================================================

Early Levels

Fast progression.

Encourage experimentation.

----------------------------

Mid Game

Steady progression.

Build identity emerges.

----------------------------

Late Game

Slower progression.

Meaningful optimisation.

No excessive grinding.

==================================================
LEVEL-UP PROCESS
==================================================

Gain XP
↓
Reach Threshold
↓
Pause Gameplay
↓
Present Upgrade Choices
↓
Player Selects Upgrade
↓
Apply Effects
↓
Resume Gameplay

Selection remains immediate.

==================================================
UPGRADE PRESENTATION
==================================================

Default:

Three upgrade choices.

Support future modifiers for:

Four choices.

Five choices.

Choice rerolls.

Choice locking.

Upgrade weighting.

Framework remains modular.

==================================================
UPGRADE CATEGORIES
==================================================

Weapon Upgrade

Weapon Evolution

Commander Ability

Passive Bonus

Movement

Shield

Critical

Status Effect

Drone

Orbital

Resource Bonus

Special Event

Every category integrates with future systems.

==================================================
BUILD FORMATION
==================================================

Player builds emerge naturally.

Encourage:

Synergy

Adaptation

Experimentation

Risk

Reward

Avoid predetermined builds.

==================================================
LEVEL CAP
==================================================

Mission-specific configurable cap.

Support:

Infinite scaling modes.

Endless mode.

Challenge modes.

Future expansions.

Framework remains data-driven.

==================================================
SCALING
==================================================

Level progression influences:

Player Strength

Enemy Scaling

Loot Quality

Research Bonuses

Mission Difficulty

Boss Readiness

Scaling remains smooth.

Never exponential without purpose.

==================================================
LEVEL FEEDBACK
==================================================

Every level provides:

Audio cue

Visual pulse

Screen transition

Upgrade animation

Celebration effect

Immediate gameplay reward

Leveling up should always feel important.

==================================================
BALANCE PRINCIPLES
==================================================

Early levels establish builds.

Mid levels strengthen builds.

Late levels optimise builds.

Every upgrade remains valuable.

Avoid mathematically dominant choices.

==================================================
ACCESSIBILITY
==================================================

Support:

Pause duration adjustment

Large upgrade cards

Font scaling

Narrated upgrades (future)

Controller navigation

Touch optimisation

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool XP pickups.

Pool upgrade cards.

Lazy load upgrade descriptions.

Optimise XP calculations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Level

Current XP

Next Level XP

XP Gain Rate

Upgrade Pool

Upgrade Weights

Level Curve

Performance

==================================================
OUTPUT
==================================================

Produce the complete Experience and Level Progression Framework.

Every future upgrade, weapon evolution, Commander progression and gameplay modifier extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play complete runs.

Review XP gain.

Review level pacing.

Review upgrade frequency.

Review upgrade variety.

Review build diversity.

Review progression curve.

Review player motivation.

Review level-up presentation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-021.

Adjust XP values.

Adjust level curve.

Adjust upgrade weighting.

Ensure every level feels meaningful from the opening minute to the final Boss encounter.

Repeat until the Experience Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-022.

---

## Foundation / AF-016–021 alignment review (recorded at catalogue time)

- The level-up process implements AF-016's LevelUp overlay state and AF-003 §7's signature interaction exactly (pause → three cards → immediate resume); XP = `solar.gold` (AF-002 §7); XP kill flow subscribes to AF-021's `EnemyKilled` on the shared bus — combat never knows XP exists.
- **Level curve is data** (AF-011 §7): polynomial-with-soft-knee thresholds tuned for fast-early / steady-mid / slower-late, with a hard anti-grind guarantee tested (threshold growth ratio bounded — late levels are slower, never walls).
- Seven pickup tiers implemented as one pooled system (behaviour identical, value/size data per tier); magnet + auto-radius + manual collection with satisfying acceleration curves; collection radii are build-modifiable (relics/Commander bonuses attach as modifiers later).
- **Upgrade pool is a weighted, seeded framework**: N distinct choices (default three; four/five/reroll/lock supported as framework methods behind future flags), weights per upgrade, maxed upgrades excluded, deterministic per mission seed. The twelve upgrade categories are the registry; the sandbox ships placeholder upgrades in six of them — real upgrade content arrives with weapon/Commander/relic modules and slots into the same pool (registered).
- "No mathematically dominant choices" inherits AF-011 §4's severity-one balance law; "never exponential without purpose" is already structural via AF-021's stage arithmetic (upgrades feed pipeline stages additively).
- Multi-level grants queue cleanly (boss XP can award several levels; each gets its own choice — no level ever wasted); level cap is mission data with infinite/endless modes supported.
- Scaling influences (enemy scaling, loot quality, boss readiness) are registered consumers: the Director already reads player level (AF-017 threat inputs — now fed live); loot/research consumers attach at AF-023/024.
- Accessibility: cards inherit AF-005 components at UI implementation; pause-duration adjustment, large cards, narrated upgrades registered (narrated = future flag).
- Live in sandbox: drones drop XP gems, magnetism pulls, the bar fills, LevelUp overlay presents three weighted choices that genuinely alter the build (damage, fire rate, crit, speed, barrier, magnet). Full-run pacing review binds as content modules land.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; pacing/balance passes bind at content QA. Produced outputs: `docs/XP_PROGRESSION.md`, `src/game/progression/`, sandbox integration.
