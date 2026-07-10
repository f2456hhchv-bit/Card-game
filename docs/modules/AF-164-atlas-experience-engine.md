## Verbatim prompt

164

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-163 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Experience Engine.

The Experience Engine exists above the Meaning Engine.

Meaning explains why something matters.

Experience determines how the player actually lives through it.

The Atlas Experience Engine continuously shapes every moment of gameplay into a memorable journey without manipulating outcomes or removing player agency.

It is responsible for pacing emotional impact, reinforcing discovery and ensuring every hour feels purposeful.

==================================================
PURPOSE
==================================================

Transform gameplay into lived experience.

Players should remember moments.

Not mechanics.

The universe should be experienced.

Not consumed.

==================================================
CORE PRINCIPLE
==================================================

Experience emerges through interaction.

Not spectacle alone.

Small moments become unforgettable when placed in meaningful context.

==================================================
EXPERIENCE PILLARS
==================================================

Wonder

Discovery

Challenge

Growth

Reflection

Belonging

Responsibility

Hope

Celebration

Legacy

==================================================
EXPERIENCE STATES
==================================================

The engine continuously evaluates:

Curiosity

Confidence

Stress

Comfort

Achievement

Fatigue

Connection

Immersion

Focus

Emotional momentum

These values influence pacing only.

Never player control.

==================================================
MICRO EXPERIENCES
==================================================

Examples

Commander greeting.

Sunrise over a restored city.

Wildlife interaction.

Museum conversation.

Research completion.

Companion animation.

Quiet music transition.

A child waving.

Each contributes to long-term emotional memory.

==================================================
MACRO EXPERIENCES
==================================================

Examples

Saving a civilisation.

Completing a megaproject.

Recruiting Atlas Prime.

Restoring Earth.

Discovering a new galaxy.

Graduating an academy.

Opening a new museum wing.

Historic celebrations.

==================================================
EXPERIENCE RHYTHM
==================================================

Alternate naturally between:

Action

↓

Discovery

↓

Conversation

↓

Construction

↓

Exploration

↓

Celebration

↓

Reflection

↓

New Mystery

The rhythm adapts naturally.

==================================================
FIRST-TIME MOMENTS
==================================================

Protect moments that only happen once.

Examples

First Commander recruited.

First colony restored.

First museum artifact.

First alien alliance.

First megaproject.

First planetary sunrise.

Never diminish them through repetition.

==================================================
RETURNING MOMENTS
==================================================

Returning to familiar places should create:

Recognition.

Growth.

Pride.

Nostalgia.

Perspective.

Players see how the universe has changed.

==================================================
SURPRISE MANAGEMENT
==================================================

Unexpected moments should feel earned.

Examples

Rare wildlife behaviour.

Commander reunion.

Hidden observatory.

Unexpected scientific insight.

Historic callback.

Planetary celebration.

==================================================
PLAYER EXPRESSION
==================================================

Different playstyles naturally create different experiences.

Explorer.

Scientist.

Engineer.

Builder.

Conservationist.

Diplomat.

Teacher.

Historian.

No path feels secondary.

==================================================
EMOTIONAL MEMORY
==================================================

The engine tracks:

Most memorable discoveries.

Most meaningful friendships.

Favourite locations.

Personal milestones.

Historic achievements.

Quiet reflections.

Used to strengthen future callbacks.

==================================================
ATMOSPHERIC DESIGN
==================================================

Coordinate:

Lighting.

Music.

Weather.

Ambient audio.

Dialogue density.

Population activity.

Environmental storytelling.

Atmosphere supports experience.

==================================================
LONG-TERM EXPERIENCE
==================================================

Across hundreds of hours:

Wonder evolves into mastery.

Mastery evolves into stewardship.

Stewardship evolves into legacy.

Players become caretakers of civilisation.

==================================================
SHARED EXPERIENCES
==================================================

Civilisation collectively experiences:

Festivals.

Scientific announcements.

Commander ceremonies.

Historic anniversaries.

Museum openings.

Planetary recoveries.

Shared experiences build identity.

