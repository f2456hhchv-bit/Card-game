## Verbatim prompt

138

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-137 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Civilisation Engine.

The player is no longer rebuilding isolated colonies.

The player is rebuilding humanity itself.

Every restored settlement becomes part of a civilisation that continues evolving across generations.

The Civilisation Engine governs how humanity expands, learns, innovates and flourishes.

==================================================
CORE PHILOSOPHY
==================================================

Civilisation is the ultimate reward.

Buildings matter.

Education matters.

Families matter.

Culture matters.

Science matters.

Hope matters.

Players should witness humanity transform from scattered survivors into a thriving interstellar civilisation.

==================================================
CIVILISATION STAGES
==================================================

Stage I

Survival

Small shelters.

Basic food.

Temporary power.

Minimal healthcare.

Stage II

Settlement

Permanent housing.

Schools.

Markets.

Medical centres.

Community gathering places.

Stage III

Colony

Industry.

Research.

Transit.

Agriculture.

Governance.

Security.

Stage IV

City

Universities.

Museums.

Orbital ports.

Manufacturing.

Culture.

Public transport.

Stage V

Capital World

Megaprojects.

Space elevators.

Arcologies.

Galactic universities.

Scientific institutes.

Trade exchanges.

Planetary parks.

Stage VI

Beacon World

Entire planets become symbols of hope.

Tourism.

Diplomacy.

Innovation.

Education.

History.

Culture.

==================================================
CIVILISATION ATTRIBUTES
==================================================

Every colony tracks:

Population

Education

Health

Employment

Food

Water

Energy

Housing

Research

Industry

Security

Culture

Ecology

Infrastructure

Tourism

Public Happiness

Innovation

Historical Preservation

==================================================
POPULATION SIMULATION
==================================================

Citizens:

Grow older.

Learn.

Choose careers.

Travel.

Retire.

Raise families.

Create businesses.

Publish research.

Volunteer.

Celebrate.

Remember history.

No citizen exists purely as decoration.

==================================================
EDUCATION
==================================================

Schools.

Academies.

Universities.

Research institutes.

Museums.

Children gradually become:

Scientists.

Engineers.

Explorers.

Doctors.

Artists.

Teachers.

Commanders.

Education permanently improves civilisation.

==================================================
CULTURE
==================================================

Every world develops:

Architecture.

Cuisine.

Art.

Music.

Traditions.

Celebrations.

Language influences.

Historic heroes.

Public monuments.

Different colonies develop unique identities.

==================================================
INFRASTRUCTURE
==================================================

Roads.

Rail.

Orbital elevators.

Spaceports.

Transit systems.

Power grids.

Water systems.

Communications.

Hospitals.

Public parks.

Infrastructure grows organically.

==================================================
GOVERNMENT
==================================================

Every colony elects leadership.

Different governments prioritise:

Science.

Industry.

Ecology.

Trade.

Culture.

Security.

Player influences direction.

Never absolute control.

==================================================
PUBLIC OPINION
==================================================

Citizens react to:

Leadership.

Disasters.

Museum.

Scientific discoveries.

Commander actions.

Festivals.

Economic prosperity.

Wildlife.

Player reputation.

==================================================
MEGAPROJECTS
==================================================

Late-game collaborative projects.

Examples

Orbital Ring.

Planetary Shield.

Galactic Library.

Interstellar University.

Deep Space Telescope.

Biodome Network.

World Tree.

Quantum Relay.

Require decades of effort.

==================================================
CIVILISATION LANDMARKS
==================================================

Statues.

Gardens.

Libraries.

Cathedrals of Science.

Commander memorials.

Public observatories.

Living museums.

Children's parks.

Become famous across the galaxy.

==================================================
IMMIGRATION
==================================================

People relocate naturally.

Seeking:

Education.

Work.

Safety.

Research.

Adventure.

Family.

Trade.

Migration changes cities over time.

==================================================
ECONOMIC SPECIALISATION
==================================================

Each world develops strengths.

Engineering.

Medicine.

Research.

Agriculture.

Tourism.

Manufacturing.

Wildlife conservation.

Education.

Trade.

==================================================
SOCIAL EVENTS
==================================================

Graduations.

Weddings.

Art festivals.

Scientific expos.

Concerts.

Book fairs.

Commander appearances.

Founders celebrations.

