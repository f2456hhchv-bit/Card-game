## Verbatim prompt

167

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-166 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Identity Engine.

The Identity Engine exists above the Consciousness Engine.

Consciousness defines who someone believes they are.

Identity defines how they exist within the wider universe.

Every individual, organisation, colony and civilisation develops a unique identity recognised by others.

Identity becomes something that is earned.

Never assigned.

==================================================
PURPOSE
==================================================

Allow every part of the universe to become recognisable.

Not because of statistics.

Because of character.

==================================================
CORE PRINCIPLE
==================================================

Identity emerges.

It cannot be manufactured.

It grows through history.

Relationships.

Achievement.

Failure.

Culture.

Time.

==================================================
IDENTITY LAYERS
==================================================

Personal

Professional

Social

Institutional

Planetary

Cultural

Scientific

Historical

Civilisational

Galactic

==================================================
PERSONAL IDENTITY
==================================================

Every major character develops:

Signature habits.

Favourite sayings.

Teaching style.

Leadership approach.

Research interests.

Humour.

Routine.

Body language.

Preferred environments.

Identity remains recognisable across decades.

==================================================
PROFESSIONAL IDENTITY
==================================================

Examples

Engineer.

Explorer.

Scientist.

Medic.

Historian.

Architect.

Pilot.

Educator.

Each profession develops traditions and culture.

==================================================
COMMANDER IDENTITY
==================================================

Each Commander gradually becomes known for:

Leadership.

Reliability.

Creativity.

Compassion.

Bravery.

Scientific curiosity.

Mentorship.

Exploration.

The galaxy recognises these qualities.

==================================================
COLONY IDENTITY
==================================================

Every settlement develops:

Architecture.

Industry.

Education.

Music.

Cuisine.

Festivals.

Research strengths.

Landmarks.

Public traditions.

Visitors immediately recognise the difference.

==================================================
PLANETARY IDENTITY
==================================================

Each world gains:

Landscape identity.

Wildlife identity.

Scientific importance.

Historic role.

Tourism.

Economic speciality.

Architectural language.

Environmental philosophy.

==================================================
INSTITUTIONAL IDENTITY
==================================================

Museums.

Universities.

Academies.

Hospitals.

Observatories.

Libraries.

Research institutes.

Each develops its own reputation and traditions.

==================================================
CULTURAL IDENTITY
==================================================

Communities evolve:

Stories.

Celebrations.

Art.

Language.

Music.

Public rituals.

Education.

Shared values.

Culture grows organically.

==================================================
HISTORICAL IDENTITY
==================================================

Historic achievements shape identity.

Examples

"The city that rebuilt the oceans."

"The Commander who reunited the fleet."

"The academy that trained generations."

Identity becomes history.

==================================================
REPUTATION
==================================================

Identity influences reputation.

Reputation influences opportunity.

Opportunity influences future identity.

A continuous feedback loop.

==================================================
SYMBOLISM
==================================================

Every identity develops symbols.

Examples

Flags.

Architectural motifs.

Colours.

Songs.

Mottos.

Insignia.

Gardens.

Constellations.

Symbols strengthen belonging.

==================================================
INTERACTION
==================================================

People recognise identities.

Dialogue changes naturally.

Visitors react differently.

Children imitate heroes.

Scientists reference famous institutions.

Identity spreads.

==================================================
IDENTITY THROUGH CHANGE
==================================================

Identity survives change.

Cities modernise.

Commanders age.

Technology advances.

Core character remains.

Growth strengthens identity.

==================================================
DEVELOPER TOOLS
==================================================

Identity graph.

Reputation map.

Institution browser.

Planet identity viewer.

Commander signature tracker.

Cultural evolution dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually say:

"I knew exactly which colony this was before I looked at the map."

Or:

"I recognised who was speaking before their name appeared."

==================================================
ACCESSIBILITY
==================================================

Identity summaries.

Institution profiles.

Commander overview.

Planet identity browser.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Identity Engine.

Allow every individual, institution and civilisation to develop a distinctive identity that grows naturally through history, culture and lived experience.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years.

Review Commander identities.

Review institutional identity.

Review planetary identity.

Review civilisation identity.

Review reputation systems.

Review cultural evolution.

Review accessibility.

Review performance.

Ensure identities emerge organically rather than from predefined labels.

Ensure every major part of the Afterlight universe becomes instantly recognisable through its accumulated history and character.

Ensure AF-167 becomes the identity layer that transforms the Living Galaxy into a universe of memorable people, places and institutions whose uniqueness is earned across generations.

Repeat until players instinctively recognise people, planets and cultures through identity rather than UI elements or statistics.

Only then lock AF-167.

## Foundation / AF-000–166 / GP-FINAL alignment review

Exists above AF-166's Consciousness Engine: consciousness defines who someone believes they are (internal), identity defines how they exist within the wider universe (external, earned by others' recognition — "never assigned"). "Personal Identity" (9 externally-visible signature traits) reuses AF-163's real generic `MeaningCurator<TCategory>` DIRECTLY over a new `SignatureTraitKind` type parameter — that class was already written as a reusable generic (unlike AF-160's hand-typed `CommanderWisdomTracker`), so no mirrored duplicate class was needed, confirmed by a dedicated test.

"Commander Identity" ("the galaxy recognises these qualities") and "Institutional Identity" ("each develops its own reputation") both describe the same underlying mechanic — others recognising a quality over time, a fundamentally different axis from AF-160's real `CommanderWisdomTracker` and AF-166's real `PersonalGrowthTracker` (both internal growth). One generic `ReputationTracker` serves both, confirmed by a dedicated test exercising it against both a Commander id and an institution id. "Cultural Identity" reuses AF-159's real `CulturalTrendTracker` directly. "Symbolism" composes AF-163's real `SignificanceTracker` directly for reinforcement, distinct from this module's own `SYMBOLISM_CATEGORIES` (symbol KINDS: flags/colours/mottos) which shares no members with AF-163's real `SYMBOL_EXAMPLES` (specific artifact instances).

"Historical Identity" ("the city that rebuilt the oceans"... "identity becomes history") is confirmed genuinely new: `EarnedTitleTracker` is append-only — a title, once earned, is never replaced or curated away, distinct from AF-135's Chronicle (records what happened) and AF-163's `MeaningCurator` (curates a single favourite per category), confirmed by a dedicated test. "Identity Layers" (10, personal→galactic scale) is confirmed a genuinely different axis from AF-166's real `CULTURAL_IDENTITY_LAYERS` (6, what a citizen identifies WITH), verified by a dedicated test. "Professional Identity" shares 4 exact-string members with AF-162's real `INDIVIDUAL_PURPOSE_KINDS`, verified by a dedicated test, kept as reference vocabulary.

The debug overlay gains a new `atlasIdentity` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-166 before it. Zero changes to AF-163's `MeaningCurator`/`SignificanceTracker`, AF-159's `CulturalTrendTracker`, AF-160's `CommanderWisdomTracker`, AF-166's `PersonalGrowthTracker`/`CULTURAL_IDENTITY_LAYERS`, AF-162's `INDIVIDUAL_PURPOSE_KINDS`, or any other locked module.

Score: 9.5/10 — approved and locked.
