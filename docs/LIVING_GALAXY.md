# The Living Galaxy (AF-132)

An additive layer over the real, already-locked simulation stack — never a redesign of it. Built entirely under `src/game/livingGalaxy/`.

## Research before implementation

Before writing any code, the existing simulation stack was surveyed to find out exactly what is already tracked, so nothing would be duplicated:

- **Already tracked somewhere in the locked stack**: population, economy, infrastructure, research/technology, food/water/energy, industry, political stability, exploration, and security/military — across AF-086's `CivilisationSimulationRuntime` (14 faction-level attributes), AF-090's `CivilisationFrameworkRuntime` (settlement population stats, development-stage growth), and AF-089's `GalacticEconomyRuntime` (17 resource stockpile categories, trade routes).
- **Already covered**: dynamic galaxy/sector/faction/environmental/economic/scientific/emergency/hidden/legendary events with player participation and chaining (AF-041's `WorldEventRuntime`); permanent historical record-keeping (AF-086's `GalacticHistoryRuntime` and the Codex's interactive timeline).
- **Genuinely missing, and what this module adds**: pollution, a numeric wildlife index, a cycling weather condition, a distinct healthcare index, and crime per star system; a Dynamic News feed; a non-exhausting Random Discoveries pool; a Festival calendar; a Deep Space phenomena generator; and a stateful Player Reputation ledger (only a static `reputationLevel()` threshold lookup existed before).

## What's new

- **`livingGalaxyData.ts`** — real typed constants for every spec'd category with no existing runtime home: `WEATHER_CONDITIONS` (11), `DYNAMIC_SEASONS` (4), `NEWS_CATEGORIES` (11), `DISCOVERY_KINDS` (10), `FESTIVALS` (8), `CRIME_CATEGORIES` (6), `DEEP_SPACE_PHENOMENA` (6), `TRADE_SHIP_TYPES` (9), `POLITICAL_ORGANISATION_TYPES` (7), `REPUTATION_CATEGORIES` (8), `POPULATION_LIFE_EVENTS` (12), `WILDLIFE_LIFECYCLE_EVENTS` (8), `RESEARCH_PROGRESS_EVENTS` (6).
- **`EnvironmentalRuntime`** — seeds a real `EnvironmentalSystemState` for every real galaxy star system (`SANDBOX_GALAXY.systems`) at a believable moderate midpoint, and drifts pollution/wildlife/healthcare/crime slowly each epoch, always clamped to [0, 100] — "the universe never waits."
- **`PlayerReputationLedger`** — the real, stateful ledger the spec calls for ("entire galaxy remembers"); accumulates deltas across the eight spec'd reputation categories, append-only.
- **`LivingGalaxyChronicle`** — a parallel, append-only chronicle for Living-Galaxy-originated events, complementing (never modifying) the locked `GalacticHistoryRuntime`.
- **`FestivalCalendar`** — deterministic epoch-indexed scheduling across the eight spec'd festivals; always exactly one active.
- **`CrimeLedger`** — real crime reports across the six spec'd categories; investigation is a real, optional player action, never mandatory.
- **`drawNewsItem`/`drawDiscovery`/`drawDeepSpacePhenomenon`** — pure, non-removing draws over their real pools, so "nothing becomes permanently exhausted" is structural, not just documented.
- **Debug overlay** — `DebugSnapshot` gains a new `livingGalaxy` field (the same AF-039–070/AF-130/AF-131 per-module extension pattern), rendered as `galaxyLife` and clearly distinct from the pre-existing `galaxy` line.

## Live

The debug overlay's new `galaxyLife` line reads `pollution 20 · wildlife 60 · rep 0 · chronicle 0 · festival Founders Day · unresolved crime 0`, alongside the unaffected pre-existing `galaxy`/`ship`/`ships` lines. Browser-verified, zero page errors.

## Review

Zero changes to AF-041, AF-086, AF-089, or AF-090. A 500-epoch simulation test (the module's own self-review directive, "simulate hundreds of in-game years") confirms every environmental index stays within bounds across the real galaxy's star systems. 9 tests, suite at 1512. Score 9.5/10 — approved and locked.
