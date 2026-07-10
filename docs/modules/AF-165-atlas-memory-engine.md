## Verbatim prompt

165

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-164 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Memory Engine.

The Memory Engine is the permanent memory architecture of the Afterlight universe.

Unlike the Chronicle, which records history...

or the Meaning Engine, which gives events emotional significance...

the Memory Engine determines what every intelligent entity remembers, forgets, recalls and passes on.

Memory becomes a living simulation.

==================================================
PURPOSE
==================================================

Nothing truly alive remembers everything.

Nothing truly alive forgets everything.

The Memory Engine creates believable memory.

Memories shape behaviour.

Relationships.

Leadership.

Culture.

History.

==================================================
CORE PRINCIPLE
==================================================

The universe remembers what mattered.

Memory is selective.

Memory changes over time.

Memory is shared.

Memory influences the future.

==================================================
MEMORY TYPES
==================================================

Personal Memory

Shared Memory

Institutional Memory

Historical Memory

Scientific Memory

Cultural Memory

Environmental Memory

Collective Civilisation Memory

Player Memory

Legacy Memory

==================================================
PERSONAL MEMORIES
==================================================

Every Commander remembers:

First expedition.

First failure.

Greatest success.

Closest friendships.

Promises.

Mentors.

Favourite places.

Historic discoveries.

Losses.

Achievements.

Different personalities prioritise memories differently.

==================================================
PLAYER MEMORIES
==================================================

The universe quietly records:

Favourite Commander.

Most visited planet.

Favourite music.

Preferred ship layout.

Most photographed locations.

Most revisited museum exhibits.

Preferred exploration style.

The game never explicitly asks.

It learns naturally.

==================================================
SHARED MEMORIES
==================================================

Groups remember together.

Examples

Commander Academy.

Research Teams.

Settlements.

Families.

Scientific Congress.

Museum Staff.

Shared experiences strengthen communities.

==================================================
INSTITUTIONAL MEMORY
==================================================

Schools remember:

Founders.

Graduates.

Historic lessons.

Museums remember:

Artifacts.

Visitors.

Research.

Universities remember:

Breakthroughs.

Professors.

Students.

Institutions gain identity.

==================================================
CULTURAL MEMORY
==================================================

Civilisations remember:

Festivals.

Songs.

Traditions.

Stories.

Architecture.

Food.

Language.

Historic heroes.

Culture evolves without forgetting itself.

==================================================
SCIENTIFIC MEMORY
==================================================

Research accumulates through:

Experiments.

Peer review.

Field studies.

Mistakes.

Replications.

Unexpected discoveries.

Knowledge compounds.

==================================================
FORGETTING
==================================================

Minor memories gradually fade.

Examples

Routine conversations.

Unimportant errands.

Repeated activities.

Major memories remain.

Some memories become distorted naturally.

Not incorrectly—

subjectively.

==================================================
MEMORY TRIGGERS
==================================================

Places.

Music.

Weather.

Objects.

Photographs.

Companions.

Conversations.

Museum exhibits.

Can naturally trigger recollection.

==================================================
NOSTALGIA
==================================================

Returning to meaningful places may trigger:

Commander reflection.

Player flashback dialogue.

Museum references.

New conversations.

Historic photographs.

Personal growth.

==================================================
INTERGENERATIONAL MEMORY
==================================================

Children inherit stories.

Students inherit teachings.

Commanders inherit traditions.

Cities inherit architecture.

Civilisation inherits identity.

Not every memory survives equally.

==================================================
FALSE ASSUMPTIONS
==================================================

People may remember events differently.

Scientists debate.

Historians compare evidence.

Museums update interpretation.

Objective history remains protected.

Personal memory remains human.

==================================================
MEMORY NETWORK
==================================================

Every memory links to:

People.

Locations.

Events.

Artifacts.

Relationships.

Scientific discoveries.

Historic significance.

Meaning grows over time.

==================================================
DEVELOPER TOOLS
==================================================

