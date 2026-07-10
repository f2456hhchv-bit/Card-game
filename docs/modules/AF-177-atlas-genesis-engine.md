## Verbatim prompt

177

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-176 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Genesis Engine.

The Genesis Engine governs the birth of everything new within the Afterlight universe.

The Continuum preserves continuity.

The Genesis Engine ensures the universe continually creates authentic beginnings.

Every institution...

Every scientific field...

Every tradition...

Every city...

Every Commander...

Every civilisation...

Every dream...

Must have a believable origin.

Nothing should simply appear.

Everything should have a beginning worthy of becoming history.

==================================================
PURPOSE
==================================================

Ensure every meaningful addition to the universe has a believable birth.

Origins matter.

Foundations matter.

History begins somewhere.

==================================================
CORE PRINCIPLE
==================================================

Every legend was once unknown.

Every great civilisation began with a single decision.

Every discovery began with a single question.

Genesis is the first chapter.

Not the finished story.

==================================================
GENESIS DOMAINS
==================================================

Scientific

Educational

Technological

Ecological

Architectural

Cultural

Social

Exploratory

Institutional

Civilisational

Personal

Historical

==================================================
THE FIRST MOMENT
==================================================

Every important creation records:

Who began it.

Why it began.

Where it began.

When it began.

What inspired it.

Who doubted it.

Who believed in it.

These become permanent history.

==================================================
COMMANDER ORIGINS
==================================================

Every Commander remembers:

First mentor.

First expedition.

First mistake.

First discovery.

First friendship.

First success.

These origins shape personality forever.

==================================================
CITY FOUNDATIONS
==================================================

Every settlement remembers:

Founders.

Original buildings.

Early hardships.

First celebrations.

Initial architecture.

Historic purpose.

Cities retain identity through growth.

==================================================
SCIENTIFIC ORIGINS
==================================================

Every scientific discipline tracks:

Original hypothesis.

First experiment.

Founding researchers.

Historic failures.

Breakthrough publication.

Educational adoption.

Knowledge remembers its roots.

==================================================
TRADITION ORIGINS
==================================================

Every tradition begins through:

A celebration.

An act of kindness.

A scientific achievement.

A Commander.

A child.

A community.

Traditions evolve naturally afterwards.

==================================================
INSTITUTION FOUNDATIONS
==================================================

Schools.

Museums.

Universities.

Hospitals.

Observatories.

Research centres.

Every institution possesses:

Founding charter.

Mission.

First members.

Historic milestones.

Institutional memory.

==================================================
CULTURAL BEGINNINGS
==================================================

Art movements.

Music traditions.

Architecture.

Cuisine.

Literature.

Language.

Each originates through believable historical events.

==================================================
ECOLOGICAL BEGINNINGS
==================================================

Recovered forests.

Protected habitats.

Wildlife sanctuaries.

Ocean reserves.

Botanical gardens.

Every ecosystem restoration has a founding story.

==================================================
PLAYER FOUNDATIONS
==================================================

Player achievements become beginnings.

Examples

The first restored colony.

The first academy.

The first planetary park.

The first museum wing.

The first living forest.

Future generations reference these origins.

==================================================
THE SPARK NETWORK
==================================================

Every beginning inspires later beginnings.

One discovery inspires another.

One school creates another.

One mentor trains another.

History expands organically.

==================================================
THE FOUNDERS
==================================================

Important founders become:

Historical figures.

Museum exhibits.

Educational curriculum.

Commander inspiration.

Public monuments.

Founders remain remembered.

==================================================
BEGINNING → LEGACY
==================================================

The Genesis Engine links:

Origin

↓

Growth

↓

Maturity

↓

Legacy

↓

New Origin

Civilisation continually renews itself.

==================================================
DEVELOPER TOOLS
==================================================

Origin browser.

Founding timeline.

Institution lineage.

Discovery genealogy.

Tradition creator.

Genesis graph.

==================================================
PLAYER EXPERIENCE
==================================================

