# Commander CMD-005 — Kael Drake "The Hunter" (AF-103)

The canonical, individually-specified implementation of Afterlight's fifth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 41, homeworld Ashfall Frontier, Independent Frontier Rangers faction, "strategic" personality, `recon` archetype/class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Predator's Analysis → `onCriticalHit`/`pickupRadius`), Ability One (Hunter Drone), Ability Two (Execution Protocol), Ultimate (Perfect Hunt), Signature (Hunter Knowledge → `onCriticalHit`/`statusChance`).
- **Talent Tree** — Marksman/Tracker/Apex Predator, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Respect (Kane), Friendship (Voss), Professional Trust (Cael) — with no fourth relationship invented for CMD-003, honestly matching the spec's silence on that pairing.
- **A sixth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `campaign` source, gated on "The Last Trail".
- **Dialogue** — all 5 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/27`; the `codex` overlay line reads `16/55 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1204. Score 9.5/10 — approved and locked.
