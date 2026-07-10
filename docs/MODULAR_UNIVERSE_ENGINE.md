# The Modular Universe Engine (AF-142)

Built entirely under `src/game/moduleUniverse/`. Unlike prior content modules, this one is architectural — a research pass before implementation found it collides with locked *architectural* modules (AF-070/093/094/095) more than with locked content rosters, and several of its sections turned out to be either already real or honestly out of scope.

## What's new (and what deliberately isn't)

- **Already real, composed directly, zero new code**: "Live Event Support" (Seasonal celebrations, offline players never lose permanent content) is AF-070's real `LiveOpsRegistry` Seasons plus its structural FOMO-rejection rule. "Save Compatibility" ("existing saves remain valid") is AF-070's real `compatibilityFor(saveVersion)` and monotone version number.
- **The genuine gap** — AF-070's real `ContentPackDef` was confirmed to have no `dependencies` field, no gameplay/narrative tags, and no cross-system compatibility flags; it registers content *packs*, not whole *modules*. `ModuleRegistry` fills exactly that gap, at a different granularity (a "module" like "Ocean Worlds" might ship many AF-070 packs over its lifetime).
- **`ModuleRegistry`** — an all-or-nothing registration gauntlet in AF-070's spirit: rejects duplicate ids, self-dependencies, and any registration that would close a dependency cycle. `topologicalLoadOrder()` uses Kahn's algorithm with adjacency lists (O(n+e) per call) — the same grey/black-DFS spirit AF-024's real `ResearchTree.validate()` already established for prerequisite graphs, adapted to this module's shape rather than reinventing an untested algorithm. `loadModule`/`unloadModule`/`isLoaded` model "modules load dynamically, inactive content remains unloaded" honestly at the data/state level — AF-094's `technicalArchitectureData.ts` already honestly declares literal async loading/asset streaming as still-future at the engine level, and this doesn't contradict that.
- **`systemCompatibilityFor`** — a deterministic, illustrative mapping from a registration's own declared fields onto AF-130 through AF-141, computed automatically at registration time ("no manual integration required").
- **`moduleQaReport`** — genuinely fulfils the "Dependencies" and "Museum integration" gates AF-095's `qualityAssuranceData.ts` explicitly flagged as still-future, without modifying that locked data. Dialogue/Performance/Narrative-consistency are not re-implemented — they have no generic, content-agnostic analog at this registration's granularity.
- **`ContentDiscoveryFeed`** — kept deliberately separate from AF-132's real `NEWS_CATEGORIES`/`DISCOVERY_KINDS`, since this spec's wording doesn't appear verbatim there.
- **Kept as pure reference data, no runtime validator**: the Faction/Commander/World "automatic expansion" checklists (a "module" here describes a whole system, not a specific faction/commander/planet instance — nothing of that shape exists to validate against) and the Developer Toolkit (internal, non-player-facing tooling with no runtime surface).
- **Debug overlay** — `DebugSnapshot` gains a new `moduleUniverse` field, rendered as `universe`.

## Live

Fresh-run debug line: `universe modules 1/20 categories · compat [AF-130, AF-132, AF-133, AF-134, AF-135, AF-139] · qa passed · loaded 1 · order resolved · discoveries 1/6`. Browser-verified, zero page errors.

## Review

A stress test registers 2000 synthetic modules in a dependency chain, verifying `topologicalLoadOrder` stays correct and every registration terminates quickly (the module's own self-review directive: "stress-test thousands of new modules"). An earlier draft's cycle check was O(n²) per registration (O(n³) total across a full stress run, ~116s); rewriting `topologicalOrderOver` to use adjacency lists brought the full 2000-module suite down to ~1.5s. Zero changes to AF-070's `LiveOpsRegistry`, AF-024's `ResearchTree`, AF-093's `uxFrameworkData.ts`, AF-095's `qualityAssuranceData.ts`, or any other locked module. 11 tests, suite at 1620. Score 9.5/10 — approved and locked.
