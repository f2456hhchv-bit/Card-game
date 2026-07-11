# The Atlas Creator Engine (AF-191)

Built entirely under `src/game/atlasCreator/`. Previous systems explain how civilisation grows; the Creator Engine explains how civilisation creates.

**NAMING SCOPE NOTE:** "Creator"/"Creative" now spans three module titles. AF-141's locked "Galactic Creator Engine" is player-facing decoration tooling. AF-171's locked "Atlas Creative Intelligence" is the closest match by far — an exact 12/12 domain match with this module, a new absolute overlap record. AF-191 never redefines either.

## What's already real, reused directly

- **"Creation Domains"** IS AF-171's real `CREATIVE_DOMAINS` — an exact 12/12 set match, so no second list was declared.
- **Every "X Creation" section** (Commander/Scientific/Engineering/Educational/Artistic/Architectural) reuses AF-171's real `CreativeContributionLog` directly.
- **"The Creation Cycle"** reuses AF-155's real generic `CyclicStageTracker<TStage>` directly, over a new stage list.
- **"Collaborative Creation"** reuses AF-155's real `CollaborativeProblemLog` directly (8th+ instance).
- **"The Creator Network"** composes AF-151's real `KnowledgeGraph.addEdge` directly.
- **"Beauty Through Purpose"** reuses AF-168's real `BeautyIndexTracker` directly.
- **"The Creation Archive"** reuses AF-171's real `CreativeHeritageArchive` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Creation Domains"** vs the real `CREATIVE_DOMAINS`: 12/12 — a NEW ABSOLUTE RECORD (previous record 11/12).
- **"Collaborative Creation" participants** vs the real `COLLABORATIVE_CREATION_PARTICIPANTS`: 6/7.
- **"Creative Inspiration"** vs the real `CREATIVE_SOURCES`: 3/8.
- **"The Creator Network" fields** vs AF-188's real `IMPLEMENTATION_ARCHIVE_FIELDS`: 2/7.

## What's genuinely new

- **`purposefulBeautyMet`** — an all-must-pass checklist over a new `PurposefulBeautyCriterion` union (Teaches/Serves/Inspires/Endures), distinct from AF-168's continuous, settlement-scale `BeautyIndexTracker`.

## Live

Fresh-run debug line: `creatorEng cycle Inspiration (next Inspiration) · collaborators 2 · contributions Engineering=2 Art=1 · network neighbours 1 · beauty Public spaces=75 · archive outcomes 2 · purposeful beauty met=true`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-151's `KnowledgeGraph`, AF-155's `CyclicStageTracker`/`CollaborativeProblemLog`, AF-168's `BeautyIndexTracker`, AF-171's `CreativeContributionLog`/`CreativeHeritageArchive`/`CREATIVE_DOMAINS`, AF-188's `IMPLEMENTATION_ARCHIVE_FIELDS`, AF-170's `detectOverlap`, or any other locked module. 10 tests, suite at 2063. Score 9.5/10 — approved and locked.
