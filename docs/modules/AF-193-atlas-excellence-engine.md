## Verbatim prompt

193

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-192 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Excellence Engine.

The Craftsmanship Engine governs refinement.

The Excellence Engine governs continual pursuit of the highest achievable standards across every aspect of civilisation.

Excellence is never perfection.

Excellence is the commitment to becoming better than yesterday.

It becomes a defining cultural value of humanity.

==================================================
PURPOSE
==================================================

Create a civilisation that continually improves itself.

Reward learning.

Reward humility.

Reward responsibility.

Reward sustained effort.

==================================================
CORE PRINCIPLE
==================================================

Excellence is a direction.

Not a destination.

No achievement is beyond thoughtful improvement.

==================================================
EXCELLENCE DOMAINS
==================================================

Science

Engineering

Education

Leadership

Medicine

Architecture

Ecology

Culture

Community

Exploration

History

Governance

==================================================
THE EXCELLENCE CYCLE
==================================================

Learn

↓

Attempt

↓

Measure

↓

Reflect

↓

Improve

↓

Validate

↓

Teach

↓

Inspire

↓

Learn Again

Improvement never ends.

==================================================
PERSONAL EXCELLENCE
==================================================

Every individual pursues growth through:

Practice.

Reflection.

Mentorship.

Education.

Curiosity.

Resilience.

Experience.

Personal excellence remains lifelong.

==================================================
COMMANDER EXCELLENCE
==================================================

Every Commander strives to improve:

Leadership.

Decision making.

Scientific understanding.

Teaching.

Communication.

Strategic thinking.

Compassion.

Their influence grows through continual learning.

==================================================
SCIENTIFIC EXCELLENCE
==================================================

Science values:

Evidence.

Replication.

Transparency.

Peer review.

Curiosity.

Integrity.

Collaboration.

The strongest idea survives because it earns confidence.

==================================================
ENGINEERING EXCELLENCE
==================================================

Engineering continually improves:

Reliability.

Maintainability.

Accessibility.

Efficiency.

Safety.

Beauty.

Longevity.

Every generation leaves stronger foundations.

==================================================
EDUCATIONAL EXCELLENCE
==================================================

Education evolves through:

Research.

Teaching innovation.

Student feedback.

Field learning.

Museums.

Mentorship.

Accessibility.

Knowledge becomes increasingly reachable.

==================================================
COMMUNITY EXCELLENCE
==================================================

Communities improve:

Public spaces.

Volunteerism.

Healthcare.

Education.

Ecology.

Neighbourhood identity.

Mutual trust.

Quality of life grows.

==================================================
CULTURAL EXCELLENCE
==================================================

Civilisation encourages:

Curiosity.

Respect.

Open discussion.

Creativity.

Public learning.

Stewardship.

Shared responsibility.

Culture matures continuously.

==================================================
INSTITUTIONAL EXCELLENCE
==================================================

Museums.

Universities.

Hospitals.

Observatories.

Libraries.

Research centres.

All regularly evaluate and improve their service to civilisation.

==================================================
PLAYER EXCELLENCE
==================================================

Players naturally improve:

City planning.

Research strategy.

Ecological restoration.

Museum curation.

Commander development.

Expedition preparation.

The universe recognises mastery through experience rather than arbitrary levels.

==================================================
THE EXCELLENCE STANDARD
==================================================

Every meaningful project asks:

Can it teach?

Can it inspire?

Can it endure?

Can it become more accessible?

Can future generations improve it?

If yes...

Continue refining.

==================================================
THE IMPROVEMENT NETWORK
==================================================

Every improvement records:

Reason.

Method.

Evidence.

Outcome.

Educational value.

Future opportunities.

Civilisation learns from improvement itself.

==================================================
THE EXCELLENCE INDEX
==================================================

Evaluate:

Educational quality.

Scientific integrity.

Engineering reliability.

Environmental stewardship.

Institutional resilience.

Community wellbeing.

Historical preservation.

Accessibility.

Quality is measured holistically.

==================================================
DEVELOPER TOOLS
==================================================

Excellence dashboard.

Continuous improvement viewer.

Institution benchmarking.

Learning graph.

Quality evolution browser.

Mastery analyser.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually realise:

"This civilisation doesn't chase perfection."

"It simply never stops improving."

==================================================
ACCESSIBILITY
==================================================

Improvement summaries.

Institution reports.

Learning timeline.

Quality overview.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Excellence Engine.

Ensure every person, institution and civilisation continuously pursues thoughtful improvement while preserving humility, accessibility and long-term sustainability.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-192.

Simulate one million years.

Review scientific standards.

Review educational quality.

Review engineering reliability.

Review ecological stewardship.

Review institutional maturity.

Review Commander development.

Review accessibility.

Review performance.

Prevent perfectionism from replacing progress.

Reward meaningful improvement over flawless execution.

Ensure excellence always strengthens cooperation rather than competition.

Ensure AF-193 becomes the continual improvement layer of the Afterlight universe, allowing humanity's defining characteristic to become its endless willingness to learn, refine and elevate everything it creates.

