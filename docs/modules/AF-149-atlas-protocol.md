## Verbatim prompt

149

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-148 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Protocol.

The Atlas Protocol is the highest operational authority governing how every future gameplay feature, story, asset, expansion and system is conceived, reviewed, implemented and preserved.

Unlike the Atlas Core (AF-145), which defines philosophy, the Atlas Protocol defines execution.

Every future development decision must follow this protocol.

==================================================
PURPOSE
==================================================

Guarantee that Afterlight never loses quality.

Never loses identity.

Never accumulates technical debt.

Never introduces disconnected systems.

Every addition should strengthen the universe.

==================================================
THE SEVEN STAGES
==================================================

Stage I

Discovery

Why should this feature exist?

What player fantasy does it fulfil?

What gap does it solve?

--------------------------------------------------

Stage II

Integration

How does it interact with:

Commanders

Galaxy

Museum

Chronicle

Legacy

Living Ship

Civilisation

Operating System

--------------------------------------------------

Stage III

Simulation

Simulate:

100 hours

500 hours

1000 hours

10,000 hours

Does the feature remain interesting?

--------------------------------------------------

Stage IV

Validation

Review:

Accessibility

Performance

Replayability

Narrative

Balance

Visual identity

Audio identity

Technical sustainability

--------------------------------------------------

Stage V

Emergence

Does it generate stories?

Unexpected moments?

Player creativity?

Long-term memories?

--------------------------------------------------

Stage VI

Preservation

How does history remember it?

Museum

Chronicle

Legacy

Civilisation

Future generations

--------------------------------------------------

Stage VII

Expansion

Can this feature naturally evolve for ten years?

Can future developers build upon it?

==================================================
SYSTEM IMPACT MAP
==================================================

Every new feature produces an impact report.

Gameplay

Narrative

Technical

Accessibility

Economy

Civilisation

History

Performance

Audio

Art

Future expansions

No isolated systems allowed.

==================================================
THE ATLAS QUESTIONS
==================================================

Before implementation ask:

Why does it exist?

Why does Afterlight need it?

What emotion does it create?

What stories emerge?

How does civilisation change?

How is history enriched?

Will players remember it?

Could it become timeless?

==================================================
THE RED FLAGS
==================================================

Immediately reject features that rely primarily upon:

Busywork

Artificial grind

Fear of missing out

Meaningless rarity

Power inflation

Content padding

Shock value

Needless complexity

Redundant mechanics

Disconnected systems

==================================================
THE GREEN FLAGS
==================================================

Prioritise features that create:

Discovery

Creativity

Cooperation

Exploration

Mastery

Education

Wonder

Community

Legacy

Beauty

==================================================
ITERATION LOOP
==================================================

Prototype

↓

Observe

↓

Measure

↓

Simplify

↓

Strengthen

↓

Observe again

↓

Repeat

Never ship the first version.

==================================================
DOCUMENTATION
==================================================

Every feature generates:

Design document

Technical specification

Art guide

Audio guide

Accessibility guide

Testing plan

Expansion notes

Historical impact summary

==================================================
POST-LAUNCH REVIEW
==================================================

After release evaluate:

Player enjoyment

Accessibility

Performance

Narrative reception

Replayability

Emergent stories

Community creativity

Technical stability

Use results to improve future systems.

==================================================
THE ATLAS SCORE
==================================================

Every feature receives:

Originality

Meaning

Elegance

Replayability

Technical Quality

Accessibility

Narrative Depth

System Integration

Emotional Impact

Future Expandability

Overall Atlas Score

Features below 9.5/10 return to Stage I.

==================================================
DEVELOPER OATH
==================================================

Every contributor accepts:

Respect the player.

Respect history.

Respect accessibility.

Respect curiosity.

Respect future developers.

Leave the universe better than you found it.

==================================================
FINAL VALIDATION
==================================================

Before any feature becomes canonical ask:

Does this strengthen the Living Galaxy?

Does this strengthen civilisation?

Does this strengthen humanity?

Does this strengthen hope?

If any answer is "No"...

Continue iterating.

==================================================
OUTPUT
==================================================

Implement the Atlas Protocol.

It becomes the permanent production workflow governing every future addition to Afterlight.

The Protocol ensures the universe continues growing without sacrificing quality, identity or long-term sustainability.

==================================================
SELF REVIEW LOOP
==================================================

Simulate decades of development.

Review thousands of proposed systems.

Reject weak ideas.

Refine promising ones.

Measure long-term player engagement.

Measure maintainability.

Measure emotional impact.

Continuously evolve the Protocol while preserving the Atlas Core and Design Constitution.

Ensure every future Afterlight feature is not only technically excellent, but meaningfully contributes to humanity's ongoing story of hope, discovery and rebuilding.

Repeat until the Atlas Protocol consistently produces additions worthy of inclusion in the Afterlight universe.

Only then lock AF-149.

## Foundation / AF-000–148 / GP-FINAL alignment review

Explicitly distinguished from AF-145's Atlas Core by its own text — AF-145 is philosophy, this is execution, a real feature-development workflow. That difference in kind changed what it overlaps with: not the abstract-value/checklist-gate modules AF-145/146/147 established, but the project's existing pipeline-stage lists. "The Seven Stages" is confirmed the fifth distinct pipeline-stage list in this codebase, after the real Constitution's 11-stage "DEVELOPMENT PIPELINE," AF-097's real `CONTENT_PIPELINE_STAGES`, AF-095's own differently-scoped same-named `CONTENT_PIPELINE_STAGES`, and AF-095's `RELEASE_PIPELINE_STAGES` — `ATLAS_PROTOCOL_STAGES` follows the same real `next*Stage` function pattern those already established rather than inventing a new shape. "The Atlas Score" (10 categories, 9.5/10 gate) is the same mechanic as AF-143's real `DesignScoreCard`/`DESIGN_SCORE_CATEGORIES`; `AtlasScoreCard` mirrors that class's exact shape but is typed to its own separate `AtlasScoreCategory` union, since AF-143's class is hand-typed to its own closed union rather than a reusable generic — the same missed-generalisation note AF-145 already recorded for AF-146's `Pillar`-typed ledger. "System Impact Map" is confirmed the fifth parallel "which systems does this touch" list, after AF-142's real `SYSTEM_COMPATIBILITY_TARGETS`, AF-144's real `AOS_RESPONSIBILITIES`, AF-145's real `ATLAS_SYSTEM_HIERARCHY`, and this module's own earlier "Integration" target list — kept separate. "Final Validation" (4 questions, all-must-pass) is confirmed the seventh occurrence of the same checklist-gate mechanic in this codebase, after the real Constitution's two gates, AF-146's Expansion Test, AF-145's Design Validation, AF-147's Franchise Test, and AF-148's `expansionRespectsTimeline`.

`FeatureLifecycleTracker` moves a feature through the Seven Stages one at a time, never skipping or regressing. `AtlasScoreCard` requires every category scored before its gate can pass. `IterationCycleTracker` makes "never ship the first version" a real structural rule rather than a design promise — a feature is only marked ready after at least two genuine iteration cycles. `systemImpactReportFor`/`featureFlagAssessment`/`finalValidationPassed` are decoupled composers over plain signals, never importing the systems or flags they report on.

The debug overlay gains a new `atlasProtocol` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-148 before it. Zero changes to AF-094/095/097's real pipelines, AF-143's `DesignScoreCard`, AF-142/144/145's system lists, or any other locked module.

Score: 9.5/10 — approved and locked.
