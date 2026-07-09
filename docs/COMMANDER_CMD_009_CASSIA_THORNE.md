# Commander CMD-009 — Cassia Thorne "The Starforged" (AF-107)

The canonical, individually-specified implementation of Afterlight's ninth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 43, homeworld Forge World Helios IX, "Atlas Dynamics" faction — a real manufacturer id already referenced across `equipmentRosterData.ts`/`shipRosterData.ts`, `engineer` archetype/class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Forge Heat → `onKill`/`criticalDamage`), Ability One (Thermal Overdrive), Ability Two (Forge Barrier), Ultimate (Starforge Core), Signature (Forge Mastery → `onKill`/`cooldownReduction`).
- **Talent Tree** — Weaponsmith/Industrial Systems/Living Forge, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Ryker), Professional Respect (Iskander), Works Closely With (Kane) — with no relationship to Voss, Cael, Drake, Sol, or Vale invented.
- **A tenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `exploration` source (a first — every other slot but `factionReputation` is now real content), gated on "The Burning Foundry".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her Preferred Ships/Weapons/Equipment draw on `ballista-mk3` and `atlas-cluster-battery` (both real Atlas Dynamics items) and `vanguard-core` (a real Atlas-manufactured reactor); her preferred biome `machine-expanse` is the real biome literally named "Forge Primus".

## Live

The `commander` overlay's roster count now reads `3/31`; the `codex` overlay line reads `16/59 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1244. Score 9.5/10 — approved and locked.
