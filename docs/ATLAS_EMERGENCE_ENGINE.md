# The Atlas Emergence Engine (AF-187)

Built entirely under `src/game/atlasEmergence/`. AF-186's Evolution governs change; the Emergence Engine governs the unexpected.

## What's already real, reused directly

- **"Commander Emergence"** is exactly AF-167's real `ReputationTracker` — reveals, never assigns, what a commander becomes known for.
- **"Scientific Emergence"** is exactly AF-151's real `KnowledgeGraph.suggestConnections`.
- **"Cultural Emergence"/"Positive Cascades"** compose AF-151's real `KnowledgeGraph.addEdge` directly; the cascade's culmination reuses AF-178's real `RenaissanceTracker.recordTrigger`.
- **"Ecological Emergence"** reuses AF-139's real `SpeciesAdaptationRegistry` directly.
- **"Community Emergence"/"Civilisational Emergence"** compose AF-159's real `CulturalTrendTracker` directly.
- **"Personal Emergence"** composes AF-160's real `MentorshipLedger` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Emergence Domains"** (12) shares 8 of 12 with the real `EVOLUTION_DOMAINS` — no record claimed (current record is 11/12).

## What's genuinely new

- **`CascadeTracker`** — classifies effects into four ordered causal-distance tiers (Immediate/Secondary/Generational/Civilisational) per origin action, for "The Butterfly Network."
- **`emergenceValidationMet`** — the fifth all-must-pass checklist function in this codebase, for "Emergence Validation."

## Live

Fresh-run debug line: `emergence reputation Mentorship · network neighbours 1 · golden age=true · cascade tiers reached=false · validation met=true · domain overlap[Emergence,Evolution] 8/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-167's `ReputationTracker`, AF-151's `KnowledgeGraph`, AF-178's `RenaissanceTracker`, AF-139's `SpeciesAdaptationRegistry`, AF-159's `CulturalTrendTracker`, AF-160's `MentorshipLedger`, AF-186's `EVOLUTION_DOMAINS`, AF-170's `detectOverlap`, or any other locked module. 8 tests, suite at 2024. Score 9.5/10 — approved and locked.
