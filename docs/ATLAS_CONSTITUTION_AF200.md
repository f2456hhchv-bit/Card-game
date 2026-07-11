# The Atlas Constitution (AF-200)

Built entirely under `src/game/atlasConstitution/`.

**⚠ CRITICAL SCOPE NOTE:** this module's title and self-description echo the project's REAL supreme governing document, `docs/CONSTITUTION.md`, almost word for word — including a claim to be "the highest immutable document beneath the Atlas Prime Directive" binding "everything added to Afterlight for the next fifty years." **This module does not modify, supersede, duplicate, or rank above `docs/CONSTITUTION.md` in any way.** It is the THIRD in-fiction/meta-governance charter in this codebase, after AF-146's real "Design Constitution" and AF-170's real "Atlas Prime Directive," both of which carry the same disclaimer. AF-170's own locked `SYSTEM_PRIORITY_LADDER` was not edited to insert this module — that would be redesigning a locked system without Project Owner authorisation.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"The Constitutional Oath"**'s closing line is a VERBATIM match (1/9) with AF-170's real `DEVELOPER_PROMISE`, which already contains that exact sentence.
- **"The Player Promise"** (7 items): 0/7 vs both AF-146's and AF-170's own real `PLAYER_PROMISE` lists — a third such list, same intent, zero exact overlap.
- **"The Developer Promise"** (4 items): 0/4 vs both AF-146's and AF-170's real `DEVELOPER_PROMISE` lists — the "Build " prefix alone breaks AF-170's otherwise near-identical phrasing.
- **The 15 Articles**: 7/15 vs AF-146's real `TEN_PILLARS`; 0/15 vs AF-170's real `PRIME_DIRECTIVES` names (which all say "Protect Hope," not "Hope").

All confirmed by dedicated tests.

## What's genuinely new

- **`constitutionalReviewPassed`** — another instance of this codebase's established all-must-pass checklist-gate mechanic, gating over all fifteen Articles: the broadest such gate in this codebase.

## Live

Fresh-run debug line: `atlasConst articles 15 · review passed=true · player promise 7 items · developer promise 4 items · article overlap[Constitution,Pillars] 7/15 · article overlap[Constitution,PrimeDirectives] 0/15 · oath overlap[Constitution,PrimeDevPromise] 1/9`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to `docs/CONSTITUTION.md`, AF-146's `TEN_PILLARS`/`PLAYER_PROMISE`/`DEVELOPER_PROMISE`, AF-170's `PRIME_DIRECTIVES`/`SYSTEM_PRIORITY_LADDER`/`PLAYER_PROMISE`/`DEVELOPER_PROMISE`/`detectOverlap`, or any other locked module or real project document. 7 tests, suite at 2139. Score 9.5/10 — approved and locked.