==================================================
DEVELOPER TOOLS
==================================================

Experience timeline.

Emotional pacing graph.

Wonder frequency tracker.

Discovery density viewer.

Atmosphere debugger.

Player journey replay.

Moment significance analyser.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually think:

"I don't remember the quest objective."

"I remember how that moment felt."

==================================================
ACCESSIBILITY
==================================================

Experience recap.

Journey summaries.

Reduced sensory mode.

Adaptive pacing options.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Experience Engine.

Ensure every interaction contributes toward a cohesive, memorable and emotionally authentic journey through the Afterlight universe.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of complete player journeys.

Review emotional pacing.

Review memorable moments.

Review atmosphere.

Review Commander interactions.

Review environmental storytelling.

Review accessibility.

Review performance.

Measure which moments players naturally remember years later.

Strengthen authentic experiences.

Remove artificial spectacle.

Ensure every meaningful memory emerges from player interaction rather than scripted manipulation.

Ensure AF-164 becomes the experiential layer that transforms Afterlight from an exceptional game into an unforgettable lifelong journey.

Repeat until players consistently describe their adventures through memories, emotions and stories rather than systems, mechanics or statistics.

Only then lock AF-164.

## Foundation / AF-000–163 / GP-FINAL alignment review

Exists above AF-163's Meaning Engine: meaning explains why something matters, experience determines how the player actually lives through it. This module leans heavily on direct reuse since "experience" mostly composes machinery already built:

"Experience Rhythm" shares SEVEN of its 8 stages verbatim with AF-154's real `PACING_CYCLE_STAGES` (only "Action" vs "Combat" differs, confirmed a synonym) — reused directly via AF-154's real `PacingCycleTracker`, verified by a dedicated test. "Player Expression" shares SEVEN of its 8 playstyles verbatim with AF-162's real `PLAYER_PURPOSE_KINDS` (only "Scientist" vs "Founder" differs) — confirmed the SAME mechanism asked twice (unlike this codebase's "domain" list family, which keeps near-duplicate vocabulary separate because each tags a different downstream structure), reused directly via AF-162's real `PlayerPurposeObserver`. "Surprise Management" is confirmed the same shape as AF-153's real `EmergenceOpportunityLog`/`EMERGENCE_OPPORTUNITY_KINDS` (4 of 6 near-exact matches) — reused directly. "Emotional Memory" overlaps directly with AF-163's real `PERSONAL_MEANING_CATEGORIES`/`MeaningCurator` and `QuietMomentLog` ("Most meaningful discovery" a verbatim shared member) — reused directly. "Micro Experiences" and "Returning Moments" both compose AF-163's real `SignificanceTracker` directly at the call site. "Shared Experiences" is confirmed the FIFTH instance of AF-155's real `CollaborativeProblemLog` mechanic in this codebase — reused directly.

"Experience Pillars" (10) is another entry in this codebase's recurring abstract-value/virtue-list family — 3 exact-string matches with AF-160's real `CIVILISATION_VALUES` (Responsibility/Hope/Legacy, verified by a dedicated test), kept separate since it tags experiential design pillars rather than civilisation-wide values. "Experience States" (10) mirrors the SHAPE of AF-154's real `PlayerExperienceFactors`/`PlayerExperienceTracker` but never its TYPE, since that interface is hand-typed to its own closed field set rather than a reusable generic.

`FirstTimeMomentTracker` ("never diminish them through repetition") and `AtmosphereCoordinator` (coordinating the 7 named atmospheric dimensions) are both confirmed genuinely new. The debug overlay gains a new `atlasExperience` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-163 before it. Zero changes to AF-154's `PacingCycleTracker`/`PlayerExperienceFactors`, AF-162's `PlayerPurposeObserver`, AF-153's `EmergenceOpportunityLog`, AF-163's `MeaningCurator`/`SignificanceTracker`/`QuietMomentLog`, AF-155's `CollaborativeProblemLog`, AF-160's `CIVILISATION_VALUES`, or any other locked module.

Score: 9.5/10 — approved and locked.
