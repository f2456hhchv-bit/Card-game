import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  ECO_BOSS_KINDS,
  ECO_DISCOVERIES,
  ECO_EVENTS,
  ECO_EVENT_TO_ENGINE,
  ECO_HAZARD_KINDS,
  ECO_LOCATIONS,
  ECO_MISSION_TYPES,
  ECO_POI_KINDS,
  ECO_RESOURCES,
  ECO_WEATHER,
  ECO_WEATHER_TO_ENGINE,
  LIVING_ECOSPHERES_BIOME,
  LORE_LIVING_ECOSPHERES_ARCHIVE,
} from "../src/game/biomes/livingEcospheresBiome";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { DERELICT_EXPANSE_BIOME } from "../src/game/biomes/derelictExpanseBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const ECO_ROSTERS = [...XENO_ENEMIES, ...CRYSTAL_ENEMIES, ...VOID_ENEMIES, ...ANCIENT_ENEMIES];
const PRIOR_BIOMES = [
  HUMAN_FRONTIER_BIOME,
  CRYSTAL_EXPANSE_BIOME,
  MACHINE_EXPANSE_BIOME,
  VOID_EXPANSE_BIOME,
  ANCIENT_CORE_BIOME,
  SOLAR_WASTES_BIOME,
  FROZEN_REACH_BIOME,
  DERELICT_EXPANSE_BIOME,
];

describe("Ecosphere vocabulary — registered shelves with total engine mappings (AF-066)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(ECO_LOCATIONS.length).toBe(10);
    expect(ECO_WEATHER.length).toBe(7);
    expect(ECO_HAZARD_KINDS.length).toBe(8);
    expect(ECO_MISSION_TYPES.length).toBe(8);
    expect(ECO_RESOURCES.length).toBe(8);
    expect(ECO_POI_KINDS.length).toBe(8);
    expect(ECO_EVENTS.length).toBe(8);
    expect(ECO_DISCOVERIES.length).toBe(8);
    expect(ECO_BOSS_KINDS.length).toBe(5);
  });

  it("every ecosphere weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of ECO_WEATHER) expect(WEATHER_KINDS).toContain(ECO_WEATHER_TO_ENGINE[name]);
    for (const name of ECO_EVENTS) expect(BIOME_EVENT_KINDS).toContain(ECO_EVENT_TO_ENGINE[name]);
  });
});

describe("The Living Ecospheres are a plain AF-036 BiomeDef — zero schema changes (AF-066 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of LIVING_ECOSPHERES_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of LIVING_ECOSPHERES_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of LIVING_ECOSPHERES_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(LIVING_ECOSPHERES_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of LIVING_ECOSPHERES_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(LIVING_ECOSPHERES_BIOME.coreBiome).toBe("livingEcosystems");
  });

  it("its enemy presence follows the spec — the Hive at home, the Ascendancy, wildlife, rare Void, occasional Custodians", () => {
    const ids = LIVING_ECOSPHERES_BIOME.enemyIds;
    for (const id of ids) expect(ECO_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => XENO_ENEMIES.some((d) => d.id === id)).length).toBe(XENO_ENEMIES.length); // the FULL Hive roster — this is their home
    expect(ids.filter((id) => CRYSTAL_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2); // the other living doctrine
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("hazards emerge from biology: the fastest tick of any biome (the grove is hungry), toxic spores, grasping roots — and the ecosystem does not eat its own", () => {
    expect(LIVING_ECOSPHERES_BIOME.hazards.length).toBe(3);
    for (const hazard of LIVING_ECOSPHERES_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    const fastest = Math.min(...LIVING_ECOSPHERES_BIOME.hazards.map((h) => h.tickIntervalMs));
    for (const prior of PRIOR_BIOMES) {
      expect(fastest).toBeLessThan(Math.min(...prior.hazards.map((h) => h.tickIntervalMs))); // the terrain is hungrier than anywhere else
    }
    expect(LIVING_ECOSPHERES_BIOME.hazards.some((h) => h.statusOnTick?.kind === "poison")).toBe(true); // Toxic Spores
    expect(LIVING_ECOSPHERES_BIOME.hazards.some((h) => h.statusOnTick?.kind === "slow")).toBe(true); // Root Traps
    expect(LIVING_ECOSPHERES_BIOME.hazardImmunities).toContain("poison");
    expect(LIVING_ECOSPHERES_BIOME.hazardImmunities).toContain("slow");
    expect(LIVING_ECOSPHERES_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("the most alive biome: the richest event pool of any authored biome, bloom-led, with the highest researchSample weight — biology IS research", () => {
    for (const prior of PRIOR_BIOMES) {
      expect(LIVING_ECOSPHERES_BIOME.events.length).toBeGreaterThan(prior.events.length); // the planet is always doing something
      const priorResearch = prior.resourceWeights.researchSample ?? 0;
      expect(LIVING_ECOSPHERES_BIOME.resourceWeights.researchSample!).toBeGreaterThan(priorResearch);
    }
    const bloom = LIVING_ECOSPHERES_BIOME.events.find((e) => e.kind === "crystalBloom")!;
    for (const event of LIVING_ECOSPHERES_BIOME.events) expect(bloom.weight).toBeGreaterThanOrEqual(event.weight); // Mass Bloom leads
    expect(LIVING_ECOSPHERES_BIOME.threatModifier).toBeGreaterThan(1.25); // a living world defending itself —
    expect(LIVING_ECOSPHERES_BIOME.threatModifier).toBeLessThan(1.3); // between the Forge and the dying suns
  });
});

describe("Galaxy integration — Verdance carries the Ecosphere (AF-066 §Lore)", () => {
  it("the darkNebula region exists and Verdance is reachable past Prismheart, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "darkNebula")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-prismheart", false)).toBe(true);
    expect(runtime.canTravelTo("sys-verdance", false)).toBe(true);
    expect(runtime.travelTo("sys-verdance", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(LIVING_ECOSPHERES_BIOME.id);
    expect(runtime.currentSystem.region).toBe("darkNebula");
  });
});

describe("BiomeRuntime integration — the Ecosphere runs on the unchanged AF-036 engine (AF-066 §Output)", () => {
  it("weather cycles only through the Ecosphere's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(LIVING_ECOSPHERES_BIOME, new Rng(4066));
    const weatherKinds = new Set(LIVING_ECOSPHERES_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(LIVING_ECOSPHERES_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the organic archive discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(LIVING_ECOSPHERES_BIOME, new Rng(2));
    const archive = LIVING_ECOSPHERES_BIOME.interactables.find((i) => i.discoveryId === LORE_LIVING_ECOSPHERES_ARCHIVE)!;
    expect(runtime.findInteractableInRange(archive.x, archive.y)?.id).toBe(archive.id);
  });
});

describe("Codex — the Living Ecospheres biome entry (AF-066 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the organic-archive discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-living-ecospheres");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_LIVING_ECOSPHERES_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Living Ecospheres — self-review: thousands of missions stay consistent (AF-066 §Self Review Loop)", () => {
  it("survives 1,000 seeded Ecosphere missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(LIVING_ECOSPHERES_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the planet never sleeps
      expect(runtime.snapshot.hazardCount).toBe(LIVING_ECOSPHERES_BIOME.hazards.length);
    }
  });
});
