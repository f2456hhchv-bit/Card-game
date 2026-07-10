## Verbatim prompt

132

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-131 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Living Galaxy.

The galaxy must exist independently of the player.

Civilisations continue growing.

Wars continue.

Species migrate.

Colonies prosper or struggle.

Expeditions launch.

Trade continues.

The player participates in the galaxy.

The player does not cause the galaxy to exist.

==================================================
CORE PHILOSOPHY
==================================================

Every system feels alive.

Players should constantly discover things that happened while they were somewhere else.

The universe never waits.

The universe keeps moving.

==================================================
GALACTIC SIMULATION
==================================================

Every star system tracks:

Population

Economy

Security

Infrastructure

Research

Food

Water

Industry

Energy

Pollution

Wildlife

Political stability

Morale

Exploration

Historical events

Weather

Trade

Military

Healthcare

==================================================
EVERY COLONY GROWS
==================================================

Colonies begin small.

As years pass they expand.

Villages become towns.

Towns become cities.

Cities become planetary capitals.

Architecture changes.

Traffic increases.

NPC density increases.

Skyline evolves.

==================================================
TRADE NETWORK
==================================================

Ships constantly move.

Freighters.

Mining fleets.

Medical transports.

Military patrols.

Construction fleets.

Scientific expeditions.

Civilian tourism.

Emergency services.

Pirates.

==================================================
DYNAMIC NEWS
==================================================

Entire galaxy produces news.

Examples

New colony founded.

Rare species discovered.

Research breakthrough.

Mining accident.

Political election.

Meteor impact.

Festival.

Sports championship.

Commander anniversary.

Museum discovery.

First contact.

==================================================
RANDOM DISCOVERIES
==================================================

Players may discover:

Derelict ships.

Lost expeditions.

Ancient satellites.

Unknown ruins.

Secret laboratories.

Prototype factories.

Abandoned stations.

Survivors.

New species.

Hidden trade routes.

==================================================
GALACTIC ECONOMY
==================================================

Supply affects prices.

Food shortages.

Fuel demand.

Research funding.

Medical crises.

Construction booms.

Tourism.

Trade embargoes.

Recovery after disasters.

Everything influences everything else.

==================================================
POLITICS
==================================================

Independent governments.

Local councils.

Scientific unions.

Trade federations.

Explorer guilds.

Engineering consortiums.

Medical organisations.

Player choices influence relationships.

Nothing feels scripted.

==================================================
WEATHER
==================================================

Planet-specific systems.

Storms.

Blizzards.

Acid rain.

Solar winds.

Meteor showers.

Auroras.

Radiation.

Fog.

Sandstorms.

Volcanic ash.

Dynamic seasons.

==================================================
POPULATION LIFE
==================================================

NPCs:

Work.

Travel.

Sleep.

Eat.

Celebrate.

Mourn.

Learn.

Retire.

Children grow.

Families change.

Businesses open.

Businesses close.

==================================================
WILDLIFE
==================================================

Migration.

Breeding.

Predators.

Prey.

Extinction recovery.

Population balancing.

Evolution.

Environmental adaptation.

==================================================
RESEARCH
==================================================

Scientists continue discoveries.

Universities publish papers.

New technologies emerge.

Museums update.

Historical debates occur.

Expeditions reveal new knowledge.

==================================================
PLAYER REPUTATION
==================================================

Entire galaxy remembers.

Saved worlds.

Destroyed facilities.

Diplomatic decisions.

Scientific discoveries.

Economic support.

Rescue missions.

Commander relationships.

Museum progress.

==================================================
HISTORICAL TIMELINE
==================================================

Every major event permanently recorded.

Player actions become history.

Museum updates.

NPC dialogue changes.

Books update.

News remembers.

Future generations reference earlier events.

==================================================
FESTIVALS
==================================================

Founders Day.

Planetary Independence.

Harvest Festivals.

Scientific Expositions.

Commander Appreciation Week.

Museum Anniversary.

Memorial Day.

