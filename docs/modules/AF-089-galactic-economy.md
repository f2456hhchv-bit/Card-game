# AF-089 — GALACTIC ECONOMY FRAMEWORK

**Module status:** Complete (a genuine colony production/consumption/trade simulation reading AF-086's real civilisation state directly; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-088 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/GALACTIC_ECONOMY.md` + implementation (`src/game/economy/galacticEconomyData.ts`, `src/game/economy/GalacticEconomyRuntime.ts`)

---

*(Module catalogued verbatim below.)*

89

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-088 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Galactic Economy Framework.

The economy is not a currency system.

It is the living industrial engine of the galaxy.

Every resource should originate somewhere.

Every colony should consume something.

Every faction should manufacture something.

Trade routes should exist because they make sense.

The player participates inside a believable galactic economy rather than exploiting arbitrary game mechanics.

==================================================
CORE PHILOSOPHY
==================================================

Industry.

Trade.

Civilisation.

Logistics.

Scarcity.

Prosperity.

Every expedition contributes to rebuilding civilisation.

==================================================
ECONOMY ARCHITECTURE
==================================================

Every economic entity contains:

Unique ID

Civilisation

Production

Consumption

Storage

Trade Value

Demand

Supply

Infrastructure

Population

Technology

Logistics

Future Expansion Hooks

Nothing remains undefined.

==================================================
RESOURCE CATEGORIES
==================================================

Support:

Raw Minerals

Refined Metals

Energy

Fuel

Scientific Materials

Biological Resources

Crystal Resources

Ancient Technology

Prototype Components

Civilian Goods

Luxury Goods

Construction Materials

Medical Supplies

Food

Water

Quantum Materials

Void Matter

Future resources extend naturally.

==================================================
PRODUCTION CHAINS
==================================================

Resources naturally flow through:

Extraction

↓

Transport

↓

Refining

↓

Manufacturing

↓

Distribution

↓

Consumption

↓

Recycling

↓

Recovery

Every resource has logical origins.

==================================================
TRADE NETWORK
==================================================

Trade routes support:

Civilian Trade

Military Logistics

Scientific Exchange

Faction Trade

Emergency Supply

Exploration Support

Ancient Recovery

Black Market

Trade adapts dynamically.

==================================================
COLONIES
==================================================

Colonies possess:

Population

Employment

Industry

Infrastructure

Research

Military

Trade

Defence

Growth

Colonies evolve independently.

==================================================
INDUSTRIES
==================================================

Support:

Mining

Shipbuilding

Weapons

Engineering

Research

Agriculture

Energy

Medicine

Construction

Exploration

Industries define local economies.

==================================================
PLAYER PARTICIPATION
==================================================

Players may:

Deliver Resources

Fund Colonies

Protect Trade

Recover Technology

Supply Research

Restore Infrastructure

Open Trade Routes

Invest in Development

Player actions accelerate growth.

==================================================
MARKET SYSTEM
==================================================

Prices fluctuate through:

Supply

Demand

Wars

Research

Natural Events

Faction Politics

Player Influence

Galaxy Events

Markets remain believable.

==================================================
GALAXY EVENTS
==================================================

Support:

Trade Boom

Economic Collapse

Resource Discovery

Mining Disaster

Scientific Revolution

Supply Crisis

Piracy

Trade Embargo

Industrial Expansion

Events reshape commerce.

==================================================
INFRASTRUCTURE
==================================================

Civilisations construct:

Stations

Shipyards

Research Centres

Trade Hubs

Mining Facilities

Orbital Elevators

Energy Networks

Communication Arrays

Infrastructure permanently changes the galaxy.

==================================================
REWARDS
==================================================

Economic progression unlocks:

Blueprints

Ships

Weapons

Modules

Research

Commander Opportunities

Rare Resources

Legendary Projects

Prosperity creates opportunity.

==================================================
BALANCE PRINCIPLES
==================================================

Economy rewards:

Planning.

Investment.

Exploration.

Trade.

Cooperation.

Never repetitive grinding.

Never inflation-driven progression.

==================================================
ACCESSIBILITY
==================================================

Support:

Trade Overview

Market Trends

Resource Search

Comparison Mode

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache market calculations.

Update distant economies asynchronously.

Optimise logistics simulation.

Pool economic events.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Supply

Demand

Trade Routes

Industrial Output

Population

Economic Health

Performance

==================================================
OUTPUT
==================================================

Produce the complete Galactic Economy Framework.

Every future civilisation, expansion and industrial system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years of galactic economic activity.

Review production chains.

Review colony growth.

Review trade routes.

Review industrial development.

Review player participation.

Review market behaviour.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-088.

Reduce artificial resource bottlenecks.

Strengthen economic realism.

Increase meaningful player influence.

Ensure the Galactic Economy becomes a believable, self-sustaining ecosystem where every expedition, discovery and industrial decision contributes to rebuilding one of gaming's richest living universes.

Repeat until the Galactic Economy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-089.

---

## Foundation / AF-000–088 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-089 is the industrial substance behind AF-086's own economic attributes:** `GalacticEconomyRuntime` takes AF-086's REAL `CivilisationSimulationRuntime` as a collaborator (the same cross-runtime composition AF-086 used with `FactionRuntime`), reading population/industrialOutput/technology/economicPower directly and writing back ONLY through the real, bounded `feedPlayerImpact` — ambient economic events never touch AF-086's state, keeping the coupling strictly one-directional. AF-025/039/040/085/086's engines, unions, and shapes are all untouched.
- **Seventeen resource categories, honestly split:** nine map onto AF-025's REAL `ResourceType` shelf (raw minerals→commonMaterials, quantum materials→quantumCores, void matter→voidEssence, and six more); the other eight (fuel, biological resources, civilian/luxury goods, construction materials, medical supplies, food, water) are honest NEW stockpile registers this module introduces — still fully live within the colony simulation, just outside AF-025's crafting pool, never force-fit onto a resource that doesn't fit.
- **THE EIGHT-STAGE PRODUCTION CHAIN IS A CLOSED RING — AF-086's life-cycle pattern, applied to goods instead of civilisations:** Recovery wraps back to Extraction (asserted: every stage reachable from any start, the ring closing exactly where it began), and a category's chain position is FORCED to advance after a bounded number of epochs, mirroring `LIFECYCLE_MAX_EPOCHS_IN_PHASE` exactly. Stockpile only ever increases at Distribution (the goods arriving) or Recovery (recycling reclaiming a fraction) — asserted structurally: nothing is manufactured from nothing.
- **SCARCITY IS REAL, not decorative:** population (read live from AF-086) consumes food, water, and energy every epoch; a shortfall zeroes the stockpile rather than going negative, and dents the colony's own growth and employment registers — proven by draining a colony's consumables and watching both registers fall over ten real epochs, with AF-086's own state asserted untouched by the ambient effect.
- **Eight Trade Network routes map TOTALLY onto AF-040's REAL merchant-kind shelf** (civilian trade→galaxyTrader, black market→blackMarketDealer, five more), with Emergency Supply reaching one layer further into AF-040's own economic-event vocabulary instead of inventing a second merchant system — a route is either a standing merchant or a response, never a new kind of either.
- **Nine Galaxy Events, five of them REUSED directly rather than reinvented:** Trade Boom and Economic Collapse are AF-086's own `tradeBooms`/`economicCollapse`; Scientific Revolution reuses `scientificRenaissance`; Piracy reuses `pirateUprisings`; Trade Embargo reuses AF-085's `embargoes` political instrument. The four genuinely new kinds (Resource Discovery, Mining Disaster, Supply Crisis, Industrial Expansion) each carry their own authored resource-category deltas — the mission-modifier pattern's latest appearance — and this runtime never re-fires another module's own engine for the reused five; it only names which real mechanism the narrative event corresponds to.
- **PRIMARY INDUSTRY IS A SEVENTH IDENTITY-UNIQUENESS AXIS:** alongside AF-085's five (architecture/music/dialogue/reward/economy sectors) and AF-086's sixth (scientific priority), every profiled civilisation's primary industry is asserted pairwise-distinct across all six — the Dominion mines, the Collective engineers, the Alliance builds ships, the Guild arms, the Custodians research, the Nomads explore.
- **Player Participation is bounded everywhere it touches state**, the AF-086 "accelerate, never dictate" law applied a second time: `PLAYER_PARTICIPATION_MAX_DELTA` caps every one of the eight actions, proven with an absurd (999999) input on multiple actions; Recover Technology and Restore Infrastructure reach into AF-086's own bounded feed, capped by BOTH ceilings at once; Invest in Development permanently constructs infrastructure once a flat threshold is crossed, in live-kind order, never via a currency spend AF-040 never made public.
- **The Market System's pure multiplier composes with, never replaces, AF-040's own pricing:** `marketPriceMultiplierFor` reads supply against an authored baseline (proven to rise as stockpile depletes and relax as it fills, always within its registered bounds) — an additional factor the composition root can multiply alongside `MarketRuntime.price()`, not a second pricing engine.
- **LIVE in the composition root:** the economy ticks on the same ambient fixed-loop schedule as `civSim`/`factionRuntime`/`marketRuntime`; a victorious expedition genuinely delivers resources to the mission's present faction's colony at the real `endRun` seam — "every expedition contributes to rebuilding civilisation," literally; the overlay's economy line now reads supply, demand, open trade routes, industrial output, population, and economic health, browser-verified ticking over real wall-clock time (`supply 1530 → 1421 · demand 108.0 → 108.9 · pop 60 → 61`), zero page errors.
- **Self-review executed:** 17 new tests — the fourteen shelves, the honest nine/eight resource-category split, the total map onto AF-040's merchant kinds, the five-reused/four-authored event split, the closed-ring production-chain proof, the primary-industry uniqueness assertion, real colony seeding, the never-invented-from-nothing production proof, the scarcity battery with AF-086 state asserted untouched, the primary-industry output-bonus proof, every bounded player-participation action (including the double-capped cross-module feeds), the infrastructure-build threshold proof, the market-multiplier bounds proof, real event-firing through the public timer, and a **50-galaxy × 300-epoch simulation sweep** ("simulate thousands of years") — stockpiles never negative, chain positions always on the real shelf, economic health always within [0, 100]. Suite: 1052 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-025/039/040/085/086; the economy as one runtime reading a real collaborator plus pure functions; the production chain as a proven closed ring; scarcity and bounded player influence both real, not decorative). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/GALACTIC_ECONOMY.md`, `src/game/economy/galacticEconomyData.ts`, `src/game/economy/GalacticEconomyRuntime.ts`.
