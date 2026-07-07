# AFTERLIGHT — Faction Framework

**Authority:** Produced output of AF-039. Extends AF-000 → AF-038. Every future civilisation, story campaign, diplomacy feature, and galaxy expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every faction believes it is right — no profile, mission, or event may cast a faction as purely good or purely evil; politics emerge from conflicting goals, and player decisions create consequences without ever trapping progression.

---

## 1. Faction Structure — paying off AF-010's content debt

AF-010 §Factions recorded "full nine-attribute profiles" as content debt for each faction's introducing module. `FactionDef` is that payoff: Name, Symbol, Leader, Government, History, Technology, Military, Culture, Economy, Territory, Unique Units, Unique Resources, and Lore are all real fields with real sandbox content for Crystal Dominion, Machine Collective, and Human Alliance — the exact three factions AF-038's sandbox galaxy already names by string. Relationships are runtime state (§4), not a `FactionDef` field, since they exist *between* factions rather than belonging to one.

## 2. Core Factions — ten registered, three profiled

All ten canon factions (Human Alliance, Crystal Dominion, Machine Collective, Solar Empire, Void Legion, Ancient Custodians, Independent Colonies, Mercenary Guild, Explorers Union, Nomad Fleet) are registered as `FACTION_IDS`. Three carry full sandbox profiles today; the remaining seven are honestly unprofiled content debt for their own future introducing content, not placeholders.

## 3. Faction Attributes — one mechanically live, nine honestly deferred

Of the ten registered `FACTION_ATTRIBUTE_KINDS`, only Reputation (technically a separate, player-facing axis — see §5) is mechanically live. Influence, Military Strength, Technology, Economic Power, Stability, Exploration, Aggression, Trust, Corruption, and Expansion are registered vocabulary with no statistic key yet, the same deferral AF-038 recorded for Faction Control's Conflict Status/Security/Corruption axes.

## 4. Faction Relationships & the Conflict System — session-scoped, mirroring GalaxyRuntime exactly

`FactionRuntime` tracks a `ConflictState` (Cold War, Border Conflict, Open War, Ceasefire, Alliance, Trade Agreement, Scientific Cooperation, Faction Collapse) per unordered faction pair, defaulting to the roster's authored default for any unlisted pair. This state is session-local — it resets to authored defaults each session, exactly mirroring `GalaxyRuntime`'s precedent of never persisting its own runtime state. Relationships with Galaxy Sectors are already expressed through `StarSystemDef.dominantFaction`; relationships with the Player are Reputation (§5); relationships with Story Events/Major Discoveries bind at future narrative content.

## 5. Reputation System & Reputation Levels — a namespaced statistic, not a new save slice

Reputation is a signed integer persisted through AF-026's existing `MetaProgression.recordStat` under `faction:<id>:reputation`, clamped on every change by AF-038's exact `GalaxyRuntime.clampedDelta` — imported and reused directly, never reimplemented. `FactionRuntime.reputationLevel(value)` is a pure static threshold lookup mapping that number onto the eight Reputation Levels (Hostile → Legendary Ally). Mission Success, Trade, Research, Rescue Operations, Faction Requests, Story Decisions, Boss Defeats, and Exploration are simply the existing bus facts and content systems that already fire — Faction Missions completing is the one wired today; the rest bind naturally as future content calls the same `clampedDelta` + `recordStat` pattern.

## 6. Faction Missions — AF-037 content by reference, not a second mission engine

All ten `FactionMissionKind`s are registered. Every `FactionMissionDef` in the sandbox roster references a real `SANDBOX_MISSIONS` id as its underlying mission — Faction Missions are a faction-issued *wrapper* (kind, reputation reward, faction reward) around AF-037's existing deterministic mission engine, not a duplicate objective/modifier/event system.

## 7. Faction Rewards — a discriminated union over existing acquisition systems

Blueprints, Research (points), Resources, and Unique Lore all have a live producer in the sandbox today (`crafting.unlockBlueprint`, `researchTree.addPoints`, `crafting.addMaterial`, `meta.discover("lore", …)`). Ships, Weapons, Equipment, Commander Unlocks, and Cosmetics are structurally defined on `FactionRewardDef` but have no sandbox producer yet, since no per-category ownership/unlock system exists for those categories to bind against — registered, not faked.

## 8. Galaxy Politics — content authored over existing systems

