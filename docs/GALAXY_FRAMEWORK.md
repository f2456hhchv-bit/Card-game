# AFTERLIGHT — Galaxy Framework

**Authority:** Produced output of AF-038. Extends AF-000 → AF-037. Every future sector, expansion, civilisation, and campaign extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the galaxy is the permanent overworld, not a mission-select screen — every layer (region → system → point of interest) is real, explorable, and persists what the player has done to it.

---

## 1. Galaxy Structure — an eight-layer hierarchy, three layers mechanically live

Regions → Constellations → Star Clusters → Star Systems → Planets → Mission Locations → Points of Interest → Ancient Sites → Secrets is registered vocabulary end to end. `GalaxyDef`/`GalaxyRegionDef`/`StarSystemDef`/`PointOfInterestDef` make Regions, Star Systems, and Points of Interest mechanically real today; Constellations, Star Clusters, Planets, Mission Locations, Ancient Sites, and Secrets are honestly deferred content granularity within the same shapes (a `StarSystemDef` already carries the `missionIds`/POI arrays that would host them), not placeholders faked with dead fields.

## 2. Galaxy Regions — AF-010's canon, not a second lore layer

All ten regions (Human Frontier, Crystal Dominion, Machine Expanse, Solar Wastes, Frozen Reach, Void Expanse, Ancient Core, Broken Systems, Dark Nebula, Singularity Zone) are registered as `GALAXY_REGIONS`. Crystal Dominion is the literal AF-010/AF-030 faction name; a region's `dominantFaction` is that faction's name as a string, reusing the Human Alliance/Machine Collective/Void Legion roster Ships, Commanders, and Weapons content already reference. No new faction registry.

## 3. Star Systems — identity through composition, not new fields

Every `StarSystemDef` carries its Primary Star's system name, `biomeId` (AF-036 content reference), `missionIds` (AF-037 content reference), `connectedSystemIds` (route graph), `pointsOfInterest`, `dominantFaction`, `threatLevel`, and `requiresFastTravelUnlock`. Asteroid Fields/Stations/Derelicts/Weather/Story Hooks are the biome and mission content a system points to, not duplicate system-level fields.

## 4. Points of Interest — AF-026's collection categories, a third/fourth consumer

All ten POI kinds (Ancient Vaults, Research Stations, Mining Colonies, Abandoned Fleets, Distress Beacons, Prototype Facilities, Crystal Temples, Machine Foundries, Trade Outposts, Unknown Signals) are registered as `POINT_OF_INTEREST_KINDS`. Discovering one is `meta.discover(discoveryCategory, discoveryId)` — the exact `CollectionCategory` call AF-034/035 already produce content for, now with a third and fourth live producer (`lore`, `biomes`) at the overworld layer.

## 5. Exploration — Fog of War as a discovery gate, Sector Information as persisted percentage

A system's Points of Interest start undiscovered; discovering one both records the collection entry and applies a clamped Exploration% delta. Resources/Lore/Mission Chains/Faction Activity/Ancient Technology/Hidden Routes are what a system's POIs and content references *are* — not six additional exploration mechanisms.

## 6. Galaxy Progression — a namespaced statistic, not a new save slice

Sector Stability and Exploration% are the two mechanically live numbers, persisted through AF-026's existing `MetaProgression.recordStat` under `galaxy:<systemId>:stability` / `galaxy:<systemId>:explorationPercent` — the identical namespaced-key pattern AF-037 established for Galaxy Impact, now one layer up. Trade Routes, Resource Availability, Mission Generation, Research, Restoration Progress, and Future Storylines are the same statistic-and-content substrate as every other module; nothing here forces a sixth persistence layer.

## 7. Faction Control — registered vocabulary, honestly not yet a consumer

