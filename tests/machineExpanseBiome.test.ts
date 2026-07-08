import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  FORGE_BOSS_KINDS,
  FORGE_DISCOVERIES,
  FORGE_EVENTS,
  FORGE_EVENT_TO_ENGINE,
  FORGE_HAZARD_KINDS,
  FORGE_LOCATIONS,
  FORGE_MISSION_TYPES,
  FORGE_POI_KINDS,
  FORGE_RESOURCES,
  FORGE_WEATHER,
  FORGE_WEATHER_TO_ENGINE,
  LORE_MACHINE_EXPANSE_ARCHIVE,
  MACHINE_EXPANSE_BIOME,
} from "../src/game/biomes/machineExpanseBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const FORGE_ROSTERS = [...MACHINE_ENEMIES, ...PARAGON_ENEMIES, ...ANCIENT_ENEMIES, ...OUTLAW_ENEMIES, ...VOID_ENEMIES];

describe("Forge vocabulary — registered shelves with total engine mappings (AF-060)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(FORGE_LOCATIONS.length).toBe(10);
    expect(FORGE_WEATHER.length).toBe(7);
    expect(FORGE_HAZARD_KINDS.length).toBe(8);
    expect(FORGE_MISSION_TYPES.length).toBe(8);
    expect(FORGE_RESOURCES.length).toBe(8);
    expect(FORGE_POI_KINDS.length).toBe(8);
    expect(FORGE_EVENTS.length).toBe(8);
    expect(FORGE_DISCOVERIES.length).toBe(8);
    expect(FORGE_BOSS_KINDS.length).toBe(5);
  });

  it("every forge weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of FORGE_WEATHER) expect(WEATHER_KINDS).toContain(FORGE_WEATHER_TO_ENGINE[name]);
    for (const name of FORGE_EVENTS) expect(BIOME_EVENT_KINDS).toContain(FORGE_EVENT_TO_ENGINE[name]);
  });
});

describe("The Machine Expanse is a plain AF-036 BiomeDef — zero schema changes (AF-060 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of MACHINE_EXPANSE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of MACHINE_EXPANSE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of MACHINE_EXPANSE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(MACHINE_EXPANSE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of MACHINE_EXPANSE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(MACHINE_EXPANSE_BIOME.coreBiome).toBe("machineWorlds");
  });

  it("its enemy presence follows the spec — Collective primary, Paragon, Custodians, occasional Outlaws, rare Void", () => {
    const ids = MACHINE_EXPANSE_BIOME.enemyIds;
    for (const id of ids) expect(FORGE_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => MACHINE_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(6); // primary
    expect(ids.some((id) => PARAGON_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => OUTLAW_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("the foundry's three hazards are real AF-035 zones, and its machines are immune to their own factory", () => {
    expect(MACHINE_EXPANSE_BIOME.hazards.length).toBe(3);
    for (const hazard of MACHINE_EXPANSE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(MACHINE_EXPANSE_BIOME.hazardImmunities).toContain("shock");
    expect(MACHINE_EXPANSE_BIOME.hazardImmunities).toContain("burn");
    expect(MACHINE_EXPANSE_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("the deepest authored biome: a threat modifier above both prior biomes", () => {
    expect(MACHINE_EXPANSE_BIOME.threatModifier).toBeGreaterThan(1.15);
  });
});

describe("Galaxy integration — Forge Primus carries the Expanse (AF-060 §Lore)", () => {
  it("the machineExpanse region exists and Forge Primus is reachable via Hollow Drift, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "machineExpanse")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.canTravelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.travelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(MACHINE_EXPANSE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("machineExpanse");
  });
});

describe("BiomeRuntime integration — the Forge runs on the unchanged AF-036 engine (AF-060 §Output)", () => {
  it("weather cycles only through the Forge's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(MACHINE_EXPANSE_BIOME, new Rng(4060));
    const weatherKinds = new Set(MACHINE_EXPANSE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(MACHINE_EXPANSE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the AI archive discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(MACHINE_EXPANSE_BIOME, new Rng(2));
    const archive = MACHINE_EXPANSE_BIOME.interactables.find((i) => i.discoveryId === LORE_MACHINE_EXPANSE_ARCHIVE)!;
    expect(runtime.findInteractableInRange(archive.x, archive.y)?.id).toBe(archive.id);
  });
});

describe("Codex — the Machine Expanse biome entry (AF-060 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the AI-archive discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-machine-expanse");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_MACHINE_EXPANSE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Machine Expanse — self-review: thousands of missions stay consistent (AF-060 §Self Review Loop)", () => {
  it("survives 1,000 seeded Forge missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(MACHINE_EXPANSE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the factory never stops working
      expect(runtime.snapshot.hazardCount).toBe(MACHINE_EXPANSE_BIOME.hazards.length);
    }
  });
});
