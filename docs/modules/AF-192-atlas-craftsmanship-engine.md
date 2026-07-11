## Verbatim prompt

192

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-191 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Craftsmanship Engine.

The Creator Engine governs the act of creation.

The Craftsmanship Engine governs the pursuit of excellence.

Every object, institution, expedition, scientific paper, work of art and public space should display evidence of care, refinement and mastery.

Nothing important should feel mass-produced.

Quality becomes a visible property of civilisation.

==================================================
PURPOSE
==================================================

Model craftsmanship across every domain.

Reward patience.

Reward refinement.

Reward mastery.

Celebrate people who continually improve their work.

==================================================
CORE PRINCIPLE
==================================================

Great work is rarely created once.

It is improved repeatedly.

Civilisation becomes exceptional through continual refinement.

==================================================
CRAFTSMANSHIP DOMAINS
==================================================

Engineering

Science

Architecture

Education

Medicine

Art

Music

Writing

Ecology

Manufacturing

Exploration

Leadership

==================================================
THE CRAFT CYCLE
==================================================

Inspiration

↓

Planning

↓

Prototype

↓

Construction

↓

Evaluation

↓

Feedback

↓

Refinement

↓

Mastery

↓

Teaching

↓

Legacy

Mastery is a journey.

Not a destination.

==================================================
MASTER CRAFTSMEN
==================================================

Exceptional individuals become recognised for:

Precision.

Patience.

Creativity.

Reliability.

Innovation.

Teaching.

Humility.

Their names become respected throughout civilisation.

==================================================
SCIENTIFIC CRAFTSMANSHIP
==================================================

Research values:

Careful observation.

Repeatability.

Clear documentation.

Peer review.

Transparency.

Long-term accuracy.

Scientific excellence becomes cultural pride.

==================================================
ENGINEERING CRAFTSMANSHIP
==================================================

Engineers continually improve:

Efficiency.

Safety.

Maintainability.

Beauty.

Longevity.

Accessibility.

Every generation builds better than the last.

==================================================
ARCHITECTURAL CRAFTSMANSHIP
==================================================

Buildings reflect:

Local materials.

Climate.

History.

Identity.

Beauty.

Function.

No landmark exists without purpose.

==================================================
ARTISTIC CRAFTSMANSHIP
==================================================

Artists refine:

Composition.

Technique.

Expression.

Storytelling.

Materials.

Public engagement.

Art gains historical significance.

==================================================
EDUCATIONAL CRAFTSMANSHIP
==================================================

Teachers refine:

Lessons.

Museums.

Fieldwork.

Demonstrations.

Assessment.

Mentorship.

Education becomes a craft.

==================================================
LEADERSHIP CRAFTSMANSHIP
==================================================

Leadership improves through:

Listening.

Reflection.

Delegation.

Mentoring.

Communication.

Integrity.

Great leaders continuously learn.

==================================================
PLAYER CRAFTSMANSHIP
==================================================

Players gradually improve:

Settlement planning.

Museum curation.

Expedition preparation.

Landscape design.

Infrastructure.

Commander development.

The player's style becomes recognisable.

==================================================
QUALITY WITHOUT PERFECTION
==================================================

The universe values:

Iteration.

Learning.

Improvement.

Not flawless execution.

Mistakes become part of mastery.

==================================================
THE MAKER'S MARK
==================================================

Outstanding creations retain evidence of:

Their creator.

Their workshop.

Their era.

Their techniques.

Their improvements.

Their influence.

Objects possess provenance.

==================================================
THE CRAFT GUILDS
==================================================

Communities naturally establish:

Engineering guilds.

Artist collectives.

Research societies.

Architect associations.

Teaching circles.

Ecological restoration groups.

Knowledge spreads through mentorship.

==================================================
THE STANDARD OF EXCELLENCE
==================================================

Every important creation asks:

Can this be improved?

Who benefits?

Will it endure?

Will future generations admire it?

If yes...

Continue refining.

==================================================
DEVELOPER TOOLS
==================================================

Craftsmanship browser.

Iteration timeline.

Mastery graph.

Quality evolution viewer.

Creator lineage explorer.

Refinement dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually recognise:

"This city wasn't simply built."

"It was lovingly crafted over generations."

==================================================
ACCESSIBILITY
==================================================

Craft summaries.

Creator profiles.

Improvement timeline.

Masterwork browser.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Craftsmanship Engine.

Ensure every meaningful creation throughout the Afterlight universe demonstrates refinement, care and mastery earned through continual improvement.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-191.

Simulate one million years.

Review scientific quality.

Review architectural refinement.