Dominant Faction and Security/Exploration%/Restoration% share the Sector Stability/Exploration% statistics above. Conflict Status/Security/Corruption are registered fields on `GalaxyRegionDef`/`StarSystemDef` with no dedicated statistic key yet — the same "registered, no consumer yet" pattern this project has used repeatedly (e.g. AF-028's `droneEffectiveness`) rather than a faked always-zero number.

## 8. Discovery System — zero new discovery vocabulary

New Biomes, Secret Bosses, Prototype Ships, Legendary Weapons, Research Breakthroughs, and Lore Archives map one-to-one onto AF-026's existing `CollectionCategory` values (`biomes`, `bosses`, `ships`, `weapons`, `research`, `lore`). Point-of-interest discovery is `meta.discover(category, id)`, the same call every prior discovery-bearing module already makes.

## 9. Galaxy Events — a fourth naming layer over one bus fact

All nine `GalaxyEventKind`s (Solar Storms, Void Breaches, Machine Uprisings, Crystal Expansion, Trade Opportunities, Distress Chains, Faction Wars, Ancient Reactivations, Comet Passages) fire through the same `EnvironmentalEventTriggered` bus fact AF-017 introduced and AF-036/037 already extended — a fourth vocabulary layer, not a fifth mechanism. `GalaxyRuntime.tryTriggerEvent()` reuses the exact weighted-pick-on-a-timer algorithm written inline in AF-036's `BiomeRuntime` and AF-037's `MissionRuntime`, deliberately re-implemented inline a third time rather than extracted, to avoid editing a locked module for a non-bug refactor.

## 10. Fast Travel — AF-024's dormant vocabulary, finally produced

`ResearchCategory` `"galaxyNavigation"` and `ResearchNodeType` `"galaxyUnlock"` were registered since AF-024 with zero content. The new `warp-charting` sandbox research node is their first producer, reusing the existing generic `unlockFlag` `ResearchEffect` rather than inventing a galaxy-specific effect kind. `GalaxyRuntime.canTravelTo(systemId, fastTravelUnlocked)` gates any `requiresFastTravelUnlock` system on that flag and bypasses adjacency entirely once unlocked — exploration is never trivialised for systems that don't require it, since adjacency still governs everything else.

## 11. Galaxy Map — AF-016's placeholder screen, its first real content

The Galaxy Command hub (AF-016's placeholder `GalaxyCommand` state) now renders the current system's region, exploration%, stability, and Fast Travel status, plus real travel buttons (gated by adjacency or Fast Travel) and point-of-interest discovery buttons — the first real Galaxy Map, not a new screen. Regions, routes, threat levels, faction borders, weather, and search/filters build out from AF-003/AF-005 at the UI module; the underlying route graph and per-system data are already real today.

## 12. Long-Term Goals — content labels over existing statistics

Complete Exploration, 100% Restoration, Ancient Recovery, Galaxy Stability, Faction Resolution, Hidden Discoveries, and Legendary Collections (`LONG_TERM_GOAL_KINDS`) are authoring labels over the Exploration%/Stability statistics and AF-026's collection tracking — not a new tracking system requiring its own persistence.

## 13. Accessibility & performance

Map scaling, search, filters, large icons, controller/touch navigation, high contrast, and colour-blind support build from AF-003/AF-004/AF-005/AF-019 at the UI module — the same accessibility floor every prior module inherits. `GalaxyRuntime` allocates nothing per frame beyond its own timers/counters; systems and points of interest are static content arrays, not per-frame constructions, matching the streaming/caching/pooling discipline already established.

## 14. Debug

Live: current system name and region, exploration%, events triggered, and the last fired event kind — rendered in the shared `DebugOverlay` `galaxy` field alongside every other module's summary line.

---

## Internal review loop (AF-038, recorded)

- **No duplicated systems** — regions, discovery categories, statistic persistence, event vocabulary, and Fast Travel gating all reuse AF-010/017/024/026/036/037 exactly; `GalaxyRuntime`'s route/event engine is the only genuinely new mechanical surface, and it stays pure (no direct `MetaProgression` dependency) by design. ✔
- **Every star has purpose** — the sandbox's three systems each carry a distinct threat level, dominant faction, and point of interest; Ember Reach's Fast-Travel gate gives it a distinct narrative/mechanical role from its neighbours. ✔
- **Exploration permanently rewards curiosity** — discovering a point of interest is idempotent (AF-026's collection set) and permanently raises Exploration%, verified directly in tests and the browser smoke test (button disappears once discovered; percentage persists). ✔
- **Fast Travel never trivialises exploration** — verified as a dedicated test and live in the browser: an adjacent, Fast-Travel-gated system's travel button is shown but the transition is refused until the gate is met. ✔
- **Sandbox proof** — a real galaxy drives live route travel, weighted event firing, and persisted exploration/stability statistics through the existing Galaxy Command screen, browser-verified with zero errors. ✔
- **Simplification pass** — rejected a second faction registry (reused AF-010's canon by name); rejected a fifth event mechanism (extended the existing bus fact a fourth time); rejected a sixth save slice (kept `GalaxyRuntime` pure, applied clamped deltas through AF-026's existing statistics engine); rejected faking Faction Control's unimplemented axes with placeholder numbers nothing reads. ✔

**Internal quality score: 9.5/10 — approved and locked; full galaxy content (additional regions/systems/constellations), Faction Control's remaining axes, and the full galaxy map UI (search/filters/borders) bind at future content and UI modules.**
