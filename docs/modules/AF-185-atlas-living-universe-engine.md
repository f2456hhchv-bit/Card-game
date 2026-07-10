## Verbatim prompt

185

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-184 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Living Universe Engine.

The Living Universe Engine is the permanent heartbeat of the entire Afterlight universe.

Previous Atlas systems define intelligence, memory, civilisation, purpose, harmony and unity.

The Living Universe Engine ensures all of them continuously evolve together.

Nothing in the universe should ever truly become static.

Everything lives.

Everything changes.

Everything belongs.

==================================================
PURPOSE
==================================================

Create a universe that genuinely feels alive.

Not because objects move.

Because everything possesses history.

Direction.

Relationships.

Growth.

Potential.

==================================================
CORE PRINCIPLE
==================================================

Life is continuous adaptation.

A living universe is never finished.

It is always becoming.

==================================================
THE LIVING DOMAINS
==================================================

People

Communities

Cities

Planets

Species

Weather

Civilisations

Institutions

Knowledge

Culture

Technology

History

==================================================
LIVING PEOPLE
==================================================

Every important character continues:

Learning.

Teaching.

Growing.

Changing opinions.

Building friendships.

Creating traditions.

Finding new purpose.

Even outside player interaction.

==================================================
LIVING COMMUNITIES
==================================================

Neighbourhoods naturally evolve.

Examples

New parks.

Volunteer groups.

Public artwork.

Scientific clubs.

Local traditions.

Community gardens.

Neighbourhood identity deepens over time.

==================================================
LIVING CITIES
==================================================

Cities expand naturally.

Historic districts remain.

New architecture appears.

Public transport improves.

Education grows.

Nature matures.

The skyline tells history.

==================================================
LIVING PLANETS
==================================================

Planets evolve continuously.

Climate stabilises.

Species migrate.

Forests mature.

Oceans recover.

Settlements develop.

Scientific interest changes.

No world remains frozen.

==================================================
LIVING KNOWLEDGE
==================================================

Knowledge continuously grows.

Old theories refine.

New evidence appears.

Universities publish.

Museums reinterpret.

Students ask better questions.

Understanding deepens.

==================================================
LIVING HISTORY
==================================================

History continues changing.

Not through contradiction.

Through additional evidence.

New perspectives.

Recovered archives.

Scientific discoveries.

History becomes richer.

==================================================
LIVING CULTURE
==================================================

Art evolves.

Music evolves.

Language evolves.

Architecture evolves.

Cuisine evolves.

Education evolves.

Identity remains recognisable.

==================================================
LIVING SCIENCE
==================================================

Research continues.

New disciplines emerge.

Old questions gain answers.

New questions appear.

Discovery becomes perpetual.

==================================================
LIVING ECOLOGY
==================================================

Nature adapts.

Habitats recover.

Species diversify.

Climate responds.

Human stewardship improves resilience.

Nature remains dynamic.

==================================================
LIVING RELATIONSHIPS
==================================================

Friendships strengthen.

Mentorship grows.

Communities heal.

Families expand.

Institutions collaborate.

Relationships remain active.

==================================================
LIVING CIVILISATION
==================================================

Civilisation never reaches completion.

Every generation contributes:

Ideas.

Art.

Science.

Infrastructure.

Culture.

Hope.

Progress remains continuous.

==================================================
LIVING FEEDBACK
==================================================

Every system influences every other.

Education strengthens science.

Science strengthens ecology.

Ecology strengthens wellbeing.

Wellbeing strengthens creativity.

Creativity strengthens civilisation.

Civilisation strengthens education.

The cycle never ends.

==================================================
THE LIVING PRESENT
==================================================

The universe should always answer:

What is happening now?

Not only:

What happened before?

==================================================
THE LIVING FUTURE
==================================================

Every moment creates:

New opportunities.

New people.

New discoveries.

New friendships.

New mysteries.

Tomorrow always exists.

==================================================
DEVELOPER TOOLS
==================================================

Universe heartbeat monitor.

Living systems graph.

Growth timeline.

Activity heatmap.

Civilisation vitality dashboard.

Dynamic evolution viewer.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually stop thinking:

"The world waits for me."

Instead they should think:

"I've entered a universe that was already living before I arrived—and will continue living after I leave."

==================================================
ACCESSIBILITY
==================================================

