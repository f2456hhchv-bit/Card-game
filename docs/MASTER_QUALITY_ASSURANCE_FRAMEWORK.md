# Master Quality Assurance Framework (AF-095)

A second "meta" module, pointed at QA/validation rather than engineering architecture (AF-094). Delegates to AF-094's real registries wherever they overlap, never reimplementing them. Zero changes to any locked module.

## What's new

- **10-stage QA pipeline + 8-stage release pipeline** — both proven LINEAR (AF-090's ladder pattern): every stage advances to exactly one successor, no cycling, always reaches the terminal stage.
- **17 Automated Validation domains** — all already backed by a real `*Data.ts`/`*Runtime` registry.
- **12 Gameplay Testing domains** — all backed by a real seeded sweep; `buildDiversity` honestly notes it proves ledger integrity today, not a usage-spread metric.
- **The honest scale gap** — `LARGEST_KNOWN_SIMULATION_ITERATIONS` (200,000, `tests/endgame.test.ts`) vs. the spec's `MILLIONS_TARGET_ITERATIONS` (1,000,000): a 5× gap, stated plainly rather than papered over.
- **Performance Validation delegates to AF-094** — `frameTime`/`loading`/`streaming` are the *same* booleans as `TECHNICAL_DEBUG_SURFACES`/`TECHNICAL_PERFORMANCE_LIVE`, not re-declared. Only 1 of 9 metrics is live (frame time).
- **Lore/Balance Validation** — real structural cross-module proofs (AF-090 settlements↔AF-038/039, AF-086's append-only history, AF-088's Knowledge Web, weapon/commander/ship rosters' 5 non-numeric balance axes) named explicitly; narrative-level and pick-rate-level checks are honest future work.
- **Content Pipeline** — 8 of 9 stages are literally this project's own per-module contract (verbatim spec, real TS, tests, binding doc, self-review sweep, STATUS.md approval); only localisation-readiness is a genuine gap.
- **Release Pipeline** — real CI (`ci.yml`) and deploy (`deploy-pages.yml`) workflows named; no performance-budget gate or RC/monitoring stage exists yet.

## Live

The `meta` debug overlay line now reports real QA/regression/accessibility/release-readiness counts. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 13 tests, suite at 1120. Score 9.5/10 — approved and locked.
