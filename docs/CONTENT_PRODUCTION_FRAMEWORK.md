# Content Production Framework (AF-097)

A third "meta" module, marking the project's own stated shift from designing systems to producing content with them. Delegates Automated Validation to AF-092/094/095's real functions/registries wherever they overlap. Zero changes to any locked module.

## What's new

- **13-stage Master Content Pipeline + 15-step Implementation Order** — both proven LINEAR (AF-095's pipeline pattern): every stage advances to exactly one successor, no cycling, always terminates.
- **22 Supported Content kinds** — 17 already have a real `*Data.ts`/`*Runtime` registry; 5 are honest future gaps (Planets, Dialogue, Species, item-level Resources, authored Museum Entries).
- **Content Template** — a generic, reusable 14-field completeness checker (`contentTemplateCompletenessFor`/`isContentTemplateComplete`), the same profile-shape law AF-091/093 proved for audio cues and UI interfaces, generalised across every content kind rather than 22 hand-authored profiles.
- **Content Scale, honestly reported** — the real, cited current roster counts against the spec's 8 numeric targets: commanders 14/100, ships 10/300, weapons 10/1000, equipment 10/5000, relics 9/2000, bosses 1/250, enemy types 61/500, biomes 11/100. No fabricated progress — every count is strictly below its target today, and bosses (1/250) are honestly registered as the furthest behind.
- **Automated Validation** — 7 of 8 checks delegate directly to real AF-092/094/095 functions (`colourSignaturesAreDistinct`, `ARCHITECTURE_PRINCIPLES`, the QA framework's lore/balance/accessibility/performance registries) rather than re-declaring booleans; only replayability has no metric anywhere in the codebase.
- **Content Dependencies** — 3 of 11 compatibility targets are real automatic checks today (AF-087's `codexArchitectureFor`, AF-088's `museumWingFor`, and the module-by-module STATUS.md review process itself); 8 are honest future work.

## Live

No Debug section in this module's spec (matching AF-096's precedent) — no `main.ts` wiring or browser verification was performed; nothing user-visible changes. The framework is a real, tested TypeScript library for future content-authoring modules to build on.

## Review

Zero changes to any locked module. 9 tests, suite at 1129. Score 9.5/10 — approved and locked.
