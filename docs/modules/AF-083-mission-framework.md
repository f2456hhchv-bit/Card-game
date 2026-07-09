# AF-083 — MISSION FRAMEWORK

**Module status:** Complete (the expedition layer as profiles + a fourteen-part completeness law over AF-037's unchanged engine; three selectable expeditions live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-082 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MISSION_ARCHITECTURE.md` + implementation (`src/game/missions/missionFrameworkData.ts`)

---

*(Module catalogued verbatim below.)*

83

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-082 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Mission Framework.

Missions are not isolated levels.

Every mission is a believable expedition inside a living galaxy.

No two expeditions should feel identical.

Procedural generation should create variety without sacrificing quality, pacing or narrative.

Every mission should feel intentionally handcrafted.

==================================================
CORE PHILOSOPHY
==================================================

Adventure.

Discovery.

Replayability.

Purpose.

Escalation.

Every mission should tell a story through gameplay.

==================================================
MISSION ARCHITECTURE
==================================================

Every mission contains:

Unique ID

Mission Type

Biome

Difficulty

Threat Budget

Objectives

Sub Objectives

Faction Presence

Environmental Systems

Boss Potential

Rewards

Narrative Hooks

World State

Future Expansion Hooks

Nothing remains undefined.

==================================================
MISSION CATEGORIES
==================================================

Support:

Exploration

Combat

Rescue

Escort

Defense

Sabotage

Investigation

Research

Recovery

Assassination

Construction

Restoration

Survey

Legendary

Ancient

Prototype

World Event

Future mission types extend naturally.

==================================================
MISSION STRUCTURE
==================================================

Every mission progresses through:

Preparation

↓

Deployment

↓

Discovery

↓

Primary Objective

↓

Escalation

↓

Major Encounter

↓

Boss/Event

↓

Extraction

↓

Debrief

Structure adapts to mission type.

==================================================
OBJECTIVE SYSTEM
==================================================

Support:

Primary Objectives

Optional Objectives

Hidden Objectives

Faction Objectives

Commander Objectives

Research Objectives

Collection Objectives

Legendary Objectives

Players decide their priorities.

==================================================
PROCEDURAL GENERATION
==================================================

Mission generation considers:

Biome

Threat Level

Campaign Progress

Faction Activity

Galaxy State

Research

Difficulty

World Events

Player History

Generation always respects lore.

==================================================
MISSION EVENTS
==================================================

Support:

Distress Calls

Unexpected Bosses

Ancient Discoveries

Faction Battles

Prototype Recovery

Scientific Opportunities

Civilian Emergencies

Environmental Disasters

Events increase replayability.

==================================================
MISSION REWARDS
==================================================

Possible rewards include:

Credits

Resources

Blueprints

Research

Commander XP

Ship XP

Equipment

Relics

Ancient Technology

Legendary Discoveries

Rewards reflect mission difficulty.

==================================================
MISSION VARIATION
==================================================

Variation comes through:

Objectives

Layout

Enemy Mix

Weather

Hazards

Narrative Events

Bosses

Exploration

No mission should rely on randomisation alone.

==================================================
MISSION FAILURE
==================================================

Failure should create consequences:

Reduced rewards

Galaxy changes

Faction reactions

Lost opportunities

Alternative missions

Failure should generate stories.

Never frustration.

==================================================
MISSION HISTORY
==================================================

Record:

Completion

Time

Commander

Ship

Weapons

Bosses

Objectives

Rewards

Statistics

History becomes permanent.

==================================================
ACCESSIBILITY
==================================================

Support:

Mission Preview

Difficulty Preview

Objective Tracker

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Subtitles

==================================================
PERFORMANCE
==================================================

Cache mission templates.

Pool procedural generation.

Optimise objective tracking.

Reuse mission logic.

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

Threat Budget

Generation

Rewards

Performance

==================================================
OUTPUT
==================================================

Produce the complete Mission Framework.

Every future mission extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate millions of missions.

Review pacing.

Review objectives.

Review replayability.

Review rewards.

Review procedural variation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-082.

Reduce repetitive objectives.

Strengthen environmental storytelling.

Improve mission diversity.

Ensure every expedition feels like a meaningful adventure inside a living galaxy, combining handcrafted quality with procedural replayability that remains engaging across thousands of hours.

Repeat until the Mission Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-083.

---

## Foundation / AF-000–082 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-037 is the engine; AF-083 is the expedition doctrine over it:** `MissionDef`, the fifteen categories, fourteen objective types, modifier/event shelves, deterministic `generateMission`, and `MissionRuntime` (run-scoped counters, stay-under objectives, optional-never-blocks) stand untouched. `MissionProfileDef` wraps each expedition BY ID with framework category, threat budget, faction presence, environmental systems, narrative hooks, world-state key, reward kinds and expansion hooks; `missionArchitectureFor` proves all fourteen parts — "nothing remains undefined" as a function.
- **Three total maps, no new machinery:** the spec's seventeen categories map TOTALLY onto AF-037's fifteen; the spec's eight mission events map TOTALLY onto AF-037's ten (which already bind to the REAL environmental-event vocabulary — three naming layers over one bus fact, asserted end-to-end); the nine-phase mission structure names the EXISTING seam realising each phase (GalaxyCommand → startRun → BiomeRuntime → MissionRuntime → Director curve → MiniBoss → Boss/event → extraction window → endRun debrief) — no second state machine; and the eight objective kinds ride AF-037's TWO engine mechanisms (primary array, optional array) — no third objective array.
- **The roster gains its first expeditions beyond the sandbox:** WINTERLINE RESCUE (rescue, Frozen Reach, difficulty 3 — civilian recovery in the stillness) and FIRST LIGHT EXCAVATION (ancient vault, Ancient Core, difficulty 6, real boss potential on the Sentinel seam) extend the template array additively, both passing the fourteen-part law, with biomes resolving against REAL biome defs, bosses against AF-035's register, and faction presence against AF-039's register. THREAT BUDGET SCALES WITH DIFFICULTY — asserted strictly monotone (120 → 320 → 600). Per AF-058 the run's biome follows the galaxy map (travel selects terrain); the mission's biomeId is the expedition's authored setting, honestly noted.
- **Rewards, variation, failure and history are honest registries:** ten reward kinds with a live flag (six-plus already flowing through real systems — credits, resources, research, commander talent points, fleet records, loot); eight variation sources and nine generation inputs each NAMING the live system they draw from ("no mission relies on randomisation alone" — and the generator proof shows multiple distinct modifier rolls per template); five failure consequences, nine history fields, two forbidden outcomes (randomisationAlone, frustration) registered BY NAME.
- **LIVE in the composition root:** Mission Selection now offers ALL framework expeditions with category/difficulty/threat-budget previews (§Accessibility: mission + difficulty preview), the selected template feeds `generateMission` and the run, and the overlay's mission line shows the framework category and threat budget: `Winterline Rescue (rescue · budget 320) [Spawn] · primary 0/2 · optional 1/2 · modifiers [doubleRewards]`.
- **Self-review executed:** 10 new tests — the twelve shelves, the three total maps with the environmental-vocabulary chain, the live-seam and two-mechanism assertions, the three-expedition roster with real biome/boss/faction resolution, the fourteen-part law for every expedition, the monotone threat-budget law, the Winterline Rescue COMPLETED through the real runtime (rescue counters, stay-under revocation, optionals never blocking), per-seed determinism, **3,000 generated expeditions** (modifiers always from the template's own pool, slot counts exact, ids unique, variation real), and a **1,000-career seeded runtime sweep** (progress monotone, stay-under objectives never resurrect). Suite: 976 passing. **Live in the browser:** expedition selected, launched, and running with a rolled modifier — zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-037; the expedition layer as pure data + one completeness function; two new expeditions on real biomes with real gates; mission selection live). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/MISSION_ARCHITECTURE.md`, `src/game/missions/missionFrameworkData.ts`.
