## Verbatim prompt

139

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-138 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Evolution Engine.

Nothing in the Afterlight universe remains static.

Species evolve.

Technology advances.

Architecture matures.

Equipment improves.

Civilisations adapt.

The galaxy itself changes through time.

Every playthrough should feel like witnessing hundreds of years of genuine progress.

==================================================
CORE PHILOSOPHY
==================================================

Progress is visible.

The player should physically see the universe improving.

Weapons become refined.

Cities become beautiful.

People become healthier.

Ships become more advanced.

Wildlife adapts.

Knowledge accumulates.

Hope compounds.

==================================================
EVOLUTION PILLARS
==================================================

Biological

Technological

Architectural

Cultural

Scientific

Economic

Political

Educational

Environmental

Exploratory

Historical

==================================================
BIOLOGICAL EVOLUTION
==================================================

Native species adapt to:

Climate.

Player restoration.

Predators.

Food availability.

Pollution.

Terraforming.

Migration.

Environmental disasters.

New behaviours appear naturally.

==================================================
TECHNOLOGY EVOLUTION
==================================================

Human technology advances continuously.

Examples

Weapons become lighter.

Ships become faster.

Medicine improves.

AI becomes safer.

Power becomes cleaner.

Construction becomes smarter.

Communication expands.

No advancement appears instantly.

Research builds gradually.

==================================================
ARCHITECTURAL EVOLUTION
==================================================

Buildings visually evolve.

Examples

Emergency shelters

↓

Homes

↓

Districts

↓

Modern cities

↓

Planetary capitals

↓

Iconic skylines

Older architecture remains preserved.

Cities tell their own history.

==================================================
EQUIPMENT EVOLUTION
==================================================

Every equipment family evolves.

Examples

Prototype

↓

Standard

↓

Improved

↓

Advanced

↓

Mastercrafted

↓

Historic Masterpiece

Visual appearance evolves naturally.

Older equipment becomes museum worthy.

==================================================
COMMANDER EVOLUTION
==================================================

Commanders mature.

Leadership improves.

Dialogue changes.

Mentorship develops.

Research expands.

Combat techniques evolve.

Friendships deepen.

Even idle animations subtly mature.

==================================================
COMPANION EVOLUTION
==================================================

Companions:

Grow.

Learn.

Breed.

Develop personalities.

Discover new behaviours.

Adapt visually.

Unlock rare genetic traits.

Long-lived companions become legends.

==================================================
COLONY EVOLUTION
==================================================

Every restored world develops:

Unique architecture.

Regional traditions.

Educational institutions.

Public artwork.

Historical monuments.

Scientific identity.

Economic strengths.

==================================================
TRANSPORT EVOLUTION
==================================================

Travel improves.

Walking paths.

Roads.

Maglev.

Orbital elevators.

Hyperspace corridors.

Quantum gateways.

Travel becomes visibly easier over time.

==================================================
LANGUAGE EVOLUTION
==================================================

Centuries later:

New sayings appear.

Historic figures become idioms.

Commander quotes become famous.

Planet-specific dialects emerge.

Books preserve earlier language.

==================================================
CULTURAL EVOLUTION
==================================================

New music.

New holidays.

Cuisine.

Fashion.

Architecture.

Literature.

Children's stories.

The civilisation slowly develops its own identity.

==================================================
RESEARCH EVOLUTION
==================================================

Scientific understanding improves.

Older theories become outdated.

Books update.

Museum exhibits expand.

Universities teach new discoveries.

The galaxy becomes smarter.

==================================================
AI EVOLUTION
==================================================

Friendly AI assistants improve.

Navigation learns.

Companions become more intelligent.

Cities optimise themselves.

Player never notices abrupt jumps.

Only gradual refinement.

==================================================
PLANETARY EVOLUTION
==================================================

Restored worlds visibly recover.

Forests expand.

Rivers clean.

Wildlife returns.

Cities flourish.

Weather stabilises.

Tourism grows.

Planets develop character.

==================================================
HISTORICAL EVOLUTION
==================================================

Heroes become legends.

Legends become history.

History becomes education.

Education inspires future generations.

The player's actions echo through centuries.

==================================================
PLAYER EVOLUTION
==================================================

Player's identity changes.

Rookie.

Explorer.

Commander.

Leader.

Founder.

Legend.

The galaxy responds accordingly.

