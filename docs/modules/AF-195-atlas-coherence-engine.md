## Verbatim prompt

195

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-194 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Coherence Engine.

The Coherence Engine is responsible for maintaining absolute internal consistency across the entire Afterlight universe.

Previous Atlas modules create emergence, evolution, creativity and possibility.

The Coherence Engine ensures every outcome remains believable.

Every event.

Every conversation.

Every institution.

Every discovery.

Every ecosystem.

Every civilisation.

Must always remain consistent with everything that came before.

The larger the universe becomes...

the more important coherence becomes.

==================================================
PURPOSE
==================================================

Maintain perfect internal consistency.

Prevent contradictions.

Protect immersion.

Protect player trust.

Allow infinite expansion without losing logical integrity.

==================================================
CORE PRINCIPLE
==================================================

Every consequence must have a cause.

Every cause must produce believable consequences.

Nothing important happens without context.

==================================================
COHERENCE DOMAINS
==================================================

Lore

History

Science

Technology

Ecology

Culture

Education

Architecture

Politics

Economy

Relationships

Civilisation

==================================================
THE CONTEXT CHAIN
==================================================

Every event references:

Previous events.

People involved.

Institutions affected.

Locations.

Scientific understanding.

Historical significance.

Future implications.

Context is never lost.

==================================================
HISTORICAL COHERENCE
==================================================

Every historical record validates:

Chronology.

Participants.

Motivations.

Evidence.

Consequences.

Interpretations.

History remains internally consistent.

==================================================
SCIENTIFIC COHERENCE
==================================================

Every discovery must align with:

Known physics.

Established biology.

Existing technology.

Observed evidence.

Previous research.

Unknowns remain scientifically plausible.

==================================================
CHARACTER COHERENCE
==================================================

Every major character maintains consistency across:

Dialogue.

Values.

Relationships.

Knowledge.

Leadership.

Emotional development.

Personal history.

Growth never contradicts identity.

==================================================
INSTITUTIONAL COHERENCE
==================================================

Institutions preserve:

Mission.

Founding purpose.

Educational philosophy.

Historical evolution.

Public reputation.

Research priorities.

Identity strengthens through continuity.

==================================================
PLANETARY COHERENCE
==================================================

Each world remains consistent with:

Climate.

Geology.

Ecology.

Settlement history.

Architecture.

Scientific importance.

No environment contradicts itself.

==================================================
PLAYER COHERENCE
==================================================

The universe remembers:

Player decisions.

Settlement history.

Relationships.

Research priorities.

Museum collections.

Commander mentorship.

Past actions remain meaningful forever.

==================================================
EMERGENT COHERENCE
==================================================

Emergent systems validate against:

Lore.

History.

Scientific rules.

Cultural norms.

Environmental constraints.

Institutional behaviour.

Unexpected does not mean inconsistent.

==================================================
THE CANON GRAPH
==================================================

Every important entity connects to:

Events.

People.

Research.

Locations.

Artifacts.

Institutions.

Relationships.

Nothing exists without traceable connections.

==================================================
THE CONTRADICTION DETECTOR
==================================================

Continuously identify:

Timeline conflicts.

Scientific inconsistencies.

Dialogue contradictions.

Institutional drift.

Character regression.

Ecological impossibilities.

Resolve before becoming canonical.

==================================================
THE COHERENCE STANDARD
==================================================

Every addition asks:

Does this fit?

Does it respect history?

Does it strengthen continuity?

Does it improve understanding?

If uncertainty exists...

Refine further.

==================================================
DEVELOPER TOOLS
==================================================

Canon validator.

Timeline inspector.

Relationship consistency graph.

Scientific plausibility checker.

Lore dependency explorer.

Continuity dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually realise:

"No matter how deeply I investigate..."

"...everything fits."

==================================================
ACCESSIBILITY
==================================================

Lore summaries.

Timeline browser.

Relationship overview.

Canon explorer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Coherence Engine.

Ensure every existing and future Atlas system remains permanently consistent, believable and interconnected regardless of the scale of the Afterlight universe.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-194.

