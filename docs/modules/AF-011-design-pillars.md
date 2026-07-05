# AF-011 — GAME DESIGN PILLAR FRAMEWORK

**Module status:** Complete (specification produced; the unified feature gate binds every future design decision)
**Lock status:** LOCKED — extends AF-000 → AF-010 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/DESIGN_PILLARS.md` (the creative compass of Afterlight, including the unified feature gate)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-010 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Game Design Pillar Framework.

This document defines how every gameplay decision is evaluated.

Whenever a new feature is proposed, this framework determines whether it belongs in Afterlight.

This is the creative compass for the entire project.

If a feature violates these principles, it should be redesigned or rejected.

==================================================
CORE VISION
==================================================

Afterlight is a premium top-down space roguelite built around:

Skill.

Discovery.

Replayability.

Build experimentation.

Meaningful progression.

The player should always feel:

"I survived because of my decisions."

Never:

"I survived because the game was generous."

==================================================
PRIMARY DESIGN PILLARS
==================================================

Pillar One

Gameplay First

Every decision improves gameplay.

Never sacrifice gameplay for realism.

--------------------------------------------------

Pillar Two

Readability

Every object communicates clearly.

Players instantly understand danger.

--------------------------------------------------

Pillar Three

Meaningful Choice

Every decision changes gameplay.

No fake choices.

No filler upgrades.

--------------------------------------------------

Pillar Four

Replayability

Every run feels different.

Different builds.

Different events.

Different discoveries.

--------------------------------------------------

Pillar Five

Mastery

Players improve through knowledge.

Not memorisation.

Not grinding.

==================================================
PLAYER EXPERIENCE
==================================================

The player journey should feel like:

Curiosity

↓

Exploration

↓

Discovery

↓

Experimentation

↓

Mastery

↓

Optimisation

↓

Legendary Moments

Every run contributes to long-term progression.

==================================================
DECISION FRAMEWORK
==================================================

Every new mechanic must answer:

Is it fun?

Is it readable?

Does it create meaningful decisions?

Does it increase replayability?

Does it fit the universe?

Does it respect existing systems?

If any answer is "No"

Redesign.

==================================================
DIFFICULTY PHILOSOPHY
==================================================

Difficulty should be:

Fair.

Consistent.

Understandable.

Avoid:

Cheap deaths.

Hidden information.

Unavoidable damage.

Artificial health inflation.

The player should always identify why they failed.

==================================================
REWARD PHILOSOPHY
==================================================

Players should regularly experience:

Small victories.

Medium victories.

Major victories.

Legendary discoveries.

Huge rewards remain rare.

But always possible.

==================================================
PROGRESSION PHILOSOPHY
==================================================

Progress occurs through:

Skill.

Knowledge.

Research.

Crafting.

Collections.

Mastery.

Discovery.

Never through repetitive grinding alone.

==================================================
BUILD DIVERSITY
==================================================

Every system should support multiple viable builds.

No mandatory weapon.

No mandatory Commander.

No mandatory Ship.

No mandatory Relic.

No mandatory strategy.

Thousands of combinations should remain competitive.

==================================================
FAILURE PHILOSOPHY
==================================================

Failure should reward:

Knowledge.

Research.

Collections.

Statistics.

Experience.

Players should lose the run.

Never lose motivation.

==================================================
CONTENT PHILOSOPHY
==================================================

Quality over quantity.

Every weapon has purpose.

Every Boss is memorable.

Every biome has identity.

Every discovery teaches something new.

Avoid repetitive content.

==================================================
LONG-TERM ENGAGEMENT
==================================================

Players should continue playing because:

New builds emerge.

New discoveries appear.

Mastery improves.

Collections expand.

The galaxy evolves.

Never because of artificial retention systems.

==================================================
MONETISATION PRINCIPLES
==================================================

Premium game.

Respect player ownership.

No pay-to-win.

No gameplay advantages for purchase.

Cosmetics remain optional.

Offline game remains complete.

==================================================
QUALITY GATES
==================================================

Every feature must pass:

Gameplay Quality

Technical Quality

Visual Quality

Accessibility

Performance

Replayability

Lore Consistency

If any gate fails,

Return for redesign.

==================================================
PERFORMANCE
==================================================

Game design must support:

Fast iteration.

Modular balancing.

Future expansions.

Stable performance.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Design Validation

Replayability Score

Complexity Rating

Feature Dependencies

Performance Impact

Quality Gate Status

==================================================
OUTPUT
==================================================

Produce the complete Game Design Pillar Framework.

Every future design decision extends this document.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every gameplay mechanic.

Review every progression system.

Review every Boss.

Review every Commander.

Review every Ship.

Review every Weapon.

Review every Biome.

Review every reward.

Review every failure state.

Review player motivation.

Review replayability.

Review performance.

Challenge every feature by asking:

"Does this genuinely improve the player's experience?"

Remove unnecessary complexity.

Strengthen meaningful decisions.

Ensure every future system reinforces the core pillars established by AF-000 through AF-011.

Repeat until every design decision serves the long-term vision of Afterlight.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-010 alignment review (recorded at catalogue time)

- Five primary pillars are the evaluative core of the Constitution's ten permanent pillars (Gameplay First, Readability, Meaningful Choice, Replayability, Mastery); the remaining five (Player Respect, Accessibility, Performance, Scalability, Maintainability) are enforced as quality gates. Reconciliation recorded in output §2 — the Constitution's ten remain permanent; AF-011 organises them into *pillars to design by* and *gates to pass*. No contradiction.
- "I survived because of my decisions" operationalises the Constitution's Combat Philosophy (no luck-reliance) and AF-004's narratable-hit law at the whole-game level.
- Difficulty/reward/progression/failure philosophies restate Constitution sections with sharper bans (artificial health inflation joins the list). Consistent.
- Build diversity ("no mandatory anything, thousands of competitive combinations") is new quantified canon binding all content/balance modules.
- **Monetisation note:** "Cosmetics remain optional" is the first text implying possible cosmetic monetisation for the premium game. Catalogued as: cosmetic monetisation is *permitted in principle, not planned*; any actual cosmetic store is a future Project Owner decision and must pass the offline-complete and player-respect laws. Flagged in output §8.
- Quality gates (seven) absorb the pipeline stages (Constitution Development Pipeline) as the evaluation half of the same process.
- **Checklist unification:** the Constitution's Design Decision Matrix (10 q) + Afterlight Test (8 q) + AF-004 §10 (5 q) + AF-010 §11 (5 q) + AF-011's decision framework (6 q) overlap heavily. Output §5 merges them into the **Unified Feature Gate** — one canonical checklist with every unique question preserved and source-attributed. Sources remain locked and authoritative; the gate is the operational instrument. This prevents checklist proliferation (itself a no-duplication requirement).
- Debug metrics (replayability score, complexity rating, feature dependencies) are specified as design-review instruments now (scored at module QA) and dashboard tooling later.

**Review verdict:** ALIGNED (one unification instrument created; one monetisation clarification flagged). Internal quality score 9.5/10 — approved. Produced output: `docs/DESIGN_PILLARS.md`.
