# The Atlas Experience Engine (AF-164)

Built entirely under `src/game/atlasExperience/`. Exists above AF-163's Meaning Engine: meaning explains why something matters, experience determines how the player actually lives through it. This module leans heavily on direct reuse since "experience" mostly composes machinery already built.

## What's already real, reused directly

- **"Experience Rhythm"** shares SEVEN of its 8 stages verbatim with AF-154's real `PACING_CYCLE_STAGES` (only "Action" vs "Combat" differs, confirmed a synonym) — reused directly via AF-154's real `PacingCycleTracker`.
- **"Player Expression"** shares SEVEN of its 8 playstyles verbatim with AF-162's real `PLAYER_PURPOSE_KINDS` (only "Scientist" vs "Founder" differs) — confirmed the SAME mechanism asked twice, unlike this codebase's "domain" list family. Reused directly via AF-162's real `PlayerPurposeObserver`.
- **"Surprise Management"** is confirmed the same shape as AF-153's real `EmergenceOpportunityLog`/`EMERGENCE_OPPORTUNITY_KINDS` (4 of 6 near-exact matches) — reused directly.
- **"Emotional Memory"** overlaps directly with AF-163's real `PERSONAL_MEANING_CATEGORIES`/`MeaningCurator` and `QuietMomentLog` ("Most meaningful discovery" a verbatim shared member) — reused directly.
- **"Micro Experiences"** and **"Returning Moments"** both compose AF-163's real `SignificanceTracker` directly at the call site.
- **"Shared Experiences"** is confirmed the FIFTH instance of AF-155's real `CollaborativeProblemLog` mechanic in this codebase — reused directly.

## The module's structural resolutions

- **"Experience Pillars"** (10) is another entry in this codebase's recurring abstract-value/virtue-list family — 3 exact-string matches with AF-160's real `CIVILISATION_VALUES` (Responsibility/Hope/Legacy), kept separate since it tags experiential design pillars rather than civilisation-wide values.
- **"Experience States"** (10) mirrors the SHAPE of AF-154's real `PlayerExperienceFactors`/`PlayerExperienceTracker` but never its TYPE, since that interface is hand-typed to its own closed field set rather than a reusable generic.

## What's genuinely new

- **`FirstTimeMomentTracker`** — "never diminish them through repetition"; protects a first-occurrence moment from being re-triggered.
- **`AtmosphereCoordinator`** — coordinates the 7 named atmospheric dimensions together.

## Live

Fresh-run debug line: `experience rhythm Discovery · expression Conservationist · surprise 1 · first-time recruited=true (repeat blocked=true) · states curiosity=70 immersion=80 · atmosphere lighting=0.6 · shared festival 2 · long-term rank 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-154's `PacingCycleTracker`/`PlayerExperienceFactors`, AF-162's `PlayerPurposeObserver`, AF-153's `EmergenceOpportunityLog`, AF-163's `MeaningCurator`/`SignificanceTracker`/`QuietMomentLog`, AF-155's `CollaborativeProblemLog`, AF-160's `CIVILISATION_VALUES`, or any other locked module. 12 tests, suite at 1823. Score 9.5/10 — approved and locked.
