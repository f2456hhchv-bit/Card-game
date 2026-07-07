# AF-039 — FACTION FRAMEWORK

**Module status:** Complete (framework specified; profile/reputation/relationship/mission/event engine implemented and tested; a sandbox roster of three factions governs Galaxy Command's diplomacy layer end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-038 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/FACTION_FRAMEWORK.md` + implementation (`src/game/factions/`)

---

*(Module catalogued verbatim below.)*

39

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-038 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Faction Framework.

Factions transform the galaxy from a collection of missions into a living civilisation.

Every faction should possess its own identity.

History.

Technology.

Goals.

Military doctrine.

Culture.

Relationships.

Players should influence the galaxy without becoming the centre of it.

==================================================
CORE PHILOSOPHY
==================================================

Every faction believes it is right.

No faction is completely good.

No faction is completely evil.

Politics emerge from conflicting goals.

Player decisions create consequences.

==================================================
FACTION STRUCTURE
==================================================

Every faction defines:

Name

Symbol

Leader

Government

History

Technology

Military

Culture

Economy

Territory

Relationships

Unique Units

Unique Resources

Lore

Future expansion fields

==================================================
CORE FACTIONS
==================================================

Support:

Human Alliance

Crystal Dominion

Machine Collective

Solar Empire

Void Legion

Ancient Custodians

Independent Colonies

Mercenary Guild

Explorers Union

Nomad Fleet

Future factions extend this framework.

==================================================
FACTION ATTRIBUTES
==================================================

Every faction tracks:

Influence

Military Strength

Technology

Economic Power

Stability

Exploration

Aggression

Trust

Corruption

Expansion

Attributes evolve dynamically.

==================================================
REPUTATION SYSTEM
==================================================

Players build reputation through:

Mission Success

Trade

Research

Rescue Operations

Faction Requests

Story Decisions

Boss Defeats

Exploration

Reputation unlocks opportunities.

Never mandatory progression.

==================================================
REPUTATION LEVELS
==================================================

Hostile

Distrusted

Neutral

Known

Trusted

Respected

Honoured

Legendary Ally

Each level unlocks unique interactions.

==================================================
FACTION RELATIONSHIPS
==================================================

Factions maintain relationships with:

Other Factions

Galaxy Sectors

Player

Story Events

Major Discoveries

Relationships evolve independently.

==================================================
FACTION MISSIONS
==================================================

Support:

Aid Requests

Defense

Recovery

Research

Reconnaissance

Trade

Diplomatic Escort

Artifact Retrieval

Emergency Response

Faction War

Faction missions feel distinct.

==================================================
FACTION REWARDS
==================================================

Support:

Blueprints

Research

Ships

Weapons

Equipment

Commander Unlocks

Cosmetics

Resources

Unique Lore

Special rewards remain faction-specific.

==================================================
GALAXY POLITICS
==================================================

Events influence:

Territory

Trade

Research

Security

Mission Availability

Exploration

Conflict

Politics evolve naturally.

==================================================
CONFLICT SYSTEM
==================================================

Support:

Cold War

Border Conflict

Open War

Ceasefire

Alliance

Trade Agreement

Scientific Cooperation

Faction Collapse

Conflict changes gameplay.

==================================================
PLAYER CHOICE
==================================================

Players may:

Support

Ignore

Oppose

Negotiate

Explore Independently

Choices influence relationships.

Never permanently trap progression.

==================================================
FACTION EVENTS
==================================================

Support:

Scientific Breakthrough

Leadership Change

Civil Unrest

Machine Rebellion

Crystal Bloom

Ancient Awakening

Trade Festival

Emergency Broadcast

Future events extend naturally.

==================================================
LORE INTEGRATION
==================================================

Every faction expands:

Codex

Characters

History

Technology

World Building

Player understanding

Lore grows organically.

==================================================
ACCESSIBILITY
==================================================

Support:

Relationship Indicators

Large Reputation Cards

Controller Navigation

Touch Navigation

Search

Sorting

High Contrast

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Update relationships asynchronously.

Cache faction data.

Pool diplomacy UI.

Lazy load history.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Faction Status

Relationships

Influence

Reputation

Territory

Conflicts

Performance

==================================================
OUTPUT
==================================================

Produce the complete Faction Framework.

Every future civilisation, story campaign, diplomacy feature and galaxy expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of galaxy cycles.

Review faction behaviour.

Review diplomacy.

Review reputation progression.

Review political balance.

Review mission diversity.

Review rewards.

Review player agency.

Review lore consistency.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-038.

Adjust relationship values.

Adjust reputation pacing.

Adjust political events.

Remove repetitive interactions.

Ensure every faction feels like a living civilisation with believable goals, meaningful player interaction and long-term consequences for the evolving galaxy.

Repeat until the Faction Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-039.

---

## Foundation / AF-000–038 / GP-FINAL alignment review (recorded at catalogue time)

- **Core Factions pay off AF-010's nine-attribute content debt, not a second lore layer.** AF-010 §Factions explicitly recorded "full nine-attribute profiles are recorded as content debt for each faction's introducing module." AF-039 is that introducing module: `FactionDef` gives Crystal Dominion, Machine Collective, and Human Alliance (the three factions AF-038's sandbox galaxy already names by string) real History/Technology/Military/Culture/Economy/Territory/Unique Units/Unique Resources/Lore profiles for the first time. Territory reuses AF-038's `GalaxyRegion` type directly; Unique Units reference real AF-030/031/032 ids already in the sandbox roster (commanders, ships, a weapon); Unique Resources reference real AF-025 `ResourceType` ids (`crystalFragments`, `quantumCores`, `commonMaterials`, `rareAlloys`).
- **Faction Rewards are a discriminated union over existing acquisition id-spaces — zero new acquisition systems.** `FactionRewardDef`'s nine kinds map onto AF-025 blueprints/resources, AF-024 research points, AF-026 lore collection ids, and (structurally, for future content) AF-028/030/031/032 equipment/commander/ship/weapon ids. The sandbox roster's three Faction Missions only issue the four kinds with a real consumer today (`blueprint` → `crafting.unlockBlueprint`, `researchPoints` → `researchTree.addPoints`, `resource` → `crafting.addMaterial`, `lore` → `meta.discover("lore", …)`); `ship`/`weapon`/`equipment`/`commander`/`cosmetic` are registered vocabulary awaiting a per-category ownership/unlock system to bind against, the same "registered, no consumer yet" pattern used repeatedly since AF-028's `droneEffectiveness`.
- **Faction Missions reference AF-037 mission content by id — no second mission engine.** Every `FactionMissionDef.missionId` points at a real `SANDBOX_MISSIONS` entry (`crystal-fields-incursion`), exactly the way AF-038's `StarSystemDef.missionIds` already referenced mission content, not a new mission-generation/objective/modifier system.
- **Reputation persists through AF-026's `recordStat`, clamped by AF-038's exact `GalaxyRuntime.clampedDelta` — imported and reused directly, never reimplemented.** `GalaxyRuntime.clampedDelta` takes generic `(current, delta, min, max)` arguments with nothing galaxy-specific about it, so `FactionRuntime` does not duplicate it; the composition root calls the same static method against `faction:<id>:reputation` namespaced keys, the identical pattern AF-038 established for Sector Stability/Exploration%, now at the diplomacy layer.
- **Faction Events are a fifth naming layer over the shared `EnvironmentalEventTriggered` bus fact AF-017 introduced and AF-036/037/038 already extended.** Trade Festival/Scientific Breakthrough/Civil Unrest/Machine Rebellion/Crystal Bloom/Leadership Change echo AF-038's Trade Opportunities/Crystal Expansion/Machine Uprisings at the faction scale — content-authoring vocabulary, not a sixth event mechanism. `FactionRuntime.tryTriggerEvent()` reuses the identical weighted-pick-on-a-timer algorithm written inline in AF-036/037/038's runtimes, deliberately re-implemented inline a fifth time rather than extracted, to avoid editing a locked module for a non-bug refactor.
- **The Conflict System (Faction Relationships) is session-scoped runtime state, mirroring `GalaxyRuntime`'s exact precedent of not persisting its own position/timer state.** Only the meta-recorded Reputation statistic survives a reload; inter-faction relationship pairs reset to the roster's authored defaults each session, exactly as `GalaxyRuntime`'s current system/event timer already do.
- **Nine of the ten Faction Attributes are honestly registered, not consumer-backed yet.** Only Reputation is mechanically live per faction today. Influence, Military Strength, Technology, Economic Power, Stability, Exploration, Aggression, Trust, Corruption, and Expansion are registered vocabulary (`FACTION_ATTRIBUTE_KINDS`) with no statistic key yet — the same deferral AF-038 recorded for Faction Control's Conflict Status/Security/Corruption axes, not faked with placeholder numbers nothing reads.
- **Player Choice never blocks progression.** Ignore and Explore Independently carry a zero reputation delta by data (`PLAYER_CHOICE_REPUTATION_DELTA`), so the UI only needs Support/Oppose/Negotiate buttons — "doing nothing" is a first-class, always-available choice, never a dead end. Abandoning an active Faction Mission (Pause → Abandon Run) releases the queued offer rather than permanently consuming it, satisfying the spec's "never permanently trap progression" line directly.
- **Galaxy Command's existing legal-transition table (AF-016, locked) governs the UI wiring exactly as written — no transition table edit.** `GalaxyCommand`'s only outbound edges are `MissionSelect`/`Statistics`/`MainMenu`; accepting a Faction Mission therefore queues an `activeFactionMissionId` flag and routes through the existing `GalaxyCommand → MissionSelect → Loading` path rather than adding a new edge or a new `GameStateId`. (Caught live during browser verification: an initial implementation tried to transition `GalaxyCommand → Loading` directly and was correctly rejected by AF-016's `StateMachine`; fixed by respecting the existing legal path instead of touching the locked transition table.)
- **Self-review executed:** faction profile lookup by id/name, pairwise relationship defaulting/overriding, weighted Faction Event firing, the pure `reputationLevel` threshold lookup (floor/ceiling/neutral/monotonicity), and reuse of `GalaxyRuntime.clampedDelta` for reputation clamping are all deterministic and tested, including a 5,000-cycle sweep applying every Player Choice against a live roster and asserting reputation never breaches its bounds. Live in the browser: Support/Oppose/Negotiate buttons move a real persisted reputation number and level label, the Crystal Dominion ↔ Machine Collective relationship reads correctly from the roster's authored defaults, accepting a Faction Mission correctly queues through Mission Selection, and abandoning a run correctly releases the queued mission back to Galaxy Command — all observed with zero page errors.

**Review verdict:** ALIGNED (zero new lore roster, zero new acquisition systems, zero new event mechanism, zero new persistence layer, zero transition-table edits; `FactionRuntime`'s relationship/event engine is the only genuinely new mechanical surface, and it stays pure by design, exactly mirroring `GalaxyRuntime`). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/FACTION_FRAMEWORK.md`, `src/game/factions/`.