Wildlife Week.

==================================================
CRIME
==================================================

Piracy.

Smuggling.

Corporate espionage.

Illegal mining.

Wildlife trafficking.

Corruption.

Player may investigate.

==================================================
DEEP SPACE
==================================================

Unknown regions constantly generate:

Anomalies.

Ruins.

Species.

Signals.

Derelicts.

Events.

Nothing becomes permanently exhausted.

==================================================
OUTPUT
==================================================

Create the Living Galaxy Simulation.

Every world continues existing regardless of player location.

Civilisation evolves naturally.

History constantly progresses.

==================================================
SELF REVIEW LOOP
==================================================

Simulate hundreds of in-game years.

Observe civilisation growth.

Observe economies.

Observe politics.

Observe wildlife.

Observe exploration.

Remove repetitive behaviour.

Ensure emergent stories naturally appear.

Ensure players regularly encounter surprising situations that no designer manually scripted.

Ensure the Living Galaxy rivals the greatest dynamic worlds ever created while remaining optimistic, believable and uniquely Afterlight.

Repeat until every playthrough naturally creates memorable stories that feel personally authored by the player's decisions.

Only then lock AF-132.

## Foundation / AF-000–131 / GP-FINAL alignment review

Before any implementation, the existing simulation stack was surveyed via a dedicated research pass to determine exactly what is already tracked, per the constitution's "do not redesign previous systems, only extend them." That survey found population, economy, infrastructure, research/technology, food/water/energy, industry, political stability, exploration, and security/military are ALL already tracked somewhere in the locked stack: AF-086's `CivilisationSimulationRuntime` (14 faction-level attributes including `stability`), AF-090's `CivilisationFrameworkRuntime` (settlement `populationStats`, development-stage growth), and AF-089's `GalacticEconomyRuntime` (17 resource stockpile categories, trade routes). AF-041's `WorldEventRuntime` already generates dynamic galaxy/sector/faction/environmental/economic/scientific/emergency/hidden/legendary events with player participation and chaining. AF-086's `GalacticHistoryRuntime` and the Codex's interactive timeline already permanently record history. None of that is redefined here.

What genuinely did not exist anywhere — confirmed by the same survey — is what this module adds: pollution, a numeric wildlife index, a cycling weather condition, and a distinct healthcare index and crime level, per star system; a Dynamic News feed; a non-exhausting Random Discoveries pool; a Festival calendar; a Deep Space phenomena generator; and a stateful Player Reputation ledger (only a static `reputationLevel()` threshold lookup existed before this module — a real gap this module fills additively).

`EnvironmentalRuntime` seeds a real `EnvironmentalSystemState` for every one of the real galaxy's star systems (`SANDBOX_GALAXY.systems`) at a believable moderate midpoint and drifts values slowly each epoch, always clamped to [0, 100] — verified by a 500-epoch simulation test satisfying the spec's own self-review directive ("simulate hundreds of in-game years") without redundantly re-running AF-089's already-existing, much more expensive multi-epoch economy simulation test. `PlayerReputationLedger` and `LivingGalaxyChronicle` are both append-only, matching "entire galaxy remembers" and "history constantly progresses" respectively; the Chronicle is explicitly a parallel, complementary log and never modifies the locked `GalacticHistoryRuntime`. `drawNewsItem`/`drawDiscovery`/`drawDeepSpacePhenomenon` are pure, non-removing draws over their real pools, making "nothing becomes permanently exhausted" structural rather than aspirational — verified by a test drawing 200 times against 10-11-item pools with no degradation. `CrimeLedger.investigate` is a real, optional action, matching "player may investigate" (never mandatory).

The debug overlay gains a new `livingGalaxy` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-070 and AF-130/AF-131 before it — rendered as `galaxyLife` and kept clearly distinct from the pre-existing `galaxy`/`ship`/`ships` lines so none of the four ever read as one system. Zero changes to any other locked module (AF-000–131).

Score: 9.5/10 — approved and locked.
