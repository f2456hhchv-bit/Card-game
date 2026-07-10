## Verbatim prompt

148

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-147 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Canon Engine.

The Canon Engine governs every piece of lore, dialogue, timeline, relationship, historical event and future expansion.

Its purpose is to guarantee that Afterlight remains internally consistent across decades of development.

Players should never encounter contradictory history.

The universe should feel as though it has always existed.

==================================================
CORE PHILOSOPHY
==================================================

Canon is living history.

History grows.

It is never rewritten without reason.

New discoveries reveal additional truth.

They do not invalidate previous truth.

==================================================
CANON PYRAMID
==================================================

Level One

Core Timeline

Cannot be contradicted.

Level Two

Campaign Events

Player choices become personal canon.

Level Three

Historical Records

May expand through discoveries.

Level Four

Museum Interpretation

May evolve through research.

Level Five

Academic Debate

Multiple viewpoints allowed.

Level Six

Legends & Folklore

May be inaccurate intentionally.

==================================================
HISTORICAL CONSISTENCY
==================================================

Every event stores:

Date

Participants

Planet

Galaxy

Commanders

Witnesses

Evidence

Museum references

Chronicle references

Relationship impact

Future callbacks

==================================================
KNOWLEDGE STATES
==================================================

Every historical event exists in three forms.

Objective Reality

What truly happened.

Historical Understanding

What civilisation currently believes.

Public Knowledge

What ordinary citizens know.

These may differ.

==================================================
DISCOVERY MODEL
==================================================

Ancient discoveries never overwrite canon.

Instead they:

Expand context.

Reveal hidden motivations.

Recover missing records.

Clarify misconceptions.

Introduce forgotten witnesses.

==================================================
LORE VALIDATION
==================================================

Every future story automatically checks:

Timeline conflicts

Character consistency

Planet history

Commander relationships

Scientific plausibility

Historical references

Museum integration

Chronicle compatibility

Expansion dependencies

==================================================
COMMANDER CONTINUITY
==================================================

Every Commander permanently tracks:

Birth

Education

Career

Relationships

Major missions

Public reputation

Private memories

Museum history

Retirement

Legacy

Nothing contradicts earlier records.

==================================================
PLANET CONTINUITY
==================================================

Every world tracks:

Discovery

Settlement

Wars

Ecological changes

Governments

Scientific advances

Population growth

Architecture

Major disasters

Historic landmarks

==================================================
ARTIFACT AUTHENTICITY
==================================================

Recovered artifacts include:

Provenance

Ownership chain

Restoration history

Scientific analysis

Museum location

Authenticity confidence

Public interpretation

==================================================
ACADEMIC EVOLUTION
==================================================

Historians may revise understanding.

Examples

New evidence discovered.

Translation corrected.

Ancient map restored.

Lost journal recovered.

History evolves naturally.

Facts remain coherent.

==================================================
MULTIPLE PERSPECTIVES
==================================================

Major historical events include:

Explorer accounts

Engineer accounts

Civilian recollections

Scientific records

Military reports

Commander journals

Children's recollections

History becomes richer.

==================================================
TIMELINE PROTECTION
==================================================

No future expansion may:

Erase existing history.

Invalidate player achievements.

Remove Commander growth.

Break relationships.

Undo civilisation progress.

Expansion always builds forward.

==================================================
FUTURE DISCOVERIES
==================================================

Hidden archives may reveal:

Unknown expeditions.

Lost colonies.

Forgotten inventions.

Ancient friendships.

Unfinished megaprojects.

New information complements earlier lore.

==================================================
CANON TOOLS
==================================================

Developer systems include:

Timeline Validator

Relationship Validator

Lore Graph

Chronology Explorer

Canon Conflict Detector

Dialogue Consistency Checker

Historical Dependency Viewer

==================================================
PLAYER EXPERIENCE
==================================================

Players should frequently experience:

"Oh...