Players should often discover:

"This incredible institution started because one person believed it was possible."

Greatness feels earned.

==================================================
ACCESSIBILITY
==================================================

Origin summaries.

Founder browser.

Institution timeline.

Discovery genealogy.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Genesis Engine.

Ensure every meaningful system, institution, tradition and achievement possesses an authentic origin that permanently enriches the history of the Afterlight universe.

==================================================
SELF REVIEW LOOP
==================================================

Simulate one million years of civilisation.

Review institutional origins.

Review Commander beginnings.

Review scientific foundations.

Review cultural emergence.

Review ecological restoration.

Review educational history.

Review accessibility.

Review performance.

Ensure nothing important appears without explanation.

Ensure every beginning naturally creates opportunities for future generations.

Ensure AF-177 becomes the origin layer of the Afterlight universe, allowing every achievement to trace its history back to a single courageous first step.

Repeat until every great accomplishment in Afterlight feels even more meaningful because players know exactly how it began.

Only then lock AF-177.

## Foundation / AF-000–176 / GP-FINAL alignment review

Sits alongside AF-176's Continuum: the Continuum preserves continuity, the Genesis Engine ensures the universe continually creates authentic beginnings. This module leans heavily on direct reuse, confirmed by dedicated tests: "Scientific Origins"' "Original hypothesis" and "First experiment" are exactly AF-172's real `HypothesisTracker.propose`/`supportWithEvidence`. "Institution Foundations"' "Institutional memory" is exactly AF-165's real `InstitutionalMemoryTracker.remember` — "Founders" is confirmed already the FIRST category in AF-165's real closed `INSTITUTIONAL_MEMORY_CATEGORIES` union. "The Spark Network" ("one discovery inspires another... history expands organically") is exactly AF-151's real `KnowledgeGraph.addEdge` using the already-real `"Inspired"` `GraphEdgeKind`. "Beginning → Legacy" is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over the module's own 5-stage `GENESIS_LIFECYCLE_STAGES` union. "Commander Origins" composes AF-166's real `IdentityRegistry` directly, confirmed by a dedicated test that a Commander's `Identity.lifeMilestones` field is already exactly where a "first" belongs. "The Founders" composes AF-167's real `EarnedTitleTracker.earn` directly, confirmed by a dedicated test that `"Founder"` is a valid free-text title requiring no modification.

"Genesis Domains" (12) is confirmed to TIE (not break) the codebase's current 10/12 absolute overlap record: TEN of its 12 members are exact-string matches with AF-174's real `HORIZON_CATEGORIES`, verified using AF-170's real `detectOverlap` function.

"The First Moment" ("who began it, why it began, where, when, what inspired it, who doubted it, who believed in it... these become permanent history") is confirmed genuinely new: `GenesisRegistry` records exactly these seven fields per entity, and — because "these become permanent history" — an origin can be recorded exactly once per entity; a second `recordOrigin` call for an already-recorded entity id is a no-op, confirmed by a dedicated test, the same "write-once, never silently rewritten" guarantee AF-135's real `EvolvingEntry` established for its own objective description. This is a fundamentally different shape from every existing per-entity log in this codebase (all either append-only histories or freely-overwritable current-state trackers), and from AF-159/173's real `Possibility`/`PossibilityRegistry` (which links required knowledge/people/resources for something not yet realised, not a record of how something already begun came to exist).

The debug overlay gains a new `atlasGenesis` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-176 before it. Zero changes to AF-172's `HypothesisTracker`, AF-165's `InstitutionalMemoryTracker`/`INSTITUTIONAL_MEMORY_CATEGORIES`, AF-151's `KnowledgeGraph`, AF-155's `CyclicStageTracker`, AF-166's `IdentityRegistry`, AF-167's `EarnedTitleTracker`, AF-174's `HORIZON_CATEGORIES`, AF-170's `detectOverlap`, AF-135's `EvolvingEntry`, or any other locked module.

Score: 9.5/10 — approved and locked.
