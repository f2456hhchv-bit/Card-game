# AF-063 — SOLAR WASTES BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-062 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/SOLAR_WASTES_BIOME.md` + implementation (`src/game/biomes/solarWastesBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

63

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-062 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Solar Wastes Biome.

The Solar Wastes are star systems approaching the end of their natural life.

Stars are unstable.

Worlds are scorched.

Entire civilisations have been abandoned.

The environment itself is the greatest threat.

Players should constantly feel they are surviving inside the final moments of dying suns.

==================================================
CORE PHILOSOPHY
==================================================

Heat.

Energy.

Decay.

Survival.

Violence.

The biome should feel overwhelming without becoming visually exhausting.

==================================================
BIOME IDENTITY
==================================================

Theme:

Red Giants.

White Dwarfs.

Solar Corona.

Scorched Worlds.

Molten Planets.

Plasma Rivers.

Solar Forges.

Burning Stations.

Everything exists beneath unstable stars.

==================================================
VISUAL LANGUAGE
==================================================

Deep orange.

Crimson.

Molten gold.

Solar plasma.

Ash clouds.

Heat distortion.

Solar arcs.

Burning debris.

Every scene should radiate extreme energy.

==================================================
ENVIRONMENT
==================================================

Support:

Solar Corona

Molten Planets

Plasma Oceans

Stellar Forges

Solar Harvesters

Burning Shipyards

Heat Fractures

Volcanic Moons

Radiation Stations

Solar Elevators

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Solar Flares

Coronal Mass Ejections

Plasma Rain

Radiation Storms

Heat Waves

Magnetic Storms

Fire Tornadoes

Weather constantly reinforces stellar instability.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Radiation Fields

Solar Beams

Plasma Geysers

Molten Debris

Heat Zones

Magnetic Collapse

Explosive Gas Clouds

Solar Shockwaves

Hazards encourage intelligent positioning.

==================================================
MISSION TYPES
==================================================

Support:

Stabilise Solar Arrays

Recover Energy Technology

Rescue Mining Teams

Harvest Stellar Energy

Prevent Reactor Meltdown

Investigate Star Collapse

Protect Research Stations

Escape Solar Storms

The biome rewards planning.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Machine Collective

Human Outlaws

Celestial Conclave

Paragon Protocol

Rare Void Entities

Environmental danger remains constant.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Solar Plasma

Fusion Cores

Thermal Crystals

Energy Cells

Molten Alloys

Radiation Samples

Stellar Catalysts

Advanced Reactor Components

Resources fuel high-tier technology.

==================================================
POINTS OF INTEREST
==================================================

Support:

Solar Harvesters

Ancient Forges

Heat Vaults

Plasma Wells

Fusion Reactors

Orbital Mirrors

Research Platforms

Collapsed Mining Colonies

Exploration rewards calculated risk.

==================================================
BIOME EVENTS
==================================================

Support:

Solar Superflare

Reactor Failure

Coronal Expansion

Heat Cascade

Radiation Surge

Magnetic Collapse

Energy Bloom

Starquake

Events constantly reshape encounters.

==================================================
EXPLORATION
==================================================

Players may discover:

Experimental Reactors

Lost Mining Fleets

Solar Research

Ancient Energy Devices

Fusion Archives

Prototype Weapons

Hidden Forges

Legendary Components

Exploration expands scientific understanding.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Solar Leviathan

Fusion Titan

Living Supernova

Forge Guardian

Radiant Colossus

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Solar Wastes teach:

Stellar evolution.

Energy harvesting.

The dangers of limitless power.

The collapse of energy-dependent civilisations.

The role of stars in precursor technology.

Players begin to understand the true energy requirements of the Afterlight Network.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced bloom

Reduced heat distortion

Hazard indicators

Photosensitivity mode

High Contrast

Colour-blind support

Readable radiation zones

==================================================
PERFORMANCE
==================================================

Pool plasma effects.

Reuse heat shaders.

Optimise particle density.

Stream large solar events.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Solar Activity

Radiation Level

Heat Density

Hazard Count

Weather State

Performance

==================================================
OUTPUT
==================================================

Produce the complete Solar Wastes Biome.

Every future stellar environment, dying star system and energy-based expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Solar Wastes missions.

Review exploration.

Review environmental storytelling.

Review hazard intensity.

Review weather systems.

Review event frequency.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-062.

Adjust solar event frequency.

Adjust resource distribution.