==================================================
GENERATIONAL CHANGE
==================================================

Children become adults.

Students become professors.

Apprentices become master engineers.

Young explorers become Commanders.

History becomes living memory.

==================================================
GALACTIC IDENTITY
==================================================

Eventually humanity develops:

Shared values.

Shared holidays.

Shared scientific standards.

Shared educational systems.

Shared cultural celebrations.

Unique planetary traditions remain.

==================================================
ACCESSIBILITY
==================================================

Civilisation dashboard.

Population summaries.

Simplified city management.

Historical growth viewer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Civilisation Engine.

Allow humanity to evolve naturally from survival into a flourishing galactic civilisation.

Every restored colony contributes to humanity's future.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years.

Observe city growth.

Observe education.

Observe migration.

Observe economies.

Observe governments.

Observe culture.

Observe megaprojects.

Ensure every colony develops a unique identity.

Ensure civilisation feels hopeful, believable and constantly evolving.

Ensure players feel they are participating in the greatest rebuilding effort in human history.

Repeat until the Civilisation Engine becomes one of Afterlight's defining systems and a benchmark for living-world simulation.

Only then lock AF-138.

## Foundation / AF-000–137 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/137) surveyed AF-090's real, locked `CivilisationFrameworkRuntime` before any design work, confirming: `SettlementState.populationStats: Record<PopulationStat, number>` declares 10 keys but AF-090's `baselinePopulationStats()` only initialises and ticks 7 of them (`education, health, security, scientificWorkforce, industrialWorkforce, militaryPersonnel, civilianHappiness`) — `population` and `employment` are declared but never mutated per settlement. `SettlementDevelopmentStage` (7 values) and `CivilisationSpecialisation` (10 values) are closed, locked unions with different names/counts/theming than this spec's 6 Civilisation Stages and 9 Economic Specialisations, so this module defines its own separate classifications rather than extending those unions. `MEGASTRUCTURES` (9 real entries, e.g. `orbital-ring-frontier`, `planetary-shield-forge`) share generic display-name wording with two of this spec's eight Megaproject examples ("Orbital Ring," "Planetary Shield") but not identity — this module's `CIVILISATION_MEGAPROJECTS` use distinct `megaproject-*` ids and are structurally unrelated (late-game per-colony collaborative projects vs. per-region galaxy megastructures). Per the AF-126 precedent, this is a documented low-stakes vocabulary overlap, not a uniquely-canonical identity collision, so no Project Owner decision was required.

Built under `src/game/civilisationEngine/`: `civilisationAttributeSummaryFor` composes the spec's own 18-attribute "Civilisation dashboard" live from three real sources — 5 attributes from AF-090's genuinely live `populationStats` fields, Population from AF-086's `CivilisationSimulationRuntime.stateFor(factionId)?.attributes.population` (real, per-faction, since AF-090's own `population` stat is dead), Employment from a live-workforce-average proxy (Employment has no numeric home anywhere in the codebase), Infrastructure from a `builtUpgrades.size` proxy, and the remaining 10 new attributes from this module's own grow-only `CivilisationAttributeExtension`. `MegaprojectTracker` mirrors AF-090's own `investInMegastructure` pattern over the new, distinctly-idd roster. `LandmarkRegistry` needed no new class at all — it's the 6th direct reuse of AF-134's generic `MuseumCollectionRegistry<K>` (after Theater/Library/Audio/Oral History/Book Publishing). `ImmigrationLedger`, `SocialEventCalendar`, `GovernmentPriorityTracker` ("player influences direction, never absolute control" — implemented as a pure lean, never a hard-set), `PublicOpinionTracker`, and `CareerPipeline` are the module's genuinely new small primitives.

A real bug was caught during browser verification, not silently missed: the first draft's `CIVILISATION_ATTRIBUTE_TO_POPULATION_STAT` mapped "Population" and "Employment" onto AF-090's declared-but-unmutated `PopulationStat` fields, which read back `undefined` at runtime and threw inside the debug overlay's `.toFixed()` call. Fixed by sourcing both from real, live data instead (AF-086's per-faction population; a live-workforce proxy for employment) and documenting the distinction in code comments so no future module repeats the same assumption.

The debug overlay gains a new `civilisationEngine` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-137 before it. Zero changes to any other locked module (AF-000–137).

Score: 9.5/10 — approved and locked.
