# Commander CMD-013 — Dr. Mira Syn "The Bioforge" (AF-111)

The canonical, individually-specified implementation of Afterlight's thirteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 40, homeworld Eden Genesis Station, "compassionate" personality, `support` archetype — a first use of that registered value — and `scientist` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Adaptive Evolution → `onKill`/`shieldRegeneration`, a literal trigger match — "Defeated biological enemies" maps directly onto the real `onKill` trigger), Ability One (Living Bloom), Ability Two (Genome Rewrite), Ultimate (Genesis Protocol), Signature (Evolution Level → `onCriticalHit`/`resourceGain`).
- **Talent Tree** — Mutation/Cultivation/Xenobiology, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Sol), Scientific Collaboration (Voss), Professional Respect (Cael) — with no relationship to Kane, Ryker, Drake, Vale, Iskander, Thorne, Vex, Ash, or Korven invented.
- **A fourteenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Last Seed".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her preferred ship `caduceus-mk1` is literally named for the medical caduceus symbol; her preferred weapon `hailborn-array` is described as "grown, not machined"; her preferred biome `living-ecospheres` is a literal ecosystem-named biome.

## Live

The `commander` overlay's roster count now reads `3/35`; the `codex` overlay line reads `16/63 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1284. Score 9.5/10 — approved and locked.
