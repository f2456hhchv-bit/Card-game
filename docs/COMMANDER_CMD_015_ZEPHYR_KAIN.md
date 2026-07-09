# Commander CMD-015 — Zephyr Kain "The Singularity" (AF-113)

The canonical, individually-specified implementation of Afterlight's fifteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 42, homeworld Event Horizon Laboratory, "fearless" personality, `prototypePilot` archetype — a first use of that registered value, closing out all 10 real archetypes — and `scientist` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Mass Accumulation → `onKill`/`statusChance`), Ability One (Gravity Well), Ability Two (Orbital Collapse), Ultimate (Event Horizon), Signature (Gravitational Equilibrium → `onCriticalHit`/`cooldownReduction`).
- **Talent Tree** — Compression/Orbital Dynamics/Singularity, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Scientific Collaboration (Cael), Professional Respect (Vex), Close Friend (Voss) — with no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, or Syn invented.
- **A sixteenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `hiddenDiscoveries` source, gated on "The Falling Sky".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — his preferred weapon `paragon-flux-driver` is the real `singularity`-category weapon with `gravityAffected` projectile behaviour; his preferred relic `singularity-keepsake` is the real `singularity`-category relic; his preferred biome `singularity-zone` is literally "Axiom" — "physics stops being a description and becomes a negotiation."

## Live

The `commander` overlay's roster count now reads `3/37`; the `codex` overlay line reads `16/65 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1304. Score 9.5/10 — approved and locked.