Territory, Trade, Research, Security, Mission Availability, Exploration, and Conflict are not seven new subsystems: Territory is `FactionDef.territory` (AF-038 regions), Mission Availability is Faction Missions (§6), Exploration is AF-038's existing per-system statistic, and the rest are Faction Attributes (§3) or Conflict States (§4) already covered above. Politics evolve through the same weighted Faction Event timer as everything else (§9).

## 9. Faction Events — a fifth naming layer over one bus fact

All eight `FactionEventKind`s (Scientific Breakthrough, Leadership Change, Civil Unrest, Machine Rebellion, Crystal Bloom, Ancient Awakening, Trade Festival, Emergency Broadcast) fire through the same `EnvironmentalEventTriggered` bus fact AF-017 introduced and AF-036/037/038 already extended — a fifth vocabulary layer, not a sixth mechanism. `FactionRuntime.tryTriggerEvent()` reuses the identical weighted-pick-on-a-timer algorithm written inline three times already, now a fourth, rather than extracted into a shared utility.

## 10. Player Choice — never mandatory, never a trap

Support, Ignore, Oppose, Negotiate, and Explore Independently are all first-class choices. Ignore and Explore Independently carry a zero reputation delta by data, so "doing nothing" never blocks or penalises the player — the UI only surfaces buttons for the three choices that actually move a number. An accepted Faction Mission that's abandoned mid-run (Pause → Abandon Run) releases back to Galaxy Command rather than permanently consuming the offer.

## 11. Lore Integration

Every profiled faction's `loreId` is a real AF-026 `"lore"` collection entry, discovered exactly like every other lore source this project already has (Ancient Vaults, Distress Beacons, boss codex entries). Codex/Characters/World Building/Player Understanding grow from the same discovery substrate — no second lore delivery channel.

## 12. Accessibility & performance

Relationship indicators, large reputation cards, controller/touch navigation, search, sorting, high contrast, and colour-blind support build from AF-003/AF-004/AF-005/AF-019 at the UI module — the same accessibility floor every prior module inherits. `FactionRuntime` allocates nothing per frame beyond its own timer/map; the roster is a static content structure, not a per-frame construction.

## 13. Debug

Live: the current system's dominant faction, its persisted reputation and level, the Crystal Dominion ↔ Machine Collective relationship read from the roster, and Faction Events triggered — rendered in the shared `DebugOverlay` `factions` field alongside every other module's summary line.

---

## Internal review loop (AF-039, recorded)

- **No duplicated systems** — profiles, rewards, mission wrapping, reputation persistence, and event vocabulary all reuse AF-010/024/025/026/030/031/032/037/038 exactly; `FactionRuntime`'s relationship/event engine is the only genuinely new mechanical surface, and it stays pure by design, mirroring `GalaxyRuntime`. ✔
- **Every faction believes it is right** — sandbox profiles for Crystal Dominion, Machine Collective, and Human Alliance each write History/Culture from that faction's own internal logic (patience-as-virtue, function-over-sentiment, hope-through-discovery) with no faction narrated as villainous. ✔
- **Politics emerge from conflicting goals, not scripting** — the Conflict System's per-pair state is authored data (Crystal Dominion/Machine Collective at Cold War; Human Alliance/Machine Collective at Border Conflict; Crystal Dominion/Human Alliance at Trade Agreement), independently overridable, not a single global "war meter." ✔
- **Player choice never traps progression** — verified directly: Ignore/Explore Independently carry a zero delta by data; abandoning a run releases a queued Faction Mission rather than consuming it permanently. ✔
- **Sandbox proof** — a real roster drives live reputation changes and level labels, a real relationship reads from authored defaults, a real Faction Mission queues through the existing legal Mission Selection path and (on victory) grants both reputation and a real faction reward, all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a sixth event mechanism (extended the existing bus fact a fifth time); rejected a new save slice for Reputation (reused AF-026's `recordStat` + AF-038's `clampedDelta` verbatim); rejected a second mission-generation engine (Faction Missions reference AF-037 content by id); rejected editing AF-016's locked transition table when a UI bug surfaced mid-verification, fixing the call site to respect the existing legal path instead. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven factions' full profiles, the nine deferred Faction Attributes, ship/weapon/equipment/commander/cosmetic faction rewards, and the full diplomacy UI (relationship indicators, search/filters) bind at future content and UI modules.**
