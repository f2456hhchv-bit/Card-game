# AFTERLIGHT — Asset Manifest

**Status today: zero art or audio assets exist.** Every entry below is currently rendered as a coloured rectangle, a canvas primitive, or plain text on a 640×360 2D canvas; every sound cue is recorded by a `NullAudioBackend` that logs what *would* have played and produces no sound. There is no starfield, parallax layer, or background art system of any kind — the entire play-field is a single flat-colour `fillRect`. This document enumerates every distinctly-named piece of content the shipped gameplay code already references, so nothing is invented.

**This is a two-pass document, and it will likely grow again.** Pass 1 (2026-07-11) covered every top-level roster (ships, weapons, enemies, bosses, biomes, etc.). Pass 2 (2026-07-11, same day, prompted by "is this *really* everything") went one layer deeper and found real gaps: per-biome environmental flavour, an entire pre-existing "visual direction" data file, cosmetic reward titles/frames, achievements, faction reputation, manufacturer emblems, and exact fire-pattern/projectile-behaviour names. Both passes are folded in below.

**Two things keep this list from ever being provably final, and it's worth saying plainly rather than re-promising completeness:**
1. **The art style hasn't been implemented yet.** The committed direction (chibi-proportioned stylized 3D, per `TECHNOLOGY_DECISION.md`'s amendment) doesn't exist in code, so nobody can yet say how many frames, what resolution, or what rig any single entry needs — that's a production decision downstream of choosing and building a rendering pipeline, not a fact this data layer can state.
2. **The codebase has multiple layers of "registered but never wired" content** — most visibly the `atlas*Data.ts` lore modules, and (found in Pass 2) each biome's own Locations/Mission Types/Resources/Events/Discoveries/Boss-Kind sub-registries (~390 more names, confirmed to have zero runtime consumers anywhere). These are excluded from the required-asset counts below because nothing renders them today — but the moment a future module wires one up, it becomes real, and this list is stale until extended again.

Counts reflect the roster as of this document's date (2026-07-11) — new content modules will extend these lists, never shrink them.

---

## Contents & totals

| # | Category | Count | Asset needed |
|---|---|---|---|
| 1 | Ships | 10 | Hangar portrait/model + in-run sprite + thumbnail icon |
| 2 | Weapons | 12 | Icon + projectile sprite + muzzle flash VFX + impact VFX |
| 3 | Commanders | 53 | Portrait + in-run sprite/model + ultimate-ability VFX |
| 4 | Equipment items | 10 | Icon |
| 5 | Ship modules | 8 | Icon |
| 6 | Enemies | 61 | Sprite/model with idle, move, attack, death states |
| 7 | Elite mutations | 18 | Visual tell (tint/particle overlay) applicable to any enemy |
| 8 | Elite tiers | 7 | Escalating border/glow treatment |
| 9 | Boss (base + 2 variants) | 3 instances / 4 phases / 1 weak point | Model with 4 distinct phase visual states + weak-point highlight |
| 10 | Boss Artifacts | 5 | Icon + activation VFX |
| 11 | Passives | 14 | Icon |
| 12 | Standalone Artifacts | 4 | Icon + effect VFX |
| 13 | Relics | 9 individual + 2 sets | Icon + set-bonus visual tell |
| 14 | Biomes | 11 | Background/environment art + weather VFX + hazard art + POI icons |
| 15 | Galaxy clusters / regions / star systems | 2 / 11 / 15 | Star-map icon + background art |
| 16 | Mission templates | 5 | Briefing illustration |
| 17 | Mission modifiers | 19 | Icon + environmental overlay VFX |
| 18 | UI screens | 24 | Full screen layout/background art |
| 19 | Audio cues | 12 | Sound effect |
| 20 | Music states | 14 | Music track/loop |
| 21 | Particle burst kinds | 5 | VFX |
| 22 | Status effect kinds | 10 | VFX (applied to affected entity) |
| 23 | Loot rarity tiers | 9 | Border/glow/icon-frame treatment |
| 24 | Resources | 15 | Icon |
| 25 | Currencies | 6 | Icon |
| 26 | Per-biome Weather kinds | 70 | Weather VFX (may reuse 7 shared engine implementations — see §14a) |
| 27 | Per-biome Hazard kinds | 79 | Hazard art + trigger VFX |
| 28 | Per-biome POI kinds | 80 | Discovery/landmark icon or set-piece art |
| 29 | Shared biome event kinds | 10 | Event-trigger VFX/banner |
| 30 | Titles (cosmetic reward) | 7 | Title-card/banner treatment |
| 31 | Portrait Frames (cosmetic reward) | 4 | Frame border art |
| 32 | Reputation Titles | 8 | Reused as text, but a distinct rank badge per tier is standard |
| 33 | Achievements | 8 | Badge icon |
| 34 | Faction Reputation tiers | 8 | Standing icon/bar segment |
| 35 | Weapon + Ship manufacturer emblems | 26 | Logo/emblem |
| 36 | Fire patterns (geometric + identity) | 12 | Muzzle/spawn-geometry VFX |
| 37 | Projectile behaviours | 12 | Distinct projectile visual/trail |
| 38 | XP pickup tiers | 7 | Gem/orb sprite |