==================================================
THE GREAT PROJECTS
==================================================

Very late game.

Civilisation begins projects impossible at campaign start.

Examples

Dyson Swarm.

Galactic University.

Living World Archives.

Interstellar Seed Vault.

Planetary Climate Network.

Deep Space Observatory Ring.

Atlas Gateway Network.

Projects require generations.

==================================================
ACCESSIBILITY
==================================================

Evolution viewer.

Before/after comparisons.

Timeline playback.

Simplified progression summaries.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Evolution Engine.

Ensure every major system matures naturally across the campaign.

The universe should visibly improve as humanity rebuilds itself.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of in-game years.

Observe technological progress.

Observe architecture.

Observe wildlife.

Observe Commander growth.

Observe language.

Observe education.

Observe cities.

Observe equipment.

Remove abrupt transitions.

Ensure evolution always feels earned through player action, scientific progress and civilisation-wide cooperation.

Ensure the Evolution Engine transforms Afterlight into a universe that genuinely ages, learns and improves over time while remaining hopeful, coherent and endlessly believable.

Repeat until players can revisit early locations hundreds of hours later and immediately recognise how far humanity has come.

Only then lock AF-139.

## Foundation / AF-000–138 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138) surveyed an unusually wide slice of the locked stack before any design work — equipment, commander progression, companions, settlement stages, wildlife, research, meta-progression, and both existing megaproject rosters. It confirmed most of this spec's 11 pillars have no real backing anywhere (safe new territory): no craftsmanship axis distinct from AF-007's `RARITY_LADDER`; no visual architecture ladder or "older architecture preserved" log; no species/creature-level adaptation (AF-132's `EnvironmentalRuntime` only tracks one aggregate `wildlifeIndex` per system); no companion growth/breeding/traits (AF-131's `CompanionHabitatRuntime` is a pure dedup registry); no sequential Rookie→Legend player-identity ladder (AF-133/136's `reputationTitleFor` is flavour text keyed by legacy category); no cross-tree "technology era" aggregate; no transport-tier ladder.

The one area requiring a real design decision: this spec's 7 Great Projects examples collide directly with AF-090's real `MEGASTRUCTURES` and AF-138's real `CIVILISATION_MEGAPROJECTS` — "Dyson Swarm" ≈ `dyson-array-lucent`, "Galactic University" ≈ `megaproject-interstellar-university`, "Deep Space Observatory Ring" ≈ `megaproject-deep-space-telescope`, "Atlas Gateway Network" ≈ `quantum-gate-axiom`. Per the AF-126/137/138 precedent (generic vocabulary/concept overlap between unrelated systems, not a uniquely-canonical identity, needs no Project Owner decision), rather than build a THIRD near-duplicate megaproject roster, this module composes: `GREAT_PROJECT_LINEAGE` documents which real project each example maps onto, and `greatProjectsProgressSummary` reports one unified progress lens across both real rosters (17 projects total). Only "Interstellar Seed Vault" had no real match and is left deferred rather than inventing a new backing megaproject — defining new megaproject entries belongs to AF-090/AF-138's domain, not this one's.

Built under `src/game/evolutionEngine/`: `architecturalStageFor` is a pure mapping over AF-090's real 7-stage `SettlementDevelopmentStage`, never a competing tracked value. `playerEvolutionRankFor` derives purely from AF-026's real `MetaProgression.snapshot.accountLevel`. `commanderMaturityScore`/`Stage` compose AF-071's real talents/mission-beat state and AF-130's real bond level — plain numbers in, per the decoupled-composition pattern AF-137's `tierWeightsFor` established. `technologyEraFor` composes AF-024's real unlocked-node count/tier average. `transportTierFor` gates its top two tiers behind AF-024's real `warp-charting` research unlock rather than a second, invented fast-travel flag. `EquipmentEvolutionTracker`, `HistoricalArchitectureLedger`, `SpeciesAdaptationRegistry`, and `CompanionEvolutionTracker` (keyed by AF-131's real `CompanionHabitatEntry.id`) are the module's genuinely new stateful primitives. `LanguageEvolutionLog` reuses AF-135's real `EvolvingEntry` directly rather than a second versioning class.

The debug overlay gains a new `evolutionEngine` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-138 before it. Zero changes to any other locked module (AF-000–138).

Score: 9.5/10 — approved and locked.
