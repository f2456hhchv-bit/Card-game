## Verbatim prompt

145

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-144 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Core.

The Atlas Core is the philosophical, systemic and technical heart of Afterlight.

It defines WHY every system exists.

Every future design decision must be validated against the Atlas Core before implementation.

If a feature weakens the Atlas Core...

...it is rejected.

==================================================
CORE PHILOSOPHY
==================================================

Afterlight is not about defeating darkness.

It is about creating light.

It is a game about rebuilding.

Discovery.

Knowledge.

Hope.

Humanity.

Every mechanic should reinforce these ideals.

==================================================
THE TWELVE ATLAS PRINCIPLES
==================================================

1.

Curiosity over Fear.

Unknown space should invite exploration.

Not discourage it.

2.

Construction over Destruction.

Building should always create more long-term value.

3.

Hope over Despair.

Even tragedy should inspire rebuilding.

4.

Knowledge over Ignorance.

Every expedition teaches something.

5.

Unity over Isolation.

Civilisation advances through cooperation.

6.

Stewardship over Exploitation.

Protect worlds.

Do not consume them.

7.

History over Forgetting.

Everything meaningful deserves remembrance.

8.

Progress over Perfection.

Humanity continually improves.

9.

People over Power.

Commanders matter because of their humanity.

10.

Discovery over Grinding.

Players seek wonder.

Not repetitive rewards.

11.

Legacy over Possession.

What players leave behind matters more than what they collect.

12.

Tomorrow over Today.

Every action should improve the future.

==================================================
DESIGN VALIDATION
==================================================

Every feature must answer:

Does it encourage exploration?

Does it strengthen civilisation?

Does it teach something?

Does it create meaningful stories?

Does it increase hope?

Does it reward curiosity?

Does it create memorable moments?

Does it respect player time?

If not...

Redesign it.

==================================================
EMOTIONAL COMPASS
==================================================

Target emotional spectrum:

Wonder.

Discovery.

Belonging.

Achievement.

Responsibility.

Friendship.

Curiosity.

Optimism.

Reflection.

Never rely upon:

Hopelessness.

Shock.

Cruelty.

Misery.

==================================================
PLAYER EXPERIENCE PILLARS
==================================================

Players should regularly think:

"I've never seen this before."

"I helped build this."

"They remembered me."

"We discovered something incredible."

"I can't wait to see what's next."

==================================================
SYSTEM HIERARCHY
==================================================

The Atlas Core governs:

Operating System.

Story Engine.

Living Galaxy.

Commanders.

Museum.

Chronicle.

Civilisation.

Evolution.

Creator Engine.

Future expansions.

Nothing supersedes the Core.

==================================================
QUALITY BAR
==================================================

Every system must be:

Readable.

Elegant.

Expandable.

Accessible.

Replayable.

Meaningful.

Technically sustainable.

Emotionally resonant.

==================================================
ACCESSIBILITY PHILOSOPHY
==================================================

Accessibility is foundational.

Never optional.

Every feature should be enjoyable by the widest possible audience without compromising design integrity.

==================================================
LONG-TERM PHILOSOPHY
==================================================

The universe should improve every year.

Developers should improve every year.

Players should discover something new every year.

The game ages alongside its community.

==================================================
THE FINAL QUESTION
==================================================

Before shipping any feature ask:

"Does this make humanity's future brighter?"

If the answer is uncertain...

Continue iterating.

==================================================
OUTPUT
==================================================

Implement the Atlas Core.

It becomes the permanent design constitution for the Afterlight universe.

Every previous and future module is evaluated against it.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-144.

Measure alignment with the Twelve Atlas Principles.

Refine any feature that weakens the philosophy.

Stress-test future expansions against the Core.

Ensure technical excellence never compromises emotional purpose.

Ensure emotional ambition never compromises technical excellence.

Repeat until the Atlas Core consistently guides every design decision toward a universe defined by hope, discovery, civilisation and legacy.

Only then lock AF-145.

## Foundation / AF-000–144 / GP-FINAL alignment review

Sent as a follow-up filling the AF-145 numbering gap that AF-146's own alignment review had already documented (this session implemented AF-146 first, one module number "ahead," before the Project Owner sent this AF-145 spec). Like AF-146, this module's own text describes itself in nearly the same terms the project's real supreme governing document already uses ("the philosophical, systemic and technical heart of Afterlight... Nothing supersedes the Core" vs. `docs/CONSTITUTION.md`'s "the highest governing specification... None may contradict it"). Per the same standing rule already applied to AF-146 — nothing may contradict the real Constitution absent explicit Project Owner authorisation, and locked modules are only extended, never redesigned — this module is implemented as a third, separate, new in-universe charter. It does not modify `docs/CONSTITUTION.md` or AF-146's real `designConstitution` data/classes.

Direct mechanical overlaps are documented rather than merged: "Design Validation" (8 questions, all-must-pass) is the same checklist-gate mechanic as the real Constitution's two all-must-pass gates and AF-146's `EXPANSION_TEST_REQUIREMENTS`, kept as its own separate list; "The Twelve Atlas Principles" (paired "X over Y" contrasts) overlaps in spirit with AF-146's `TEN_PILLARS` but is structurally different (12 paired virtue/vice entries vs. 10 single-word values), kept as its own `AtlasPrincipleDef` type; "System Hierarchy" (10 items) is the third parallel "which systems does this govern" list in the codebase after AF-142's real `SYSTEM_COMPATIBILITY_TARGETS` (12) and AF-144's real `AOS_RESPONSIBILITIES` (17), none identical, kept separate; "Quality Bar" (8 adjectives, no numeric score) overlaps in spirit with AF-143's real `DESIGN_SCORE_CATEGORIES` and the real Constitution's/`FOUNDATION_LOCK.md`'s numeric 9.5/10 gate, kept as its own plain adjective list since the spec assigns it no gate of its own. An "Atlas" naming note: this module, AF-143's "Atlas Development Framework," the real founder commander "Atlas Prime," and AF-139/140's "Atlas Gateway Network" megaproject all share the name — a recurring franchise motif across a person, two frameworks, and a megaproject, not a single canonical individual being reused, so (unlike AF-126's Orion rename) no Project Owner decision is required.

`designValidationPassed` is a real all-must-pass gate function. `AtlasCoreComplianceRegistry` and `AtlasPrincipleReinforcementLedger` mirror AF-146's `FeatureComplianceRegistry`/`PillarReinforcementLedger` shape — real, append-only, inspectable evidence rather than design-promise text with nothing behind it — but typed to this module's own `AtlasPrincipleId` rather than reusing AF-146's classes, since AF-146 hand-typed its ledger to its own closed `Pillar` union rather than a reusable generic (a missed-generalisation note for a future module, not something correctable here without modifying a locked module).

The debug overlay gains a new `atlasCore` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-146 before it. Zero changes to `docs/CONSTITUTION.md`, AF-146's `designConstitution` module, or any other locked module.

Score: 9.5/10 — approved and locked.
