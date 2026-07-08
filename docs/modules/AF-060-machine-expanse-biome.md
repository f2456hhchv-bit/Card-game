# AF-060 — MACHINE EXPANSE BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-059 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MACHINE_EXPANSE_BIOME.md` + implementation (`src/game/biomes/machineExpanseBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

60

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-059 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Machine Expanse Biome.

The Machine Expanse is the industrial heart of the Machine Collective.

Entire planets have been converted into autonomous factories.

Nothing here exists naturally.

Everything has been engineered for maximum efficiency.

Players should feel they are entering a planet-sized machine that has continued manufacturing itself for thousands of years without human oversight.

==================================================
CORE PHILOSOPHY
==================================================

Precision.

Industry.

Automation.

Efficiency.

Endless production.

The biome itself behaves like a living machine.

==================================================
BIOME IDENTITY
==================================================

Theme:

Factory Worlds.

Orbital Shipyards.

Automated Mines.

Assembly Continents.

Refining Oceans.

Machine Cities.

Planetary Foundries.

Industrial Megastructures.

Every environment should feel manufactured.

==================================================
VISUAL LANGUAGE
==================================================

Dark steel.

White illumination.

Blue energy.

Moving machinery.

Factory smoke.

Rotating structures.

Conveyor systems.

Mechanical precision.

Visuals communicate endless production.

==================================================
ENVIRONMENT
==================================================

Support:

Assembly Lines

Planetary Foundries

Orbital Drydocks

Machine Cities

Energy Reactors

Mining Arrays

Fusion Plants

Drone Factories

Power Relays

AI Control Centres

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Electrical Storms

Plasma Rain

Steam Clouds

EMP Waves

Magnetic Winds

Cooling Vents

Ion Discharge

Mechanical weather reinforces industrial identity.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Moving Machinery

Laser Grids

Crushing Presses

Molten Metal

Electrified Floors

Assembly Arms

Power Surges

Security Turrets

Hazards reward awareness.

==================================================
MISSION TYPES
==================================================

Support:

Destroy Factories

Disable AI

Recover Prototype Data

Sabotage Production

Escort Engineers

Protect Researchers

Capture Control Nodes

Deactivate Reactors

The biome emphasises infiltration and sabotage.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Machine Collective

Paragon Protocol

Ancient Custodians

Occasional Human Outlaws

Rare Void Corruption

Every encounter reinforces mechanical superiority.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Machine Components

Alloys

Quantum Circuits

Fusion Cells

AI Cores

Prototype Parts

Industrial Materials

Research Samples

Resources advance engineering progression.

==================================================
POINTS OF INTEREST
==================================================

Support:

Prototype Laboratories

AI Archives

Machine Temples

Manufacturing Vaults

Orbital Shipyards

Control Spires

Energy Wells

Lost Research Facilities

Exploration remains highly rewarding.

==================================================
BIOME EVENTS
==================================================

Support:

Factory Overload

Production Surge

AI Uprising

Reactor Failure

Prototype Activation

Orbital Construction

Machine Reinforcements

Emergency Shutdown

The biome constantly changes.

==================================================
EXPLORATION
==================================================

Players may discover:

Hidden Blueprints

Prototype Weapons

Experimental Ships

Machine Archives

Lost Scientists

Ancient Facilities

Secret Assembly Lines

AI Memories

Every discovery expands technological understanding.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Factory Overseer

Planetary Constructor

Adaptive War Platform

Orbital Forge

Machine Intelligence Core

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Machine Expanse teaches:

Machine evolution.

Autonomous industry.

Artificial intelligence.

Post-human manufacturing.

Planetary automation.

The rise of the Machine Collective.

It demonstrates what civilisation becomes when efficiency replaces purpose.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced particle mode

Hazard indicators

High Contrast

Colour-blind support

Reduced machinery motion

Photosensitivity mode

Readable industrial warnings

==================================================
PERFORMANCE
==================================================

