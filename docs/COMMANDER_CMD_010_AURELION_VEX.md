# Commander CMD-010 — Aurelion Vex "The Chronomancer" (AF-108)

The canonical, individually-specified implementation of Afterlight's tenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (biological age 35, homeworld Chronos Research Ring, "haunted" personality — a first use of that registered trait, `recon` archetype/`support` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Temporal Awareness → `onLowHealth`/`cooldownReduction`), Ability One (Time Fracture), Ability Two (Chrono Recall), Ultimate (Frozen Moment), Signature (Temporal Charge → `onCriticalHit`/`movementSpeed`).
- **Talent Tree** — Acceleration/Temporal Control/Chronology, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Cael), Professional Respect (Voss), Scientific Collaboration (Sol) — with no relationship to Kane, Ryker, Drake, Vale, Iskander, or Thorne invented.
- **An eleventh Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Broken Hour".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — his preferred equipment includes `horizon-flux-capacitor` (a real Quantum Horizon prototype item); his preferred ships include `aurelia-hull-mk1` (the real `scienceVessel`-class hull) and `bastion-hull-mk1` (the real `frigate`-class hull); his preferred weapon `hailborn-array` is the real freeze-status weapon; his preferred biome `singularity-zone` is literally named "Axiom" — "physics stops being a description and becomes a negotiation."

## Live

The `commander` overlay's roster count now reads `3/32`; the `codex` overlay line reads `16/60 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1254. Score 9.5/10 — approved and locked.
