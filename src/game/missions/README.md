# missions — Mission Framework (AF-037, game layer)

**Purpose:** The primary gameplay structure — every expedition should feel like a meaningful journey with evolving objectives, not an identical repeat. Almost every numeric hook this module needs was already reserved by an earlier module and left unused.

**Responsibilities:** Data shapes for category/objective-type/optional-objective/modifier/event vocabulary and `MissionDef` (`missionData`); deterministic modifier rolling from a mission seed, the same guarantee every other seeded generator makes (`MissionGenerator`); run-scoped objective progress tracking, optional-objective grants that never block completion, weighted event scheduling, and modifier-derived numeric feeds (`MissionRuntime`).

**Dependencies:** `game/meta` (`MasteryReward` — optional-objective rewards are the same cosmetic-only union everything else uses). `game/progression` (`XpTier` — mission reward tier). References AF-036's `biomeId` and AF-035's `bossId` as content, not code.

**Data structures:** `MissionDef`, `ObjectiveDef`, `MissionModifierDef`, `MissionEventDef`, `MissionInstance`, `MissionSnapshot`.

**Extension points:** new missions are data; `MISSION_EVENT_TO_ENVIRONMENTAL_EVENT` maps all ten `MissionEventKind`s onto the concrete event-type strings AF-017's `EnvironmentalEventType` or AF-036's `BiomeEventKind` already fire through the shared `EnvironmentalEventTriggered` bus fact — a third naming layer over two existing systems, not a fourth event engine. Objective `type` (`OBJECTIVE_TYPES`) is complete content vocabulary; only `destroy`/`survive`-shaped objectives (counter reaches a target, or a counter that must stay at zero) are mechanically exercised by the sandbox mission — the rest describe real gameplay verbs (Escort, Repair, Capture, Scan, …) that bind to their own systems as those arrive, the same "registered, no consumer yet" pattern established repeatedly.

**Known limitations:** mission briefing/summary UI, waypoints, and navigation assistance build from AF-003/AF-005 at the UI module; Galaxy Impact (Sector Stability, Faction Influence, …) reuses AF-026's existing named-statistic engine (`recordStat`) rather than a new galaxy-state ledger — this module supplies the statistic *keys*, not a new persistence layer; only one sandbox mission template governs a live run today, driving real automatic `RunPhase` advancement (AF-016) instead of the placeholder manual "Advance Run Phase" debug button.
