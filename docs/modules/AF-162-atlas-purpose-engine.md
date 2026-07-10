## Verbatim prompt

162

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-161 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Purpose Engine.

The Purpose Engine sits above the Philosophy Engine.

Philosophy asks why.

Purpose answers:

"What are we building toward?"

It continuously aligns every individual, organisation and civilisation with meaningful long-term goals.

It prevents a prosperous galaxy from becoming directionless.

==================================================
PURPOSE
==================================================

Ensure civilisation never loses meaning.

As humanity becomes safer...

It must also become wiser.

As humanity becomes stronger...

It must also become more purposeful.

==================================================
CORE PRINCIPLE
==================================================

Survival is the first goal.

Purpose is the final goal.

Every generation should inherit not only a better world...

...but a reason to improve it further.

==================================================
PURPOSE DOMAINS
==================================================

Exploration

Education

Scientific Discovery

Engineering

Ecology

Culture

Community

Art

Medicine

Leadership

History

Future Generations

==================================================
INDIVIDUAL PURPOSE
==================================================

Every citizen gradually discovers purpose.

Examples

Teacher.

Scientist.

Explorer.

Engineer.

Artist.

Doctor.

Historian.

Caretaker.

Mentor.

Builder.

Purpose evolves naturally through life.

==================================================
COMMANDER PURPOSE
==================================================

Every Commander maintains:

Professional mission.

Personal aspiration.

Legacy ambition.

Teaching objective.

Historical contribution.

Their purpose evolves with experience.

==================================================
CIVILISATION PURPOSE
==================================================

Civilisation continually evaluates:

What should we preserve?

What should we discover?

Who still needs help?

Which worlds remain forgotten?

What can we leave behind?

==================================================
PLAYER PURPOSE
==================================================

The game never assigns destiny.

Instead it observes.

Examples

Explorer.

Builder.

Teacher.

Conservationist.

Engineer.

Historian.

Diplomat.

Founder.

The player's actions reveal purpose.

==================================================
INSTITUTIONAL PURPOSE
==================================================

Universities educate.

Museums remember.

Hospitals heal.

Observatories inspire.

Gardens restore.

Libraries preserve.

Every institution exists for meaningful reasons.

==================================================
LONG-TERM MISSIONS
==================================================

Examples

Restore every ecosystem.

Archive every language.

Map every constellation.

Preserve every species.

Educate every colony.

Reconnect lost civilizations.

These span generations.

==================================================
PURPOSE EVOLUTION
==================================================

Purpose changes over time.

Early civilisation:

Survive.

Later:

Expand.

Later:

Understand.

Later:

Inspire.

Later:

Guide others.

==================================================
CULTURAL PURPOSE
==================================================

Every world develops ideals.

Some value:

Knowledge.

Art.

Engineering.

Ecology.

Exploration.

Education.

Each contributes uniquely to humanity.

==================================================
CRISIS OF PURPOSE
==================================================

As civilisation prospers, meaningful questions emerge.

Examples

What lies beyond known space?

What knowledge remains missing?

What responsibilities accompany peace?

The universe continually creates new reasons to explore.

==================================================
SHARED PURPOSE
==================================================

Large collaborative goals unite civilisation.

Examples

Galactic Observatory Network.

Universal Medical Archive.

Interstellar Education Initiative.

Atlas Memory Project.

Living Planet Restoration.

Every colony contributes.

==================================================
LEGACY OF PURPOSE
==================================================

Completed purposes become:

Traditions.

Institutions.

Educational curriculum.

Commander teachings.

Museum exhibits.

Historic inspiration.

==================================================
PURPOSE NETWORK
==================================================

Purposes connect through:

People.

History.

Knowledge.

Institutions.

Future projects.

Shared dreams.

Civilisation becomes increasingly interconnected.

==================================================
DEVELOPER TOOLS
==================================================

Purpose graph.

Institution browser.

Legacy influence viewer.

Motivation explorer.

Civilisation aspiration map.

Shared-goal dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should gradually realise:

"I've stopped playing for rewards."

"I'm playing because I genuinely want to see humanity succeed."

==================================================
ACCESSIBILITY
==================================================

Purpose summaries.

Long-term goal tracker.

Institution browser.

Legacy roadmap.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Purpose Engine.

Allow every intelligent entity and civilisation to continually discover meaningful reasons to build, explore, preserve and inspire.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of generations.

Review Commander aspirations.

Review institutional evolution.

Review civilisation priorities.

Review player motivation.

Review cultural diversity.

Review educational impact.

Review accessibility.

Review performance.

Ensure purpose never becomes repetitive.

Ensure prosperity naturally creates new aspirations rather than ending progression.

Ensure AF-162 becomes the motivational layer of the Afterlight universe, ensuring that humanity always has another horizon to pursue while remaining faithful to the Atlas Core values of hope, curiosity, stewardship and legacy.

Repeat until every generation inherits not only a better civilisation—but a greater sense of purpose than the one before.

Only then lock AF-162.

## Foundation / AF-000–161 / GP-FINAL alignment review

Sits above AF-161's Philosophy Engine: philosophy asks why, purpose answers "what are we building toward?" "Purpose Domains" (12) is confirmed the HEAVIEST vocabulary overlap yet recorded in this codebase — 8 of its 12 members are exact-string matches with AF-161's real `PHILOSOPHICAL_DOMAINS`, verified by a dedicated test, surpassing even AF-161's own 3-exact-match overlap with AF-160's `WISDOM_DIMENSIONS`. Kept as its own separate union anyway: three lists now ask three different questions over largely the same vocabulary — judgement, debate topic, and meaningful goal/vocation — never merged, always documented. "Cultural Purpose" is itself almost entirely a subset of this module's own `PURPOSE_DOMAINS` (5 of 6 members, confirmed by a dedicated test), flagged as the module's own internal near-duplicate rather than silently repeated.

"Shared Purpose" ("large collaborative goals unite civilisation... every colony contributes") is confirmed the FOURTH instance of the identical mechanic in this codebase, after AF-155's Collaborative Intelligence, AF-156's Group Decisions, and AF-157's Collaborative Planning (all real `CollaborativeProblemLog`) — reused directly again via the existing `collaborativeProblems` instance. "Purpose Network" ("purposes connect through people, history, knowledge...") is exactly the shape AF-151's real `KnowledgeGraph` already provides — composed directly via the existing `knowledgeGraph` instance rather than a second graph structure.

"Legacy of Purpose" (6 outputs) mirrors the SHAPE of AF-157/158/159/160's real memory-archive classes — the FIFTH mirrored "completed work becomes a named output" archive in this codebase, typed to its own separate union. "Player Purpose" is deliberately LESS strict than AF-161's real `PlayerPhilosophyObserver` ("the game observes, it never labels"): the spec's own "the player's actions reveal purpose" wording licenses a `dominantPurpose()` argmax over real tallies, confirmed by a dedicated test that it returns null until at least one action has been observed — an emergent read, never a destiny assigned in advance.

`IndividualPurposeTracker` and `CommanderPurposeTracker` both mirror AF-161's real `CommanderBeliefTracker` full-history shape. `LongTermMissionTracker` gives "Long-term Missions" real progress tracking rather than reference-only flavour text. The debug overlay gains a new `atlasPurpose` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-161 before it. Zero changes to AF-161's `PHILOSOPHICAL_DOMAINS`/`PlayerPhilosophyObserver`/`CommanderBeliefTracker`, AF-155's `CollaborativeProblemLog`, AF-151's `KnowledgeGraph`, AF-157/158/159/160's memory-archive classes, or any other locked module.

Score: 9.5/10 — approved and locked.
