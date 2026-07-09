# Commander CMD-004 — Seraphina Cael "The Quantum Weaver" (AF-102)

The canonical, individually-specified implementation of Afterlight's fourth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 34, homeworld Helios Quantum Institute, "fearless" personality, `voidSpecialist` archetype/`experimental` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Probability Cascade → `onCriticalHit`/`experienceGain`), Ability One (Quantum Anchor), Ability Two (Probability Shift), Ultimate (Reality Bloom), Signature (Quantum Stability → `onCriticalHit`/`statusChance`).
- **Talent Tree** — Probability/Quantum Physics/Dimensional Control, exactly as named in the spec.
- **A three-way relationship web** — Close Friend of Lyra Voss, Professional Collaboration with Elias Ryker, Respect for Adrian Kane — all real bindings to their actual roster ids.
- **A fifth Codex entry, cross-referencing all three prior commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Impossible Equation".
- **Dialogue** — all 5 spec lines carried verbatim, including "Ultimate" mapped to the real `legendaryMoments` category.

## Live

The `commander` overlay's roster count now reads `3/26`; the `codex` overlay line reads `16/54 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1194. Score 9.5/10 — approved and locked.
