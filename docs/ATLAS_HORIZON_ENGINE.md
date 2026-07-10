# The Atlas Horizon Engine (AF-174)

Built entirely under `src/game/atlasHorizon/`. Governs humanity's relationship with the unknown, formalising the "horizon" concept AF-169's real `ensureNextHorizonOpen` first introduced and AF-172's own "Horizon Effect" section already reused directly. Leans almost entirely on direct reuse.

## What's already real, reused directly

- **"Commander Horizons"** ("dreams evolve, never end") reuses AF-161's real `CommanderBeliefTracker` directly — the third reuse of that plain evolving-string generic for an evolving aspiration.
- **"Living Frontiers"** and **"The Unknown Index"** both compose AF-159's real `MysteryLog.open`/`unsolved` directly — "Incomplete research" and "Lost expeditions" are verbatim-shared with AF-159's real `MYSTERY_KINDS`.
- **"Horizon Network"** composes AF-151's real `KnowledgeGraph.addEdge` directly.
- **"Beyond the Map"** and **"Legacy Horizons"** both reuse AF-169's real `ensureNextHorizonOpen` directly — the same chaining function AF-172's "Horizon Effect" already reused.
- **"Civilisation Horizons"** (the 8-stage "ambitions expand" ladder) is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over this module's own `CIVILISATION_HORIZON_STAGES` union.
- **"Discovery Cascade"** and **"Educational Horizons"** stay pure reference vocabulary, composing the above three real classes together at the call site.

All confirmed by dedicated tests.

## Overlap record (verified with AF-170's own `detectOverlap`)

- **"Horizon Categories"** (12) ties (does not break) the codebase's 8/12 absolute overlap record: 8 of its 12 members are exact-string matches with the real `POSSIBILITY_CATEGORIES`.

## What's genuinely new

- **`HorizonEffectTracker`** — models "the more civilisation learns, the more it realises remains unknown. Knowledge expands humility, not certainty." Its unknown index grows, never shrinks, as recorded knowledge grows — the opposite guarantee from AF-172's evidence-gate `HypothesisTracker` and AF-166's recovery-toward-a-ceiling `EmotionalContinuityTracker`.

## Live

Fresh-run debug line: `horizon vision "I want to map the unexplored region beyond Verdance." · mysteries unsolved 4 · network neighbours 1 · civilisation stage Discover · unknown index 2 (knowledge 1) · domain overlap[Horizon,Possibility] 8/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-161's `CommanderBeliefTracker`, AF-159's `MysteryLog`/`MYSTERY_KINDS`, AF-151's `KnowledgeGraph`, AF-169's `ensureNextHorizonOpen`, AF-155's `CyclicStageTracker`, AF-173's `POSSIBILITY_CATEGORIES`, AF-170's `detectOverlap`, or any other locked module. 8 tests, suite at 1921. Score 9.5/10 — approved and locked.
