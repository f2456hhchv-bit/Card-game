# Commander CMD-030 — Lysandra Aether "The Celestial" (AF-128)

The canonical, individually-specified implementation of Afterlight's thirtieth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 42, homeworld Celestia Observatory, "visionary" personality, `orbitalCommander` archetype/`hybrid` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Stellar Alignment → `onKill`/`criticalChance`), Ability One (Starfall), Ability Two (Constellation Network), Ultimate (Birth of a Galaxy), Signature (Celestial Harmony → `onLowHealth`/`cooldownReduction`).
- **Talent Tree** — Stars/Celestial Guidance/Cosmic Ascension, exactly as named in the spec.
- **Deliberately distinct from Rhea Solari, Selene Myrr, AND Eliana Ross** — the spec's own self-review directive says "Reduce overlap with Photon, Oracle and Horizon Commanders," the roster's third TRIPLE overlap-reduction directive. Her `orbitalCommander`/`hybrid` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Solari's `assault`/`scientist` kit, Myrr's `support`/`support` kit, and Ross's `droneCommander`/`support` kit; a dedicated test asserts distinctness from all three across archetype, class, passive, and signature.
- **The roster's TWELFTH commander with four spec'd relationships instead of three** — Close Friend (Voss), Professional Respect (Myrr), Scientific Collaboration (Vex), Works With (Ross) — with no relationship to any other prior commander invented.
- **A thirty-first Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `legendaryMissions` source (matching the spec's "Final Endgame" recruitment difficulty and framing as "one of the game's ultimate unlocks"), gated on "When Stars Remember."
- **Dialogue** — all 6 spec lines carried verbatim.
- **Strong real-data continuity find** — `helios-prism-array` (Helios, sun god / Prism, Solar Prism) is a literal thematic match for her preferred weapons, and `solar-wastes` for her preferred biomes.

## Live

The `commander` overlay's roster count now reads `3/52`; the `codex` overlay line reads `16/80 entries`. Browser-verified via the dev server's debug overlay, zero page errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Solari/Myrr/Ross triple distinctness check), suite at 1471. Score 9.5/10 — approved and locked.
