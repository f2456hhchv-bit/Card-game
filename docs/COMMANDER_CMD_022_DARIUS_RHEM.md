# Commander CMD-022 — Darius Rhem "The Catalyst" (AF-120)

The canonical, individually-specified implementation of Afterlight's twenty-second fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 38, homeworld Helix Research Complex, "optimistic" personality, `prototypePilot` archetype/`experimental` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Reaction Potential → `onKill`/`cooldownReduction`), Ability One (Catalytic Charge), Ability Two (Cascade Field), Ultimate (Critical Mass), Signature (Reaction Network → `onShieldBreak`/`statusChance`).
- **Talent Tree** — Detonation/Propagation/Catalysis, exactly as named in the spec.
- **Deliberately distinct from BOTH Rhea Solari (Photon) and Valen Ash (Tempest)** — the spec's own self-review directive says "Reduce overlap with Photon and Tempest Commanders." His `prototypePilot`/`experimental` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Solari's `assault`/`scientist` kit and Ash's `orbitalCommander`/`assault` kit; a dedicated test asserts distinctness from both commanders across archetype, class, passive, and signature.
- **The roster's FOURTH commander with four spec'd relationships instead of three** — Close Friend (Thorne), Scientific Collaboration (Cael), Professional Respect (Ryker), Inspired By (Voss) — with no relationship to Kane, Drake, Sol, Vale, Iskander, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, Myrr, Nova, or Vega invented.
- **A twenty-third Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Domino Principle".
- **Dialogue** — all 6 spec lines carried verbatim.
- **Strong continuity finds** — his preferred weapon `coil-ripper-mk2` has a real `chainLightning` projectile behaviour; his preferred relic `cinder-heart` literally detonates on critical hits; his preferred research `harmonic-overload` is literally named "Overload."

## Live

The `commander` overlay's roster count now reads `3/44`; the `codex` overlay line reads `16/72 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Solari-and-Ash distinctness check), suite at 1380. Score 9.5/10 — approved and locked.