Pool machinery.

Stream megastructures.

Reuse industrial shaders.

Optimise moving environments.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Factory Status

Production Rate

Power Grid

Hazard Count

Machine Activity

Performance

==================================================
OUTPUT
==================================================

Produce the complete Machine Expanse Biome.

Every future machine world, automated megastructure and industrial civilisation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Machine Expanse missions.

Review exploration.

Review environmental storytelling.

Review hazards.

Review machinery interaction.

Review events.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-059.

Adjust hazard frequency.

Adjust production events.

Adjust exploration rewards.

Remove repetitive industrial layouts.

Ensure the Machine Expanse becomes one of the most mechanically immersive locations in Afterlight, communicating the overwhelming scale of autonomous industry while providing varied, readable and highly replayable gameplay.

Repeat until the Machine Expanse Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-060.

---

## Foundation / AF-000–059 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-058/059's exact content-module shape, applied to the Collective's industrial heart.** `MACHINE_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: THREE AF-035 hazard zones — the biome's dangers are the factory itself (a shocking Laser Grid, a burning Molten Channel, and a heavy Press Line, the most hazards of any authored biome) — three weathers with real AF-020 forces (Electrical Storms, visibility-reducing EMP Waves, Magnetic Winds with real wind force), four weighted events, and AF-023 smart-loot weights biased toward engineering progression (craftingMaterial/blueprint/researchSample/equipment/weapon). Both vocabulary mappings (7 weather names, 8 event names) are total onto the locked shelves.
- **"Nothing here exists naturally" is numbers again:** `threatModifier: 1.25` (the deepest of the three authored biomes, asserted as strictly above AF-059's), factory-maintained natives through AF-036's live `enemyBuff` hook (`shieldCapacity +12`), and `hazardImmunities: ["shock", "burn"]` — the foundry does not harm its own machines. All asserted, not intended.
- **Enemy Presence follows the spec exactly:** the full AF-047 Machine roster primary (all six defs — this is their home), Paragon Protocol (prototype drone, pulse cannon — the abandoned experiments among the machines that kept running), Ancient Custodians (defence drone — even they watch the Expanse), occasional Outlaw salvage raids, rare Void corruption. Every id resolution-tested. `bossId: null` is honest — the five forge boss kinds (Adaptive War Platform already registered as AF-047 mini-boss vocabulary) bind as `BossDef`s when authored.
- **Forge Primus joins the galaxy additively:** a new `machineExpanse` region and system (threat 4, Machine Collective, reached through Hollow Drift's contested space — two real travel hops, no Fast Travel gate) carrying `biomeId: "machine-expanse"` through AF-058's registry — the third consumer of AF-038's field — with a machine-foundry POI discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the Forge Primus AI archive discovers `LORE_MACHINE_EXPANSE_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-machine-expanse` entry (cross-referencing the Collective profile AND AF-047's network doctrine — the faction, its doctrine, and its home taught as one chain) with zero Missing Links. A third interactable uses the `disableHazard` interaction kind — a security node the player can shut down, infiltration made literal.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the five-faction enemy-presence structure (≥6 Collective primary + all four guest factions), all three real hazard ticks, the manufactured-world assertions (dual immunity, live buff hook, threat strictly above AF-059's), real `GalaxyRuntime` travel through Hollow Drift to Forge Primus resolving the Expanse `biomeId`, `BiomeRuntime` integration (weather/events only from the Forge's own pools across 4,000 steps), the AI-archive discovery, the Codex entry, and a 1,000-mission seeded sweep in which the factory's hazards always fire ("the factory never stops working", literally asserted). **Live in the browser:** travelled Lucent Gate → Hollow Drift → Forge Primus via two real travel buttons, launched, and the Forge ran live — `Forge Primus · weather ionClouds · hazards 3` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the third biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/MACHINE_EXPANSE_BIOME.md`, `src/game/biomes/machineExpanseBiome.ts`.
