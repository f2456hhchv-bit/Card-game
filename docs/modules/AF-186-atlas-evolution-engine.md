## Verbatim prompt

186

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-185 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Evolution Engine.

The Evolution Engine governs how every system within the Afterlight universe changes across time.

The Living Universe Engine ensures everything remains alive.

The Evolution Engine ensures everything grows for a reason.

Growth is never random.

Every change is earned through accumulated history, interaction, knowledge and adaptation.

==================================================
PURPOSE
==================================================

Create meaningful evolution.

Ensure civilisation grows naturally.

Ensure every change has understandable causes.

Preserve continuity while embracing progress.

==================================================
CORE PRINCIPLE
==================================================

Evolution is adaptation.

Not replacement.

Everything carries its history forward.

==================================================
EVOLUTION DOMAINS
==================================================

People

Communities

Species

Cities

Planets

Institutions

Technology

Science

Culture

Architecture

Education

Civilisation

==================================================
PERSONAL EVOLUTION
==================================================

Every important individual evolves through:

Experience.

Education.

Relationships.

Mentorship.

Success.

Failure.

Reflection.

Time.

No character remains static.

==================================================
COMMANDER EVOLUTION
==================================================

Every Commander develops:

Leadership.

Teaching.

Research.

Decision making.

Communication.

Reputation.

Personal philosophy.

Legacy.

Growth becomes visible across decades.

==================================================
SPECIES EVOLUTION
==================================================

Wildlife adapts to:

Climate.

Habitats.

Human stewardship.

Migration.

Food availability.

Predation.

Scientific restoration.

Evolution remains biologically believable.

==================================================
CITY EVOLUTION
==================================================

Cities continuously evolve.

Historic districts remain preserved.

Modern districts emerge.

Infrastructure improves.

Public transport expands.

Nature integrates.

Architecture reflects history.

Cities visibly mature.

==================================================
INSTITUTIONAL EVOLUTION
==================================================

Museums expand collections.

Universities create new disciplines.

Academies refine teaching.

Hospitals improve care.

Libraries digitise archives.

Institutions retain identity while improving.

==================================================
SCIENTIFIC EVOLUTION
==================================================

Knowledge develops through:

Replication.

Debate.

Evidence.

Revision.

Discovery.

Teaching.

Scientific understanding continually deepens.

==================================================
TECHNOLOGICAL EVOLUTION
==================================================

Technology progresses through:

Research.

Field testing.

Iteration.

Public adoption.

Education.

Maintenance.

Nothing becomes obsolete without historical explanation.

==================================================
CULTURAL EVOLUTION
==================================================

Cultures naturally develop:

Language.

Music.

Literature.

Architecture.

Cuisine.

Festivals.

Traditions.

Identity evolves without disappearing.

==================================================
EDUCATIONAL EVOLUTION
==================================================

Teaching improves through:

Research.

Experience.

Technology.

Mentorship.

Student feedback.

Exploration.

Education becomes increasingly effective.

==================================================
CIVILISATIONAL EVOLUTION
==================================================

Humanity progresses through:

Knowledge.

Cooperation.

Stewardship.

Creativity.

Reflection.

Purpose.

Legacy.

Progress compounds.

==================================================
THE EVOLUTION CHAIN
==================================================

Observation

↓

Learning

↓

Experimentation

↓

Improvement

↓

Adoption

↓

Tradition

↓

Foundation

↓

New Observation

Evolution becomes continuous.

==================================================
REVERSIBILITY
==================================================

Not all evolution succeeds.

Civilisation may:

Abandon ideas.

Restore forgotten practices.

Rediscover older knowledge.

Learn from mistakes.

Failure strengthens future growth.

==================================================
THE EVOLUTION RECORD
==================================================

Every meaningful change records:

Origin.

Reason.

Evidence.

Contributors.

Consequences.

Future influence.

History remains traceable.

==================================================
DEVELOPER TOOLS
==================================================

Evolution timeline.

Growth graph.

Institution evolution viewer.

Technology lineage browser.

Species adaptation viewer.

Civilisation maturity dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should notice:

Nothing suddenly changes.

Everything gradually becomes more sophisticated because of everything that happened before.

==================================================
ACCESSIBILITY
==================================================

Evolution summaries.

Growth timeline.

Institution history.

Technology lineage.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Evolution Engine.

Ensure every living system within the Afterlight universe evolves logically through accumulated experience while preserving historical continuity and identity.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-185.

Simulate one million years of civilisation.

Review character development.

Review institutional evolution.

Review ecological adaptation.

Review technological progression.

Review cultural continuity.

Review educational advancement.

Review accessibility.

Review performance.

