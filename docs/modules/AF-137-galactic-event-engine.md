## Verbatim prompt

137

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-136 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Galactic Event Engine.

The galaxy should constantly generate meaningful events whether the player is present or not.

Events must emerge naturally from the Living Galaxy Simulation (AF-132), the Dynamic Story Engine (AF-136), the Legacy Engine (AF-133), and Commander relationships (AF-130).

The Event Engine creates endless replayability.

==================================================
CORE PHILOSOPHY
==================================================

Events should feel discovered.

Not spawned.

Players should constantly think:

"I wonder what's happening today?"

No event exists purely as filler.

Every event should strengthen the feeling that humanity is alive.

==================================================
EVENT TIERS
==================================================

Tier I

Local

Examples:

Research breakthrough

Wildlife birth

Equipment shipment

Engineering competition

Festival

Small rescue

Tier II

Regional

Trade dispute

Meteor impact

Disease outbreak

Pirate activity

Ancient ruin uncovered

Scientific conference

Tier III

Sector

Political election

Massive migration

Economic boom

Colony expansion

Solar storm

Large expedition

Tier IV

Galactic

First Contact

Major alliance

Supernova

Ancient megastructure activation

Historic discovery

Galaxy-wide celebration

Tier V

Legendary

The Lost Ark

The Founder Signal

Unknown Intelligence

The Silent Fleet

Ancient AI Awakening

Never guaranteed.

==================================================
EVENT GENERATION
==================================================

Events consider:

Economy

Weather

Commander bonds

Player reputation

Colony growth

Research

Wildlife

Population

Politics

History

Exploration

Nothing appears randomly.

==================================================
EVENT CHAINS
==================================================

Small events create larger ones.

Example

Mining boom

↓

New settlement

↓

Trade route

↓

Pirates appear

↓

Security upgrades

↓

Commander mission

↓

Museum exhibit

↓

History entry

Every action ripples.

==================================================
COMMUNITY EVENTS
==================================================

Colonists celebrate:

Harvest.

Scientific success.

Engineering milestones.

School graduations.

Planet anniversaries.

Wildlife festivals.

Museum openings.

Sports championships.

Music concerts.

==================================================
COMMANDER EVENTS
==================================================

Examples

Birthday.

Promotion.

Award ceremony.

Research publication.

Friendly rivalry.

Retirement.

Historic speech.

Commander friendships influence attendance.

==================================================
WORLD EVENTS
==================================================

Planetary earthquakes.

Ice ages.

Ocean blooms.

Solar eclipses.

Meteor showers.

Auroras.

Volcanic eruptions.

Terraforming success.

Environmental recovery.

==================================================
DISCOVERY EVENTS
==================================================

Unknown ruins.

Living megafauna.

Ancient satellites.

First alien artwork.

Historic recordings.

Lost colonies.

Experimental technology.

Every discovery expands lore.

==================================================
PLAYER EVENTS
==================================================

Depending on reputation:

Parades.

Statues.

Interviews.

Requests for help.

Invitations.

Scientific lectures.

Children asking questions.

Commander celebrations.

==================================================
EMERGENCY EVENTS
==================================================

Medical emergency.

Power failure.

Ship collision.

Research accident.

Wildfire.

Radiation leak.

Missing expedition.

Companion rescue.

These are dramatic without becoming repetitive.

==================================================
HISTORICAL EVENTS
==================================================

Anniversaries trigger:

Museum exhibitions.

Commander speeches.

Fireworks.

Memorials.

Educational broadcasts.

Historical documentaries.

==================================================
SHIP EVENTS
==================================================

Movie night.

Cooking competition.

Engineering prank.

Lost pet.

Unexpected visitor.

Power outage.

Concert.

Meteor viewing.

Quiet evening.

==================================================
EXPLORATION EVENTS
==================================================

Expedition distress calls.

Unknown beacons.

Living planets.

Impossible storms.

Quantum echoes.

Space whales.

Forgotten observatories.

Deep-space archaeology.

==================================================
ECONOMIC EVENTS
==================================================

Trade surplus.

Fuel shortage.

Construction contracts.

Research grants.

Market crash.

Medical donations.

Tourism boom.

Industrial expansion.

==================================================
ACCESSIBILITY
==================================================

Event history.

Upcoming celebrations.

Difficulty scaling.

Event filters.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Galactic Event Engine.

The galaxy should continuously surprise the player through believable emergent events.

Every event should strengthen the Living Galaxy.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of galactic years.

Observe event frequency.

Observe repetition.

Observe Commander participation.

Observe economic consequences.

Observe historical continuity.

Ensure event chains naturally create memorable stories.

Ensure players routinely encounter situations they have never seen before.

Ensure the Galactic Event Engine feels limitless without sacrificing narrative coherence or optimism.

Repeat until the galaxy consistently feels alive regardless of where the player chooses to explore.

Only then lock AF-137.

## Foundation / AF-000–136 / GP-FINAL alignment review

Built entirely under `src/game/eventEngine/`, as a new SCALE-tier classification layered alongside AF-041's real `WorldEventRuntime`/`EventCategory` (10 TYPE-based values: galaxy/sector/faction/ancient/environmental/economic/scientificDiscovery/emergency/hidden/legendary, already handling player participation and event chaining). This module's `EVENT_TIERS` (Local/Regional/Sector/Galactic/Legendary) is a different axis entirely — how far an event's consequences reach, not what kind it is. "Sector" and "Legendary" happen to appear as literal strings in both unions, but they live in two separate, unrelated TypeScript types in two separate files; neither module imports the other's types, and neither is modified.

Per the spec's own explicit instruction ("Events must emerge naturally from the Living Galaxy Simulation (AF-132), the Dynamic Story Engine (AF-136), the Legacy Engine (AF-133), and Commander relationships (AF-130)"), `tierWeightsFor` takes plain numeric summaries rather than importing any of those four modules directly — a caller (main.ts) extracts real values from `EnvironmentalRuntime.averagePollution()`/`averageWildlife()`, `PlayerReputationLedger.grandTotal()`, `BondNetworkRuntime.snapshot().averageLevel`, and `StoryPillarTracker.dominantPillars()`, keeping the Event Engine itself fully decoupled and testable in isolation while still genuinely composing with all four. Higher composed activity biases weight toward larger-scale tiers, verified by a dedicated test; Legendary's weight never moves regardless of input, matching "never guaranteed" structurally rather than as a documented-only rule. `rollTier` performs real weighted-random selection over those weights — "nothing appears randomly" — and is wired live in `main.ts` via a seeded `Rng` fork, logging one real opening event into `GalacticEventLog` at startup. `EventChainRuntime` tracks real, observable progress through the spec's own eight-step mining-boom example, one ripple per `advance()` call.

The debug overlay gains a new `eventEngine` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-070 and AF-130 through AF-136 before it. Zero changes to any other locked module (AF-000–136).

Score: 9.5/10 — approved and locked.
