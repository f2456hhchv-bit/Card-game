# The Atlas Soul Engine (AF-168)

Built entirely under `src/game/atlasSoul/`. Exists above AF-167's Identity Engine: identity answers "who are we?", the Soul Engine answers "what kind of civilisation are we becoming?" — operating at civilisation scale. This module leans heavily on direct reuse, similar in spirit to AF-164.

## What's already real, reused directly

- **"Commander Spirit"** is exactly AF-167's real `ReputationTracker`/`EarnedTitleTracker` at legendary scale.
- **"Place Spirit"** composes AF-163's real `SignificanceTracker` directly.
- **"Community Spirit"** reuses AF-159's real `CulturalTrendTracker` directly.
- **"Inspiration"** composes AF-160's real `MentorshipLedger` directly — mentor→mentee IS an inspiration link.
- **"Collective Memory"** is exactly AF-163's real `collectiveMemory` `MeaningCurator` instance.
- **"Galactic Reputation"** is exactly AF-167's real `ReputationTracker`, reused at civilisation scale (entity id `"humanity"`).
- **"Soul Through Adversity"** is exactly AF-166's real `EmotionalContinuityTracker`, reused at civilisation scale.

All confirmed by dedicated tests — no second symbol/legend/propagation/adversity system anywhere in this module.

## The module's heaviest-ever overlap (kept separate anyway)

**"Soul Dimensions"** (12) is confirmed the HEAVIEST PROPORTIONAL overlap yet recorded in this codebase: 8 of AF-160's real 10-member `CIVILISATION_VALUES` appear verbatim here — 80% of that list, a higher proportion than AF-162's previous 8-of-12 (67%) record overlap with AF-161. Kept separate: `CIVILISATION_VALUES` names ideals the Wisdom Engine actively reinforces, while `SOUL_DIMENSIONS` names aspects of a spirit that can only be measured as it emerges — never reinforced or assigned directly, enforced structurally by having no direct-set function anywhere in this module.

## Honoring the self-review's explicit constraint

The self-review's directive — "ensure the Soul Engine never becomes a numerical morality system" — is honoured by `CollectiveCharacterTracker`: it only exposes per-trait witnessed counts and an emergent dominant trait (mirroring AF-162's real `PlayerPurposeObserver.dominantPurpose` "reveal, never assign" discipline), confirmed by a dedicated test that no morality-score property exists. "Rituals" ("none are mandatory, all are meaningful") is structurally enforced by `RitualLog` having no completion/mandatory field at all.

## What's genuinely new

- **`MomentsOfHumanityLog`** — a civilisation-wide witnessed-moments ledger, distinct from AF-163's per-entity `SignificanceTracker`.
- **`BeautyIndexTracker`** — per-category level with a simple average.

## Live

Fresh-run debug line: `soul character Welcoming · rituals 1 · humanity moments 1 · beauty 70 · galactic reputation Compassion · civilisation hope 75`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-167's `ReputationTracker`/`EarnedTitleTracker`, AF-163's `SignificanceTracker`/`MeaningCurator`, AF-159's `CulturalTrendTracker`, AF-160's `MentorshipLedger`/`CIVILISATION_VALUES`, AF-166's `EmotionalContinuityTracker`, AF-162's `PlayerPurposeObserver`, or any other locked module. 13 tests, suite at 1867. Score 9.5/10 — approved and locked.