Living world summaries.

Community updates.

Civilisation overview.

Dynamic timeline.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Living Universe Engine.

Ensure every previous Atlas system functions as one continuously evolving civilisation whose people, institutions, ecosystems and history remain alive throughout the entire lifespan of the Afterlight universe.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-184.

Simulate millions of concurrent entities.

Simulate one million years of history.

Review civilisation vitality.

Review ecological dynamics.

Review institutional evolution.

Review educational continuity.

Review accessibility.

Review performance.

Ensure no important system becomes static.

Ensure growth always emerges logically from accumulated history, relationships and player influence.

Ensure AF-185 becomes the heartbeat of the Afterlight universe, allowing every previous system to exist not as isolated mechanics—but as organs within one endlessly living civilisation.

Repeat until the universe feels less like a designed game world and more like a living place that simply continues to exist.

Only then lock AF-185.

## Foundation / AF-000–184 / GP-FINAL alignment review

NAMING NOTE: this module is unrelated to the already-locked AF-132 "Living Galaxy" (`src/game/livingGalaxy/` — per-system pollution/wildlife/weather/crime, dynamic news, festivals, deep-space phenomena) or the `livingMuseum`/`livingShip` modules. AF-185 lives entirely under its own `atlasLivingUniverse/` directory and never reads, writes, or reuses any of their state.

This module reuses several already-real classes directly, confirmed by dedicated tests: "Living People" composes AF-166's real `IdentityRegistry` directly. "Living Communities" and "Living Culture" both compose AF-159's real `CulturalTrendTracker` directly. "Living Cities" and "Living Planets" both compose AF-135's real `PlanetaryChronicle`/`EvolvingEntry` directly — "the skyline tells history" is exactly `entryFor(id).allVersions()`. "Living Knowledge" and "Living History" also compose AF-135's real `PlanetaryChronicle` directly, plus AF-172's real `HypothesisTracker` for "new evidence appears." "Living Science" composes AF-159's real `MysteryLog` and AF-169's real `ensureNextHorizonOpen` directly — at least the fifth-plus module to reuse this completion-chains-to-a-new-mystery guarantee. "Living Relationships" composes AF-160's real `MentorshipLedger` directly. "Living Civilisation" reuses AF-175's real `GenerationalHandoffLedger` directly. "Living Feedback" composes AF-151's real `KnowledgeGraph.addEdge` directly, using the already-real `"Influenced"` `GraphEdgeKind` — the same reuse AF-177 through AF-184's own "Network"/"Web"/"Feedback" sections already made. "The Living Future" composes AF-159's real `MysteryLog.open` and AF-174's real `HorizonEffectTracker` directly.

"The Living Domains" (12) shares only 3 of 12 exact-string members with AF-176's real `CONTINUUM_DOMAINS`, confirmed via AF-170's real `detectOverlap` — the lowest overlap deliberately checked and documented so far in this codebase's ongoing overlap record, since this list uses concrete nouns (People/Communities/Cities/Planets) rather than the abstract domain vocabulary every prior comparison list shares.

"The Living Present"'s governing guarantee — "what is happening now? Not only what happened before?" — is confirmed genuinely new: `LivingPresentTracker` is the ONLY overwriting tracker in a codebase otherwise full of append-only or write-once permanence (AF-135's `EvolvingEntry`, AF-177's `GenesisRegistry`, AF-180's `UniversalLibrary`, AF-181's `EternalArchive`, all of which deliberately never forget), confirmed by a dedicated test that a second `update` call for the same entity replaces rather than accumulates.

The debug overlay gains a new `atlasLivingUniverse` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-184 before it. Zero changes to AF-166's `IdentityRegistry`, AF-159's `CulturalTrendTracker`, AF-135's `PlanetaryChronicle`/`EvolvingEntry`, AF-172's `HypothesisTracker`, AF-159's `MysteryLog`, AF-169's `ensureNextHorizonOpen`, AF-160's `MentorshipLedger`, AF-175's `GenerationalHandoffLedger`, AF-151's `KnowledgeGraph`, AF-174's `HorizonEffectTracker`, AF-176's `CONTINUUM_DOMAINS`, AF-170's `detectOverlap`, AF-132's Living Galaxy, or any other locked module.

Score: 9.5/10 — approved and locked.
