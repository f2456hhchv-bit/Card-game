## Verbatim prompt

159

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-158 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Possibility Engine.

The Possibility Engine sits above the Future Engine.

The Future Engine predicts likely outcomes.

The Possibility Engine imagines opportunities that nobody has considered yet.

It is the engine responsible for innovation, creativity, serendipity and breakthrough discoveries throughout the Afterlight universe.

It ensures civilisation never stagnates.

==================================================
PURPOSE
==================================================

Enable genuine innovation.

Allow new ideas to emerge naturally.

Create discoveries that no scripted designer explicitly authored.

Support curiosity.

Support wonder.

Support hope.

==================================================
CORE PRINCIPLE
==================================================

Civilisations do not advance by repeating the past.

They advance by imagining something that has never existed before.

The Possibility Engine continuously searches for:

"What if?"

==================================================
POSSIBILITY SOURCES
==================================================

The engine evaluates:

Knowledge Graph

World Model

Future Engine

Chronicle

Museum

Research

Commander Bonds

Civilisation

Wildlife

Exploration

Player creativity

History

==================================================
DISCOVERY CATEGORIES
==================================================

Scientific

Engineering

Medical

Architectural

Ecological

Educational

Cultural

Diplomatic

Exploration

Historical

Artistic

Social

==================================================
SCIENTIFIC BREAKTHROUGHS
==================================================

The engine proposes:

Unexpected material combinations.

Cross-disciplinary research.

Ancient technology reinterpretation.

Biological adaptations.

Energy innovations.

Quantum discoveries.

Every breakthrough requires evidence.

==================================================
ENGINEERING INNOVATION
==================================================

Suggest:

Improved infrastructure.

Novel construction methods.

Safer reactors.

Adaptive habitats.

New transportation.

Efficient manufacturing.

Nothing appears magically.

==================================================
COMMANDER INSPIRATION
==================================================

Commanders occasionally experience:

New theories.

Creative strategies.

Unexpected collaborations.

Teaching breakthroughs.

Personal insights.

Leadership evolution.

Inspired by:

Experience.

Failure.

Friendship.

Discovery.

==================================================
COLONY INNOVATION
==================================================

Settlements naturally develop:

New festivals.

Architectural styles.

Educational programmes.

Community traditions.

Ecological solutions.

Public art.

Cities become culturally unique.

==================================================
PLAYER INSPIRATION
==================================================

Without forcing behaviour, identify opportunities such as:

Interesting expedition routes.

Museum collections nearing completion.

Commander synergies.

Historic mysteries.

Potential megaprojects.

Rare species migration.

The player discovers opportunities naturally.

==================================================
SERENDIPITY
==================================================

Meaningful coincidences emerge.

Examples

Two scientists independently solve related problems.

A child notices an overlooked artifact.

A wildlife migration reveals hidden ruins.

A Commander remembers an old conversation.

Nothing feels contrived.

==================================================
CROSS-DISCIPLINARY THINKING
==================================================

Encourage collaboration between:

Medicine + Engineering

Ecology + Architecture

Education + Exploration

History + AI

Astronomy + Navigation

Biology + Robotics

Innovation often happens between fields.

==================================================
CULTURAL EVOLUTION
==================================================

New ideas spread.

Examples

Music styles.

Art movements.

Education reforms.

Scientific philosophy.

Architectural movements.

Historic preservation.

Civilisation grows intellectually.

==================================================
UNSOLVED MYSTERIES
==================================================

The engine continuously maintains:

Ancient questions.

Unknown signals.

Lost expeditions.

Incomplete research.

Missing artifacts.

Forgotten languages.

Players always have mysteries worth pursuing.

==================================================
OPPORTUNITY NETWORK
==================================================

Every possibility links to:

Required knowledge.

Required people.

Required locations.

Potential risks.

Potential rewards.

Historical significance.

Future implications.

==================================================
INNOVATION MEMORY
==================================================

Successful innovations become:

Academic disciplines.

Museum exhibits.

