# Commander CMD-007 — Orion Vale "The Voidrunner" (AF-105)

The canonical, individually-specified implementation of Afterlight's seventh fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 36, homeworld Null Reach, "fearless" personality, `voidSpecialist` archetype/`experimental` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Void Affinity → `onLowHealth`/`movementSpeed`), Ability One (Phase Step), Ability Two (Collapse Field), Ultimate (Beyond the Horizon), Signature (Corruption Balance → `onLowHealth`/`resourceGain`).
- **Talent Tree** — Voidwalker/Collapse/Stability, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Respect (Cael), Professional Trust (Voss), Respects (Kane) — with no relationship to Ryker, Drake, or Sol invented.
- **An eighth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `legendaryMissions` source, gated on "The Black Crossing".
- **Dialogue** — all 5 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/29`; the `codex` overlay line reads `16/57 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1224. Score 9.5/10 — approved and locked.
