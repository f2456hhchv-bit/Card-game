# Commander CMD-001 — Dr. Lyra Voss "The Pathfinder" (AF-099)

The canonical, individually-specified implementation of Afterlight's first fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 38, species Human, homeworld New Horizon Colony, Afterlight Initiative faction, "curious" personality, exploration-focused archetype `recon`/class `scientist`) realised exactly as specified.
- **Abilities on real shapes** — Passive (Explorer's Instinct → `onKill`/`pickupRadius`), Ability One (Survey Drone), Ability Two (Quantum Scanner), Ultimate (Afterlight Beacon), Signature (Scientific Momentum → `onKill`/`experienceGain`) — all on AF-030/071's unchanged `CommanderPassive`/`ActiveModule`/`CommanderUltimate`/`CommanderSignatureMechanic` shapes.
- **Talent Tree** — Explorer/Scientist/Field Commander, exactly as named in the spec. The Field Commander branch produces `droneEffectiveness`, giving that bonus kind a **second** real producer alongside `kite-aviary`'s.
- **Preferred Ships/Weapons/Equipment/Relics/Research/Biomes** — all 20 preference ids resolve against real, existing rosters (Science Vessel → `aurelia-hull-mk1`, Prototype Explorer → `maelstrom-x1`, etc.).
- **Recruitment** — real, bound to AF-072's `campaign` source, gated on "The Silent Observatory" exactly as specified (Early Campaign difficulty).
- **Dialogue** — all 5 spec lines carried verbatim in `dialogueLibrary`, each tagged to a real `DIALOGUE_TRIGGER_CATEGORIES` value.
- **Codex** — a second real `codex-commander-*` entry (`codex-commander-voss-pathfinder`), added additively — `codexData.ts` itself is untouched. Extends AF-098's honest "1/14 commanders have a Codex entry" gap.
- **Weaknesses are structural, not just written** — proven by test that neither her passive nor signature bonus is `damage`/`criticalDamage`, matching the spec's "lower burst damage / lower direct combat power."

## Live

The `commander` overlay's roster count now reads `3/23`; the `codex` overlay line reads `16/51 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests, suite at 1162. Score 9.5/10 — approved and locked.
