# The Atlas Philosophy Engine (AF-161)

Built entirely under `src/game/atlasPhilosophy/`. Exists above AF-160's Wisdom Engine: knowledge explains, intelligence reasons, wisdom judges, philosophy asks why.

## The module's closest-ever overlap (kept separate anyway)

**"Philosophical Domains"** (12) is the closest two lists have ever come in this codebase to full duplication — it shares exactly THREE exact-string members with AF-160's real `WISDOM_DIMENSIONS` (Engineering/Leadership/Exploration, verified by a dedicated test) and near-synonym pairs for eight more. Kept as its own separate union since `WISDOM_DIMENSIONS` tags what kind of judgement applies while `PHILOSOPHICAL_DOMAINS` tags what kind of debate topic applies — a real distinction despite the heavy vocabulary overlap.

## What's already real, reused directly

- **"Cultural Reflection"** ("books, music, art... gradually reflect civilisation's evolving philosophy") is exactly AF-159's real `CulturalTrendTracker` mechanic — reused directly via the existing `culturalTrends` instance.
- **"Historical Reinterpretation"** ("history gains depth, not contradiction") is exactly AF-135's real `PlanetaryChronicle`/`EvolvingEntry.expand` — reused directly via the existing `chroniclePlanets` instance, since that class already append-only-expands an entry rather than overwriting it.

## The module's structural resolutions

- **"Interdisciplinary Thinking"** (4 directional pairs) is confirmed a genuinely different shape from AF-159's real `CROSS_DISCIPLINARY_PAIRS` (6 symmetric collaboration pairs) — one-way influence, not mutual collaboration, sharing zero exact pairs, verified by a dedicated test.
- **"Commander Philosophy"** names six illustrative Commander examples (Atlas Prime/Cassia/Lyra/Orion/Sora/Vega) that don't correspond to any real roster id — treated as flavour illustrations, not a roster addition. `CommanderBeliefTracker` is built generically over any real commander id.
- **"Player Philosophy"** is deliberately built so nothing ever collapses observed tendencies into a single categorical label — `PlayerPhilosophyObserver` only exposes per-dimension tallies, confirmed by a dedicated test that no combined-verdict property exists.

## What's genuinely new

- **`AcademicInfluenceTracker`** — tracks which of the 5 real Academic Schools an entity currently adheres to.
- **`PhilosophicalEventLog`** — append-only record of scheduled philosophical events ("nothing changes through combat, ideas matter").

## Live

Fresh-run debug line: `philosophy belief "Hope through unity." · school Conservation School · observed stewardship 1 · events 1 · cultural adopters 1 · chronicle versions 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-160's `WISDOM_DIMENSIONS`, AF-159's `CulturalTrendTracker`/`CROSS_DISCIPLINARY_PAIRS`, AF-135's `PlanetaryChronicle`/`EvolvingEntry`, or any other locked module. 9 tests, suite at 1792. Score 9.5/10 — approved and locked.
