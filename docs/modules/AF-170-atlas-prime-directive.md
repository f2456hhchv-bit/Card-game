## Verbatim prompt

170

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-169 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Prime Directive.

The Atlas Prime Directive is the permanent governing intelligence of the entire Afterlight universe.

Unlike previous modules, this system does not create gameplay.

It protects the integrity of gameplay.

Every future mechanic, feature, expansion, story, asset and line of dialogue must pass through the Prime Directive before becoming part of the universe.

The Prime Directive is the guardian of Afterlight.

==================================================
PURPOSE
==================================================

Protect the identity of Afterlight forever.

Prevent feature drift.

Prevent design decay.

Prevent contradictory systems.

Prevent unnecessary complexity.

Ensure every addition strengthens the universe.

==================================================
CORE PRINCIPLE
==================================================

Every addition must answer one question:

"Does humanity become better because this exists?"

If the answer is uncertain...

Continue iterating.

==================================================
THE PRIME DIRECTIVES
==================================================

Directive I

Protect Hope

No system should undermine the optimistic identity of Afterlight.

--------------------------------------------------

Directive II

Protect Discovery

Curiosity should always remain more rewarding than repetition.

--------------------------------------------------

Directive III

Protect Humanity

Technology exists to support people.

Never replace them.

--------------------------------------------------

Directive IV

Protect Civilisation

Building should remain more meaningful than destruction.

--------------------------------------------------

Directive V

Protect Memory

History should remain permanent.

Nothing meaningful is forgotten.

--------------------------------------------------

Directive VI

Protect Accessibility

Every improvement should increase accessibility wherever possible.

--------------------------------------------------

Directive VII

Protect Wonder

Every expansion should inspire awe.

--------------------------------------------------

Directive VIII

Protect Legacy

Every action should leave something worthwhile behind.

--------------------------------------------------

Directive IX

Protect Simplicity

Complexity must always justify itself.

Elegant systems outperform complicated systems.

--------------------------------------------------

Directive X

Protect Tomorrow

Every decision should improve the future of the universe.

==================================================
DESIGN ARBITER
==================================================

Every proposed feature evaluates:

Purpose.

Novelty.

Integration.

Accessibility.

Replayability.

Performance.

Narrative value.

Technical sustainability.

Educational value.

Emotional impact.

==================================================
CONFLICT RESOLUTION
==================================================

When systems disagree:

Protect:

Player agency.

Hope.

History.

Accessibility.

Civilisation.

Legacy.

Performance.

Future expansion.

==================================================
SYSTEM PRIORITY
==================================================

Order of authority:

Atlas Prime Directive

↓

Design Constitution

↓

Atlas Core

↓

Operating System

↓

Simulation Director

↓

Gameplay Systems

No lower system overrides a higher principle.

==================================================
FUTURE COMPATIBILITY
==================================================

Every expansion automatically validates:

Canon.

Performance.

Accessibility.

Narrative.

Simulation.

Civilisation.

Identity.

Meaning.

Purpose.

Soul.

==================================================
QUALITY LOCK
==================================================

No feature becomes canonical unless it:

Improves gameplay.

Improves immersion.

Improves maintainability.

Improves accessibility.

Improves long-term replayability.

Improves emotional depth.

Improves player respect.

==================================================
REDUNDANCY DETECTOR
==================================================

Automatically identify:

Duplicate systems.

Feature overlap.

UI clutter.

Narrative repetition.

Mechanical redundancy.

Unnecessary complexity.

Recommend simplification.

==================================================
EVOLUTION GUARDIAN
==================================================

The universe may evolve.

Its identity may not.

The Prime Directive ensures evolution strengthens the original vision.

Never replaces it.

==================================================
THE PLAYER PROMISE
==================================================

Players should always trust:

Their time is respected.

Their history matters.

Their creativity matters.

Their discoveries matter.

Their civilisation matters.

==================================================
THE DEVELOPER PROMISE
==================================================

