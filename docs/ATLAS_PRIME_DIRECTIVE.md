# The Atlas Prime Directive (AF-170)

Built entirely under `src/game/atlasPrimeDirective/`. Not a gameplay system — the permanent governing intelligence every future mechanic, feature, expansion, story, asset and line of dialogue must pass through before joining the universe.

## Critical scope note

"System Priority" places "Atlas Prime Directive" above "Design Constitution", "Atlas Core", "Operating System" and "Simulation Director" — but every one of those names refers to IN-FICTION AF-XXX modules (AF-146, AF-145, AF-000, AF-153), never to the REAL `docs/CONSTITUTION.md`. Per this project's standing rule, the real Constitution is the actual supreme design authority and sits categorically outside this in-fiction governance ladder. AF-170 does not modify it, does not rank above it, and does not claim any authority over it — `SYSTEM_PRIORITY_LADDER` is exclusively an ordering among in-fiction AF-XXX modules, confirmed by a dedicated test and a prominent code comment.

## The module's structural resolutions

- **"Design Arbiter"** (10 criteria) mirrors the SHAPE of AF-143's real `DesignScoreCard` and AF-149's real `AtlasScoreCard` (score/scoreFor/isComplete/overallScore/passesGate at 9.5) — the THIRD such mirrored scoring rubric in this codebase, typed to its own separate union.
- **"The Prime Directives"** (a strict priority order) and **"Conflict Resolution"** (a second, separate priority order) both mirror AF-156's real `resolveByFailsafePriority` pattern, confirmed by dedicated tests showing each resolves independently.
- **"Future Compatibility"**, **"Quality Lock"** and **"Final Test"** are three more instances of this codebase's established all-must-pass checklist-gate mechanic. "Final Test" in particular echoes the real Constitution's own "THE AFTERLIGHT TEST" gate almost exactly in spirit, confirmed a deliberate structural callback rather than a duplicate since the exact five questions differ.

## The module's own genuine, self-referential contribution

**"Redundancy Detector"** is the one genuinely new mechanic: `detectOverlap` FORMALISES the exact manual overlap-checking discipline this session's own module-implementation process has performed by hand in nearly every module since AF-145/146 into one real, reusable function — confirmed by a dedicated test that reproduces two previously hand-computed overlap facts exactly (AF-162's `PURPOSE_DOMAINS` vs. AF-161's `PHILOSOPHICAL_DOMAINS`: 8/12; AF-169's `LEGACY_DOMAINS` vs. AF-162's `PURPOSE_DOMAINS`: 8/12), and confirmed via a live browser-verified debug reading.

## Live

Fresh-run debug line: `primeDir directive Protect Hope · conflict Player agency · design score 9.6 (passed) · future compat=true · quality lock=true · final test=true · system rank 4 · overlap[Purpose,Philosophy] 8/12`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-143's `DesignScoreCard`, AF-149's `AtlasScoreCard`, AF-156's `resolveByFailsafePriority`, the real Constitution, or any other locked module. 8 tests, suite at 1884. Score 9.5/10 — approved and locked.
