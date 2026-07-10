# The Afterlight Design Constitution (AF-146)

Built entirely under `src/game/designConstitution/`. This module's own text describes itself in nearly the same terms as the project's *real* supreme governing document, `docs/CONSTITUTION.md` — so before writing any code, the relationship between the two needed to be settled honestly.

## Relationship to the real Constitution

`docs/CONSTITUTION.md` ("AFTERLIGHT MASTER CONSTITUTION v1.0") is already "the highest governing specification for the Afterlight project," already states "None may contradict it," and already frames the project's identity as "rebuilding civilisation... transforms a dying galaxy into one filled with hope again" — the same mission AF-146 restates. This module does **not** modify, supersede, or duplicate that real document. It is implemented as its own new, clearly-separate in-universe design charter, the same honest-precedent treatment AF-143 gave discovering its own "Design Score >9.5/10" was really this project's own real standing process.

Direct mechanical overlap, documented rather than merged: the real Constitution already has two checklist-based feature gates — "THE AFTERLIGHT TEST" (8 yes/no questions, all must be "Yes") and the "DESIGN DECISION MATRIX" (10 yes/no questions, all must be "Yes"). AF-146's own "Content Test" (10 questions, only 8-of-10 required) and "Expansion Test" (6 requirements, all required) are the same mechanic with different wording and a partial-pass threshold — kept as their own separate rubric, never force-merged into the real Constitution's gates.

A naming-adjacency note: AF-136's real `StoryPillarTracker`/`STORY_PILLARS` (Hope/Curiosity/Sacrifice/Leadership/Discovery/...) shares "Hope" and "Discovery" verbatim with this module's `TEN_PILLARS`, but the two are different axes — AF-136's are per-playthrough narrative themes; this module's are meta-design-philosophy pillars governing the whole project. Kept separate, per the AF-137/138/139/140 precedent for documented vocabulary overlap.

## A module-numbering note

This spec was sent as "146" and declares "AF-000 → AF-145 are LOCKED," but no AF-145 catalogue, doc, or STATUS.md row exists anywhere in this repository — AF-144 is the last real, locked module. Implemented as AF-146 exactly as specified; the gap is documented in `docs/modules/STATUS.md` rather than silently renumbered or silently ignored.

## What's new

- **`contentTestScore`/`expansionTestPassed`** — real, testable checklist functions matching the spec's own exact thresholds (8-of-10 partial pass vs. all-6-required).
- **`FeatureComplianceRegistry`** — append-only per-feature compliance history.
- **`PillarReinforcementLedger`** — a real, inspectable record of which pillar each feature actually reinforced, rather than a design promise with no evidence behind it.
- **Debug overlay** — `DebugSnapshot` gains a new `designConstitution` field, rendered as `constitn`.

## Live

Fresh-run debug line: `constitn features 1 (1 passed content test) · latest expansion-ocean-worlds 10/10 · expansion passed · dominant pillar Wonder · reinforcements 2`. Browser-verified, zero page errors.

## Review

Zero changes to `docs/CONSTITUTION.md`, AF-136's `StoryPillarTracker`, or any other locked module. 7 tests, suite at 1649. Score 9.5/10 — approved and locked.
