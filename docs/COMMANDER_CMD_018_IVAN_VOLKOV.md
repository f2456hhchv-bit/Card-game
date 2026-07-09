# Commander CMD-018 — Ivan Volkov "The Titan" (AF-116)

The canonical, individually-specified implementation of Afterlight's eighteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 49, homeworld Forge Bastion Sigma, "compassionate" personality, `engineer` archetype/`assault` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Living Fortress → `onDamageTaken`/`shieldCapacity`), Ability One (Titan Charge), Ability Two (Siege Hammer), Ultimate (Bulwark Protocol), Signature (Fortitude → `onKill`/`shieldRegeneration`).
- **Talent Tree** — Juggernaut/Siege/Guardian, exactly as named in the spec.
- **Deliberately distinct from BOTH Adrian Kane and Astrid Reyes** — the spec's own self-review directive says "Reduce overlap with Adrian Kane and Astrid Reyes." His `engineer`/`assault` archetype/class and his passive's `shieldCapacity` bonus are chosen specifically to differ from Kane's `guardian`/`defender`/`shieldRegeneration` kit and Reyes's `support`/`hybrid`/`shieldRegeneration` kit; a dedicated test asserts distinctness from both commanders directly.
- **Exactly the three spec'd relationships** — Close Friend (Kane), Professional Respect (Reyes), Works With (Thorne) — with no relationship to Ryker, Cael, Drake, Sol, Vale, Iskander, Vex, Ash, Korven, Syn, Solari, Kain, or Orion invented.
- **A nineteenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `factionReputation` source, gated on "The Iron Gate".
- **Dialogue** — all 6 spec lines carried verbatim (Mission Start/Heavy Attack/Boss Encounter/Ultimate/Victory/Low Health).
- **Strong continuity finds** — his preferred equipment `barrier-plate` is a real, heaviest-shieldCapacity defensive module; his preferred weapon `novasplitter` ties to the real Ironmoor Foundry manufacturer philosophy ("Mass is honesty"); his preferred biome `machine-expanse` is the real biome literally named "Forge Primus."

## Live

The `commander` overlay's roster count now reads `3/40`; the `codex` overlay line reads `16/68 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Kane-and-Reyes distinctness check), suite at 1336. Score 9.5/10 — approved and locked.
