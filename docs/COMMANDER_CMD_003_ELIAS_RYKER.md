# Commander CMD-003 — Elias Ryker "The Engineer" (AF-101)

The canonical, individually-specified implementation of Afterlight's third fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 44, homeworld Titan Foundry Station, Afterlight Initiative faction, "scientific" personality, engineering archetype/class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Field Workshop → `onDamageTaken`/`resourceGain`), Ability One (Auto Turret), Ability Two (Repair Swarm), Ultimate (Forward Operating Base), Signature (Engineering Components → `onDamageTaken`/`droneEffectiveness` — a **third** real producer of that bonus kind, alongside `kite-aviary` and CMD-001's Field Commander branch).
- **Talent Tree** — Automation/Engineering/Fortification, exactly as named in the spec.
- **A three-way relationship web** — Close Friend of Dr. Lyra Voss and Professional Respect for Adrian Kane, both real cross-commander relationships binding to their actual roster ids.
- **A fourth Codex entry, cross-referencing both predecessors** — `codex-commander-ryker-engineer`, `relatedEntryIds` pointing at both CMD-001 and CMD-002.
- **Preferred Ships/Weapons/Equipment/Relics/Research/Biomes** — all resolve against real, existing rosters.
- **Recruitment** — bound to AF-072's `campaign` source, gated on "Echoes of the Foundry".
- **Dialogue** — all 5 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/25`; the `codex` overlay line reads `16/53 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests, suite at 1184. Score 9.5/10 — approved and locked.
