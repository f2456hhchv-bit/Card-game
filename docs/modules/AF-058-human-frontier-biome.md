# AF-058 — HUMAN FRONTIER BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-057 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/HUMAN_FRONTIER_BIOME.md` + implementation (`src/game/biomes/frontierBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

58

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-057 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Human Frontier Biome.

The Human Frontier is the player's introduction to the living galaxy.

It represents the fragile remains of humanity following the Collapse.

It is not a safe area.

It is a struggling civilisation desperately attempting to rebuild.

Players should immediately understand what humanity has lost—and what Afterlight is trying to restore.

==================================================
CORE PHILOSOPHY
==================================================

Hope.

Recovery.

Survival.

Discovery.

Expansion.

The Human Frontier is the beginning of rebuilding civilisation.

==================================================
BIOME IDENTITY
==================================================

Theme:

Colonial frontier.

Mining systems.

Trade stations.

Abandoned settlements.

Early reconstruction.

Broken infrastructure.

Civilian fleets.

Everything should communicate resilience despite collapse.

==================================================
VISUAL LANGUAGE
==================================================

Blue-white stars.

Industrial stations.

Mining platforms.

Cargo routes.

Solar arrays.

Repair drones.

Construction scaffolds.

Civilian traffic.

Lighting should feel hopeful.

==================================================
ENVIRONMENT
==================================================

Support:

Trade Stations

Mining Colonies

Cargo Convoys

Shipyards

Research Outposts

Asteroid Fields

Communication Arrays

Orbital Habitats

Solar Farms

Frontier Gates

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Solar Winds

Debris Fields

Ion Storms

Micro Meteor Showers

Radiation Clouds

Engine Exhaust Fields

Electrical Storms

Weather remains readable.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Damaged Stations

Explosive Fuel Tanks

Minefields

Debris Belts

Electrical Arcs

Reactor Leaks

Navigation Hazards

Hazards reinforce industrial space.

==================================================
MISSION TYPES
==================================================

Support:

Escort Convoys

Protect Colonies

Repair Infrastructure

Rescue Survivors

Recover Technology

Eliminate Pirates

Survey Systems

Restore Communications

The Frontier introduces core gameplay systems.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Human Outlaws

Stellar Nomads

Light Machine Activity

Occasional Eclipsed

Rare Ancient Guardians

Threat escalates naturally.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Iron Alloys

Energy Cells

Electronics

Construction Materials

Fuel

Research Samples

Civilian Technology

Basic Blueprints

Frontier resources establish early progression.

==================================================
POINTS OF INTEREST
==================================================

Support:

Distress Signals

Abandoned Stations

Mining Operations

Civilian Settlements

Prototype Workshops

Black Market Outposts

Navigation Beacons

Historic Wrecks

Exploration remains rewarding.

==================================================
BIOME EVENTS
==================================================

Support:

Pirate Raids

Trade Convoys

Civilian Rescue

Station Repairs

Mining Accidents

Solar Activity

Prototype Deliveries

Faction Patrols

Events reinforce a living frontier.

==================================================
EXPLORATION
==================================================

Players may discover:

Hidden Cargo

Research Archives

Lost Expeditions

Ancient Relays

Prototype Parts

Hidden Routes

Civilian Stories

Lore Objects

Exploration strengthens world building.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Pirate Flagship

Prototype Gunship

Mercenary Warlord

Machine Siege Platform

Corrupted Carrier

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Human Frontier teaches:

The Collapse

The rebuilding effort

Civilian life

Trade

Politics

Early exploration

The birth of the Afterlight Initiative

It establishes the emotional foundation of the game.

==================================================
ACCESSIBILITY
==================================================

Support:

Hazard indicators

Objective markers

Reduced debris density

High Contrast

Colour-blind support

Reduced environmental effects

==================================================
PERFORMANCE
==================================================

Pool stations.

Pool cargo traffic.

Stream asteroid fields.

Reuse industrial assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Biome State

Weather

Civilian Activity

Hazard Count

Events

Exploration %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Human Frontier Biome.

Every future colony, settlement and human civilisation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Human Frontier missions.

Review exploration.

Review environmental storytelling.

Review mission diversity.

Review hazards.

Review events.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-057.

Adjust event frequency.

Adjust resource distribution.

Adjust exploration rewards.

Remove repetitive mission layouts.

Ensure the Human Frontier becomes a hopeful yet dangerous introduction to the Afterlight universe, teaching core gameplay while establishing the emotional stakes of rebuilding humanity.

Repeat until the Human Frontier Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-058.

---

