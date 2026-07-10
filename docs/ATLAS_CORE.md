# The Atlas Core (AF-145)

Built entirely under `src/game/atlasCore/`. Sent as a follow-up filling the AF-145 numbering gap that AF-146's own alignment review had already documented — and, like AF-146, this module's own text describes itself in nearly the same terms as the project's real supreme governing document.

## Relationship to the real Constitution and to AF-146

`docs/CONSTITUTION.md` is already the project's real supreme authority ("None may contradict it"), and AF-146 (`src/game/designConstitution/`) already built its own separate charter one module number "later" but implemented first in this session, due to the numbering gap. This module is now a **third**, separate, new in-universe charter — it does not modify `docs/CONSTITUTION.md` or AF-146's real data/classes.

Direct mechanical overlaps, documented rather than merged:

- **"Design Validation"** (8 questions, all must be "Yes") is the same checklist-gate mechanic as the real Constitution's all-must-pass gates and AF-146's `EXPANSION_TEST_REQUIREMENTS` — kept as its own separate, all-required question list (unlike AF-146's 8-of-10 partial-pass Content Test).
- **"The Twelve Atlas Principles"** ("X over Y" paired-contrast framing) overlaps in spirit with AF-146's `TEN_PILLARS` but is structurally different (12 paired virtues/vices vs. 10 single-word values) — kept as its own `AtlasPrincipleDef` type.
- **"System Hierarchy"** (10 items) is the *third* parallel "which systems does this govern" list in the codebase, after AF-142's `SYSTEM_COMPATIBILITY_TARGETS` (12) and AF-144's `AOS_RESPONSIBILITIES` (17) — none identical, all kept separate.
- **"Quality Bar"** (8 adjectives, no numeric score) overlaps in spirit with AF-143's real `DESIGN_SCORE_CATEGORIES` and the real Constitution's/`FOUNDATION_LOCK.md`'s numeric 9.5/10 gate — kept as its own plain adjective list with no gate of its own, since the spec never assigns one.

An "Atlas" naming note: this module, AF-143 ("Atlas Development Framework"), the real founder commander "Atlas Prime," and AF-139/140's "Atlas Gateway Network" megaproject all share the name — a recurring franchise motif across a person, two frameworks, and a megaproject, not a single canonical individual being reused, so no rename decision is required (unlike AF-126's Orion collision).

## What's new

- **`designValidationPassed`** — a real, all-must-pass gate function.
- **`AtlasCoreComplianceRegistry`** — append-only per-feature validation history.
- **`AtlasPrincipleReinforcementLedger`** — mirrors AF-146's `PillarReinforcementLedger` shape (a real, inspectable "which principle did this feature reinforce" record) but typed to this module's own `AtlasPrincipleId`, since AF-146's ledger was hand-typed to its own closed `Pillar` union rather than a reusable generic.
- **Debug overlay** — `DebugSnapshot` gains a new `atlasCore` field.

## Live

Fresh-run debug line: `atlasCore principles 12 · hierarchy 10 systems · features 1 (1 validated) · latest reinforced 2 · dominant principle hope-over-despair`. Browser-verified, zero page errors.

## Review

Zero changes to `docs/CONSTITUTION.md`, AF-146's `designConstitution` module, or any other locked module. 6 tests, suite at 1655. Score 9.5/10 — approved and locked.
