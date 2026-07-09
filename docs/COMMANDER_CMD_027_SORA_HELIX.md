# Commander CMD-027 — Sora Helix "The Alchemist" (AF-125)

The canonical, individually-specified implementation of Afterlight's twenty-seventh fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 34, homeworld Elemental Research Nexus, "curious" personality, `engineer` archetype/`scientist` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Catalytic Knowledge → `onKill`/`experienceGain`), Ability One (Elemental Injector), Ability Two (Reaction Chamber), Ultimate (Grand Synthesis), Signature (Reaction Library → `onCriticalHit`/`statusDuration`).
- **Talent Tree** — Chemistry/Research/Synthesis, exactly as named in the spec.
- **Deliberately distinct from BOTH Darius Rhem and Valen Ash** — the spec's own self-review directive says "Reduce overlap with Darius Rhem and Valen Ash." Her `engineer`/`scientist` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Rhem's `prototypePilot`/`experimental` kit and Ash's `orbitalCommander`/`assault` kit; a dedicated test asserts distinctness from both commanders across archetype, class, passive, and signature.
- **The roster's NINTH commander with four spec'd relationships instead of three** — Close Friend (Rhem), Scientific Collaboration (Syn), Works With (Oris), Professional Respect (Cael) — with no relationship to any other prior commander invented.
- **A twenty-eighth Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Impossible Formula."
- **Dialogue** — all 6 spec lines carried verbatim.
- **A strong real-data continuity find** — her preferred relics (`ember-core`, `frost-shard`, `cinder-heart`) are literally elemental relics already in the real relic roster, matching "Elemental Relics" from the spec exactly.

## Live

The `commander` overlay's roster count now reads `3/49`; the `codex` overlay line reads `16/77 entries`. Browser-verified via the dev server's debug overlay, zero page errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Rhem-and-Ash distinctness check), suite at 1436. Score 9.5/10 — approved and locked.
