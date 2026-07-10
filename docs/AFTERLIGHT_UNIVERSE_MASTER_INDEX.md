# The Afterlight Universe Master Index (AF-150)

Built entirely under `src/game/masterIndex/`. Explicitly "not a gameplay feature" per its own text — a meta-registry over every individual game *object*, at a genuinely different granularity than AF-142's real `ModuleRegistry` (whole modules) and AF-148's real `CanonEventLedger` (one richer record type, historical events specifically).

## Relationship to AF-142

Direct shape overlap with AF-142's real `ModuleRegistrationDef` is expected and intentional — both are registries — but `MasterIndexEntry` operates one level down (individual objects, not whole systems), so it's its own separate interface, never importing or extending AF-142's type. `MasterIndexRegistry`'s dependency-graph algorithm deliberately **mirrors AF-142's real adjacency-list fix** — the same O(n+e) approach that corrected an O(n²)-per-registration performance bug discovered during AF-142's own self-review — rather than reinventing or regressing to the slower approach. The stress test below (2000 synthetic entries, ~1s) confirms the lesson carried over cleanly.

## What's new

- **`MasterIndexRegistry`** — an all-or-nothing registration gauntlet at the individual-object granularity, with real `search()` (substring match over id/category/related systems) and `dependencyOrder()`.
- **`RelationshipGraph`** — append-only edges, queryable from either direction, over the spec's own 9 relationship kinds.
- **`DependencyMap`** — richer, typed relations (Parent/Child/Required/Optional/Expansion/Deprecated) layered on top of the registry's flat cycle check, never replacing it.
- **`VersionHistoryLedger`** — append-only; confirmed no delete/mutate method exists on the class, matching "history is never deleted."
- **`QualityTracker`** — per-category numeric scores keyed by indexed object id, a different shape than AF-143/149's real per-*feature* `DesignScoreCard`/`AtlasScoreCard`, so it's its own new class rather than a third reuse of that shape.

## Documented overlaps, not merged

"Expansion Support" ("every future module automatically registers itself, no manual indexing required") restates AF-142's own "no manual integration required" philosophy at the individual-object granularity. "Failsafe Rules" (8 checks, all-must-pass) is the *eighth* occurrence of the same checklist-gate mechanic in this codebase. "Player-Facing Derivatives" lists systems that are all already real and locked (Museum, Chronicle, Codex, etc.) — kept as reference confirmation only, never reimplemented.

## Live

Fresh-run debug line: `masterIdx entries 1/34 categories · order resolved · relationships 1 · dependency links 1 · version history 1 · quality 9.3`. Browser-verified, zero page errors.

## Review

A stress test registers 2000 synthetic indexed entries in a dependency chain (the module's own self-review directive: "stress-test thousands of future expansions"), completing in under a second thanks to reusing AF-142's real algorithm fix. Zero changes to AF-142's `ModuleRegistry`, AF-143/149's score cards, AF-148's `CanonEventLedger`, or any other locked module. 10 tests, suite at 1691. Score 9.5/10 — approved and locked.