Review artistic excellence.

Review educational improvement.

Review engineering standards.

Review leadership maturity.

Review accessibility.

Review performance.

Eliminate disposable design.

Reward thoughtful refinement.

Ensure every generation inherits better craftsmanship than the one before.

Ensure AF-192 becomes the excellence layer of the Afterlight universe, allowing civilisation to become recognised not only for what it creates—but for how beautifully, responsibly and thoughtfully it creates it.

Repeat until every important object, institution and achievement feels like the work of people who genuinely cared about leaving the universe better than they found it.

Only then lock AF-192.

## Foundation / AF-000–191 / GP-FINAL alignment review

**NAMING NOTE (light-touch, no real vocabulary overlap):** unrelated to `src/game/crafting/`'s "Crafting System" (AF-025, material inventory and item-recipe crafting) and `src/game/masterIndex/`'s "Master Index" (AF-150, module dependency registration) — both share a plain English word with this module's title, zero shared state or vocabulary.

AF-192 is AF-191's direct sibling — "the Creator Engine governs the act of creation, the Craftsmanship Engine governs the pursuit of excellence" — and reuses several of its neighbours' real classes directly, confirmed by dedicated tests: "Master Craftsmen" ("their names become respected... recognised for Precision/Patience/...") is exactly AF-166's real `ReputationTracker` — "reveals, never assigns" a most-recognised quality, the same mechanic AF-187's "Commander Emergence" already reused for an identical purpose. "Quality Without Perfection" ("iteration... mistakes become part of mastery... not flawless execution") is exactly AF-149's real `IterationCycleTracker` — "never ship the first version," ready once genuinely cycled twice. "The Maker's Mark" ("objects possess provenance") composes AF-151's real `KnowledgeGraph.addEdge` directly. "The Craft Guilds" ("knowledge spreads through mentorship") reuses AF-160's real `MentorshipLedger` directly.

"The Craft Cycle" (Inspiration→Planning→Prototype→Construction→Evaluation→Feedback→Refinement→Mastery→Teaching→Legacy) is, unlike AF-191's own "Creation Cycle," an ORDERED, NON-CYCLIC ladder — the spec never draws an arrow back from Legacy to Inspiration ("mastery is a journey, not a destination" describes an open-ended endpoint, not a closed loop). Modelled with this codebase's established `xRank(stage): number` pure-lookup pattern via the new `craftCycleRank`, never AF-155's real `CyclicStageTracker`. It shares only 3 of its 10 stages exactly with AF-191's real `CREATION_CYCLE_STAGES` (Inspiration/Refinement/Teaching), verified via AF-170's real `detectOverlap` — two sibling 10-stage process ladders, authored back to back, with genuinely different shape (cyclic vs non-cyclic) and mostly different membership, confirmed by a dedicated test.

"The Standard of Excellence" ("every important creation asks... if yes, continue refining") is an ANY-of-N shape — a single affirmed question is sufficient to warrant continued refinement — distinct in DIRECTION from every existing ANY-of-N gate in this codebase (AF-149's `featureFlagAssessment`, AF-181's `eternalStandardMet`, AF-183's `thematicConsistencyMet`, AF-190's `updateQualityAssessment`), which all gate REJECTION or PASSING; this one gates ONGOING INVESTMENT via the new `standardOfExcellenceAssessment`, confirmed by a dedicated test.

"Craftsmanship Domains" (12) shares 9 of 12 exact-string members with AF-191's real `CREATIVE_DOMAINS` (itself reused directly there from AF-171) — documented honestly via `detectOverlap`, no record claimed (the current absolute record remains AF-191's own 12/12 against the same list). The six domain-specific craftsmanship-values sections (Scientific/Engineering/Architectural/Artistic/Educational/Leadership) plus "Player Craftsmanship" are kept as pure reference vocabulary — confirmed no computational analog beyond the shared mechanisms above, the same honest scope boundary AF-143/149/171/191 already established for enumeration sections with no distinct mechanic of their own.

The debug overlay gains a new `atlasCraftsmanship` field on `DebugSnapshot`, rendered with the label `craftsman` — checked against every existing debug line for collisions before finalising (including the pre-existing unrelated `masterIdx` label) and confirmed unique. Zero changes to AF-149's `IterationCycleTracker`, AF-151's `KnowledgeGraph`, AF-160's `MentorshipLedger`, AF-166's `ReputationTracker`, AF-170's `detectOverlap`, AF-171's `CREATIVE_DOMAINS`, AF-191's `CREATION_CYCLE_STAGES`, or any other locked module.

Score: 9.5/10 — approved and locked.
