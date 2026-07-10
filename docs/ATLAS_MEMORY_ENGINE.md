# The Atlas Memory Engine (AF-165)

Built entirely under `src/game/atlasMemory/`. Unlike AF-135's Chronicle (records history) or AF-163's Meaning Engine (gives events emotional significance), AF-165 determines what every intelligent entity remembers, forgets, recalls and passes on. Primarily a taxonomy and composition layer over memory machinery already real elsewhere.

## What's already real, reused directly

- **Personal Memory** composes AF-133's real `NpcMemoryLog` (raw storage) directly with AF-163's real `MeaningCurator` (curated superlatives) — "Greatest success"/"Closest friendships"/"Historic discoveries" are near-exact matches with AF-163's real `PERSONAL_MEANING_CATEGORIES`.
- **Player Memory** reuses AF-163's real `playerMeaning` `MeaningCurator` instance directly for "Favourite X" categories — "Favourite Commander" is a verbatim shared member, confirmed by a dedicated test.
- **Shared Memory** is confirmed the SIXTH instance of AF-155's real `CollaborativeProblemLog` mechanic in this codebase.
- **Cultural Memory** reuses AF-159's real `CulturalTrendTracker` directly.
- **Memory Network** reuses AF-151's real `KnowledgeGraph` directly.
- **Nostalgia** composes AF-163's real `SignificanceTracker.reinforce` directly — the same mechanic AF-164's "Returning Moments" already reused.
- **"Forgetting"** (minor memories fade, major memories remain) is confirmed something AF-133's real `NpcMemoryLog` ALREADY does via its bounded `minorCapacity` constructor parameter — verified by a dedicated test, no second decay mechanism.

## The module's structural resolution

**"False Assumptions"** is the module's own stated justification for why `MemoryDistortionTracker` must stay separate from AF-135's real `EvolvingEntry`: that class guarantees history "gains depth, not contradiction" (objective, append-only), while `MemoryDistortionTracker` deliberately tracks a SUBJECTIVE current version alongside an untouched objective original — the opposite guarantee, confirmed by a dedicated test.

## What's genuinely new

- **`MemoryDistortionTracker`** — objective description untouched; subjective description drifts.
- **`PlayerMemoryTracker`** — the genuinely new numeric Player Memory quantities (visit/photo counts) nothing else tracks.
- **`InstitutionalMemoryTracker`** — confirmed genuinely new at this granularity; AF-134's museum classes and AF-162's `INSTITUTIONAL_PURPOSES` describe institutions' functions, not what they specifically remember.

## Live

Fresh-run debug line: `memory distortion objective "The expedition made peaceful first contact." subjective "I remember it as far more dangerous than it really was." · most visited planet-verdance (2 visits) · photos 1 · institution memories 1 · personal memories 1 · network neighbours 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-133's `NpcMemoryLog`, AF-135's `EvolvingEntry`, AF-151's `KnowledgeGraph`, AF-155's `CollaborativeProblemLog`, AF-159's `CulturalTrendTracker`, AF-163's `MeaningCurator`/`SignificanceTracker`, or any other locked module. 11 tests, suite at 1834. Score 9.5/10 — approved and locked.
