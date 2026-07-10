# The Atlas Unity Engine (AF-184)

Built entirely under `src/game/atlasUnity/`. Exists above AF-183's Symphony Engine: the Symphony Engine ensures systems work together, the Unity Engine ensures every layer ultimately serves one shared vision.

## What's already real, reused directly

- **"The Unity Network," "The Civilisation Web," and "The Knowledge Commons"** all compose AF-151's real `KnowledgeGraph.addEdge` directly.
- **"Unity Through Diversity"** composes AF-159's real `CulturalTrendTracker` directly.
- **"Shared Achievements"** reuses AF-176's real `ThreadRegistry`/`allThreadsConnected` directly — a shared achievement is exactly a permanently significant thread.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Unity Domains"** (12) shares 9 of 12 with the real `SYMPHONY_DOMAINS` — no record claimed (current record is 11/12).
- **"Institutional Unity"** shares 5 of 8 institution types with the real `INSTITUTION_TYPES`.
- **"The Unity Index"** shares 2 of 8 criteria with the real `ASCENSION_INDEX_CRITERIA`.

## What's genuinely new

- **`UnityIndexScoreCard`** — the eighth mirrored scoring-rubric shape in this codebase, sharing the same 9.5 gate. Consistent with AF-183's own light-touch precedent, this module contributes exactly one new piece and composes the rest.

"Commander Unity" and "Planetary Unity"/"Unity Events" stay pure reference-lookup data.

## Live

Fresh-run debug line: `unity network neighbours 2 · cultural adopters 1 · shared achievements connected=true · index score 9.6 (passed) · domain overlap[Unity,Symphony] 9/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-151's `KnowledgeGraph`, AF-159's `CulturalTrendTracker`, AF-176's `ThreadRegistry`/`allThreadsConnected`, AF-183's `SYMPHONY_DOMAINS`/`ORCHESTRA_MODEL_ROLES`, AF-177's `INSTITUTION_TYPES`, AF-179's `ASCENSION_INDEX_CRITERIA`, AF-170's `detectOverlap`, or any other locked module. 6 tests, suite at 1999. Score 9.5/10 — approved and locked.
