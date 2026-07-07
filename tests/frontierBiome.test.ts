import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
  type BiomeDef,
} from "../src/game/biomes/biomeData";
import {
  FRONTIER_BOSS_KINDS,
  FRONTIER_DISCOVERIES,
  FRONTIER_EVENTS,
  FRONTIER_EVENT_TO_ENGINE,
  FRONTIER_HAZARD_KINDS,
  FRONTIER_LOCATIONS,
  FRONTIER_MISSION_TYPES,
  FRONTIER_POI_KINDS,
  FRONTIER_RESOURCES,
  FRONTIER_WEATHER,
  FRONTIER_WEATHER_TO_ENGINE,
  HUMAN_FRONTIER_BIOME,
  LORE_HUMAN_FRONTIER_ARCHIVE,
} from "../src/game/biomes/frontierBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { SANDBOX_ENEMIES } from "../src/game/enemies/enemyData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const ALL_ENEMY_IDS = new Set(
  [
    ...SANDBOX_ENEMIES,
    ...OUTLAW_ENEMIES,
    ...MACHINE_ENEMIES,
    ...CRYSTAL_ENEMIES,
    ...VOID_ENEMIES,
    ...ANCIENT_ENEMIES,
    ...XENO_ENEMIES,
    ...NOMAD_ENEMIES,
    ...PARAGON_ENEMIES,
    ...CELESTIAL_ENEMIES,
    ...ECLIPSED_ENEMIES,
  ].map((d) => d.id),
);

function assertBiomeIsValid(biome: BiomeDef): void {
  for (const condition of biome.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
  for (const weather of biome.weather) expect(WEATHER_KINDS).toContain(weather.kind);
  for (const event of biome.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
  for (const category of Object.keys(biome.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
  for (const interactable of biome.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
  for (const enemyId of biome.enemyIds) expect(ALL_ENEMY_IDS.has(enemyId)).toBe(true);
}

describe("Frontier vocabulary — registered shelves with total engine mappings (AF-058)", () => {
  it("registers ten locations, seven weather, seven hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(FRONTIER_LOCATIONS.length).toBe(10);
    expect(FRONTIER_WEATHER.length).toBe(7);
    expect(FRONTIER_HAZARD_KINDS.length).toBe(7);
    expect(FRONTIER_MISSION_TYPES.length).toBe(8);
    expect(FRONTIER_RESOURCES.length).toBe(8);
    expect(FRONTIER_POI_KINDS.length).toBe(8);
    expect(FRONTIER_EVENTS.length).toBe(8);
    expect(FRONTIER_DISCOVERIES.length).toBe(8);
    expect(FRONTIER_BOSS_KINDS.length).toBe(5);
  });

  it("every frontier weather name maps onto AF-036's locked WeatherKind shelf — a naming layer, not a new engine", () => {
    for (const name of FRONTIER_WEATHER) expect(WEATHER_KINDS).toContain(FRONTIER_WEATHER_TO_ENGINE[name]);
  });

  it("every frontier event name maps onto AF-036's locked BiomeEventKind shelf", () => {
    for (const name of FRONTIER_EVENTS) expect(BIOME_EVENT_KINDS).toContain(FRONTIER_EVENT_TO_ENGINE[name]);
  });
});

describe("The Human Frontier is a plain AF-036 BiomeDef — zero schema changes (AF-058 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    assertBiomeIsValid(HUMAN_FRONTIER_BIOME);
    expect(HUMAN_FRONTIER_BIOME.coreBiome).toBe("frontierSystems");
  });

  it("its enemy presence follows the spec — Outlaws and Nomads primary, light Machines, occasional Eclipsed, rare Ancients", () => {
    const ids = HUMAN_FRONTIER_BIOME.enemyIds;
    expect(ids.some((id) => OUTLAW_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => NOMAD_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => MACHINE_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ECLIPSED_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("its hazards are real AF-035 hazard zones ticking through the unchanged engine", () => {
    for (const hazard of HUMAN_FRONTIER_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs - 1)).toBe(false);
      expect(stepHazardZone(hazard, state, 1)).toBe(true);
    }
  });

  it("teaches gently: a sub-1 threat modifier, no enemy buff, no native hazard immunities", () => {
    expect(HUMAN_FRONTIER_BIOME.threatModifier).toBeLessThan(1);
    expect(HUMAN_FRONTIER_BIOME.enemyBuff).toBeNull();
    expect(HUMAN_FRONTIER_BIOME.hazardImmunities.length).toBe(0);
  });
});

describe("Galaxy integration — AF-038's biomeId gets its first consumer (AF-058 §Lore / §Environment)", () => {
  it("the humanFrontier region and Meridian Rest exist, reachable from the starting system without Fast Travel", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "humanFrontier")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.canTravelTo("sys-meridian-rest", false)).toBe(true);
    expect(runtime.travelTo("sys-meridian-rest", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(HUMAN_FRONTIER_BIOME.id);
    expect(runtime.currentSystem.region).toBe("humanFrontier");
  });
});

describe("BiomeRuntime integration — the frontier runs on the unchanged AF-036 engine (AF-058 §Output)", () => {
  it("weather cycles only through the frontier's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(HUMAN_FRONTIER_BIOME, new Rng(4058));
    const weatherKinds = new Set(HUMAN_FRONTIER_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(HUMAN_FRONTIER_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the archive interactable discovers the biome's lore in range and not out of range", () => {
    const runtime = new BiomeRuntime(HUMAN_FRONTIER_BIOME, new Rng(2));
    const archive = HUMAN_FRONTIER_BIOME.interactables.find((i) => i.discoveryId === LORE_HUMAN_FRONTIER_ARCHIVE)!;
    expect(runtime.findInteractableInRange(archive.x, archive.y)?.id).toBe(archive.id);
    expect(runtime.findInteractableInRange(archive.x + 50, archive.y + 50)).toBeNull();
  });
});

describe("Codex — the Human Frontier biome entry (AF-058 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the archive discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-human-frontier");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_HUMAN_FRONTIER_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Human Frontier — self-review: thousands of missions stay consistent (AF-058 §Self Review Loop)", () => {
  it("survives 1,000 seeded frontier missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(HUMAN_FRONTIER_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // industrial space is never inert
      expect(runtime.snapshot.hazardCount).toBe(HUMAN_FRONTIER_BIOME.hazards.length);
    }
  });
});