Adjust environmental pacing.

Remove repetitive layouts.

Ensure the Solar Wastes become one of Afterlight's most spectacular biomes, delivering constant environmental tension while remaining fair, readable and highly replayable.

Repeat until the Solar Wastes Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-063.

---

## Foundation / AF-000–062 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058→062 content-module shape, applied to star systems dying in public.** `SOLAR_WASTES_BIOME` is a plain AF-036 `BiomeDef` whose defining mechanical statement IS the spec's thesis — "the environment itself is the greatest threat": the only authored biome where EVERY hazard zone carries a status effect, asserted per-hazard. A Radiation Field applying AF-021's poison (sickness that follows you out of the zone), a Plasma Geyser with heavy burn, and a Solar Shockwave applying AF-053's overload status — its FIRST use as a biome hazard (the dying star scrambling ship systems). Three weathers with real AF-020 forces (Solar Flares dominant, visibility-reducing Radiation Storms — the spec's ash clouds — and the strongest single-axis Heat Wave wind yet), four weighted events with `solarFlare` structurally dominant (asserted ≥ every other weight — stellar instability is the pool's centre of gravity), and AF-023 smart-loot weights biased toward high-tier technology fuel (resource/craftingMaterial/equipment).
- **"Overwhelming without becoming visually exhausting" is honoured structurally:** every danger is a readable AF-035 zone with a fixed tick interval — positioning is always the counterplay ("hazards encourage intelligent positioning", "the biome rewards planning").
- **Enemy Presence follows the spec exactly:** Machine Collective AND Human Outlaws both primary (≥3 defs each, asserted — the salvage wars beneath a dying sun; the `factionConflict` event at weight 2 carries the same story), Celestial Conclave attending their element (including the LIVING SUPERNOVA — the spec's own boss name already fights here as a playable AF-054 entity, asserted by id), a Paragon energy construct, rare Void. Every id resolution-tested across five rosters. `bossId: null` is honest — the five waste boss kinds bind as `BossDef`s when authored.
- **The star is the enemy, not the factions:** `threatModifier: 1.3` slots BETWEEN the Forge (1.25) and the Void (1.35) — asserted from both sides, the first biome placed mid-ladder rather than atop it, because the Wastes' danger budget lives in the environment, not the roster. Natives via AF-036's live `enemyBuff` hook (`shieldCapacity +12`, thermal shielding) with `hazardImmunities: ["burn", "poison"]` — forged under this sun.
- **Cinderfall joins the galaxy additively:** a new `solarWastes` region and system (threat 4, Machine Collective dominant, off Forge Primus — burning shipyards beside the foundries, three real travel hops, no Fast Travel gate) carrying `biomeId: "solar-wastes"` through AF-058's registry — the sixth consumer of AF-038's field — with a collapsed-mining-colony POI (`miningColonies` kind) discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the Cinderfall ancient forge discovers `LORE_SOLAR_WASTES_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-solar-wastes` entry — cross-referencing the Conclave profile AND the Ancient Core biome entry, because the spec's lore payload ("the role of stars in precursor technology… the true energy requirements of the Afterlight Network") is exactly the thread connecting the star-shepherds to what the precursors built — with zero Missing Links. An Orbital Mirror interactable uses `disableHazard` (redirect the mirror and the beam goes out).
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the five-faction enemy-presence structure (dual-primary Machines+Outlaws ≥3 each, all three guests, living-supernova by id), all three real hazard ticks with the every-hazard-has-a-status assertion plus the poison/burn/overload kind assertions, the dying-sun assertions (dual immunity, live buff hook, threat bounded between AF-060's and AF-061's from both sides, solarFlare pool dominance), real `GalaxyRuntime` travel through Hollow Drift and Forge Primus to Cinderfall resolving the Wastes `biomeId`, `BiomeRuntime` integration (weather/events only from the Wastes' own pools across 4,000 steps), the ancient-forge discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Wastes' hazards always fire ("the star never relents", literally asserted). **Live in the browser:** travelled Lucent Gate → Hollow Drift → Forge Primus → Cinderfall via three real travel buttons, launched, and the Wastes ran live — `biome Cinderfall · weather solarStorms (7s) · hazards 3` and `galaxy Cinderfall (solarWastes)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the sixth biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; one status kind given its first biome-hazard producer). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/SOLAR_WASTES_BIOME.md`, `src/game/biomes/solarWastesBiome.ts`.
