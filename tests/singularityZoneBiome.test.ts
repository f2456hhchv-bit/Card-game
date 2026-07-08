import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  LORE_SINGULARITY_ZONE_ARCHIVE,
  SINGULARITY_ZONE_BIOME,
  ZONE_BOSS_KINDS,
  ZONE_DISCOVERIES,
  ZONE_EVENTS,
  ZONE_EVENT_TO_ENGINE,
  ZONE_HAZARD_KINDS,
  ZONE_LOCATIONS,
  ZONE_MISSION_TYPES,
  ZONE_POI_KINDS,
  ZONE_RESOURCES,
  ZONE_WEATHER,
  ZONE_WEATHER_TO_ENGINE,
} from "../src/game/biomes/singularityZoneBiome";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { DERELICT_EXPANSE_BIOME } from "../src/game/biomes/derelictExpanseBiome";
import { LIVING_ECOSPHERES_BIOME } from "../src/game/biomes/livingEcospheresBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { GALAXY_REGIONS, SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const ZONE_ROSTERS = [...VOID_ENEMIES, ...CELESTIAL_ENEMIES, ...ANCIENT_ENEMIES, ...PARAGON_ENEMIES];
const PRIOR_BIOMES = [
  HUMAN_FRONTIER_BIOME,
  CRYSTAL_EXPANSE_BIOME,
  MACHINE_EXPANSE_BIOME,
  VOID_EXPANSE_BIOME,
  ANCIENT_CORE_BIOME,
  SOLAR_WASTES_BIOME,
  FROZEN_REACH_BIOME,
  DERELICT_EXPANSE_BIOME,
  LIVING_ECOSPHERES_BIOME,
];

describe("Zone vocabulary — registered shelves with total engine mappings (AF-067)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(ZONE_LOCATIONS.length).toBe(10);
    expect(ZONE_WEATHER.length).toBe(7);
    expect(ZONE_HAZARD_KINDS.length).toBe(8);
    expect(ZONE_MISSION_TYPES.length).toBe(8);
    expect(ZONE_RESOURCES.length).toBe(8);
    expect(ZONE_POI_KINDS.length).toBe(8);
    expect(ZONE_EVENTS.length).toBe(8);
    expect(ZONE_DISCOVERIES.length).toBe(8);
    expect(ZONE_BOSS_KINDS.length).toBe(5);
  });

  it("every zone weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of ZONE_WEATHER) expect(WEATHER_KINDS).toContain(ZONE_WEATHER_TO_ENGINE[name]);
    for (const name of ZONE_EVENTS) expect(BIOME_EVENT_KINDS).toContain(ZONE_EVENT_TO_ENGINE[name]);
  });
});

