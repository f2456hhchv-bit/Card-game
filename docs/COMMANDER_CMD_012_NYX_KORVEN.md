# Commander CMD-012 — Nyx Korven "The Phantom" (AF-110)

The canonical, individually-specified implementation of Afterlight's twelfth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 33, homeworld Eclipse Station, "compassionate" personality, `recon` archetype/`recon` class — a first double-recon match) realised exactly as specified.
- **Abilities on real shapes** — Passive (Ghost Protocol → `onKill`/`criticalDamage`), Ability One (Optical Cloak), Ability Two (Holographic Decoy), Ultimate (Blackout Network), Signature (Intel Network → `onCriticalHit`/`resourceGain`).
- **Talent Tree** — Infiltration/Sabotage/Assassin, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Professional Respect (Drake), Works Closely With (Voss), Trusted By (Kane) — with no relationship to Ryker, Cael, Sol, Vale, Iskander, Thorne, Vex, or Ash invented.
- **A thirteenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `story` source, gated on "The Invisible War".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her preferred ship `wayfarer-hull-mk2` is the real `scout`-class `corvette` hull; her preferred relic `veil-fragment` is literally named for concealment; her preferred relic `gambler-die` doubles critical chance below 25% health, a strong match for "Precision Relics."

## Live

The `commander` overlay's roster count now reads `3/34`; the `codex` overlay line reads `16/62 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1274. Score 9.5/10 — approved and locked.