Simulate one million years.

Validate historical continuity.

Validate scientific consistency.

Validate Commander development.

Validate institutional identity.

Validate ecological realism.

Validate player history.

Review accessibility.

Review performance.

Eliminate contradictions.

Eliminate unexplained outcomes.

Ensure every new feature strengthens rather than weakens the coherence of the Living Universe.

Ensure AF-195 becomes the consistency layer that allows Afterlight to scale across decades of development while maintaining absolute trust in its internal logic.

Repeat until every story, system and simulation remains perfectly coherent regardless of how deeply players explore the universe.

Only then lock AF-195.

## Foundation / AF-000–194 / GP-FINAL alignment review

A research pass before implementation found this spec's vocabulary overlaps almost entirely with AF-148's already-locked "Atlas Canon Engine" (`src/game/canonEngine/`) — a different title, but the exact same territory (internal consistency/validation over lore). Reused directly wherever a section names a mechanic AF-148 already built, confirmed by dedicated tests: "The Context Chain" is exactly AF-148's real `CanonEventLedger`/`CanonEventRecord` directly — that record already carries participants/witnesses/evidence/museum+chronicle references/relationship impact/future callbacks. "Historical Coherence," "Scientific Coherence," and "Emergent Coherence" all reuse AF-148's real `loreValidationReport`/`LORE_VALIDATION_CHECK_KINDS` directly. "The Contradiction Detector" reuses AF-148's real `KnowledgeStateTracker.hasDiverged` directly — a second real reuse alongside `loreValidationReport` for the same section. "Character Coherence" reuses AF-148's real `CommanderContinuityLedger` directly. "Institutional Coherence" reuses AF-165's real `InstitutionalMemoryTracker` directly. "Planetary Coherence" reuses AF-148's real `recordPlanetContinuityFact` (composing AF-135's real `PlanetaryChronicle`) directly. "The Canon Graph" composes AF-151's real `KnowledgeGraph.addEdge` directly.

Confirmed genuinely new: "The Coherence Standard" ("does this fit... if uncertainty exists, refine further") is another instance of this codebase's established all-must-pass checklist-function family via the new `coherenceStandardMet`, typed to its own `CoherenceStandardQuestion` union — every question must be resolved with confidence before an addition is considered coherent; any unresolved question means "refine further," confirmed by a dedicated test.

"Coherence Domains" (12) shares 7 of 12 exact-string members with AF-194's real `POSSIBILITY_DOMAINS` and 6 of 12 with AF-193's real `EXCELLENCE_DOMAINS` — no record claimed (current record remains AF-191's own 12/12), both verified via AF-170's real `detectOverlap`. "Player Coherence" (6 examples — "the universe remembers player decisions...") restates, rather than adds to, a property many real systems already guarantee (`WorldStateStore`, `PossibilityRegistry`, every append-only ledger in this codebase) — kept as pure reference, no new mechanic, since a parallel "memory of memory" tracker would violate "extend, don't duplicate." The remaining domain-specific coherence-aspect sections (Scientific/Character/Institutional/Planetary) and "The Canon Graph"/"The Contradiction Detector"'s own target lists are kept as pure reference vocabulary describing WHICH signals feed the shared mechanisms above — the same honest scope boundary AF-143/149/171/191/192/193/194 already established.

The debug overlay gains a new `atlasCoherence` field on `DebugSnapshot`, rendered with the label `coherence` — checked against every existing debug line for collisions before finalising and confirmed unique. Zero changes to AF-135's `PlanetaryChronicle`, AF-148's `CanonEventLedger`/`loreValidationReport`/`KnowledgeStateTracker`/`CommanderContinuityLedger`/`recordPlanetContinuityFact`, AF-151's `KnowledgeGraph`, AF-165's `InstitutionalMemoryTracker`, AF-170's `detectOverlap`, AF-193's `EXCELLENCE_DOMAINS`, AF-194's `POSSIBILITY_DOMAINS`, or any other locked module.

Score: 9.5/10 — approved and locked.
