# Commander Production Framework (AF-098)

Extends AF-030's `CommanderDef`, AF-071's `CommanderProfileDef`/`CommanderProgressionRuntime`, AF-072's `RosterRuntime`, and AF-026's `MetaProgression` — all unchanged. Zero changes to any locked module.

## What's new

- **14-stage production pipeline** — proven LINEAR: every stage advances to exactly one successor, no cycling, always terminates.
- **37-field "Every Commander Must Define" template** — 21 already have a real home on the locked classes above; 16 are genuinely new (Age, Species, Homeworld, Psychological Profile, Leadership Style, Animation Style, Music Motif, Mastery Challenges, all 6 Preferred-X fields, Ending Story, Dialogue Library). This module defines their **shape**; per-commander content authoring is separate future work.
- **Personality Framework, dialogue-only BY SHAPE** — `PersonalityDialogueHint` has no bonus field at all, exactly mirroring `CommanderRelationshipDef`'s own "not gameplay balance" law. A stat-bearing personality is structurally unrepresentable, not just discouraged by convention.
- **Roster Diversity** — only 2 of 10 axes (combat role, faction history) are provable across the real 14-commander roster today; the other 8 have no roster-wide content yet.
- **Recruitment** — 7 of 8 methods realise onto AF-072's real `RECRUITMENT_SOURCES`; only `ancientDiscovery` is future (would otherwise double-claim `hiddenDiscoveries`).
- **Mastery** — 5 of 7 features delegate to real AF-026/072/088 mechanisms via the existing `masteryTrackId` string key; `uniqueChallenges` and `titles` are honest future.
- **Dialogue** — honestly 0/12 trigger categories; no dialogue system exists anywhere in the codebase.
- **Codex/Relationships** — proven against the real roster: exactly 1 of 14 commanders has a Codex entry (`codex-commander-reyes`), exactly 3 of 14 have authored relationships (`FRAMEWORK_COMMANDERS`).

## Live

The `commander` debug overlay line now appends real template/recruitment/relationship/personality/dialogue/mastery summaries. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 12 tests, suite at 1141. Score 9.5/10 — approved and locked.
