# The Atlas Wisdom Engine (AF-160)

Built entirely under `src/game/atlasWisdom/`. Sits above AF-155–159: where those engines understand, choose, coordinate, forecast and imagine, AF-160 asks whether something should be done at all.

## What's already real, reused directly

- **"Reflection Loop"** (Experience→Reflection→Discussion→Learning→Teaching→Improved Judgement) is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` — the same class already reused for AF-155's own Intelligence Layers/Learning Loop and AF-156's Decision Pyramid. Confirmed by a dedicated test that this list's exact membership still differs from every prior cyclic list.

## The module's structural resolutions

- **"Commander Wisdom"** (6 traits, "gradually develops") is confirmed a genuinely different axis from two existing Commander concepts, verified by a dedicated test showing zero member overlap: AF-030's real `PersonalityTrait` is fixed and dialogue-only by design law; AF-139's real `COMMANDER_MATURITY_STAGES` is a coarse 4-stage career-summary ladder. `CommanderWisdomTracker` tracks six fine-grained scores that accumulate with lived experience.
- **"Civilisation Values"** (10) is confirmed another entry in this codebase's recurring "abstract value/virtue list" family, kept separate from the real Constitution's Design Pillars, AF-146's `TEN_PILLARS`, AF-145's Atlas Principle virtues, and AF-147's `CORE_THEMES`.
- **"Scientific Wisdom"** and **"Ethical Deliberation"** are two more instances of this codebase's established all-must-pass checklist-gate mechanic.
- **"Wisdom Memory"** mirrors the SHAPE of AF-157/158/159's real `PlanMemoryArchive`/`FutureMemoryArchive`/`InnovationMemoryArchive` — the FOURTH mirrored "completed experience becomes a named institution" archive in this codebase.

## What's genuinely new

- **`MentorshipLedger`** — the first REAL mentor/mentee relationship ledger in the codebase. Prior mentions in AF-156/157's own decision/plan-kind lists were reference vocabulary only.
- **`generationalTransferRank`** — mirrors AF-148/154/157's real indexOf-rank pattern as a linear escalation ladder (Knowledge→Lessons→Traditions→Institutions→Civilisation) rather than a cycle.

## Live

Fresh-run debug line: `wisdom loop Experience (next Reflection) · wisdom 4.2 (patience 15) · mentor commander-thorne-starforged · scientific review=false · ethical review=true · transfer rank 1 · memory 0`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `CyclicStageTracker`/`STRATEGIC_REASONING_FACTORS`, AF-030's `PersonalityTrait`, AF-139's `COMMANDER_MATURITY_STAGES`, AF-157/158/159's memory-archive classes, or any other locked module. 8 tests, suite at 1783. Score 9.5/10 — approved and locked.