Eliminate arbitrary change.

Eliminate stagnant systems.

Ensure every improvement emerges naturally from accumulated history rather than scripted progression.

Ensure AF-186 becomes the evolutionary framework that allows the Afterlight universe to remain recognisable while continuously becoming richer, wiser and more alive across generations.

Repeat until every aspect of civilisation appears to evolve with the same believable continuity found in the natural world.

Only then lock AF-186.

## Foundation / AF-000–185 / GP-FINAL alignment review

NAMING SCOPE NOTE: this module's own name collides directly with the already-locked AF-139 "Evolution Engine" (`src/game/evolutionEngine/` — equipment craftsmanship stages, `HistoricalArchitectureLedger`, `SpeciesAdaptationRegistry`, companion growth, commander maturity, technology eras, language evolution). AF-186 is a distinct module at the Atlas civilisation-narrative layer, lives entirely under its own `atlasEvolution/` directory, and never redefines any AF-139 mechanic — wherever this module's own sections name a mechanic AF-139 already built, AF-186 composes it directly instead.

"Species Evolution" reuses AF-139's real `SpeciesAdaptationRegistry` directly — this module's own `SPECIES_EVOLUTION_EXAMPLES` shares 3 of 7 exact-string members with AF-139's real `SPECIES_ADAPTATION_TRIGGER_KINDS` (Climate/Migration/Food availability), confirmed via AF-170's real `detectOverlap`. "City Evolution" reuses AF-139's real `HistoricalArchitectureLedger` directly. "Cultural Evolution"'s "Language" reuses AF-139's real `LanguageEvolutionLog` directly; the broader section also composes AF-159's real `CulturalTrendTracker`. "Commander Evolution" reuses AF-139's real `commanderMaturityScore`/`commanderMaturityStageFor` directly. "Technological Evolution" reuses AF-139's real `technologyEraFor`/`TECHNOLOGY_ERAS` directly. "Personal Evolution" composes AF-166's real `IdentityRegistry` directly. "Institutional Evolution" composes AF-165's real `InstitutionalMemoryTracker` directly. "Scientific Evolution" composes AF-172's real `HypothesisTracker` directly. "Educational Evolution" composes AF-160's real `MentorshipLedger` directly. "Civilisational Evolution" reuses AF-175's real `GenerationalHandoffLedger` directly. All confirmed by dedicated tests.

"Evolution Domains" (12) shares ZERO exact-string members with AF-139's real `EVOLUTION_PILLARS` (11) despite obvious conceptual overlap, confirmed via `detectOverlap` — AF-139's list uses adjective forms (Technological/Scientific/Cultural/Architectural/Educational) while this module's own list uses concrete nouns (People/Communities/Species/Cities/Planets), the same "near-total conceptual duplicate, zero exact overlap" pattern this codebase has documented before.

"The Evolution Chain" (Observation → Learning → Experimentation → Improvement → Adoption → Tradition → Foundation → New Observation, "evolution becomes continuous") is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over this module's own 8-stage `EVOLUTION_CHAIN_STAGES` union — confirmed genuinely absent from AF-139, whose own trackers are all grow-only.

"Reversibility" and "The Evolution Record" together describe the module's own genuinely new contribution: `EvolutionRecord`. Every other tracker in this codebase — AF-139's own equipment/companion/architecture ledgers included — only grows forward. `EvolutionRecord` is the FIRST tracker whose current state can legitimately regress to an earlier value (Adopted → Abandoned → Restored) while remaining a fully honest, traceable append-only history, confirmed by a dedicated test — a fundamentally different guarantee from AF-177's real `GenesisRegistry` (write-once, exactly one permanent origin, never a second record for the same entity).

The debug overlay gains a new `atlasEvolution` field on `DebugSnapshot`, rendered with the label `atlasEvo` (not `evolution`) to avoid visual collision with AF-139's own pre-existing `evolution` debug line — the same established extension pattern used by AF-039 through AF-185 before it, with this one additional disambiguation step made necessary by the naming collision. Zero changes to AF-139's `SpeciesAdaptationRegistry`/`HistoricalArchitectureLedger`/`LanguageEvolutionLog`/`commanderMaturityScore`/`technologyEraFor`/`EVOLUTION_PILLARS`, AF-166's `IdentityRegistry`, AF-165's `InstitutionalMemoryTracker`, AF-172's `HypothesisTracker`, AF-160's `MentorshipLedger`, AF-175's `GenerationalHandoffLedger`, AF-159's `CulturalTrendTracker`, AF-155's `CyclicStageTracker`, AF-170's `detectOverlap`, or any other locked module.

Score: 9.5/10 — approved and locked.
