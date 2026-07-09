# Commander CMD-002 — Adrian Kane "The Vanguard" (AF-100)

The canonical, individually-specified implementation of Afterlight's second fully production-ready Commander. Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Zero changes to any locked module.

## What's new

- **Full identity** — every spec field (age 47, species Human, homeworld Bastion Prime, United Human Frontier faction, "stoic" personality, defensive archetype `guardian`/class `defender`) realised exactly as specified.
- **Abilities on real shapes** — Passive (Iron Resolve → `onDamageTaken`/`shieldRegeneration`), Ability One (Guardian Barrier), Ability Two (Command Protocol), Ultimate (Fortress Formation), Signature (Leadership Presence → `onDamageTaken`/`cooldownReduction`).
- **Talent Tree** — Defender/Commander/Juggernaut, exactly as named in the spec.
- **Deep Respect for Dr. Lyra Voss** — a real cross-commander relationship binding to CMD-001's actual roster id, not just flavour text.
- **A third Codex entry, cross-referenced** — `codex-commander-kane-vanguard`, added additively, `relatedEntryIds` pointing at Lyra's real entry.
- **Preferred Ships/Weapons/Equipment/Relics/Research/Biomes** — all resolve against real, existing rosters (Heavy Cruiser → `dawnspire`, "Bastion" equipment id → literal `bastion`).
- **Recruitment** — bound to AF-072's `campaign` source, gated on "The Last Bastion".
- **Dialogue** — all 5 spec lines carried verbatim, tagged to real `DIALOGUE_TRIGGER_CATEGORIES` values.
- **Weaknesses are structural** — proven by test that his passive/signature carry no `damage`/`criticalDamage`/`movementSpeed` bonus, matching the spec's "lower mobility... limited burst damage."

## Live

The `commander` overlay's roster count now reads `3/24`; the `codex` overlay line reads `16/52 entries`. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 11 tests, suite at 1173. Score 9.5/10 — approved and locked.
