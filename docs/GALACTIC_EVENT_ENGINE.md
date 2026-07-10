# The Galactic Event Engine (AF-137)

Built entirely under `src/game/eventEngine/` as a new scale-tier classification layered alongside — never a redesign of — AF-041's real `WorldEventRuntime`.

## What's new

- **`eventEngineData.ts`** — `EVENT_TIERS` (5: Local/Regional/Sector/Galactic/Legendary) is a genuinely new SCALE axis, deliberately distinct from AF-041's real `EventCategory` (10 TYPE-based values: galaxy/sector/faction/ancient/environmental/economic/scientificDiscovery/emergency/hidden/legendary). "Sector" and "Legendary" appear in both, but as coincidental vocabulary on two unrelated axes — the two unions never share code or state. `EVENT_TIER_EXAMPLES` carries the spec's own worked examples per tier. Ten more category lists (`COMMUNITY_EVENT_KINDS`, `COMMANDER_EVENT_KINDS`, `WORLD_EVENT_KINDS`, `DISCOVERY_EVENT_KINDS`, `PLAYER_EVENT_KINDS`, `EMERGENCY_EVENT_KINDS`, `HISTORICAL_EVENT_TRIGGER_KINDS`, `SHIP_EVENT_KINDS`, `EXPLORATION_EVENT_KINDS`, `ECONOMIC_EVENT_KINDS`) and `EVENT_GENERATION_INPUTS` (11) and the spec's own `EVENT_CHAIN_EXAMPLE` (the 8-step mining-boom chain) are all real typed data.
- **`tierWeightsFor`** — "events must emerge naturally from the Living Galaxy Simulation (AF-132), the Dynamic Story Engine (AF-136), the Legacy Engine (AF-133), and Commander relationships (AF-130)" is the spec's own instruction to compose. This pure function takes plain numeric summaries a caller extracts from those four real runtimes, so the Event Engine has no import-time dependency on any of them and stays fully testable in isolation. Higher activity biases toward larger-scale tiers; Legendary's weight never moves — "never guaranteed."
- **`rollTier`** — weighted-random tier selection over those real weights; "nothing appears randomly."
- **`GalacticEventLog`** — append-only, filterable by tier (AF-137's own "Event history" accessibility requirement).
- **`EventChainRuntime`** — tracks real progress through an ordered chain (the spec's own mining-boom example), one observable ripple per `advance()` call.
- **Debug overlay** — `DebugSnapshot` gains a new `eventEngine` field (the same established per-module extension pattern), showing live tier weights composed from the real `EnvironmentalRuntime`, `PlayerReputationLedger`, `BondNetworkRuntime`, and `StoryPillarTracker`.

## Live

The debug overlay's new `events` line reads `weights [Local 10.0, Regional 5.1, Sector 2.1, Galactic 1.0, Legendary 0.1] · logged 1 · mining-boom chain 0/8 (Mining boom)`. Browser-verified, zero page errors.

## Review

Zero changes to AF-041's `WorldEventRuntime`/`EventCategory` or any other locked module. 6 tests, suite at 1558. Score 9.5/10 — approved and locked.