That explains what we discovered fifty hours ago."

Small discoveries gradually illuminate much larger mysteries.

==================================================
ACCESSIBILITY
==================================================

Timeline search.

Relationship browser.

Lore summaries.

Chronological mode.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Canon Engine.

Ensure every existing and future piece of Afterlight lore remains internally consistent while allowing history to deepen naturally through discovery.

==================================================
SELF REVIEW LOOP
==================================================

Simulate hundreds of expansions.

Review every historical record.

Validate every Commander.

Validate every planet.

Validate every relationship.

Validate every museum exhibit.

Validate every Chronicle entry.

Resolve contradictions through additional context rather than retcons whenever possible.

Ensure the Atlas Canon Engine enables one of the most coherent and believable fictional histories ever created while preserving player agency and long-term narrative flexibility.

Repeat until every future addition strengthens rather than fragments the Afterlight universe.

Only then lock AF-148.

## Foundation / AF-000–147 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138 through AF-147) found this module composes far more directly with real AF-133/134/135 classes than the previous four franchise-governance modules did — this is a genuine consistency/validation engine over lore that already has real storage to extend, not just design philosophy to restate. Confirmed already real, reused directly: "Discovery Model" is fully implemented by AF-135's real `EvolvingEntry` (confirmed no mutate/delete method exists on the class); "Multiple Perspectives" reuses AF-135's real `AuthorVoice` union directly rather than adding a third overlapping perspective union (a second real union, `PerspectiveKind`, already exists with different membership and is never touched); "Planet Continuity" composes AF-135's real `PlanetaryChronicle` via its existing `write()` method.

Confirmed genuinely new: `CanonEventLedger`'s event shape (date/participants/planet/galaxy/commanders/witnesses/evidence/museum+chronicle references/relationship impact/future callbacks) is materially richer than AF-133's real `OfficialHistoricalRecord`, which has no witnesses/evidence fields — it optionally forwards a summary into that real, locked log via the same `forwardTo` pattern AF-133 itself established for reaching into AF-086. `KnowledgeStateTracker` implements the three-form event model with Objective Reality genuinely enforced-immutable (throws on contradiction, a real structural invariant matching Canon Pyramid Level One, not just documentation), Historical Understanding reusing `EvolvingEntry`, and Public Knowledge freely mutable. `CommanderContinuityLedger` is materially richer than AF-135's real `commanderHistoryFor`, confirmed to be a thin numeric aggregate with zero biographical fields. `ArtifactAuthenticityRegistry` is confirmed genuinely absent — AF-134's `GiftLedger`/`RestorationLab` never track provenance or authenticity confidence. `expansionRespectsTimeline` is a real semantic non-invalidation gate, confirmed genuinely new since AF-070's `LiveOpsRegistry` and AF-142's `ModuleRegistry` both only guard against id collisions. `canonPyramidRank` mirrors AF-147's real `canonTierRank` indexOf pattern but governs a different axis (in-fiction narrative-layer authority vs. real-world media source authority) — its own separate union, never importing AF-147's `CanonTier`. `loreValidationReport` composes plain boolean signals per the AF-137 `tierWeightsFor` decoupling discipline; only 2-3 of AF-095's real 7 `LORE_VALIDATION_CHECKS` have any existing backing, confirmed by direct citation.

"Canon Tools" is kept as pure reference data — `KnowledgeStateTracker.hasDiverged`/`expansionRespectsTimeline` collectively are the real Canon Conflict Detector/Timeline Validator, so no separate, redundant interactive tool was built.

The debug overlay gains a new `canonEngine` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-147 before it. Zero changes to AF-133's `GalacticHistoryLog`, AF-134's `GiftLedger`/`RestorationLab`, AF-135's `EvolvingEntry`/`AuthorVoice`/`PlanetaryChronicle`, AF-147's `CanonAuthorityResolver`, or any other locked module.

Score: 9.5/10 — approved and locked.