**Grand total of individually-named entries needing a dedicated asset: 705** (still before each enemy's 4 animation states, or resolution/frame-count decisions that depend on a chosen art pipeline — see the intro above).

---

## 1. Ships (10) — `src/game/ships/`

Each needs: a hangar/loadout **portrait or 3D render**, an in-run **top-down sprite**, and a small **roster thumbnail**.

| id | Name | Class | Manufacturer | Tier |
|---|---|---|---|---|
| `wayfarer-hull-mk2` | Wayfarer Mk. II | Scout | Halcyon Driveworks | Common |
| `bastion-hull-mk1` | Bastion Mk. I | Guardian | Ironmoor Foundry | Uncommon |
| `aurelia-hull-mk1` | Aurelia Mk. I | Experimental | Meridian Yards | Ancient |
| `sable-dart-mk1` | Sable Dart Mk. I | Interceptor | Helios Industries | Uncommon |
| `falchion-mk2` | Falchion Mk. II | Assault | Vanguard Fleetworks | Rare |
| `hivemother-mk1` | Hivemother Mk. I | Carrier | Nova Forge | Epic |
| `dawnspire` | Dawnspire | Ancient | Ancient Foundry | Legendary |
| `ballista-mk3` | Ballista Mk. III | Destroyer | Atlas Dynamics | Uncommon |
| `caduceus-mk1` | Caduceus Mk. I | Engineer | Aegis Systems | Rare |
| `maelstrom-x1` | Maelstrom X-1 | Prototype | Prototype Division | Prototype |

---

## 2. Weapons (12) — `src/game/weapons/`

Each needs: an **inventory/HUD icon**, a **projectile sprite** (shape follows `projectileBehaviour`), a **muzzle flash**, and an **impact VFX**.

| id | Name | Category | Manufacturer | Tier/Rarity | Fire pattern | Projectile behaviour |
|---|---|---|---|---|---|---|
| `coil-ripper` | Coil Ripper | Ballistic | Halcyon Driveworks | 1 / Common | singleShot | piercing |
| `coil-ripper-mk2` | Coil Ripper Mk. II | Arc | Halcyon Driveworks | 2 / Rare | chain | chainLightning |
| `novasplitter` | Novasplitter | Flak | Ironmoor Foundry | 2 / Improved | nova | explosive |
| `voidlance` | Voidlance | Void | Void Legion Remnant | 3 / Epic | beam | persistentBeam |
| `hailborn-array` | Hailborn Array | Crystal | Meridian Yards | 2 / Rare | spread | splitting |
| `swarm-tender` | Swarm Tender | Summon | Halcyon Driveworks | 2 / Rare | orbit | orbiting |
| `spore-lance` | Spore Lance | Plasma | Meridian Yards | 2 / Improved | burst | piercing |
| `atlas-cluster-battery` | Atlas Cluster Battery | Missile | Atlas Dynamics | 1 / Common | spread | explosive |
| `helios-prism-array` | Helios Prism Array | Laser | Helios Industries | 3 / Epic | spread | piercing |
| `paragon-flux-driver` | Paragon Flux Driver | Singularity | Paragon Laboratories | 4 / Legendary | chargedShot | gravityAffected |
| `foundry-sunlance` | Foundry Sunlance | Ancient | Ancient Foundry | 4 / Legendary | beam | persistentBeam |
| `salvage-scattergun` | Salvage Scattergun | Flak | Frontier Salvage | 1 / Common | arc | straight |

*Note: 14 weapon manufacturers are registered with their own written visual-identity briefs (`visualIdentity`/`engineeringStyle` fields already in the data — e.g. Atlas Dynamics: "Slab breeches, visible bolts"; Void Legion Remnant: "Matte void panels"). These aren't separate assets but should be the actual style-guide input for every weapon icon/projectile above.*

---

## 3. Commanders (53) — `src/game/commanders/`

Each needs: a **portrait** (menu/recruitment), an **in-run sprite/model**, and a distinct **ultimate-ability VFX**. This is the single largest asset category in the game.

**Base roster (22):**
Ilsa Reyes "Longlight" (Orbital Strike) · Vek Tarn "Ironhull" (Planetary Defence Grid) · Dr. Sen Vael "Meridian" (Field Breakthrough) · Jelan Okoye "Torque" (Total Overhaul) · Ai Naru "Whisper" (Pathfinder Protocol) · Dain Vex "Longfang" (Apex Hour) · Petra Holt "Thunderline" (Grid Bombardment) · Rell Anders "Cipher" (Root Access) · Suno Kite "Aviary" (Full Wing) · Mara Sel "Keystone" (Collapse Point) · Ilex Vane "Chord" (Full Chorus) · Dr. Oshen Kael "Nadir" (Publish or Perish) · Juno Farr "Redline" (Eleventh Prototype) · Sera Iman "Relay" (Open Every Door) · Thessaly Korr "Wardbreaker" (Guild Writ Enforced) · Dr. Imara Voss "Lanternkeep" (Unsealed Index) · Ash Devereux "Static" (Static Line) · Rin Okafor "Halcyon" (Halcyon Hour) · Vantha Ur-Sella "Chorus" (Full Assembly) · Boren Kade "Fulcrum" (Full Integration) · Yuen Calder "Driftline" (Convoy Sense) · Dr. Petrin Aldana "Aftercare" (Case Closed)

**Codex/story roster (31):**
Dr. Lyra Voss "Pathfinder" (Afterlight Beacon) · Adrian Kane "Vanguard" (Fortress Formation) · Elias Ryker "Engineer" (Forward Operating Base) · Seraphina Cael "Weaver" (Reality Bloom) · Kael Drake "Hunter" (Perfect Hunt) · Aria Sol "Resonant" (Symphony of Light) · Orion Vale "Voidrunner" (Beyond the Horizon) · Nova Iskander "Swarmmaster" (Hive Network) · Cassia Thorne "Starforged" (Starforge Core) · Aurelion Vex "Chronomancer" (Frozen Moment) · Valen Ash "Tempest" (Planetfall Storm) · Nyx Korven "Phantom" (Blackout Network) · Dr. Mira Syn "Bioforge" (Genesis Protocol) · Rhea Solari "Photon" (Helios Cascade) · Zephyr Kain "Singularity" (Event Horizon) · Astrid Reyes "Warden" (Last Sanctuary) · Lucien Orion "Starlancer" (Supernova Drive) · Ivan Volkov "Titan" (Bulwark Protocol) · Selene Myrr "Oracle" (Future Vision) · Caelus Nova "Architect" (Frontier Citadel) · Talia Vega "Echo" (Deep Echo Network) · Darius Rhem "Catalyst" (Critical Mass) · Eliana Ross "Horizon" (New Frontier) · Kieran Solace "Diplomat" (United Front) · Xanthe Oris "Nanoforge" (Genesis Fabricator) · Ronan Drake "Sentinel" (Planetary Defence Matrix) · Sora Helix "Alchemist" (Grand Synthesis) · Dorian Fen "Beastmaster" (Wild Dominion) · Vega Noctis "Voidwalker" (Beyond the Veil) · Lysandra Aether "Celestial" (Birth of a Galaxy) · Atlas Prime "Founder" (Afterlight)

*17 distinct commander classes are represented (assault, guardian, crystalSpecialist, engineer, recon, hybrid, experimental, scientist, support, prototypePilot, droneCommander, voidSpecialist, orbitalCommander) — each class implies a distinct silhouette/uniform language, so this is really 17 base looks × individual face/colour variation, not 53 fully unique designs from scratch.*

---

## 4. Equipment items (10) — `src/game/equipment/`

Icon only.

`refit-cannon` (Refit Cannon) · `barrier-plate` (Barrier Plate, Vanguard Set) · `vanguard-thrusters` (Vanguard Thrusters, Vanguard Set) · `vanguard-core` (Vanguard Core, Vanguard Set) · `ancient-relay` (Ancient Relay, unique) · `cryo-manifold` (Cryo Manifold) · `aegis-bastion-array` (Aegis Bastion Array, Bastion Doctrine) · `aegis-ward-projector` (Aegis Ward Projector, Bastion Doctrine) · `horizon-flux-capacitor` (Horizon Flux Capacitor, unique) · `nova-warden-hive` (Nova Warden Hive)

## 5. Ship modules (8) — `src/game/ships/`

Icon only. `module-fusion-reactor` (Fusion Reactor) · `module-vector-engine` (Vector Engine) · `module-lattice-shield` (Lattice Shield) · `module-predictive-targeter` (Predictive Targeter) · `module-drone-bay` (Drone Bay) · `module-deep-sensor` (Deep Sensor Array) · `module-cryo-loop` (Cryo Cooling Loop) · `module-axiom-core` (Axiom Core)

---

## 6. Enemies (61 across 11 factions) — `src/game/enemies/`

Each needs a **sprite/model with idle, move, attack, and death states** — 61 × 4 = **244 individual animation frames/states minimum**. 19 distinct role tags (chaser, flanker, sniper, tank, support, healer, disruptor, summoner, controller, areaDenial, elite, bossSupport, assassin, commander, charger, ambusher, burrower, exploder, shieldUnit) mean silhouettes should read at a glance even before colour.

**Sandbox (2):** Wisp Chaser · Flak Orbiter

**Mercenary Guild / Outlaws (5)** — industrial, angular scrap armour, orange warning / grey plating: Outlaw Raider · Outlaw Sniper · Outlaw Shield Carrier · Outlaw Mine Layer · Outlaw Captain

**Machine Collective (6)** — dark alloy, hexagonal shielding, blue core glow: Machine Combat Drone · Machine Sniper Unit · Machine Shield Generator · Machine Repair Drone · Machine Swarm Constructor · Machine Command Core

**Crystal Dominion (6)** — translucent crystal, prismatic light, blue/violet/green veins: Crystal Drone · Shard Hunter · Resonance Node · Growth Seeder · Crystal Guardian · Crystal Titan

**Void Swarm (6)** — black energy, distorted silhouettes, gravitational lensing: Void Wisp · Corruption Parasite · Shadow Hunter · Void Beacon · Rift Guardian · Ancient Void Avatar

**Ancient Custodians (6)** — white ceramic, gold frames, blue-white energy, ancient glyphs: Sentinel · Defence Drone · Guardian Sphere · Shield Architect · Custodian Walker · Ancient Executor

**Xenomorph Hive (6)** — organic bone plating, bioluminescent veins, acid-yellow: Hive Drone · Spitter · Stalker · Evolution Node · Crusher · Living Titan

**Stellar Nomads (6)** — mixed salvaged hull plating, welding scars, colourful markings: Scout Skiff · Hunter · Escort Fighter · Junker Gunship · Repair Frigate · Nomad Flagship

**Paragon Protocol (6)** — white lab alloy, orange warning lights, quantum distortion: Prototype Drone · Pulse Cannon · Adaptive Hunter · Containment Sentinel · Energy Construct · Omega Prototype

**Celestial Conclave (6)** — solar plasma, golden-white energy, nebula halos: Solar Spark · Pulsar Hunter · Gravity Oracle · Constellation Avatar · Corona Guardian · Living Supernova

**The Eclipsed (6)** — damaged/flickering armour, broken insignias, grey/purple/pale palette: Lost Scout · Broken Pilot · Echo Drone · Memory Warden · Fallen Guardian · Eclipsed Champion

## 7. Elite mutations (18) — `src/game/enemies/eliteData.ts`

A **visual tell** — layered onto *any* enemy sprite above — for each: regeneration (pulsing green seams) · shielded (barrier shimmer) · explosive (cracked glowing plating) · teleport (spatial distortion flash) · reflectiveArmour (mirrored sheen) · rapidAssault (overcharged weapon glow) · gravityField (distortion ring) · summoner (beacon pulse) · berserker (red low-hull flare) · cryogenic (frost trail) · incendiary (trailing embers) · corrupted (glitching void-purple outline) · quantumShift (flickering double-image) · temporalEcho (translucent duplicate) · adaptiveArmour (colour-shifting plates) · electric (crackling arcs) · cloaked (fading outline) · vampiric (red damage tether)

## 8. Elite tiers (7) — escalating border/glow only

veteran · champion · ancient · prime · legendary · apex · mythic

---

## 9. Boss — The Hollow Sentinel (1 base + 2 generated variants) — `src/game/bosses/bossData.ts`

One model, **4 distinct phase visual states**, plus a highlighted **weak point**:
1. **Siege** — Siege Cannon, orbiting movement
2. **Collapse** — Collapse Nova (AoE + corruption), teleport movement
3. **Chaos** — Chaos Spiral (missile spiral), wall-crawling movement
4. **Signature** — Vault Beam (sustained beam + burn), teleport movement
- Weak point: **Core Eye**
- Enrage state (final-stand look, triggers at 15% hull)
- Variants reuse the same model at different scale/hull-bar length: **The Hollow Sentinel** (base) · **World-Ender The Hollow Sentinel** (World Boss, larger) · **The Hollow Sentinel Vanguard** (Mini Boss, smaller, only Siege+Collapse phases)

## 10. Boss Artifacts (5) — icon + activation VFX

Living Reactor (heal-pulse + AoE scorch) · Atlas Core (fire-rate aura) · Graviton Heart (boost-triggered gravity well) · Stellar Compass (loot-floor glow) · Void Engine (boost-triggered shockwave)

---

## 11. Passives (14) — `src/game/passives/passiveData.ts` — icon only

Focus Fire · Overcharge Coils · Deadeye · Light Frame · Hardened Plating · Wide Net · Nanite Mesh · Salvage Protocol · Fast Learner · Escort Link · Guardian Ward · Signal Boost · Drone Primer · Resonance

## 12. Standalone Artifacts (4) — icon + effect VFX

Shrapnel Core (nova on kill) · Reactive Plating (barrier on damage) · Fail-Safe Cell (heal on shield break) · Ascension Matrix (crit on level-up)

## 13. Relics (9) + Relic Sets (2) — icon + set-bonus tell

Ember Core · Frost Shard · Cinder Heart (Ember+Frost fusion) · Gambler's Die · Static Node · Conduit Loop · Warden's Token · Singularity Keepsake · Veil Fragment
Sets: **Thermal Cycle** (Cinder Heart + Static Node) · **Expedition Ledger** (Conduit Loop + Gambler's Die + Singularity Keepsake)

---

## 14. Biomes (11) — `src/game/biomes/`

Each needs **background/environment art** at minimum — see §14a immediately below for the exact per-biome weather/hazard/POI names, and §14b for what's already art-directed vs. still placeholder.

Crystal Fields (starved-light crystal growths) · Meridian Rest (half-lit rebuilt trade station) · Prismheart (refractive crystal valley) · Forge Primus (industrial factory world) · Hollow Crown (reality-torn empty space) · First Light (precursor archive) · Cinderfall (dying-sun salvage wars) · Winterline (cryogenic suspended colony) · Gravewake (starship graveyard) · Verdance (single-organism planet) · Axiom (physics-breaking singularity zone)

### 14a. Per-biome Weather / Hazard / POI kinds — Pass 2 addition

Each of the 10 named-file biomes (the sandbox Crystal Fields reuses the shared engine kinds directly) defines its **own** named Weather, Hazard, and POI vocabulary — not shared between biomes. Every biome-specific weather name maps down onto one of **7 shared engine `WeatherKind` visual implementations** (solarStorms, crystalRain, meteorActivity, nebulaDrift, voidLightning, energyWinds, ionClouds) for its actual mechanical/visual behaviour — so the real art decision is whether each biome's flavour name gets a bespoke look, or reuses/retints one of the 7 base weather systems. There's also one shared `BiomeEventKind` (10 values: distressSignal, ancientVault, lostExpedition, machineActivation, crystalBloom, solarFlare, voidBreach, wanderingMerchant, prototypeWreckage, factionConflict), each firing a real, tracked in-run event.

| Biome | Weather (7 each) | Hazards | POI/Discovery (8 each) |
|---|---|---|---|
| Ancient Core | solarStreams, energyRain, quantumResonance, gravityHarmony, lightBloom, stellarWinds, ancientEnergyPulses | securityFields, energyBridges, quantumGates, gravityWells, guardianArrays, defenceLasers, collapsingPlatforms, temporalLocks (8) | planetaryLibraries, stellarObservatories, ancientCouncils, knowledgeWells, guardianTemples, quantumBridges, memoryArchives, civilisationMonuments |
| Crystal Expanse | crystalRain, prismaticStorms, energyWinds, resonancePulses, lightBloom, crystalMist, solarRefraction | growingCrystalWalls, reflectiveShards, energyEruptions, resonanceFields, crystalExplosions, collapsingFormations, prismaticLasers, livingTerrain (8) | resonanceWells, livingMonoliths, ancientCrystalArchives, energyBridges, crystalBloomSites, hiddenCaverns, planetaryHeartChambers, prismaticSanctuaries |
| Derelict Expanse | debrisStorms, electromagneticClouds, microMeteorFields, staticDisturbance, sensorInterference, powerFluctuations, ionDust | hullExplosions, reactorLeaks, electricalDischarge, floatingDebris, brokenGravityFields, radiationPockets, fuelFires, unstableWreckage (8) | ghostCarriers, abandonedBridges, cryoEscapePods, fleetCommandShips, prototypeHangars, researchVessels, cargoVaults, emergencyBeacons |
| Human Frontier | solarWinds, debrisFields, ionStorms, microMeteorShowers, radiationClouds, engineExhaustFields, electricalStorms | damagedStations, explosiveFuelTanks, minefields, debrisBelts, electricalArcs, reactorLeaks, navigationHazards (7) | distressSignals, abandonedStations, miningOperations, civilianSettlements, prototypeWorkshops, blackMarketOutposts, navigationBeacons, historicWrecks |
| Frozen Reach | cryoStorms, auroraActivity, iceFog, frozenDust, electrostaticSnow, crystalHail, thermalCollapse | iceCracks, cryogenicFields, frozenGasClouds, slipperySurfaces, thermalShock, cryoExplosions, fallingIce, frozenDebris (8) | cryoVaults, frozenFleets, ancientLaboratories, iceTemples, subsurfaceCities, auroraObservatories, preservationChambers, deepIceArchives |
| Living Ecospheres | sporeStorms, pollenClouds, bioluminescentRain, livingFog, photosyntheticBloom, seedWinds, organicLightning | carnivorousFlora, toxicSpores, livingVines, rootTraps, acidSap, sporeBursts, collapsingGrowth, organicAmbushes (8) | planetaryHeart, evolutionPools, ancientBioLabs, livingTemples, seedVaults, symbiosisChambers, organicArchives, giganticRootSystems |
| Machine Expanse | electricalStorms, plasmaRain, steamClouds, empWaves, magneticWinds, coolingVents, ionDischarge | movingMachinery, laserGrids, crushingPresses, moltenMetal, electrifiedFloors, assemblyArms, powerSurges, securityTurrets (8) | prototypeLaboratories, aiArchives, machineTemples, manufacturingVaults, orbitalShipyards, controlSpires, energyWells, lostResearchFacilities |
| Singularity Zone | gravityStorms, quantumRain, realityCascades, timeEchoes, lightInversions, particleCollapse, probabilityWaves | microSingularities, gravityCollapse, timeDilationFields, probabilityZones, realityFractures, quantumLightning, phaseInstability, eventHorizonSurges (8) | realityWells, infiniteLibraries, collapsedObservatories, quantumArchives, singularityTemples, mathematicalEngines, timeVaults, impossibleMonuments |
| Solar Wastes | solarFlares, coronalMassEjections, plasmaRain, radiationStorms, heatWaves, magneticStorms, fireTornadoes | radiationFields, solarBeams, plasmaGeysers, moltenDebris, heatZones, magneticCollapse, explosiveGasClouds, solarShockwaves (8) | solarHarvesters, ancientForges, heatVaults, plasmaWells, fusionReactors, orbitalMirrors, researchPlatforms, collapsedMiningColonies |
| Void Expanse | voidStorms, realityPulses, gravitationalWaves, darkMatterClouds, temporalEchoes, spatialDistortion, quantumRain | gravityWells, realityTears, temporalFields, voidZones, darkEnergyBursts, movingSingularities, collapsingSpace, phaseHazards (8) | realityAnchors, collapsedGateways, voidArchives, ancientMonoliths, singularityChambers, dimensionalBridges, lostFleets, quantumBeacons |

**Totals: 70 weather + 79 hazard + 80 POI = 229**, plus the 10 shared event kinds above.

### 14b. Visual Direction data (AF-092) — `src/game/visual/visualDirectionData.ts`

A real, pre-existing art-direction data file — **not previously in this manifest.** It's mostly a skeleton:
- **6 Faction Colour Signatures** are fully authored (primary/secondary/energy/UI-accent hex + lighting theme + material palette + one-line visual signature) for crystalDominion, machineCollective, humanAlliance, mercenaryGuild, ancientCustodians, nomadFleet — these are real palettes ready to hand to an artist today.
- **Biome Visual Identity (8 elements: lighting, fog, skybox, planetaryColours, architecture, vegetation, weather, environmentalVfx) is authored for only 2 of 11 biomes** — `crystal-fields-alpha` and `frozen-reach`. The other 9 fall back to literal placeholder strings like `"forge-primus lighting (generated)"` — i.e. **9 biomes have no real art direction written down at all yet**, only a name.
- Also present, all still 100% future/unbuilt: 8 Lighting Themes (1 live: weatherLighting), 9 VFX-priority kinds, 8 Cinematic Presentation bindings, 7 Animation Language principles, 7 Camera Framework kinds (1 live: gameplayCamera), 8 Photo Mode features (0 live), 7 Accessibility surfaces (2 live: highContrast, colourBlindModes), 5 Performance disciplines.

## 15. Galaxy structure — `src/game/galaxy/`

- **Galaxy clusters (2):** The Lucent Cluster · The Shattered Expanse — each needs a distinct galaxy-map background.
- **Galaxy regions (11):** Crystal Dominion · Human Frontier · Machine Expanse · Void Expanse · Ancient Core · Solar Wastes · Frozen Reach · Broken Systems · Dark Nebula · Singularity Zone · Shattered Expanse — each needs a region label/nebula-art treatment on the star map.
- **Star systems (15):** Lucent Gate · Hollow Drift · Ember Reach · Meridian Rest · Prismheart · Forge Primus · Hollow Crown · First Light · Cinderfall · Winterline · Gravewake · Verdance · Axiom · Shatter Approach · Shatter Core — each needs a star-map node icon.

## 16. Mission templates (5) — `src/game/missions/`

Briefing illustration each: Crystal Fields Incursion · Winterline Rescue · First Light Excavation · Forge Primus Uprising · The Vault Signal

## 17. Mission modifiers (19) — icon + environmental overlay VFX

Low Gravity · Radiation · Elite Activity · Double Rewards · Shield Instability · Weapon Overcharge · Crystal Bloom · Dark Sector · Void Corruption · Experimental Conditions · Meteor Storm · Solar Radiation · Black Hole Distortion · Electrical Nebula · Frozen Sector · Toxic Clouds · Dark Matter · Ancient Battlefield · Civilian Evacuation

---

## 18. UI screens (24) — `src/game/states/GameStates.ts`

Each is a full layout/background treatment, not just an icon: Boot · Splash · MainMenu · GalaxyCommand · MissionSelect · Loading · Gameplay (HUD chrome) · Pause · LevelUp · InventoryOverlay · MissionComplete · Defeat · Statistics · Multiplayer *(reserved, unbuilt)* · CommunityHub *(reserved, unbuilt)* · BuildPathChoice · MidRunMerchant · ExtractionDecision · BossArtifactChoice · RecruitCommanders · ViewMuseum · ReadCodex · ManageAtlas · LoadoutChoice

*Also needed but not tied to a single named entry: generic HUD chrome — health/shield bar, energy bar, minimap, crosshair/reticle, floating damage-number typeface, toast/notification banner, wave/boss-timer readout.*

*Codex and Museum screens display already-listed content (enemies, weapons, commanders, bosses) rather than introducing new named entries — they need their own screen chrome (counted above) plus reuse of each entry's own art as a thumbnail.*

---

## 19. Audio cues (12) — `src/game/audio/audioData.ts`

Critical Hit · Shield Break · Level Up · Legendary Drop · Boss Spawn · Mission Complete · Mission Failed · Enemy Death · Elite Death · Research Complete · Craft Success · Achievement

## 20. Music states (14)

Galaxy Command (menu) · Exploration · Combat · Heavy Combat · Elite Encounter · Boss Introduction · Boss Phase 2 · Boss Phase 3 ("Chaos") · Boss Phase 4+ ("Signature") · Victory · Defeat · Research *(registered, unused)* · Crafting *(registered, unused)* · Credits *(registered, unused)*

---

## 21. Particle burst kinds (5) — `src/engine/vfx/particleTuning.ts`

Hit Impact (small white) · Elite Death (orange, mid) · Boss Phase Change (large gold) · Explosion (large red) · Level Up (cyan celebratory)

## 22. Status effect kinds (10) — `src/game/combat/combatTuning.ts`

Burn · Shock · Freeze · Corruption · Poison · Slow · Stasis · Shield Break · Armour Break · Overload — each needs a visual applied to the affected sprite (tint, particle loop, or icon badge).

---

## 23. Loot rarity tiers (9) — `src/game/loot/lootTuning.ts`

Each needs a consistent border/glow/icon-frame treatment at its already-defined colour: Damaged `#7a8296` · Common `#dce4f2` · Improved `#4de868` · Rare `#4d7cff` · Epic `#9b5cff` · Legendary `#ffc652` · Ancient `#c8323c` · Mythic `#fff3d6` · Singularity `#e4d4ff`

## 24. Resources (15) — icon each

Common Materials · Rare Alloys · Crystal Fragments · Void Essence · Ancient Components · Quantum Cores · Energy Cells · Research Samples · Mythic Materials · Singularity Matter · Dark Matter · Quantum Crystals · Biomass · Living Metal · Atlas Fragments

## 25. Currencies (6) — icon each

Credits · Research Data · Ancient Fragments · Crystal Essence · Void Matter · Singularity Cores

---

## Pass 2 additions (2026-07-11, same day)

## 26. Titles, Portrait Frames & Reputation Titles (19) — cosmetic rewards

**Titles (7)** — earned from missions/achievements/bosses/codex, each needs a **title-card/banner treatment**: TITLE_UNSCARRED (flawless Hollow Sentinel clear) · TITLE_VETERAN · TITLE_ARCHIVIST_OF_BOSSES · TITLE_WINTERLINE_WARDEN · TITLE_FOUNDRY_BREAKER · TITLE_UNTOUCHED · TITLE_DRONE_REAPER

**Portrait Frames (4)** — border art for the commander portrait: FRAME_BOSS_HUNTER · FRAME_FIRST_LIGHT · FRAME_ELITE_HUNTER · FRAME_HARVESTER

**Reputation Titles (8)** — derived from the player's dominant Legacy category, displayed as a player-facing rank: The Explorer · The Builder · The Scientist · The Guardian · The Diplomat · The Founder · The Pathfinder · The Restorer

## 27. Achievements (8) — `src/game/achievements/achievementData.ts` — badge icon each

Veteran (destroy 50 enemies) · Boss Hunter (defeat a Boss) · Curator (discover 2 Lore Entries) · Trusted Ally (reach 50 reputation with the Crystal Dominion) · Master Researcher (unlock 2 Research Nodes) · Trade Networks Restored · Ghost in the Vault (hidden) · First Contact (hidden)

## 28. Faction Reputation tiers (8) — `src/game/factions/factionData.ts` — standing icon/bar segment each

hostile · distrusted · neutral · known · trusted · respected · honoured · legendaryAlly

## 29. Weapon + Ship Manufacturer emblems (26)

**Weapon manufacturers (14):** Atlas Dynamics · Helios Industries · Nova Forge · Vanguard Systems · Aegis Armaments · Quantum Horizon · Black Horizon · Frontier Salvage · Ancient Foundry · Paragon Laboratories · Halcyon Driveworks · Ironmoor Foundry · Void Legion Remnant · Meridian Yards

**Ship manufacturers (12):** Atlas Dynamics · Helios Industries · Nova Forge · Aegis Systems · Vanguard Fleetworks · Eclipse Engineering · Quantum Horizon · Ancient Foundry · Prototype Division · Halcyon Driveworks · Ironmoor Foundry · Meridian Yards

*(A third, adjacent list — `ENGINEERING_MANUFACTURER_IDS`, 14 ids for equipment — reuses the same manufacturer identities and isn't counted separately here.)*

## 30. Fire patterns (12) + Projectile behaviours (12) — `src/game/weapons/weaponData.ts`

**Geometric fire patterns (6):** singleShot · burst · spread · arc · nova · spiral
**Identity fire patterns (6):** beam · orbit · homing · chain · wave · chargedShot
**Projectile behaviours (12):** straight · seeking · bouncing · piercing · explosive · returning · accelerating · splitting · orbiting · chainLightning · persistentBeam · gravityAffected

Every weapon in §2 combines one fire pattern + one behaviour — the muzzle/spawn-geometry VFX and the projectile's own visual/trail should be built against these 24 primitives rather than once per weapon, so all 12 weapons (and every future one) compose from a shared, finite set.

## 31. XP pickup tiers (7) — `src/game/progression/xpTuning.ts` — gem/orb sprite each

small · medium · large · elite · boss · ancient · research

---

## What this document deliberately excludes

- **Blueprint categories (6)** and **weapon families (~24)** — these are organisational tags over the content above, not separate assets.
- **Codex/Museum entries** — display views over already-listed content; need only their own screen chrome (§18) plus reused thumbnails.
- Anything from the many `atlas*Data.ts` lore/world-building modules (Atlas Civilisation, Atlas Wisdom, Atlas Philosophy, etc.) — narrative/statistical data registries with no runtime rendering, not yet wired to any visual presentation layer.
- **Each biome's own Locations (10), Mission Types (8), Resources (8), Events (8), Discoveries (8), and Boss Kinds (5) sub-registries — ~390 more named strings across the 10 biome files** (confirmed via search: zero imports, zero runtime consumers anywhere outside their own definition file). Same category as the Atlas modules above. If a future module wires these up, they become real requirements this document doesn't yet count.
- **Faction Colour Signatures (6, already authored in `visualDirectionData.ts`)** and the **7 shared engine `WeatherKind` implementations** — not counted as separate line items since they're the *reusable basis* other rows (§14a, enemy factions) are built from, not new named entries of their own.

## What still can't be answered from code alone

- **Per-entity animation frame counts, sprite resolutions, and rig requirements** — depend entirely on the (not-yet-built) chibi-3D rendering pipeline. §6's "244 animation states minimum" is a floor (idle/move/attack/death × 61 enemies), not a spec.
- **Whether each biome's 7-per-biome weather flavour needs a bespoke look or can retint one of the 7 shared engine types** (§14a) — an art-direction call, not a code fact.
- **9 of 11 biomes have no authored visual identity at all** (§14b) — until someone writes their lighting/fog/skybox/architecture/vegetation direction (the same way `crystal-fields-alpha` and `frozen-reach` already have), there's nothing yet for an artist to build *toward* for those 9, only a name and a one-line lore snippet.

This manifest reflects the shipped data layer as of 2026-07-11 (GP-FINAL locked), across two passes the same day. It will grow again as future AF/GP modules add content, and as the rendering pipeline gets built — extend this document, don't replace it.