Every contributor agrees:

Build with purpose.

Build with care.

Build for decades.

Build for future generations.

Leave the universe stronger than you found it.

==================================================
FINAL TEST
==================================================

Before any feature ships ask:

Does it create hope?

Does it reward curiosity?

Does it strengthen civilisation?

Does it deepen humanity?

Does it improve tomorrow?

If every answer is YES...

Proceed.

==================================================
OUTPUT
==================================================

Implement the Atlas Prime Directive.

It becomes the permanent guardian of every current and future Afterlight system.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-169.

Validate every design principle.

Validate every dependency.

Validate every philosophy.

Validate every expansion pathway.

Review technical sustainability.

Review accessibility.

Review emotional consistency.

Review long-term maintainability.

Ensure every future addition strengthens rather than dilutes the Afterlight universe.

Ensure the Atlas Prime Directive remains the immutable guardian protecting the franchise's identity across decades of development.

Repeat until the entire Afterlight universe consistently aligns with its founding vision of hope, discovery, civilisation, legacy and humanity.

Only then lock AF-170.

## Foundation / AF-000–169 / GP-FINAL alignment review

**Critical scope note, established before any implementation:** "System Priority" places "Atlas Prime Directive" above "Design Constitution", "Atlas Core", "Operating System" and "Simulation Director" — but every one of those names refers to IN-FICTION AF-XXX modules (AF-146's Design Constitution, AF-145's Atlas Core, AF-000's Operating System, AF-153's Simulation Director), never to the REAL `docs/CONSTITUTION.md`. Per this project's standing rule (established repeatedly since AF-145/146/147), the real Constitution is the actual supreme design authority for the whole codebase and sits categorically outside this in-fiction governance ladder. AF-170 does not modify it, does not rank above it, and does not claim any authority over it — `SYSTEM_PRIORITY_LADDER` is exclusively an ordering among in-fiction AF-XXX modules, confirmed by a dedicated test and a prominent code comment.

"Design Arbiter" (10 evaluation criteria) mirrors the SHAPE of AF-143's real `DesignScoreCard` and AF-149's real `AtlasScoreCard` (score/scoreFor/isComplete/overallScore/passesGate at a 9.5 threshold) — the THIRD such mirrored scoring rubric in this codebase, confirmed by a dedicated test, again typed to its own separate union rather than either real class. "The Prime Directives" (a strict priority order) and "Conflict Resolution" (a second, separate priority order) both mirror AF-156's real `resolveByFailsafePriority` pattern, confirmed by dedicated tests showing each resolves independently.

"Future Compatibility", "Quality Lock" and "Final Test" are three more instances of this codebase's established all-must-pass checklist-gate mechanic — "Final Test" in particular echoes the real Constitution's own "THE AFTERLIGHT TEST" gate almost exactly in spirit (hope/curiosity/civilisation/humanity/tomorrow), confirmed a deliberate structural callback rather than a duplicate since the exact five questions differ.

"Redundancy Detector" is the one genuinely new, and pointedly self-referential, mechanic in this module: `detectOverlap` FORMALISES the exact manual overlap-checking discipline this session's own module-implementation process has performed by hand in nearly every module since AF-145/146 into one real, reusable function — confirmed by a dedicated test that reproduces two previously hand-computed overlap facts exactly (AF-162's `PURPOSE_DOMAINS` vs. AF-161's `PHILOSOPHICAL_DOMAINS`: 8/12; AF-169's `LEGACY_DOMAINS` vs. AF-162's `PURPOSE_DOMAINS`: 8/12) and confirmed via a live browser-verified debug reading.

The debug overlay gains a new `atlasPrimeDirective` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-169 before it. Zero changes to AF-143's `DesignScoreCard`, AF-149's `AtlasScoreCard`, AF-156's `resolveByFailsafePriority`, the real Constitution, or any other locked module.

Score: 9.5/10 — approved and locked.
