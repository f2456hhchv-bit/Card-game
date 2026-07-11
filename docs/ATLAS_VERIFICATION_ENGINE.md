# The Atlas Verification Engine (AF-196)

Built entirely under `src/game/atlasVerification/`. AF-195's direct sibling — the Coherence Engine ensures everything fits together, the Verification Engine ensures everything is demonstrably correct.

## What's already real, reused directly

- **"Scientific Verification"** reuses AF-172's real `HypothesisTracker` directly.
- **"The Evidence Graph"** composes AF-151's real `KnowledgeGraph.addEdge` directly (its existing numeric `confidence` field is exactly the "how sure, and why" pairing this section asks for).
- **"Player Verification"** reuses AF-148's real `CanonEventLedger` directly.
- **"Institutional Verification"** reuses AF-165's real `InstitutionalMemoryTracker` directly.
- **"Contradiction Review"** reuses AF-148's real `KnowledgeStateTracker.revealHistoricalUnderstanding` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Verification Domains"** (12): 9/12 vs AF-195's real `COHERENCE_DOMAINS`, 8/12 vs AF-194's real `POSSIBILITY_DOMAINS` — no record claimed.

## What's genuinely new

- **`verificationChainRank`** — an ordered, non-cyclic rank lookup for the 10-stage Verification Chain.
- **`confidenceLevelRank`** — a discrete categorical confidence ladder, distinct from `GraphEdge`'s continuous numeric confidence field.
- **`truthStandardMet`** — mirrors AF-195's real `coherenceStandardMet` shape, another all-must-pass instance.

## Live

Fresh-run debug line: `verify     hypothesis grounded=true · evidence graph neighbours 1 · player event witnesses 1 · institution memories 2 · understanding "Later evidence showed a full team contributed." · chain rank 4 · confidence rank 3 · truth met=true · domain overlap[Verification,Coherence] 9/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-135's `EvolvingEntry`, AF-148's `CanonEventLedger`/`KnowledgeStateTracker`, AF-151's `KnowledgeGraph`, AF-165's `InstitutionalMemoryTracker`, AF-170's `detectOverlap`, AF-172's `HypothesisTracker`, AF-194's `POSSIBILITY_DOMAINS`, AF-195's `COHERENCE_DOMAINS`/`coherenceStandardMet`, or any other locked module. 8 tests, suite at 2106. Score 9.5/10 — approved and locked.
