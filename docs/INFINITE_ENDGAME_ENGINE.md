# The Infinite Endgame Engine (AF-140)

Built entirely under `src/game/endgameEngine/`. A dedicated research pass before implementation surveyed an unusually wide slice of the locked stack and found this spec collides more than any prior module — most of its named examples are duplicates of systems already built across AF-069/082/089/090/132/134/135/137/138/139. The module composes with all of them rather than re-inventing a single one.

## What's new (and what deliberately isn't)

- **Endgame gate** — composes AF-069's real, already-locked `EndgameRuntime.snapshot.unlocked` directly as the "after campaign completion" gate. No second flag was invented.
- **Legendary Projects** — 7 of this spec's 8 examples are exact or near duplicates of entries already in AF-090's `MEGASTRUCTURES`, AF-138's `CIVILISATION_MEGAPROJECTS`, or AF-139's `GREAT_PROJECT_LINEAGE` ("Dyson Swarm," "Galactic Library," "Atlas Gateway Network," and "Deep Space Observatory Ring" are exact-string duplicates). Rather than build a fourth roster, this module reuses AF-139's real `greatProjectsProgressSummary` directly. Only "Museum of Civilisations" had no match — left deferred, the same treatment AF-139 gave its own unmatched "Interstellar Seed Vault."
- **Colony Specialisation → megacities** — this spec's 9-item specialisation list overlaps 7-of-9 with AF-138's real `CIVILISATION_ENGINE_SPECIALISATIONS`. No competing union was added; `megacityThresholdMet` composes AF-090's real, already-tracked per-settlement `specialisation` field and population directly, and `MegacityLedger` records the genuinely new "new megacities emerge" milestone.
- **Annual Events** — "Founders Day" and "Museum Anniversary" are exact-string duplicates of AF-132's real `FESTIVALS`. Kept as its own small `AnnualEndgameCalendar`, the same documented-overlap treatment AF-138 already gave its own `SocialEventCalendar` alongside AF-132's `FestivalCalendar`.
- **Expedition Council** — `ExpeditionCouncilTracker` mirrors AF-138's real `GovernmentPriorityTracker` lean-only mechanic ("player influences direction, never absolute control") exactly, typed to its own priority vocabulary since it genuinely differs from AF-138's 6.
- **Infinite Research** — already real. AF-082's `infiniteResearchProjectFor`/`INFINITE_RESEARCH_KINDS` already implement "no infinite stat inflation, knowledge expands instead." This module composes it directly and adds zero new tracked state for it.
- **Frontier Beyond / Great Expeditions** — genuinely new. `FrontierExpeditionRegistry` and `GREAT_EXPEDITION_DESTINATIONS` are a deliberately separate, parallel late-game roster — never wired into or extending AF-038's real, closed `SANDBOX_GALAXY` — the same namespaced-apart separation AF-131's Living Ship used against AF-031's combat Ship Framework.
- **Commander Legacies / New Commanders** — `CommanderLegacyRuntime` tracks per-commander legacy roles (idempotent) and append-only lore successor records. Successors are narrative-only; AF-030's real, closed commander roster arrays are never extended or modified.
- **Mega Discoveries** and **Living Economy's "new industries appear"** — both confirmed genuinely new territory. `MegaDiscoveryLog` and `EmergentIndustryLedger` are straightforward append-only logs; `industryEmergenceEligible` gates industry emergence on AF-089's real `economicHealth` signal.
- **Galactic Museum expansion** — `GalacticMuseumExpansionTracker` adds only the two genuinely new counters ("researchers travel across sectors," "artifacts arrive automatically"), additive over AF-134's real `MuseumQualityTracker`/`MuseumCollectionRegistry`.
- **Debug overlay** — `DebugSnapshot` gains a new `endgameEngine` field, rendered as `infEndgame` to stay visually distinct from AF-069's existing `endgame` line.

## Live

Fresh-run debug line: `infEndgame locked — the endgame begins after the main campaign` — the same real gate AF-069 already uses, correctly closed pre-campaign-completion. Browser-verified, zero page errors.

## Review

Zero changes to AF-069's `EndgameRuntime`, AF-090/AF-138/AF-139's megaproject/megastructure rosters, AF-132's `FestivalCalendar`, AF-134's `MuseumQualityTracker`, AF-030's commander roster, or any other locked module. 13 tests, suite at 1596. Score 9.5/10 — approved and locked.