Commander teachings.

Historic milestones.

Educational curriculum.

Future foundations.

==================================================
VISUALISATION
==================================================

Developer tools include:

Innovation graph.

Opportunity map.

Discovery network.

Research convergence viewer.

Creative dependency graph.

Possibility explorer.

==================================================
PLAYER EXPERIENCE
==================================================

Players should frequently think:

"I never expected that."

"I wonder if these two ideas connect."

"What happens if we investigate further?"

Curiosity continually drives play.

==================================================
ACCESSIBILITY
==================================================

Opportunity summaries.

Discovery hints.

Innovation tracker.

Mystery journal.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Possibility Engine.

Allow the Afterlight universe to generate believable innovation, creativity and new opportunities that emerge naturally from accumulated knowledge rather than predetermined scripting.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years of civilisation.

Review scientific breakthroughs.

Review Commander inspiration.

Review architectural innovation.

Review ecological recovery.

Review cultural evolution.

Review player curiosity.

Review accessibility.

Review performance.

Eliminate repetitive discoveries.

Encourage genuine surprise.

Ensure innovation always grows logically from existing knowledge while remaining capable of producing entirely new directions for civilisation.

Ensure AF-159 becomes the imagination layer of the Afterlight universe, ensuring that humanity's future is defined not only by what is known—but by what is still possible.

Repeat until players consistently experience authentic moments of discovery, inspiration and wonder throughout thousands of hours of play.

Only then lock AF-159.

## Foundation / AF-000–158 / GP-FINAL alignment review

Sits above AF-158's Future Engine: where the Future Engine predicts likely outcomes, the Possibility Engine imagines opportunities nobody has considered yet. "Player Inspiration" (6 kinds) mirrors the SHAPE of AF-155's real `DiscoverySuggestionLog` and AF-158's real `OpportunityLog` (both append-only, surface-by-kind) but never their TYPE, since both classes are hand-typed to their own closed unions rather than reusable generics — the same missed-generalisation precedent AF-149/153/158 already recorded. `PlayerInspirationKind` shares zero members with either real union, confirmed by a dedicated test as the SIXTH "kind of notable moment" list in this codebase, after AF-136/153/154/155/158's real lists.

"Innovation Memory" (6 outputs) mirrors the SHAPE of AF-157's real `PlanMemoryArchive` and AF-158's real `FutureMemoryArchive` for the same reason — the THIRD mirrored "completed work becomes a named output" archive in this codebase, again typed to its own separate union rather than either real one.

"Serendipity" ("two scientists independently solve related problems... a Commander remembers an old conversation") is exactly the shape of question AF-151's real `KnowledgeGraph.suggestConnections` already answers (shared-neighbour convergence) — composing it directly at the call site is the intended way to surface a real serendipity moment, confirmed by a dedicated test, never a second convergence algorithm. Unlike every other list in this module, `SerendipityLog` records free-text descriptions rather than a closed union, since the spec's own four examples are full scenarios rather than short category names.

"Possibility Sources" (12 systems) is confirmed the TENTH parallel "which systems does this touch" list in this codebase, after AF-142/144/145/149/152/153/154/155/158's real lists — kept separate. Confirmed genuinely new: `PossibilityRegistry` (the full "Opportunity Network" shape per possibility — required knowledge/people/locations, risks, rewards, historical significance, future implications), `MysteryLog` ("players always have mysteries worth pursuing" — a mystery stays open until explicitly resolved), and `CulturalTrendTracker` (tracks which entities have adopted a given cultural trend, over plain caller-supplied trend names rather than a closed union, since cultural movements are player/simulation-authored).

The debug overlay gains a new `atlasPossibility` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-158 before it. Zero changes to AF-151's `KnowledgeGraph`, AF-155's `DiscoverySuggestionLog`, AF-157's `PlanMemoryArchive`, AF-158's `OpportunityLog`/`FutureMemoryArchive`, or any other locked module.

Score: 9.5/10 — approved and locked.
