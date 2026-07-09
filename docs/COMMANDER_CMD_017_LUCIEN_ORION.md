# Commander CMD-017 — Lucien Orion "The Starlancer" (AF-115)

The canonical, individually-specified implementation of Afterlight's seventeenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 35, homeworld Nova Reach, "fearless" personality, `assault` archetype/`assault` class — a first exact double-match) realised exactly as specified.
- **Abilities on real shapes** — Passive (Momentum Engine → `onCriticalHit`/`movementSpeed`), Ability One (Star Dash), Ability Two (Velocity Lock), Ultimate (Supernova Drive), Signature (Velocity Chain → `onKill`/`criticalDamage`).
- **Talent Tree** — Velocity/Interceptor/Starflight, exactly as named in the spec.
- **The roster's first commander with FOUR spec'd relationships instead of three** — Close Friend (Ash), Professional Rival (Drake — the roster's first "rival" relationship type), Great Respect (Kane), Enjoys Working With (Voss) — with no relationship to Ryker, Cael, Sol, Vale, Iskander, Thorne, Vex, Korven, Syn, Solari, Kain, or Reyes invented.
- **An eighteenth Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `exploration` source, gated on "The Redline".
- **Dialogue** — all 5 spec lines carried verbatim, including the spec's non-standard 5th category ("Low Health") alongside Mission Start/Boss Encounter/Ultimate/Victory.
- **Strong continuity finds** — his preferred equipment `vanguard-thrusters` is the real, literal thruster item; his preferred ship `sable-dart-mk1` is the real `interceptor`-class hull with a `speed` specialisation; his preferred relic `gambler-die` grants a real `+0.5 criticalDamage` effect.

## Live

The `commander` overlay's roster count now reads `3/39`; the `codex` overlay line reads `16/67 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1325. Score 9.5/10 — approved and locked.
