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

## Roster Expansion, Batch 1 (produced immediately after, per Project Owner direction)

`commanderExpansionRoster.ts` adds 8 new, fully fleshed-out commanders (Korr "Wardbreaker", Voss "Lanternkeep", Devereux "Static", Okafor "Halcyon", Ur-Sella "Chorus", Kade "Fulcrum", Calder "Driftline", Aldana "Aftercare") additively onto the launch roster — 14 → 22 toward AF-097's 100+ target. Each carries the full 37-field template, including real content for all 16 AF-098-new fields (age, species, homeworld, psychological profile, leadership style, animation style, music motif, all 6 Preferred-X fields bound to real ship/weapon/equipment/relic/research/biome ids, ending story, dialogue library, mastery challenges) — a `CommanderExpandedProfileDef` wrapper, since AF-030/071's locked shapes don't carry these fields. Every new commander is proven distinct from the entire 22-commander roster via the real AF-030 fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check — not eyeballed. All 8 are genuinely recruitable through the real `RosterRuntime`, bound to AF-072's unchanged 7-value `RECRUITMENT_SOURCES`. Live: the `commander` overlay's `roster` count now reads `3/22`. 10 more tests, suite at 1151.
