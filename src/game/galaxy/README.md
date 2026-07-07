# galaxy — Galaxy Framework (AF-038, game layer)

**Purpose:** The permanent overworld — not a mission-select screen. Regions, systems, and points of interest reuse AF-010's canon and AF-036/037's biome/mission content directly; almost nothing here is a new system.

**Responsibilities:** Data shapes for region/point-of-interest/galaxy-event/long-term-goal vocabulary and `GalaxyDef`/`StarSystemDef` (`galaxyData`); route traversal, Fast Travel gating, and weighted Galaxy Event scheduling (`GalaxyRuntime`).

**Dependencies:** `game/meta` (`CollectionCategory` — point-of-interest discovery reuses already-registered categories, no new discovery vocabulary). References AF-036's `biomeId` and AF-037's `missionIds` as content. Fast Travel gates on AF-024's `galaxyNavigation` research category / `galaxyUnlock` node type, both registered since AF-024 with no producer until now (`warp-charting` in `SANDBOX_RESEARCH_TREE` is their first).

**Data structures:** `GalaxyDef`, `GalaxyRegionDef`, `StarSystemDef`, `PointOfInterestDef`, `GalaxyEventDef`, `GalaxySnapshot`.

**Extension points:** new regions/systems/points of interest are data; `GalaxyRuntime.clampedDelta()` is a pure helper — Sector Stability, Faction Influence, and Exploration% are **not** a new persistence layer. The composition root applies clamped deltas through AF-026's existing `MetaProgression.recordStat`, namespaced per system (`galaxy:<systemId>:stability`, etc.), the exact pattern AF-037 already established for Galaxy Impact statistics. Long-Term Goals (`LONG_TERM_GOAL_KINDS`) are content labels over those same statistics, not a new tracking system.

**Known limitations:** the galaxy map UI (regions, routes, threat levels, faction borders, search/filters) builds from AF-003/AF-005 at the UI module; only one sandbox galaxy (three systems in the Crystal Dominion) governs a live session today; Faction Control's Conflict Status/Security/Corruption axes are registered vocabulary without their own statistic keys yet — Sector Stability and Exploration% are the two mechanically live per-system numbers.