describe("The Singularity Zone is a plain AF-036 BiomeDef — zero schema changes (AF-067 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of SINGULARITY_ZONE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of SINGULARITY_ZONE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of SINGULARITY_ZONE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(SINGULARITY_ZONE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of SINGULARITY_ZONE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(SINGULARITY_ZONE_BIOME.coreBiome).toBe("blackHoleSystems");
  });

  it("its enemy presence follows the spec — Void Swarm, Conclave, Custodians, Paragon, and reality constructs resolved from existing rosters", () => {
    const ids = SINGULARITY_ZONE_BIOME.enemyIds;
    for (const id of ids) expect(ZONE_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => VOID_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(3);
    expect(ids.filter((id) => CELESTIAL_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2);
    expect(ids.filter((id) => ANCIENT_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2);
    expect(ids.filter((id) => PARAGON_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2);
    expect(ids).toContain("constellation-avatar"); // rare Reality Constructs —
    expect(ids).toContain("energy-construct"); // entities made of the Zone's own substance
  });

  it("physics itself is hostile: the MOST hazard zones of any biome, all real AF-035 zones, and the Zone's own do not object", () => {
    for (const prior of PRIOR_BIOMES) expect(SINGULARITY_ZONE_BIOME.hazards.length).toBeGreaterThan(prior.hazards.length);
    for (const hazard of SINGULARITY_ZONE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(SINGULARITY_ZONE_BIOME.hazards.some((h) => h.statusOnTick === null)).toBe(true); // Micro Singularities
    expect(SINGULARITY_ZONE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "stasis")).toBe(true); // Time Dilation Fields
    expect(SINGULARITY_ZONE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "shock")).toBe(true); // Quantum Lightning
    expect(SINGULARITY_ZONE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "overload")).toBe(true); // Event Horizon Surges
    expect(SINGULARITY_ZONE_BIOME.hazardImmunities).toContain("stasis");
    expect(SINGULARITY_ZONE_BIOME.hazardImmunities).toContain("overload");
  });

  it("the endgame apex, asserted: deepest threat, highest elite chance, strongest buff and winds, richest ancientArtifact loot — and fully readable", () => {
    for (const prior of PRIOR_BIOMES) {
      expect(SINGULARITY_ZONE_BIOME.threatModifier).toBeGreaterThan(prior.threatModifier);
      expect(SINGULARITY_ZONE_BIOME.eliteChance).toBeGreaterThan(prior.eliteChance);
      expect(SINGULARITY_ZONE_BIOME.enemyBuff!.value).toBeGreaterThan(prior.enemyBuff?.value ?? 0);
      expect(SINGULARITY_ZONE_BIOME.resourceWeights.ancientArtifact!).toBeGreaterThan(prior.resourceWeights.ancientArtifact ?? 0);
      const priorMaxWind = Math.max(...prior.weather.map((w) => Math.max(Math.abs(w.windForceX), Math.abs(w.windForceY))));
      const zoneMaxWind = Math.max(...SINGULARITY_ZONE_BIOME.weather.map((w) => Math.max(Math.abs(w.windForceX), Math.abs(w.windForceY))));
      expect(zoneMaxWind).toBeGreaterThan(priorMaxWind); // gravity storms
    }
    for (const weather of SINGULARITY_ZONE_BIOME.weather) expect(weather.reducedVisibility).toBe(false); // "while remaining fully readable"
  });
});

describe("Galaxy integration — Axiom carries the Zone, and the galaxy map is complete (AF-067 §Lore)", () => {
  it("the singularityZone region exists — every region on AF-038's locked shelf now has a definition", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "singularityZone")).toBe(true);
    for (const region of GALAXY_REGIONS) {
      expect(SANDBOX_GALAXY.regions.some((r) => r.id === region)).toBe(true); // the galaxy map is complete
    }
  });

  it("Axiom is the deepest system in the galaxy, past even First Light, resolving the biomeId", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.travelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.travelTo("sys-hollow-crown", false)).toBe(true);
    expect(runtime.travelTo("sys-first-light", false)).toBe(true);
    expect(runtime.canTravelTo("sys-axiom", false)).toBe(true);
    expect(runtime.travelTo("sys-axiom", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(SINGULARITY_ZONE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("singularityZone");
    for (const system of SANDBOX_GALAXY.systems) {
      expect(runtime.currentSystem.threatLevel).toBeGreaterThanOrEqual(system.threatLevel);
    }
  });
});

describe("BiomeRuntime integration — the Zone runs on the unchanged AF-036 engine (AF-067 §Output)", () => {
  it("weather cycles only through the Zone's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(SINGULARITY_ZONE_BIOME, new Rng(4067));
    const weatherKinds = new Set(SINGULARITY_ZONE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(SINGULARITY_ZONE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the quantum archive discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(SINGULARITY_ZONE_BIOME, new Rng(2));
    const archive = SINGULARITY_ZONE_BIOME.interactables.find((i) => i.discoveryId === LORE_SINGULARITY_ZONE_ARCHIVE)!;
    expect(runtime.findInteractableInRange(archive.x, archive.y)?.id).toBe(archive.id);
  });
});

describe("Codex — the Singularity Zone biome entry (AF-067 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the quantum-archive discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-singularity-zone");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_SINGULARITY_ZONE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Singularity Zone — self-review: thousands of missions stay consistent (AF-067 §Self Review Loop)", () => {
  it("survives 1,000 seeded Zone missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(SINGULARITY_ZONE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // reality never stops redrafting
      expect(runtime.snapshot.hazardCount).toBe(SINGULARITY_ZONE_BIOME.hazards.length);
    }
  });
});
