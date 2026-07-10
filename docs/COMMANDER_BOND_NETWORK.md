# Commander Bond Network (AF-130)

A permanent, additive relationship layer connecting every Commander in the real 53-commander roster (22 foundation + 31 individually-specified) into one living bond graph. Built entirely alongside AF-071's `CommanderProfileDef` and `CommanderRelationshipDef` — neither is modified. AF-071's own locked design law ("Relationships influence dialogue, NOT gameplay balance — there is no bonus field in this shape") is preserved exactly; this module's gameplay bonuses live entirely in its own new, separate layer.

## What's new

- **`bondNetworkData.ts`** — real typed constants for every spec'd category: `BOND_LEVEL_NAMES` (6, Unknown→Family), `BOND_TYPES` (the spec's 20 examples plus a 21st, "Unacquainted," for the default case), `CAMP_LOCATIONS` (8), `GROUP_EVENTS` (10), `BOND_GROWTH_SOURCES` (9), `DYNAMIC_DIALOGUE_TRIGGERS` (9), `EMOTIONAL_MEMORY_KINDS` (5), `MUSEUM_RELATIONSHIP_WING_EXHIBITS` (7).
- **`seedBondGraph()`** — the spec says "every pair of Commanders possesses one relationship type," taken literally: builds exactly one `BondDef` for every unordered pair in the real roster (53 × 52 / 2 = 1,378 pairs). Pairs with an authored AF-071 relationship (either direction) seed at level 3 (Trusted) under the generic "Historic Connection" type — the specific flavour is already captured in that commander's real dialogueHint prose and isn't re-derived. Every other pair defaults to "Unacquainted" at level 0 (Unknown), since not every commander has narratively met every other one — the honest default the spec's own "avoid repetitive dialogue" directive calls for.
- **`DUAL_ULTIMATES`** — the spec's six named pairs, resolved to real roster ids. "Orion + Mira" does not resolve to Lucien Orion (already paired with Valen Ash in the same list) — it resolves to Dorian Fen, the AF-126 owner-authorised rename of the verbatim spec's "Orion Vale." Fen's own AF-126 relationships independently confirm this: Mira Syn is his Close Friend.
- **`personalQuestSetsFor()`** — every roster commander (53) gets exactly 3 personal quest ids plus one friendship, legacy, and final resolution quest id, additive to and distinct from AF-071's existing 6-beat `personalMissions`.
- **`BondNetworkRuntime`** — `bondFor`, `growBond` (caps at max, never decreases — "nothing resets artificially"), `isMaxBond`, `dualUltimateDefFor` / `unlockedDualUltimateFor` (gated on max bond), `snapshot()`.
- **`EmotionalMemoryLog`** — a strictly append-only per-commander memory log (AF-130 §Emotional System).
- **`bondGameplayBonusFor(level)`** — a pure function scaling passive-bonus and cooldown-reduction bonuses with bond level, entirely within this new layer.
- **Debug overlay** — `DebugSnapshot` gains a new `bonds` field (AF-016's established per-module extension pattern, same as every AF-039 through AF-070 field before it), rendering total/discovered/maxed bond counts and dual-ultimate unlock progress.

## Live

The debug overlay's new `bonds` line reads `1378 pairs · 131 discovered · 0 maxed (avg lvl 0.29) · dual ultimates 0/6`, alongside the unaffected `commander`/`codex` lines. Browser-verified, zero page errors.

## Review

Zero changes to AF-071's `CommanderProfileDef`/`CommanderRelationshipDef` shape or any other locked module beyond the precedented `DebugSnapshot` extension. 11 tests, suite at 1493. Score 9.5/10 — approved and locked.
