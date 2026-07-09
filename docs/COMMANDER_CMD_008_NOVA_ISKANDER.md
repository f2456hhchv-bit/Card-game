# Commander CMD-008 — Nova Iskander "The Swarmmaster" (AF-106)

The canonical, individually-specified implementation of Afterlight's eighth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 39, homeworld Orbital Hive Sigma, "compassionate" personality, `droneCommander` archetype/`hybrid` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Distributed Intelligence → `onCriticalHit`/`droneEffectiveness`, the fourth real `droneEffectiveness` producer), Ability One (Drone Deployment Matrix), Ability Two (Swarm Command), Ultimate (Hive Network), Signature (Swarm Intelligence → `onCriticalHit`/`cooldownReduction`).
- **Talent Tree** — Offensive Swarm/Support Network/Adaptive Intelligence, exactly as named in the spec.
- **Exactly the three spec'd relationships** — Close Friend (Ryker), Professional Respect (Kane), Collaborates With (Sol) — with no relationship to Voss, Cael, or Drake invented.
- **A ninth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `hiddenDiscoveries` source, gated on "Hive Protocol".
- **Dialogue** — all 5 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/30`; the `codex` overlay line reads `16/58 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 10 tests, suite at 1234. Score 9.5/10 — approved and locked.
