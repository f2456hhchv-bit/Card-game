# Commander CMD-028 — Dorian Fen "The Beastmaster" (AF-126)

The canonical, individually-specified implementation of Afterlight's twenty-eighth fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## Owner-authorised name substitution

The verbatim AF-126 prompt specifies Full Name "Orion Vale" — which collides with the already-locked CMD-007 "Orion Vale 'The Voidrunner'" (AF-105), an entirely unrelated character (void expedition specialist vs. this module's xenobiologist/wildlife handler). This was flagged to the Project Owner before any implementation began; the Owner chose to rename this Commander to **Dorian Fen** rather than implement a duplicate full name. Every other spec field — codename, biography, personality, abilities, talent tree, relationships, dialogue — is realised exactly as written, with only the "Orion"/"Vale" name references replaced by "Dorian"/"Fen" in generated prose. See `docs/modules/AF-126-commander-cmd-028-dorian-fen.md` for the full verbatim prompt and alignment review.

## What's new

- **Full identity** — every spec field (age 41, homeworld Verdant Expanse, "compassionate" personality, `droneCommander` archetype/`hybrid` class) realised exactly as specified, under the renamed identity above.
- **Abilities on real shapes** — Passive (Natural Bond → `onKill`/`droneEffectiveness`), Ability One (Call Companion), Ability Two (Pack Command), Ultimate (Wild Dominion), Signature (Companion Evolution → `onShieldBreak`/`experienceGain`).
- **Talent Tree** — Predator/Guardian/Conservation, exactly as named in the spec; the seventh real `droneEffectiveness` producer across the roster (companions mapped onto the existing summon-effectiveness bonus kind).
- **Deliberately distinct from Mira Syn** — the spec's own self-review directive says "Reduce overlap with Mira Syn." His `droneCommander`/`hybrid` archetype/class and passive/signature trigger+bonus pairs are chosen specifically to differ from Syn's `support`/`scientist` kit; a dedicated test asserts distinctness across archetype, class, passive, and signature.
- **The roster's TENTH commander with four spec'd relationships instead of three** — Close Friend (Syn), Professional Respect (Ross), Works With (Helix), Collaborates With (Reyes) — with no relationship to any other prior commander invented.
- **A twenty-ninth Codex entry, cross-referencing exactly those four commanders.**
- **Recruitment** — bound to AF-072's `exploration` source, gated on "The Last Guardian."
- **Dialogue** — all 6 spec lines carried verbatim.

## Live

The `commander` overlay's roster count now reads `3/50`; the `codex` overlay line reads `16/78 entries`. Browser-verified via the dev server's debug overlay, zero page errors.

## Review

Zero changes to any locked module. 12 tests (including a dedicated Syn distinctness check and a dedicated name-collision-avoidance check against CMD-007), suite at 1448. Score 9.5/10 — approved and locked.
