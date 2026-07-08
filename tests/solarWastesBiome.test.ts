import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  LORE_SOLAR_WASTES_ARCHIVE,
  SOLAR_WASTES_BIOME,
  WASTES_BOSS_KINDS,
  WASTES_DISCOVERIES,
  WASTES_EVENTS,
  WASTES_EVENT_TO_ENGINE,
  WASTES_HAZARD_KINDS,
  WASTES_LOCATIONS,
  WASTES_MISSION_TYPES,
  WASTES_POI_KINDS,
  WASTES_RESOURCES,
  WASTES_WEATHER,
  WASTES_WEATHER_TO_ENGINE,
} from "../src/game/biomes/solarWastesBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const WASTES_ROSTERS = [...MACHINE_ENEMIES, ...OUTLAW_ENEMIES, ...CELESTIAL_ENEMIES, ...PARAGON_ENEMIES, ...VOID_ENEMIES];

describe("Solar Wastes vocabulary — registered shelves with total engine mappings (AF-063)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(WASTES_LOCATIONS.length).toBe(10);
    expect(WASTES_WEATHER.length).toBe(7);
    expect(WASTES_HAZARD_KINDS.length).toBe(8);
    expect(WASTES_MISSION_TYPES.length).toBe(8);
    expect(WASTES_RESOURCES.length).toBe(8);
    expect(WASTES_POI_KINDS.length).toBe(8);
    expect(WASTES_EVENTS.length).toBe(8);
    expect(WASTES_DISCOVERIES.length).toBe(8);
    expect(WASTES_BOSS_KINDS.length).toBe(5);
  });

  it("every wastes weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of WASTES_WEATHER) expect(WEATHER_KINDS).toContain(WASTES_WEATHER_TO_ENGINE[name]);
    for (const name of WASTES_EVENTS) expect(BIOME_EVENT_KINDS).toContain(WASTES_EVENT_TO_ENGINE[name]);
  });
});

describe("The Solar Wastes are a plain AF-036 BiomeDef — zero schema changes (AF-063 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of SOLAR_WASTES_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of SOLAR_WASTES_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of SOLAR_WASTES_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(SOLAR_WASTES_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of SOLAR_WASTES_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(SOLAR_WASTES_BIOME.coreBiome).toBe("solarWastes");
  });

  it("its enemy presence follows the spec — Machines and Outlaws primary, Conclave, Paragon, rare Void", () => {
    const ids = SOLAR_WASTES_BIOME.enemyIds;
    for (const id of ids) expect(WASTES_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => MACHINE_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(3); // primary
    expect(ids.filter((id) => OUTLAW_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(3); // primary — the salvage wars
    expect(ids.some((id) => CELESTIAL_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => PARAGON_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids).toContain("living-supernova"); // the spec's boss name already fights here as an AF-054 entity
  });

  it("the environment itself is the greatest threat: every hazard is a real AF-035 zone AND carries a status", () => {
    expect(SOLAR_WASTES_BIOME.hazards.length).toBe(3);
    for (const hazard of SOLAR_WASTES_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
      expect(hazard.statusOnTick).not.toBeNull(); // the only authored biome where every hazard has one
    }
    expect(SOLAR_WASTES_BIOME.hazards.some((h) => h.statusOnTick?.kind === "poison")).toBe(true); // Radiation Fields
    expect(SOLAR_WASTES_BIOME.hazards.some((h) => h.statusOnTick?.kind === "burn")).toBe(true); // Plasma Geysers
    expect(SOLAR_WASTES_BIOME.hazards.some((h) => h.statusOnTick?.kind === "overload")).toBe(true); // Solar Shockwaves
    expect(SOLAR_WASTES_BIOME.hazardImmunities).toContain("burn");
    expect(SOLAR_WASTES_BIOME.hazardImmunities).toContain("poison");
    expect(SOLAR_WASTES_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("the star is the enemy: threat sits between the Forge and the Void, and solarFlare dominates the event pool", () => {
    expect(SOLAR_WASTES_BIOME.threatModifier).toBeGreaterThan(1.25);
    expect(SOLAR_WASTES_BIOME.threatModifier).toBeLessThan(1.35);
    const flare = SOLAR_WASTES_BIOME.events.find((e) => e.kind === "solarFlare")!;
    for (const event of SOLAR_WASTES_BIOME.events) expect(flare.weight).toBeGreaterThanOrEqual(event.weight);
  });
});

describe("Galaxy integration — Cinderfall carries the Wastes (AF-063 §Lore)", () => {
  it("the solarWastes region exists and Cinderfall is reachable off Forge Primus, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "solarWastes")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.travelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.canTravelTo("sys-cinderfall", false)).toBe(true);
    expect(runtime.travelTo("sys-cinderfall", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(SOLAR_WASTES_BIOME.id);
    expect(runtime.currentSystem.region).toBe("solarWastes");
  });
});

describe("BiomeRuntime integration — the Wastes run on the unchanged AF-036 engine (AF-063 §Output)", () => {
  it("weather cycles only through the Wastes' own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(SOLAR_WASTES_BIOME, new Rng(4063));
    const weatherKinds = new Set(SOLAR_WASTES_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(SOLAR_WASTES_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the ancient forge discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(SOLAR_WASTES_BIOME, new Rng(2));
    const forge = SOLAR_WASTES_BIOME.interactables.find((i) => i.discoveryId === LORE_SOLAR_WASTES_ARCHIVE)!;
    expect(runtime.findInteractableInRange(forge.x, forge.y)?.id).toBe(forge.id);
  });
});

describe("Codex — the Solar Wastes biome entry (AF-063 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the ancient-forge discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-solar-wastes");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_SOLAR_WASTES_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Solar Wastes — self-review: thousands of missions stay consistent (AF-063 §Self Review Loop)", () => {
  it("survives 1,000 seeded Wastes missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(SOLAR_WASTES_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the star never relents
      expect(runtime.snapshot.hazardCount).toBe(SOLAR_WASTES_BIOME.hazards.length);
    }
  });
});
