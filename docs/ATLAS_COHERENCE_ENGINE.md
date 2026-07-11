# The Atlas Coherence Engine (AF-195)

Built entirely under `src/game/atlasCoherence/`. Overlaps almost entirely with AF-148's own already-locked "Atlas Canon Engine" — a different title, the same territory (internal consistency/validation over lore).

## What's already real, reused directly

- **"The Context Chain"** is exactly AF-148's real `CanonEventLedger`/`CanonEventRecord`.
- **"Historical/Scientific/Emergent Coherence"** all reuse AF-148's real `loreValidationReport` directly.
- **"The Contradiction Detector"** reuses AF-148's real `KnowledgeStateTracker.hasDiverged` directly.
- **"Character Coherence"** reuses AF-148's real `CommanderContinuityLedger` directly.
- **"Institutional Coherence"** reuses AF-165's real `InstitutionalMemoryTracker` directly.
- **"Planetary Coherence"** reuses AF-148's real `recordPlanetContinuityFact` directly.
- **"The Canon Graph"** composes AF-151's real `KnowledgeGraph.addEdge` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Coherence Domains"** (12): 7/12 vs AF-194's real `POSSIBILITY_DOMAINS`, 6/12 vs AF-193's real `EXCELLENCE_DOMAINS` — no record claimed.

## What's genuinely new

- **`coherenceStandardMet`** — another instance of this codebase's established all-must-pass checklist-function family; every question must be resolved with confidence, else "refine further."

## Live

Fresh-run debug line: `coherence  context event participants 1 · diverged=false · character facts 1 · institution memories 1 · planet entry "[Ecological changes] A wounded ecosystem was restored." · canon graph neighbours 1 · standard met=true · domain overlap[Coherence,Possibility] 7/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-135's `PlanetaryChronicle`, AF-148's `CanonEventLedger`/`loreValidationReport`/`KnowledgeStateTracker`/`CommanderContinuityLedger`/`recordPlanetContinuityFact`, AF-151's `KnowledgeGraph`, AF-165's `InstitutionalMemoryTracker`, AF-170's `detectOverlap`, AF-193's `EXCELLENCE_DOMAINS`, AF-194's `POSSIBILITY_DOMAINS`, or any other locked module. 8 tests, suite at 2098. Score 9.5/10 — approved and locked.
