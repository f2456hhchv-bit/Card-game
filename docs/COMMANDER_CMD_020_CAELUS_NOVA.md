# Commander CMD-020 — Caelus Nova "The Architect" (AF-118)

The canonical, individually-specified implementation of Afterlight's twentieth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 46, homeworld Atlas Prime, primary faction "Atlas Dynamics" — his first-ever primary-faction assignment away from Afterlight Initiative, "visionary" personality, `orbitalCommander` archetype/`support` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Infrastructure Network → `onKill`/`shieldCapacity`), Ability One (Rapid Fabrication), Ability Two (Atlas Network), Ultimate (Frontier Citadel), Signature (Construction Progress → `onShieldBreak`/`cooldownReduction`).
- **Talent Tree** — Construction/Infrastructure/Expansion, exactly as named in the spec.
- **Deliberately distinct from BOTH Elias Ryker and Nova Iskander** — the spec's own self-review directive says "Reduce overlap with Elias Ryker and Nova Iskander." His `orbitalCommander`/`support` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Ryker's `engineer`/`engineer` kit and Iskander's `droneCommander`/`hybrid` kit; a dedicated test asserts distinctness from both commanders directly.
- **The roster's SECOND commander with four spec'd relationships instead of three** — Close Friend (Ryker), Professional Respect (Thorne), Works Closely With (Iskander), Inspired By (Voss — the roster's first "Inspired By" relationship type) — with no relationship to Kane, Cael, Drake, Sol, Vale, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, or Myrr invented.
- **A twenty-first Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `campaign` source, gated on "The First Foundation".
- **Dialogue** — all 6 spec lines carried verbatim.
- **Strong continuity finds** — his preferred equipment `vanguard-core` is manufactured by the real Atlas Dynamics — his own faction; his preferred weapon `atlas-cluster-battery` and ship `ballista-mk3` are both real Atlas Dynamics products; his preferred biome `machine-expanse` is the real biome literally named "Forge Primus."

## Live

The `commander` overlay's roster count now reads `3/42`; the `codex` overlay line reads `16/70 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Ryker-and-Iskander distinctness check), suite at 1358. Score 9.5/10 — approved and locked.
