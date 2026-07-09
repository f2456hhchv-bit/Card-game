# Commander CMD-019 — Selene Myrr "The Oracle" (AF-117)

The canonical, individually-specified implementation of Afterlight's nineteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 39, homeworld Oracle Station Theta, "visionary" personality, `support` archetype/`support` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Predictive Insight → `onCriticalHit`/`pickupRadius`), Ability One (Tactical Projection), Ability Two (Probability Matrix), Ultimate (Future Vision), Signature (Prediction Level → `onKill`/`resourceGain`).
- **Talent Tree** — Analysis/Strategy/Oracle, exactly as named in the spec.
- **Deliberately avoids the `recon` archetype** — the spec's own self-review directive says "Reduce overlap with reconnaissance and research Commanders." Rather than reusing `recon` (already used four times: Voss, Drake, Vex, Korven), she leans into a squad-wide `support`/`support` double-match — a fresh combination nobody else has used, verified by a dedicated test asserting her archetype and class are never `recon`.
- **Exactly the three spec'd relationships** — Close Friend (Vex), Professional Respect (Voss), Collaborates With (Cael) — with no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, or Volkov invented.
- **A twentieth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `research` source, gated on "The Infinite Equation".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her preferred equipment `horizon-flux-capacitor` ties to the real Quantum Horizon manufacturer; her preferred ship `aurelia-hull-mk1` is the real `scienceVessel`-class hull; her preferred biome `singularity-zone` is literally "Axiom" — "physics stops being a description and becomes a negotiation."

## Live

The `commander` overlay's roster count now reads `3/41`; the `codex` overlay line reads `16/69 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated recon-avoidance check), suite at 1347. Score 9.5/10 — approved and locked.
