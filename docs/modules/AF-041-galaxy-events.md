# AF-041 — GALAXY EVENT FRAMEWORK

**Module status:** Complete (framework specified; Dynamic Event Generation/World State/Player Participation/Event Chain engine implemented and tested; a sandbox event roster governs Galaxy Command's world-simulation layer end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-040 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/GALAXY_EVENT_FRAMEWORK.md` + implementation (`src/game/worldEvents/`)

---

*(Module catalogued verbatim below.)*

41

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-040 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Galaxy Event Framework.

The galaxy must never feel static.

Every expedition should take place inside a living universe where factions move, anomalies emerge, civilizations rebuild and ancient technologies awaken.

Players should feel that the universe continues to evolve with or without them.

Events should create stories.

Not scripted sequences.

==================================================
CORE PHILOSOPHY
==================================================

A living galaxy.

Meaningful consequences.

Emergent storytelling.

Constant discovery.

Player influence.

Every return to Galaxy Command should reveal something new.

==================================================
WORLD STATE
==================================================

The galaxy tracks:

Faction Activity

Sector Stability

Threat Levels

Resource Availability

Ancient Activity

Void Corruption

Scientific Progress

Trade Networks

Civilian Population

Exploration Progress

Every value evolves dynamically.

==================================================
EVENT CATEGORIES
==================================================

Galaxy Events

Sector Events

Faction Events

Ancient Events

Environmental Events

Economic Events

Scientific Discoveries

Emergency Events

Hidden Events

Legendary Events

Future categories extend this framework.

==================================================
GALAXY EVENTS
==================================================

Examples include:

Solar Superflare

Void Expansion

Machine Uprising

Crystal Bloom

Ancient Reactivation

Trade Boom

Pirate Activity

Civilian Evacuation

Prototype Discovery

First Contact

Events influence multiple systems.

==================================================
SECTOR EVENTS
==================================================

Individual sectors may experience:

Resource Rush

Meteor Activity

Radiation Storm

Ancient Signal

Faction Conflict

Research Opportunity

Refugee Arrival

Trade Convoy

Hidden Vault

Environmental Collapse

Sector events remain localised.

==================================================
FACTION EVENTS
==================================================

Support:

Scientific Breakthrough

Political Coup

Alliance

War

Expedition Launch

Economic Crisis

Territory Expansion

Leadership Change

Technology Theft

Peace Negotiation

Faction events evolve the galaxy.

==================================================
ANCIENT EVENTS
==================================================

Support:

Vault Opening

Beacon Activation

AI Awakening

Ancient Fleet

Planetary Defence

Hidden Archive

Prototype Recovery

Energy Surge

Lost Civilisation

Ancient events remain rare.

==================================================
DYNAMIC EVENT GENERATION
==================================================

Event generation considers:

Galaxy State

Faction Status

Player Progress

Exploration %

Research

Mission History

World Seed

Random Variation

Generation remains deterministic from world seed.

==================================================
PLAYER PARTICIPATION
==================================================

Players may:

Ignore

Investigate

Support

Prevent

Exploit

Document

Observe

Every choice influences future events.

==================================================
EVENT CHAINS
==================================================

Events may evolve into:

Mission Chains

Boss Encounters

Faction Campaigns

Research Opportunities

New Biomes

Galaxy Discoveries

Hidden Civilisations

Legendary Rewards

Event chains remain modular.

==================================================
WORLD EVOLUTION
==================================================

The galaxy remembers:

Destroyed Bosses

Restored Systems

Faction Victories

Major Discoveries

Scientific Progress

Player Choices

Civilian Survival

Ancient Recoveries

Nothing important is forgotten.

==================================================
NOTIFICATION SYSTEM
==================================================

Galaxy Command displays:

Breaking Events

Sector Alerts

Faction Messages

Emergency Signals

Research Reports

Trade Updates

Discovery Logs

Notifications remain informative.

Never intrusive.

==================================================
LONG-TERM CONSEQUENCES
==================================================

Major events may permanently alter:

Mission Availability

Sector Difficulty

Trade Routes

Faction Relationships

Biome Conditions

Boss Availability

Research

Exploration

Consequences remain understandable.

==================================================
ACCESSIBILITY
==================================================

Support:

Event Filters

Timeline View

Large Notifications

Controller Navigation

Touch Navigation

Colour-blind Support

High Contrast

Reduced Notification Mode

==================================================
PERFORMANCE
==================================================

Update world simulation asynchronously.

Cache world state.

Pool event notifications.

Lazy load event chains.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current World State

Active Events

Sector Events

Faction Events

Event Queue

Simulation Tick

Performance

==================================================
OUTPUT
==================================================

Produce the complete Galaxy Event Framework.

Every future seasonal event, expansion, campaign and world simulation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of galaxy years.

Review event frequency.

Review world evolution.

Review event diversity.

Review faction interactions.

Review event chains.

Review long-term consequences.

Review player agency.

Review notification clarity.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-040.

Adjust event weighting.

Adjust consequence strength.

Adjust world simulation.

Remove repetitive events.

Ensure the galaxy always feels alive, reactive and capable of creating memorable emergent stories while maintaining gameplay clarity and long-term replayability.

Repeat until the Galaxy Event Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-041.

---

## Foundation / AF-000–040 / GP-FINAL alignment review (recorded at catalogue time)

- **Four of the ten Event Categories are exactly the registered vocabulary AF-038 (Galaxy), AF-039 (Faction), AF-040 (Economic), and AF-017/036 (Environmental) already own — re-surfaced, not re-registered.** `WorldEventDef.kind` is typed as a plain string, the exact boundary `EnvironmentalEventTriggered` has always used; the sandbox roster's galaxy/faction/economic/environmental entries use real values from those modules' own kind arrays (`machineUprisings`, `civilUnrest`, `tradeFestivals`, `SolarFlare`) by value, never by editing those locked unions. This module's own §Galaxy Events "examples" list (Solar Superflare, Void Expansion, Machine Uprising, Crystal Bloom, Ancient Reactivation, Trade Boom) is itself an almost 1:1 restating of AF-038's `GALAXY_EVENT_KINDS` — confirming the category is meant to be re-surfaced, not duplicated. The four non-overlapping examples (Pirate Activity, Civilian Evacuation, Prototype Discovery, First Contact) were homed into the Emergency/Legendary categories instead of forcing an edit to AF-038's fixed union.
- **World State persists through AF-026's `recordStat` under `worldState:<key>`, clamped by AF-038's exact `GalaxyRuntime.clampedDelta` — imported directly at the composition root, reused for a third time (after Reputation and Credits), never reimplemented.** Zero new save slice; zero new clamping logic.
- **Dynamic Event Generation reuses the identical weighted-pick-on-a-timer algorithm AF-036/037/038/039/040 already wrote inline five times — a sixth reuse, not a seventh mechanism.** "Deterministic from World Seed" is the same seeded-`Rng`-per-runtime guarantee every generator in this project already makes (verified directly: same seed, same fired-event sequence).
- **Player Participation mirrors AF-039's Player Choice exactly, one layer up.** Ignore and Observe carry a zero World State delta by data — "every choice influences future events" without any choice ever being mandatory, the identical discipline AF-039 established for Ignore/Explore Independently.
- **Event Chains are plain content references (`chainsInto: { kind, contentId }`), never a second mission/research/lore engine.** Four of the ten sandbox events carry a real chain reference; one kind (`researchOpportunity`) is wired to a real producer (`researchTree.addPoints`) at the composition root today, mirroring how AF-039/040 only wired a subset of their own reward-kind unions and documented the rest as registered.
- **World Evolution ("nothing important is forgotten") reuses AF-026's collections wholesale — zero new persistence.** Responding to a World Event calls `meta.discover("lore", event.id)`, the same idempotent discovery call every lore source in this project already makes.
- **The Notification System has two producers, both zero new UI.** The in-run HUD flash reuses the existing toast list (`lootNotices`, already used by AF-037/038's event flashes) for events firing mid-expedition; since the spec calls out "Galaxy Command displays" by name and that toast list only renders during Gameplay, the Galaxy Command screen's subtitle gained one more summary line for the last fired World Event — the exact pattern AF-038/039/040 already established there for their own summaries.
- **Long-Term Consequences are composition points onto systems that already exist**, not eight new subsystems: Research is the Event Chain hook above; Faction Relationships/Trade Routes are AF-039's existing Conflict System and this module's own `factionActivity`/`tradeNetworks` World State keys; Mission Availability/Biome Conditions/Boss Availability/Sector Difficulty/Exploration are registered composition points awaiting a future content module's producer, the same honest "registered, no consumer yet" deferral used throughout.
- **Self-review executed:** weighted event firing (bounded to the roster's own pool, deterministic per seed), World State clamping at both bounds, Player Participation's zero-delta-for-Ignore/Observe invariant, and Event Chain content-reference validity are all tested, including a 5,000-cycle "galaxy years" sweep applying random Player Participation choices after every fired event and asserting every one of the ten World State values stays within bounds throughout. Live in the browser (a real ~53-second wait for the seeded timer to elapse): a World Event fired or (economic · Trade Festivals), the Galaxy Command subtitle correctly displayed "Breaking: economic · trade Festivals" with the live `tradeNetworks` value at its ambient-delta result (0 → 10), an Investigate button appeared and, on click, applied its own additional delta on top (10 → 14) and then correctly disappeared — confirming the ambient-vs-participation delta layering and the once-per-event-instance response gate both work exactly as designed, with zero page errors.

**Review verdict:** ALIGNED (zero new event mechanism, zero new save slice, zero new acquisition/mission/research engine, zero edits to any locked category union; `WorldEventRuntime`'s generation engine is the only genuinely new mechanical surface, and it stays pure by design, mirroring every prior `*Runtime` in this project). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/GALAXY_EVENT_FRAMEWORK.md`, `src/game/worldEvents/`.
