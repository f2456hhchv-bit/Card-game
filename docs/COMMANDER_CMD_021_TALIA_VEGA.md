# Commander CMD-021 — Talia Vega "The Echo" (AF-119)

The canonical, individually-specified implementation of Afterlight's twenty-first fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 29, homeworld Echo Deep Observatory, "curious" personality, `crystalSpecialist` archetype/`scientist` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Echo Mapping → `onKill`/`pickupRadius`), Ability One (Resonance Pulse), Ability Two (Signal Relay — a fifth real `droneEffectiveness` producer via her Communications talent branch), Ultimate (Deep Echo Network), Signature (Signal Clarity → `onShieldBreak`/`statusDuration`).
- **Talent Tree** — Recon/Communications/Resonance, exactly as named in the spec.
- **Deliberately distinct from BOTH Selene Myrr and Nyx Korven** — the spec's own self-review directive says "Reduce overlap with Selene Myrr and Nyx Korven." Her `crystalSpecialist`/`scientist` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Myrr's `support`/`support` kit and Korven's `recon`/`recon` kit; a dedicated test asserts distinctness from both commanders across archetype, class, passive, and signature.
- **The roster's THIRD commander with four spec'd relationships instead of three** — Close Friend (Myrr), Professional Respect (Voss), Works Closely With (Korven), Collaborates With (Iskander) — with no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Thorne, Vex, Ash, Syn, Solari, Kain, Reyes, Orion, Volkov, or Nova invented.
- **A twenty-second Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `hiddenDiscoveries` source, gated on "The Silent Signal".
- **Dialogue** — all 6 spec lines carried verbatim.
- **Strong continuity finds** — her preferred relic `static-node` literally "hums when another of its kind draws near"; her preferred research `resonant-collectors` is literally "resonant"; her preferred biomes `void-expanse` ("what is left keeps their shapes the way a footprint keeps a foot") and `derelict-expanse` ("some still transmit") both echo her whole signal-trace fantasy.

## Live

The `commander` overlay's roster count now reads `3/43`; the `codex` overlay line reads `16/71 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Myrr-and-Korven distinctness check), suite at 1369. Score 9.5/10 — approved and locked.
