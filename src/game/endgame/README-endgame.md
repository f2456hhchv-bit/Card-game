# Endgame (AF-069)

The endgame is AF-068's sibling ledger, gated on the campaign:

- **The gate is a state, not a convention**: `EndgameRuntime` constructs LOCKED; every progression operation returns `false` until `notifyCampaignComplete()` (fired by the composition root the moment AF-068's ladder completes).
- **"Resets expedition progression. Retains permanent progression."** is the two-map split: `expeditionProgress` (cleared by `ascend()`) vs `lifetimeExpeditions`, research, evolution, and legacy (no clearing operation exists — asserted over the prototype).
- **"Not inflated health. Not inflated damage."** is unrepresentable: `AscensionModifierDef` carries an axis (one of five registered difficulty levers) and a description — there is no numeric field to smuggle a multiplier through.
- **"Unlimited future expansion"**: `ascensionLevelFor(level)` generates levels beyond the authored I–III forever, always on the same shape.
- **"Never artificial progression walls"**: milestones scale linearly per level, research node costs geometrically — smooth formulas, no caps, no gates.
- **Mastery is AF-026's engine**: `ENDGAME_MASTERY_TRACKS` are mastery-track IDs (`endgame:ships`, …), not a new system.
- **World events** are a seeded weighted pick under an injected `Rng` — deterministic, AF-036's pool discipline.
