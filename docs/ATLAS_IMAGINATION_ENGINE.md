# The Atlas Imagination Engine (AF-172)

Built entirely under `src/game/atlasImagination/`. Sits one layer above AF-171's Creative Intelligence: creativity produces new ideas, imagination explores realities that do not yet exist. Leans almost entirely on direct reuse.

## What's already real, reused directly

- **"Commander Visions"** ("their dreams evolve through experience") reuses AF-161's real `CommanderBeliefTracker` directly — that class already stores plain evolving strings per commander with no union constraint.
- **"Engineering Imagination"** ("ideas become future projects") and **"Collective Dreams"** ("new horizons unite society") both compose AF-162's real `LongTermMissionTracker.register` directly.
- **"Historical Imagination"** ("what remains undiscovered?") composes AF-159's real `MysteryLog.open` directly.
- **"The Dream Network"** (child imagines → teacher encourages → scientist investigates → engineer prototypes → Commander funds → civilisation advances) is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over this module's own 5-stage `DREAM_NETWORK_STAGES` union.
- **"The Horizon Effect"** ("every answer creates new questions... wonder never reaches completion") reuses AF-169's real `ensureNextHorizonOpen` directly, rather than a second completion-chains-to-a-new-mystery mechanic.

All confirmed by dedicated tests.

## Overlap record (verified with AF-170's own `detectOverlap`)

- **"Imagination Domains"** (12) ties (does not break) AF-171's current absolute overlap record: NINE of its 12 members are exact-string matches with the real `CREATIVE_DOMAINS`. Kept as its own separate reference vocabulary regardless — it tags what a SPECULATIVE idea concerns, distinct from Purpose, Meaning, Legacy, and Creative Intelligence.

## What's genuinely new

- **`HypothesisTracker`** — a speculative-idea registry with an explicit grounded/ungrounded state (`propose`/`supportWithEvidence`/`isGrounded`). Every idea starts ungrounded and only becomes grounded through an explicit later action, modelling "imagination never breaks established science... every extraordinary possibility eventually gains believable scientific grounding." Confirmed a fundamentally different concept from AF-155's real `rankOptions` and AF-159's real `PossibilityRegistry`.

## Live

Fresh-run debug line: `vision "I dream of a living city that restores itself." · hypothesis grounded=false · engineering idea 0% · dream stage Imagine · mysteries unsolved 3 · domain overlap[Imagination,Creative] 9/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-161's `CommanderBeliefTracker`, AF-162's `LongTermMissionTracker`, AF-159's `MysteryLog`, AF-155's `CyclicStageTracker`, AF-169's `ensureNextHorizonOpen`, AF-171's `CREATIVE_DOMAINS`, AF-170's `detectOverlap`, or any other locked module. 8 tests, suite at 1905. Score 9.5/10 — approved and locked.
