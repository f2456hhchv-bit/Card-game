# Commander CMD-006 — Aria Sol "The Resonant" (AF-104)

The canonical, individually-specified implementation of Afterlight's sixth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 32, homeworld Resonance Station Epsilon, Crystal Ascendancy faction — a lore-consistent internal name for Crystal Dominion's leadership, already referenced by `vane-chord`'s biography — "idealistic" personality, `crystalSpecialist` archetype/`support` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Resonant Harmony → `onShieldBreak`/`boostEfficiency`), Ability One (Crystal Pulse), Ability Two (Harmonic Link), Ultimate (Symphony of Light), Signature (Harmony Meter → `onShieldBreak`/`cooldownReduction`).
- **Talent Tree** — Resonance/Support/Conductor, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Cael), Professional Respect (Voss), Collaborates With (Ryker) — with no relationship to Kane or Drake invented.
- **A seventh Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `story` source, gated on "The Crystal Choir".
- **Dialogue** — all 5 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/28`; the `codex` overlay line reads `16/56 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1214. Score 9.5/10 — approved and locked.