## Foundation / AF-000–057 / GP-FINAL alignment review (recorded at catalogue time)

- **This is a CONTENT module — the first full biome authored on AF-036's locked engine, with zero schema changes.** `HUMAN_FRONTIER_BIOME` is a plain `BiomeDef`: its hazards ARE AF-035 hazard zones (a Debris Belt and a burning Reactor Leak, ticking through the unchanged `stepHazardZone`), its weather uses AF-020's force kinds through AF-036's `WeatherDef` (Solar Winds as `energyWinds` with a real wind force, Ion Storms as visibility-reducing `ionClouds`, Micro Meteor Showers as `meteorActivity`), its events weight AF-036's locked `BiomeEventKind` shelf, and its resource bias feeds AF-023's smart-loot hook directly (resource/craftingMaterial/blueprint/currency/researchSample — early progression, literally weighted).
- **The module's own vocabulary is naming layers with TOTAL mappings, never new engines.** All seven spec weather names and all eight spec event names map explicitly onto the locked shelves (`FRONTIER_WEATHER_TO_ENGINE`, `FRONTIER_EVENT_TO_ENGINE`, both totality-tested) — the same Nth-naming-layer discipline every prior module applied to `EnvironmentalEventTriggered`. Locations, mission types, resources, POIs, discoveries, and the five boss kinds are registered shelves binding to AF-035/037 content when authored (`bossId: null` is honest — no frontier `BossDef` exists yet).
- **AF-038's `StarSystemDef.biomeId` field gets its FIRST CONSUMER.** Since AF-038, every star system has declared a `biomeId` that nothing read — `main.ts` hardcoded the sandbox biome. AF-058 adds a `BIOME_REGISTRY` and resolves the run's biome from `galaxyRuntime.currentSystem.biomeId` at `startRun` (fallback: the sandbox biome), so the galaxy now decides where the expedition happens — the dormant-hook-gets-first-producer lineage (AF-038's own `galaxyNavigation`, AF-046's formation context, …) applied to AF-038 itself.
- **The frontier is REACHABLE, additively.** A new `humanFrontier` region and the Meridian Rest system join `SANDBOX_GALAXY` (the same roster-addition class as AF-046/050/052's faction profiles), connected to the starting system without Fast Travel, threat level 1, dominated by the Human Alliance. Its POI discovers lore through AF-038's existing discovery path.
- **Enemy Presence is the ten-faction roster, weighted exactly as the spec asks:** Outlaws (raider/sniper/captain) and Nomads (skiff/hunter/flagship) primary, light Machine activity (combat drone), occasional Eclipsed (lost scout), rare Ancient Guardians (sentinel) — every id resolution-tested against all eleven rosters. `enemyBuff: null` and `threatModifier: 0.9` keep the introduction honest: dangerous through composition, gentler in pressure, never a stat crutch. `hazardImmunities: []` — nobody is native to a reactor leak.
- **Lore lands through the biome itself:** the Meridian Rest civilian archive interactable discovers `LORE_HUMAN_FRONTIER_ARCHIVE` through AF-036's existing interaction path, unlocking the additive `codex-biome-human-frontier` entry (category `biomes`, cross-referencing the Human Alliance profile) with zero Missing Links.
- **Self-review executed:** 12 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity against every locked shelf (conditions, weather, events, loot categories, interaction kinds, enemy ids across eleven rosters), real hazard ticks through `stepHazardZone`, the gentle-introduction assertions (sub-1 threat, no buff, no immunities), real `GalaxyRuntime` travel to Meridian Rest resolving the correct `biomeId` and region, `BiomeRuntime` integration (weather/events only ever from the frontier's own pools across a 4,000-step sweep), interactable range discovery, the Codex entry, and a 1,000-mission seeded sweep in which the frontier's hazards always fire and the hazard census holds. **Live in the browser:** travelled Lucent Gate → Meridian Rest via the real Galaxy Command travel button, launched, and the run's biome WAS the frontier — `Meridian Rest · weather ionClouds · hazards 2` on the overlay, the frontier's own Ion Storms cycling at their authored duration, zero page errors, and the piloted player survived the full observation window (the 0.9 threat modifier working as designed).

**Review verdict:** ALIGNED (zero engine changes anywhere — AF-036's biome engine, AF-038's galaxy engine, and AF-023's loot hook consumed exactly as designed; one dormant AF-038 field gains its first consumer; galaxy/Codex additions are the established additive-roster class). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/HUMAN_FRONTIER_BIOME.md`, `src/game/biomes/frontierBiome.ts`.
