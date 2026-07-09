# Commander CMD-014 — Rhea Solari "The Photon" (AF-112)

The canonical, individually-specified implementation of Afterlight's fourteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 31, homeworld Helios Array, "optimistic" personality, `assault` archetype — a first use of that registered value — and `scientist` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Solar Conversion → `onKill`/`damage`), Ability One (Photon Lance), Ability Two (Solar Mirrors), Ultimate (Helios Cascade), Signature (Luminosity → `onCriticalHit`/`criticalDamage`).
- **Talent Tree** — Photon Weapons/Solar Engineering/Radiance, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Ash), Scientific Collaboration (Sol), Professional Respect (Voss) — with no relationship to Kane, Ryker, Cael, Drake, Vale, Iskander, Thorne, Vex, Korven, or Syn invented.
- **A fifteenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `campaign` source, gated on "The Dying Sun".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her preferred ship `dawnspire` is the real `heavyCruiser` with the `energyWeapons` specialisation; her preferred weapon `helios-prism-array` shares her homeworld's name; her preferred biome `solar-wastes` is literally solar-themed, directly echoing "The Dying Sun."

## Live

The `commander` overlay's roster count now reads `3/36`; the `codex` overlay line reads `16/64 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1294. Score 9.5/10 — approved and locked.