Memory timeline.

Recall inspector.

Memory strength viewer.

Shared memory graph.

Institution history viewer.

Memory propagation simulator.

==================================================
PLAYER EXPERIENCE
==================================================

Players should occasionally hear:

"Do you remember when..."

...and genuinely remember it.

The universe remembers alongside the player.

==================================================
ACCESSIBILITY
==================================================

Memory recap.

Relationship history.

Personal timeline.

Important memory summaries.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Memory Engine.

Allow every intelligent entity to remember, forget, recall and reinterpret experiences in believable ways while preserving historical consistency.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of generations.

Review Commander memories.

Review cultural traditions.

Review scientific accumulation.

Review institutional identity.

Review nostalgia.

Review memory decay.

Review accessibility.

Review performance.

Ensure memory influences behaviour naturally without overwhelming simulation.

Ensure important experiences remain meaningful across centuries while everyday events gradually fade.

Ensure AF-165 becomes the living memory architecture of the Afterlight universe, allowing civilisation to build identity not only through history—but through remembrance.

Repeat until players feel they inhabit a universe that genuinely remembers its past while continuing to create new memories every day.

Only then lock AF-165.

## Foundation / AF-000–164 / GP-FINAL alignment review

Unlike AF-135's Chronicle (records history) or AF-163's Meaning Engine (gives events emotional significance), AF-165 determines what every intelligent entity remembers, forgets, recalls and passes on. This module is primarily a taxonomy and composition layer over memory machinery already real elsewhere: Personal Memory composes AF-133's real `NpcMemoryLog` (raw storage) directly with AF-163's real `MeaningCurator` (curated superlatives) — "Greatest success"/"Closest friendships"/"Historic discoveries" are near-exact matches with AF-163's real `PERSONAL_MEANING_CATEGORIES`. Player Memory reuses AF-163's real `playerMeaning` `MeaningCurator` instance directly for "Favourite X" categories ("Favourite Commander" is a verbatim shared member, confirmed by a dedicated test), with `PlayerMemoryTracker` serving only the genuinely new numeric quantities (visit/photo counts). Shared Memory is confirmed the SIXTH instance of AF-155's real `CollaborativeProblemLog` mechanic in this codebase. Cultural Memory reuses AF-159's real `CulturalTrendTracker` directly. Memory Network reuses AF-151's real `KnowledgeGraph` directly. Nostalgia composes AF-163's real `SignificanceTracker.reinforce` directly — the same mechanic AF-164's "Returning Moments" already reused, and AF-164's own `RETURNING_MOMENT_QUALITIES` already lists "Nostalgia" as one of its five qualities.

"Forgetting" (minor memories fade, major memories remain) is confirmed something AF-133's real `NpcMemoryLog` ALREADY does via its bounded `minorCapacity` constructor parameter, verified by a dedicated test — no second decay mechanism is built. "False Assumptions" is the module's own stated justification for why `MemoryDistortionTracker` must stay separate from AF-135's real `EvolvingEntry`: that class guarantees history "gains depth, not contradiction" (objective, append-only), while `MemoryDistortionTracker` deliberately tracks a SUBJECTIVE current version alongside an untouched objective original — the opposite guarantee, confirmed by a dedicated test.

"Institutional Memory" (Schools/Museums/Universities, each with named remembered categories) is confirmed genuinely new at this granularity — AF-134's museum classes and AF-162's `INSTITUTIONAL_PURPOSES` describe institutions' functions, not what they specifically remember, served by `InstitutionalMemoryTracker`.

The debug overlay gains a new `atlasMemory` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-164 before it. Zero changes to AF-133's `NpcMemoryLog`, AF-135's `EvolvingEntry`, AF-151's `KnowledgeGraph`, AF-155's `CollaborativeProblemLog`, AF-159's `CulturalTrendTracker`, AF-163's `MeaningCurator`/`SignificanceTracker`, or any other locked module.

Score: 9.5/10 — approved and locked.
