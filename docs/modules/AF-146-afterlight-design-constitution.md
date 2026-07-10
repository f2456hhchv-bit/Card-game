## Verbatim prompt

146

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-145 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Afterlight Design Constitution.

This is the highest-level design document.

It exists above every gameplay system.

Above every expansion.

Above every future feature.

It defines what Afterlight is...

...and what it must never become.

==================================================
PURPOSE
==================================================

The Design Constitution protects the identity of Afterlight forever.

Technology will change.

Hardware will change.

Developers may change.

Features will evolve.

The Constitution remains.

==================================================
MISSION STATEMENT
==================================================

Afterlight exists to let players rebuild humanity through exploration, discovery, cooperation and hope.

The universe should become brighter because the player existed.

Every hour played should contribute to something meaningful.

==================================================
THE TEN PILLARS
==================================================

Pillar One

Hope

Players leave every session believing tomorrow can be better.

--------------------------------------------------

Pillar Two

Discovery

Every expedition teaches something.

Curiosity is always rewarded.

--------------------------------------------------

Pillar Three

Humanity

People always matter more than technology.

Characters drive the universe.

--------------------------------------------------

Pillar Four

Civilisation

Building should feel more rewarding than destroying.

--------------------------------------------------

Pillar Five

History

Nothing meaningful is forgotten.

The galaxy remembers.

--------------------------------------------------

Pillar Six

Mastery

Players improve through knowledge.

Not repetitive grinding.

--------------------------------------------------

Pillar Seven

Beauty

The universe should inspire awe.

Architecture.

Nature.

Music.

Art.

Lighting.

Everything contributes.

--------------------------------------------------

Pillar Eight

Accessibility

Everyone deserves the opportunity to experience hope.

Accessibility is fundamental.

--------------------------------------------------

Pillar Nine

Longevity

The universe is built for decades.

Never trends.

Never short-term gimmicks.

--------------------------------------------------

Pillar Ten

Wonder

Every major update should contain at least one moment where players simply stop and admire what they have discovered.

==================================================
PROHIBITED DESIGN PATTERNS
==================================================

Avoid systems based primarily on:

Artificial frustration.

Excessive grinding.

Fear of missing out.

Meaningless collectibles.

Power creep.

Disposable content.

Predatory monetisation.

Repetitive busywork.

Hopeless storytelling.

Player disrespect.

==================================================
REQUIRED DESIGN PATTERNS
==================================================

Prioritise:

Meaningful progression.

Player creativity.

Emergent stories.

Persistent history.

Long-term consequences.

Replayability.

Community.

Education.

Discovery.

Optimism.

==================================================
CONTENT TEST
==================================================

Every feature must answer YES to at least eight of these:

Does it create wonder?

Does it reward curiosity?

Does it deepen civilisation?

Does it create memories?

Does it strengthen relationships?

Does it teach something?

Does it improve accessibility?

Does it expand the Living Galaxy?

Does it respect player time?

Will players remember it years later?

==================================================
EXPANSION TEST
==================================================

Every future expansion must:

Introduce discovery.

Expand history.

Advance civilisation.

Respect previous canon.

Integrate with every major system.

Leave the universe better than before.

==================================================
TECHNICAL PRINCIPLES
==================================================

Systems should be:

Modular.

Maintainable.

Scalable.

Observable.

Documented.

Accessible.

Performant.

Stable.

==================================================
ARTISTIC PRINCIPLES
==================================================

Visual identity should always communicate:

Hope.

Clean technology.

Living worlds.

Natural beauty.

Scientific optimism.

Architectural elegance.

Future possibility.

==================================================
AUDIO PRINCIPLES
==================================================

Music should evoke:

Exploration.

Belonging.

Discovery.

Achievement.

Reflection.

Never constant tension.

Silence is allowed.

==================================================
NARRATIVE PRINCIPLES
==================================================

Stories should celebrate:

Recovery.

Forgiveness.

Curiosity.

Friendship.

Scientific progress.

Intergenerational legacy.

Shared achievement.

==================================================
PLAYER PROMISE
==================================================

The player should always feel:

Respected.

Valued.

Curious.

Inspired.

Rewarded.

Connected.

Never manipulated.

==================================================
DEVELOPER PROMISE
==================================================

Every developer working on Afterlight agrees to preserve:

Quality.

Consistency.

Accessibility.

Optimism.

Technical excellence.

Respect for players.

Long-term thinking.

==================================================
THE FINAL PROMISE
==================================================

Afterlight will never ask:

"What can we make players do?"

Instead it asks:

"What future can we build together?"

==================================================
OUTPUT
==================================================

Implement the Afterlight Design Constitution.

It becomes the permanent creative charter for the franchise.

Every feature created after AF-146 must comply with it.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-145.

Compare every mechanic against the Constitution.

Remove contradictions.

Strengthen weak principles.

Future-proof the framework.

Ensure the Constitution remains relevant through decades of development.

Ensure every future Afterlight experience continues to embody hope, discovery, civilisation, beauty and humanity.

Repeat until the Constitution serves as a timeless creative guide for the entire Afterlight franchise.

Only then lock AF-146.

## Foundation / AF-000–145 / GP-FINAL alignment review

Two findings preceded any design work. First, a module-numbering gap: this spec (sent as "146") declares "AF-000 → AF-145 are LOCKED," but no AF-145 catalogue, doc, or STATUS.md row exists anywhere in this repository — AF-144 is the last real, locked module. Implemented as AF-146 exactly as specified; the gap is recorded here for the Project Owner rather than silently renumbered or silently ignored.

Second, and more significant: this module's own text describes itself in nearly the same terms the project's REAL supreme governing document already uses. `docs/CONSTITUTION.md` ("AFTERLIGHT MASTER CONSTITUTION v1.0") is already "the highest governing specification for the Afterlight project," already states "None may contradict it," and already frames the project's identity as "rebuilding civilisation... transforms a dying galaxy into one filled with hope again" — the same mission AF-146 restates. Per the standing rule that nothing may contradict the real Constitution "unless the Project Owner explicitly authorises it" (no such authorisation was given here), this module does NOT modify, supersede, or duplicate that document — it is implemented as its own new, clearly-separate in-universe design charter, the same honest-precedent treatment AF-143 gave discovering its own "Design Score >9.5/10" was really this project's own real standing self-review process. Direct mechanical overlap is documented rather than merged: the real Constitution already has two checklist-based feature gates ("THE AFTERLIGHT TEST," 8 questions all-must-pass; the "DESIGN DECISION MATRIX," 10 questions all-must-pass); AF-146's own "Content Test" (10 questions, 8-of-10 partial pass) and "Expansion Test" (6 requirements, all required) are the same mechanic with different wording and threshold, kept as their own separate rubric. AF-136's real `StoryPillarTracker`/`STORY_PILLARS` shares "Hope" and "Discovery" verbatim with this module's `TEN_PILLARS` but is a different axis (per-playthrough narrative themes vs. meta-design-philosophy pillars) — kept separate per the AF-137/138/139/140 precedent for documented vocabulary overlap.

`contentTestScore`/`expansionTestPassed` are real, testable functions matching the spec's own exact thresholds. `FeatureComplianceRegistry` and `PillarReinforcementLedger` give the Content Test and Ten Pillars real, inspectable evidence rather than pure design-promise text with nothing behind it. The debug overlay gains a new `designConstitution` field on `DebugSnapshot`, rendered as `constitn` — the same established extension pattern used by AF-039 through AF-144 before it. Zero changes to `docs/CONSTITUTION.md`, AF-136's `StoryPillarTracker`, or any other locked module.

Score: 9.5/10 — approved and locked.
