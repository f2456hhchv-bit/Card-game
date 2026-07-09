# AF-084 — MISSION ROSTER FRAMEWORK

**Module status:** Complete (the expedition ecosystem — families, tiers, chains, the permanent log and the Operations Centre — on unchanged AF-037/083 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-083 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MISSION_ROSTER.md` + implementation (`src/game/missions/missionRosterData.ts`)

---

*(Module catalogued verbatim below.)*

84

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-083 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Mission Roster Framework.

The objective is not to create hundreds of missions.

The objective is to create an intelligent expedition ecosystem where every mission feels unique through combinations of objectives, environments, factions, discoveries and world evolution.

Players should never feel they are repeating content.

==================================================
CORE PHILOSOPHY
==================================================

Adventure.

Variety.

Discovery.

Consequences.

Replayability.

Every expedition becomes part of the player's personal history.

==================================================
MISSION FAMILIES
==================================================

Support major mission families:

Exploration

Combat

Rescue

Escort

Research

Survey

Sabotage

Defence

Recovery

Construction

Diplomacy

Civilian Support

Ancient Discovery

Prototype Recovery

Legendary Expedition

World Event

Faction Campaign

Future families extend naturally.

==================================================
MISSION TIERS
==================================================

Support:

Common

Special

Elite

Legendary

Ancient

Prototype

Mythic

Galaxy Event

Tier changes complexity and reward quality.

Not simply enemy strength.

==================================================
OBJECTIVE NETWORK
==================================================

Mission objectives may combine:

Combat

Exploration

Puzzle Solving

Scientific Analysis

Construction

Resource Gathering

Survival

Extraction

Boss Encounters

Diplomatic Decisions

Every combination feels intentional.

==================================================
WORLD REACTIVITY
==================================================

Mission outcomes influence:

Faction Reputation

Trade Routes

Civilian Growth

Research

Galaxy Stability

Resource Availability

Future Missions

Story Progression

The galaxy remembers player actions.

==================================================
DYNAMIC EVENTS
==================================================

Support:

Pirate Ambushes

Void Incursions

Solar Storms

Ancient Reactivations

Civilian Emergencies

Prototype Discoveries

Fleet Battles

Environmental Collapse

Scientific Breakthroughs

Events emerge naturally.

==================================================
LEGENDARY EXPEDITIONS
==================================================

Legendary missions feature:

Unique Bosses

Exclusive Lore

Hidden Objectives

Rare Relics

Prototype Technology

Ancient Discoveries

Galaxy Impact

Legendary expeditions become memorable milestones.

==================================================
CHAIN MISSIONS
==================================================

Support:

Multi-stage Expeditions

Commander Stories

Faction Campaigns

Research Projects

Exploration Chains

Galaxy Restoration

Ancient Mysteries

Mission chains create long-term narratives.

==================================================
MISSION GENERATOR
==================================================

Generation considers:

Player History

Campaign Progress

Biome

Faction Presence

Research

Galaxy State

Weather

Enemy Director

Boss Director

Exploration Progress

Every expedition feels handcrafted.

==================================================
MISSION COLLECTION
==================================================

Track:

Completed Missions

Legendary Expeditions

Perfect Completions

Optional Objectives

Hidden Discoveries

Boss Victories

Historical Timeline

Statistics

Collections reward exploration.

==================================================
GALAXY OPERATIONS CENTRE
==================================================

Support:

Mission Archive

Replay System

Statistics

Mission Search

Expedition Timeline

Commander Records

Reward History

Galaxy Activity

Operations become the player's command hub.

==================================================
BALANCE PRINCIPLES
==================================================

Missions reward:

Preparation.

Knowledge.

Exploration.

Adaptation.

Decision Making.

Never repetitive grinding.

Never artificial padding.

==================================================
ACCESSIBILITY
==================================================

Support:

Mission Search

Objective Filters

Difficulty Preview

Estimated Duration

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache procedural templates.

Optimise mission generation.

Pool objective logic.

Reuse event systems.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Mission Family

Objectives

Event State

Generation Seed

Reward Tier

Performance

==================================================
OUTPUT
==================================================

Produce the complete Mission Roster Framework.

Every future expedition, campaign, legendary mission and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate millions of expeditions.

Review mission families.

Review objective combinations.

Review dynamic events.

Review chain missions.

Review legendary expeditions.

Review replayability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-083.

Reduce repetitive structures.

Strengthen environmental storytelling.

Improve world reactivity.

Ensure the Mission ecosystem delivers virtually endless handcrafted-feeling expeditions where exploration, discovery and meaningful player decisions continually create fresh experiences throughout the lifetime of Afterlight.

Repeat until the Mission Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-084.

---

## Foundation / AF-000–083 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-076→082 roster move applied to expeditions, on unchanged shapes:** AF-037's engine and AF-083's `MissionProfileDef` stand untouched — the ecosystem is data. Seventeen mission families map TOTALLY onto AF-083's seventeen framework categories with a per-expedition THREE-LAYER BINDING (entry family → framework category → the profile's category, exact); the ten-surface objective network maps TOTALLY onto AF-037's objective-type shelf; the nine spec dynamic events map TOTALLY onto AF-037's ten event kinds (already bound to the real environmental vocabulary); and the eight world-reactivity surfaces each NAME the live system mission outcomes already feed.
- **"TIER CHANGES COMPLEXITY AND REWARD QUALITY, NOT SIMPLY ENEMY STRENGTH" is PROVEN, not stated:** the common-tier Winterline Rescue is asserted HARDER in raw difficulty (3) than the special-tier Crystal Fields Incursion (1) — the tier ladder is provably not the difficulty ladder — while the ancient-tier excavation runs strictly more modifier slots (complexity) than every lower-tier expedition. Entries are identity-only (family + tier, key-inspected); mythic and galaxyEvent tiers are honestly registered-empty.
- **CHAIN MISSIONS are ordered lists of REAL expeditions:** `MissionChainDef` + the pure `nextChainStageAfter` progression function; THE VAULT SIGNAL (ancientMysteries) chains the Crystal Fields incursion into the First Light excavation — the Void signature was following a signal — with every stage resolving against the real roster, stages unique, and the walk proven end-to-end (including its terminal null).
- **THE EXPEDITION LOG makes "every expedition becomes part of the player's personal history" LITERAL:** `ExpeditionLogRuntime` is permanent, append-only history with monotone sequence numbers — defeats remembered as honestly as victories ("failure should generate stories"), perfect completions and boss victories tracked, no-removal API asserted by prototype inspection. Wired at the REAL endRun seam: every run — victory or defeat — lands on the record with tier, optionals, boss state and play time.
- **The GALAXY OPERATIONS CENTRE is derivation:** `operationsCentreFor` assembles all eight features (mission archive through galaxy activity) from the log and existing ledgers — replay is honest (expeditions are seed-deterministic per AF-037), commander records point at AF-072's real ledger. Seven legendary-expedition features, seven chain kinds, ten generator inputs (extending AF-083's nine with both directors), eight collection kinds, two forbidden outcomes (repetitiveGrinding, artificialPadding) — registered shelves.
- **LIVE in the composition root:** the log records at endRun (browser-verified: a simulated defeat lands as `log 1 (0 perfect)` on the overlay's mission line — failure on the record, exactly as designed), and the overlay shows timeline length + perfect count beside the AF-083 budget and modifiers.
- **Self-review executed:** 9 new tests — the twelve shelves, the three total maps with live-binding assertions, the three-layer entry binding with key inspection, the tier-is-not-enemy-strength proof with honest-empty tiers, the chain battery through the pure progression function, the append-only log with sequence/no-removal proofs, the eight-feature Operations Centre on empty AND populated logs, **3,000 expeditions with globally unique instance ids**, and a **1,000-career seeded log sweep** (sequence strictly monotone, perfect ≤ victories, the ledger never drifts). Suite: 985 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero shape changes; the ecosystem as pure data + one append-only runtime + two pure functions; the first mission chain over real expeditions; personal history wired at the real end-of-run seam). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/MISSION_ROSTER.md`, `src/game/missions/missionRosterData.ts`.
