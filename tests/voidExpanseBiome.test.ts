import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  LORE_VOID_EXPANSE_ARCHIVE,
  VOIDX_BOSS_KINDS,
  VOIDX_DISCOVERIES,
  VOIDX_EVENTS,
  VOIDX_EVENT_TO_ENGINE,
  VOIDX_HAZARD_KINDS,
  VOIDX_LOCATIONS,
  VOIDX_MISSION_TYPES,
  VOIDX_POI_KINDS,
  VOIDX_RESOURCES,
  VOIDX_WEATHER,
  VOIDX_WEATHER_TO_ENGINE,
  VOID_EXPANSE_BIOME,
} from "../src/game/biomes/voidExpanseBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const VOIDX_ROSTERS = [...VOID_ENEMIES, ...ECLIPSED_ENEMIES, ...ANCIENT_ENEMIES, ...CELESTIAL_ENEMIES, ...MACHINE_ENEMIES];

describe("Void Expanse vocabulary — registered shelves with total engine mappings (AF-061)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(VOIDX_LOCATIONS.length).toBe(10);
    expect(VOIDX_WEATHER.length).toBe(7);
    expect(VOIDX_HAZARD_KINDS.length).toBe(8);
    expect(VOIDX_MISSION_TYPES.length).toBe(8);
    expect(VOIDX_RESOURCES.length).toBe(8);
    expect(VOIDX_POI_KINDS.length).toBe(8);
    expect(VOIDX_EVENTS.length).toBe(8);
    expect(VOIDX_DISCOVERIES.length).toBe(8);
    expect(VOIDX_BOSS_KINDS.length).toBe(5);
  });

  it("every void weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of VOIDX_WEATHER) expect(WEATHER_KINDS).toContain(VOIDX_WEATHER_TO_ENGINE[name]);
    for (const name of VOIDX_EVENTS) expect(BIOME_EVENT_KINDS).toContain(VOIDX_EVENT_TO_ENGINE[name]);
  });
});

describe("The Void Expanse is a plain AF-036 BiomeDef — zero schema changes (AF-061 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of VOID_EXPANSE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of VOID_EXPANSE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of VOID_EXPANSE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(VOID_EXPANSE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of VOID_EXPANSE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(VOID_EXPANSE_BIOME.coreBiome).toBe("voidRegions");
  });

  it("its enemy presence follows the spec — Void Swarm primary, the Eclipsed, Custodians, rare Celestials, occasional Machines", () => {
    const ids = VOID_EXPANSE_BIOME.enemyIds;
    for (const id of ids) expect(VOIDX_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => VOID_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(6); // primary — the Void dominates
    expect(ids.some((id) => ECLIPSED_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => CELESTIAL_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => MACHINE_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("its three hazards are real AF-035 zones — gravity, corruption, stolen time — and the natives are corruption-immune", () => {
    expect(VOID_EXPANSE_BIOME.hazards.length).toBe(3);
    for (const hazard of VOID_EXPANSE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(VOID_EXPANSE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "corruption")).toBe(true); // Reality Tears
    expect(VOID_EXPANSE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "stasis")).toBe(true); // Temporal Fields
    expect(VOID_EXPANSE_BIOME.hazardImmunities).toContain("corruption");
    expect(VOID_EXPANSE_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("the edge of existence: a threat modifier above every prior authored biome", () => {
    expect(VOID_EXPANSE_BIOME.threatModifier).toBeGreaterThan(1.25);
  });
});

describe("Galaxy integration — Hollow Crown carries the Expanse (AF-061 §Lore)", () => {
  it("the voidExpanse region exists and Hollow Crown is reachable past Forge Primus, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "voidExpanse")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.travelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.canTravelTo("sys-hollow-crown", false)).toBe(true);
    expect(runtime.travelTo("sys-hollow-crown", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(VOID_EXPANSE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("voidExpanse");
    expect(runtime.currentSystem.threatLevel).toBe(5);
  });
});

describe("BiomeRuntime integration — the Void runs on the unchanged AF-036 engine (AF-061 §Output)", () => {
  it("weather cycles only through the Void's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(VOID_EXPANSE_BIOME, new Rng(4061));
    const weatherKinds = new Set(VOID_EXPANSE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(VOID_EXPANSE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the void archive discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(VOID_EXPANSE_BIOME, new Rng(2));
    const archive = VOID_EXPANSE_BIOME.interactables.find((i) => i.discoveryId === LORE_VOID_EXPANSE_ARCHIVE)!;
    expect(runtime.findInteractableInRange(archive.x, archive.y)?.id).toBe(archive.id);
  });
});

describe("Codex — the Void Expanse biome entry (AF-061 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the void-archive discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-void-expanse");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_VOID_EXPANSE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Void Expanse — self-review: thousands of missions stay consistent (AF-061 §Self Review Loop)", () => {
  it("survives 1,000 seeded Void missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(VOID_EXPANSE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // reality never stops collapsing
      expect(runtime.snapshot.hazardCount).toBe(VOID_EXPANSE_BIOME.hazards.length);
    }
  });
});
