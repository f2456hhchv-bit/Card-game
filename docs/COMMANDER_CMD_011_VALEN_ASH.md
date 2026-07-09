# Commander CMD-011 — Valen Ash "The Tempest" (AF-109)

The canonical, individually-specified implementation of Afterlight's eleventh fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 37, homeworld Stormspire Colony, "optimistic" personality — an exact literal trait match, `orbitalCommander` archetype/`assault` class — both first uses of these values) realised exactly as specified.
- **Abilities on real shapes** — Passive (Atmospheric Charge → `onCriticalHit`/`damage`), Ability One (Lightning Spear), Ability Two (Cyclone Field), Ultimate (Planetfall Storm), Signature (Storm Intensity → `onDamageTaken`/`cooldownReduction`).
- **Talent Tree** — Lightning/Atmosphere/Stormcaller, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Sol), Professional Respect (Voss), Works With (Vex) — with no relationship to Kane, Ryker, Cael, Drake, Vale, Iskander, or Thorne invented.
- **A twelfth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `factionReputation` source (the last of the 7 recruitment sources to see real content), gated on "Eye of the Storm".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — his preferred weapon `coil-ripper-mk2` is the real `arc`-category weapon; his preferred relic `static-node` is literally named for static electricity; his preferred biome `living-ecospheres` ties directly to his "planetary preservation over rapid extraction" recruitment choice.

## Live

The `commander` overlay's roster count now reads `3/33`; the `codex` overlay line reads `16/61 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1264. Score 9.5/10 — approved and locked.