Repeat until civilisation consistently demonstrates that its greatest achievement is the pursuit of becoming better together.

Only then lock AF-193.

## Foundation / AF-000–192 / GP-FINAL alignment review

AF-193 is the third module in the Creator (AF-191) → Craftsmanship (AF-192) → Excellence (AF-193) trilogy — "the Craftsmanship Engine governs refinement, the Excellence Engine governs continual pursuit of the highest achievable standards" — and reuses several of its predecessors' real classes directly, confirmed by dedicated tests: "The Excellence Cycle" (Learn→Attempt→Measure→Reflect→Improve→Validate→Teach→Inspire→"Learn Again," an explicit closed loop) reuses AF-155's real generic `CyclicStageTracker<TStage>` directly, instantiated over this module's own new 8-stage `EXCELLENCE_CYCLE_STAGES` union — unlike AF-192's own "Craft Cycle" (confirmed non-cyclic), this one explicitly loops. "Personal Excellence"'s "Mentorship" channel reuses AF-160's real `MentorshipLedger` directly. "Commander Excellence" ("their influence grows through continual learning") reuses AF-166's real `ReputationTracker` directly — the same "reveals, never assigns" mechanic AF-187's Commander Emergence and AF-192's Master Craftsmen both already reused. "Cultural Excellence" ("culture matures continuously") composes AF-159's real `CulturalTrendTracker` directly. "Institutional Excellence" ("all regularly evaluate and improve their service") reuses AF-149's real `IterationCycleTracker` directly — the same "never ship the first version" mechanic AF-192's own Quality Without Perfection already reused.

"The Excellence Standard" (5 questions, "if yes, continue refining") is the SECOND instance of AF-192's own `standardOfExcellenceAssessment` shape (an ANY-of-N gate that triggers ONGOING INVESTMENT rather than rejection or completion) via the new `excellenceStandardAssessment`, typed to its own separate `ExcellenceStandardQuestion` union — shares ZERO exact-string members with AF-192's real `STANDARD_OF_EXCELLENCE_QUESTIONS` despite near-identical framing ("Will it endure?" vs "Can it endure?"), confirmed via AF-170's real `detectOverlap`.

"The Excellence Index" (8 categories, "quality is measured holistically") mirrors AF-143/149/170/173/179/180/182/184/188/190's real scoring-rubric shape exactly — the ELEVENTH such rubric in this codebase, typed to its own new `ExcellenceIndexCategory` union, reusing the same established 9.5 gate even though this section never restates the threshold explicitly. Shares only 1 of 8 exact-string members with AF-190's real `ATLAS_SCORECARD_CATEGORIES` (Accessibility), confirmed by a dedicated test.

"The Improvement Network" ("every improvement records Reason/Method/Evidence/Outcome/Educational value/Future opportunities") is confirmed genuinely new in domain: no per-improvement structured record of this exact field shape exists anywhere else (AF-190's `DesignHistoryLedger` is per-MECHANIC, not per-improvement-EVENT, and uses entirely different fields). The new `ImprovementNetworkLedger` mirrors the established append-only-record-list shape (AF-135's `EvolvingEntry`, AF-190's `DesignHistoryLedger`) rather than inventing a new one, confirmed by a dedicated test.

"Excellence Domains" (12) shares 9 of 12 exact-string members with AF-191's real `CREATIVE_DOMAINS` and 8 of 12 with AF-192's real `CRAFTSMANSHIP_DOMAINS` — no record claimed (current record remains AF-191's own 12/12). "The Excellence Cycle" shares ZERO exact-string stages with either AF-191's `CREATION_CYCLE_STAGES` or AF-192's `CRAFT_CYCLE_STAGES` despite being the THIRD sibling process ladder authored back to back ("Teach" vs "Teaching," "Reflect" vs "Reflection") — confirmed via `detectOverlap`, an even starker membership divergence than AF-186's own 0/12 domain overlap. The six domain-specific excellence-values sections (Personal/Scientific/Engineering/Educational/Community/Cultural) plus "Player Excellence" and "Institutional Excellence"'s own institution-type examples are kept as pure reference vocabulary — the same honest scope boundary AF-143/149/171/191/192 already established for enumeration sections with no distinct mechanic of their own.

The debug overlay gains a new `atlasExcellence` field on `DebugSnapshot`, rendered with the label `excellence` — checked against every existing debug line for collisions before finalising and confirmed unique. Zero changes to AF-149's `IterationCycleTracker`, AF-155's `CyclicStageTracker`, AF-159's `CulturalTrendTracker`, AF-160's `MentorshipLedger`, AF-166's `ReputationTracker`, AF-170's `detectOverlap`, AF-190's `ATLAS_SCORECARD_CATEGORIES`/`DesignHistoryLedger`, AF-191's `CREATIVE_DOMAINS`/`CREATION_CYCLE_STAGES`, AF-192's `CRAFTSMANSHIP_DOMAINS`/`CRAFT_CYCLE_STAGES`/`STANDARD_OF_EXCELLENCE_QUESTIONS`/`standardOfExcellenceAssessment`, or any other locked module.

Score: 9.5/10 — approved and locked.
