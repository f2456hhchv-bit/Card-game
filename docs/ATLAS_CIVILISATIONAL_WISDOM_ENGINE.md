# The Atlas Civilisational Wisdom Engine (AF-199)

Built entirely under `src/game/atlasCivilisationalWisdom/`. "Knowledge answers 'What is true?' Reasoning answers 'What follows?' Judgement answers 'What should we choose?' Wisdom answers 'What should never be forgotten?'"

**NAMING SCOPE NOTE:** the closest possible collision short of a verbatim duplicate with AF-160's own locked "Atlas Wisdom Engine." Never redefines it.

## What's already real, reused directly

- **"The Wisdom Cycle"** reuses AF-155's real `CyclicStageTracker<TStage>` directly — the same class AF-160's own "Reflection Loop" already reused.
- **"Commander Wisdom"** reuses AF-160's real `CommanderWisdomTracker`/`MentorshipLedger` directly.
- **"Institutional Wisdom"** reuses AF-165's real `InstitutionalMemoryTracker` directly.
- **"Cultural Wisdom"** composes AF-159's real `CulturalTrendTracker` directly.
- **"Wisdom Through Failure"** reuses AF-160's real `WisdomMemoryArchive` directly.
- **"Intergenerational Wisdom"** reuses AF-160's real `generationalTransferRank` directly.
- **"Wisdom Domains"** IS AF-198's real `JUDGEMENT_DOMAINS` — an exact 12/12 set match, ties the absolute overlap record for the second time.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **Wisdom Domains vs AF-160's own `WISDOM_DIMENSIONS`**: only 3/12, despite reusing AF-198's exact-match domains.
- **"The Wisdom Cycle"** vs AF-160's real `REFLECTION_LOOP_STAGES`: 3/7.
- **"Collective Wisdom"** vs AF-160's real `CIVILISATION_VALUES`: 2/7. **"The Civilisational Compass"** vs the same list: 5/7 (the stronger match).
- **"Cultural Wisdom"** vs AF-160's real `CULTURAL_WISDOM_FACTORS`: 2/6.

## What's genuinely new

- **`WisdomLibrary`** — an append-only per-lesson record (situation/decision/outcome/reflection/future relevance/teaching value), a genuinely different question from AF-160's `WisdomMemoryArchive` (which only tags destinations, never the narrative).

## Live

Fresh-run debug line: `civWisdom  cycle Experience (next Experience) · commander wisdom 3.3 · mentees 1 · institution memories 3 · cultural adopters 1 · failure outcomes 2 · library teaching value "Taught at the Verdance Academy."`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `CyclicStageTracker`, AF-159's `CulturalTrendTracker`, AF-160's `CommanderWisdomTracker`/`MentorshipLedger`/`WisdomMemoryArchive`/`generationalTransferRank`, AF-165's `InstitutionalMemoryTracker`, AF-170's `detectOverlap`, AF-198's `JUDGEMENT_DOMAINS`, or any other locked module. 9 tests, suite at 2132. Score 9.5/10 — approved and locked.
