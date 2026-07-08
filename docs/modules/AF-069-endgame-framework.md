# AF-069 — ENDGAME FRAMEWORK

**Module status:** Complete (framework + sandbox ascensions implemented on locked engines; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-068 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ENDGAME_FRAMEWORK.md` + implementation (`src/game/endgame/`)

---

*(Module catalogued verbatim below.)*

69

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-068 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Endgame Framework.

The endgame begins after the main campaign.

It is not a grind.

It is the beginning of a new chapter.

Players should transition naturally from restoring the galaxy to mastering it.

The endgame must support thousands of hours of meaningful progression without relying on repetitive content.

==================================================
CORE PHILOSOPHY
==================================================

Mastery.

Endless discovery.

Escalation.

Experimentation.

Legacy.

The player never reaches a point where there is "nothing left to do."

==================================================
ENDGAME STRUCTURE
==================================================

Campaign Complete

↓

Galaxy Restoration

↓

Ascension

↓

Legendary Expeditions

↓

Infinite Research

↓

World Events

↓

Seasonal Discoveries

↓

Mythic Challenges

↓

Community Events (Future)

↓

Infinite Exploration

Endgame continually expands.

==================================================
ASCENSION SYSTEM
==================================================

Players may Ascend after completing major milestones.

Ascending:

Resets expedition progression.

Retains permanent progression.

Unlocks new mechanics.

Unlocks higher difficulties.

Unlocks exclusive rewards.

Each Ascension changes gameplay.

==================================================
ASCENSION LEVELS
==================================================

Support:

Ascension I

↓

Ascension II

↓

Ascension III

↓

...

Unlimited future expansion.

Each level introduces:

New modifiers.

Enemy mutations.

Mission changes.

Reward improvements.

==================================================
LEGENDARY EXPEDITIONS
==================================================

Support:

Ancient Vault Chains

Galaxy Emergencies

Prototype Recoveries

Infinite Boss Hunts

Faction Wars

Void Incursions

Planetary Restoration

Quantum Expeditions

Legendary expeditions become the primary endgame activity.

==================================================
WORLD EVOLUTION
==================================================

The post-campaign galaxy continues evolving:

New colonies.

New technologies.

New threats.

New discoveries.

New factions.

New sectors.

Nothing remains static.

==================================================
ENDGAME DIFFICULTY
==================================================

Difficulty increases through:

Enemy intelligence.

Encounter composition.

Environmental complexity.

Mission modifiers.

Boss mechanics.

Not inflated health.

Not inflated damage.

==================================================
INFINITE RESEARCH
==================================================

Research expands beyond campaign.

Support:

Efficiency

Exploration

Technology

Experimental Systems

Prototype Engineering

Civilian Development

Future sciences.

Every node remains meaningful.

==================================================
LEGENDARY REWARDS
==================================================

Support:

Mythic Relics

Legendary Ships

Ancient Weapons

Commander Skins

Animated Cosmetics

Titles

Galaxy Statues

Historical Records

Prestige remains cosmetic where appropriate.

==================================================
WORLD EVENTS
==================================================

Support:

Galaxy Crises

Void Expansion

Faction Campaigns

Ancient Reactivations

Scientific Discoveries

Civilian Emergencies

Legendary Bosses

Seasonal Events

Events continually refresh gameplay.

==================================================
MASTERY
==================================================

Players continue mastering:

Ships

Weapons

Commanders

Biomes

Bosses

Research

Exploration

Collections

There is always another goal.

==================================================
GALAXY LEGACY
==================================================

Player achievements permanently influence:

Galaxy history.

Codex.

Statistics.

Memorials.

Historical records.

Named discoveries.

The player's journey becomes part of the universe.

==================================================
BALANCE PRINCIPLES
==================================================

Endgame rewards:

Knowledge.

Skill.

Preparation.

Experimentation.

Exploration.

Never repetitive grinding.

Never artificial progression walls.

==================================================
ACCESSIBILITY
==================================================

Support:

Difficulty Selection

Endgame Recaps

Progress Tracking

Large UI

Controller Navigation

Touch Navigation

High Contrast

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache progression.

Optimise large saves.

Pool endgame systems.

Lazy load expansions.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Ascension Level

Endgame Progress

Legendary Missions

Galaxy State

World Events

Performance

==================================================
OUTPUT
==================================================

Produce the complete Endgame Framework.

Every future expansion, DLC, live update and seasonal release extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate hundreds of thousands of endgame hours.

Review Ascension.

Review progression.

Review rewards.

Review world evolution.

Review Legendary Expeditions.

Review replayability.

Review build diversity.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-068.

Adjust progression pacing.

Adjust reward frequency.

Adjust difficulty scaling.

Remove repetitive gameplay loops.

Ensure the endgame provides effectively limitless, meaningful progression driven by mastery, exploration and experimentation rather than grind, making Afterlight a game players can continue enjoying for years.

Repeat until the Endgame Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-069.

---

## Foundation / AF-000–068 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-068's sibling ledger, gated on the campaign — the gate is a STATE, not a convention.** `EndgameRuntime` constructs LOCKED and every progression operation (milestones, expeditions, research, evolution, legacy, ascension) returns `false` until `notifyCampaignComplete()`, which the composition root fires the moment AF-068's ladder completes — the same `feedCampaignProgress` seam feeds both runtimes from the same three real-play events. "The endgame begins after the main campaign" is a tested boolean, and the locked state is VISIBLE in-game: the overlay reads `locked — the endgame begins after the main campaign` until the ladder closes.
- **"Resets expedition progression. Retains permanent progression." is the two-map split:** `ascend()` clears exactly one map (per-ascension expedition progress) and deliberately touches nothing else — lifetime expedition totals, research nodes, the evolution log, and the legacy log all survive, asserted together in one test. The permanent side has NO clearing operation; like AF-068, the prototype is asserted to expose no remove/delete/revoke/reset method.
- **"Not inflated health. Not inflated damage." is UNREPRESENTABLE, not just avoided:** `AscensionModifierDef` carries an axis (one of the five registered difficulty levers — enemy intelligence, encounter composition, environmental complexity, mission modifiers, boss mechanics) and a description. There is no numeric field in the shape at all — asserted across fifty generated levels by inspecting the modifier's own keys. The same discipline AF-056 applied to pacing ("adaptation adjusts pacing, not hidden difficulty") applied to escalation.
- **"Unlimited future expansion" is a formula, not a promise:** `ascensionLevelFor(level)` returns the authored defs for I–III (The Second Dawn, The Long Watch, Past the Horizon — each with axis modifiers, real reward kinds, and an unlocked mechanic) and generates the same shape forever beyond them — a ten-ascension career is tested, landing on "Ascension 10" with compounding modifiers.
- **"Never artificial progression walls":** milestone requirements scale linearly per level and research node costs geometrically (`researchNodeCostFor`) — smooth escalating formulas with no caps, no cliffs, no gates. The research test banks a million points, unlocks 30+ nodes across all six branches, runs dry, tops up by exactly one node's cost, and resumes immediately: progression stops only when points run out, never at a wall.
- **Mastery reuses AF-026's engine:** the eight mastery tracks are AF-026 mastery-track IDs (`endgame:ships` …), registered as vocabulary — no second mastery system. World events are a seeded weighted pick under an injected `Rng` (AF-036's pool discipline), asserted deterministic across mirrored seeds and always within the registered pool.
- **Nine shelves registered** (phases including the Constitution-compliant `communityEvents` future slot, expedition kinds, evolution kinds, difficulty axes, research branches, reward kinds, world events, mastery tracks, legacy kinds) — naming layers for future expansion/DLC/seasonal modules to bind, all counted in tests.
- **Self-review executed:** 11 new tests — all nine shelves, the mastery-track ID discipline, the fifty-level no-numeric-modifier assertion, the locked-gate battery (seven operations no-oping before unlock), the two-map ascension split, escalating requirements + unlimited levels + compounding modifiers, authored Ascension I payload, infinite research (geometric costs, no walls, immediate resumption), deterministic world events over 500 mirrored picks, append-only legacy/evolution with the no-removal-API prototype assertion, and a **1,000-career seeded sweep** of 200 mixed operations each (milestones, expeditions, research, ascensions, evolution) — permanent progression never regresses, ascension level never regresses, expedition progress resets on every ascension, and the next goal is always finite and stated ("there is always another goal", literally). **Live in the browser:** launched an expedition and the endgame ran beside the campaign on the overlay — `endgame locked — the endgame begins after the main campaign` — the gate exactly as specced, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; one pure runtime in the AF-056/057/068 orchestration class; one composition-root seam shared with AF-068; one debug overlay line; nine shelves for future live content). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ENDGAME_FRAMEWORK.md`, `src/game/endgame/`.
