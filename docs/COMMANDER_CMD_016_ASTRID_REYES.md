# Commander CMD-016 — Astrid Reyes "The Warden" (AF-114)

The canonical, individually-specified implementation of Afterlight's sixteenth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 45, homeworld Sanctuary Bastion, "compassionate" personality, `support` archetype/`hybrid` class) realised exactly as specified.
- **Abilities on real shapes** — Passive (Guardian's Oath → `onShieldBreak`/`shieldRegeneration`), Ability One (Guardian Dome), Ability Two (Emergency Protocol), Ultimate (Last Sanctuary), Signature (Civil Defence Rating → `onCriticalHit`/`shieldCapacity`).
- **Talent Tree** — Protector/Emergency Response/Command, exactly as named in the spec.
- **Deliberately distinct from Adrian Kane** — the spec's own self-review directive says "Reduce overlap with Adrian Kane." Her `support`/`hybrid` archetype/class and her passive's `onShieldBreak` trigger are chosen specifically to differ from Kane's `guardian`/`defender`/`onDamageTaken` kit; a dedicated test asserts this distinctness directly.
- **Exactly the three spec'd relationships** — Close Friend (Kane), Professional Respect (Syn), Works Closely With (Iskander) — with no relationship to Ryker, Cael, Drake, Sol, Vale, Thorne, Vex, Ash, Korven, Solari, or Kain invented.
- **A seventeenth Codex entry, cross-referencing exactly those three commanders.**
- **Recruitment** — bound to AF-072's `legendaryMissions` source, gated on "The Final Evacuation".
- **Dialogue** — all 5 spec lines carried verbatim.
- **Strong continuity finds** — her preferred equipment `nova-warden-hive` is literally named "Warden," matching her own codename; her preferred relic `warden-token` is the real "Warden's Token"; her preferred ship `bastion-hull-mk1` is the real `guardian`-class `frigate`.

## Live

The `commander` overlay's roster count now reads `3/38`; the `codex` overlay line reads `16/66 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests (including a dedicated Kane-distinctness check), suite at 1315. Score 9.5/10 — approved and locked.
