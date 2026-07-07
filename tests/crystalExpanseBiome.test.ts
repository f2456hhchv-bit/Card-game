import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  CRYSTAL_EXPANSE_BIOME,
  EXPANSE_BOSS_KINDS,
  EXPANSE_DISCOVERIES,
  EXPANSE_EVENTS,
  EXPANSE_EVENT_TO_ENGINE,
  EXPANSE_HAZARD_KINDS,
  EXPANSE_LOCATIONS,
  EXPANSE_MISSION_TYPES,
  EXPANSE_POI_KINDS,
  EXPANSE_RESOURCES,
  EXPANSE_WEATHER,
  EXPANSE_WEATHER_TO_ENGINE,
  LORE_CRYSTAL_EXPANSE_ARCHIVE,
} from "../src/game/biomes/crystalExpanseBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const EXPANSE_ROSTERS = [...CRYSTAL_ENEMIES, ...ANCIENT_ENEMIES, ...VOID_ENEMIES, ...MACHINE_ENEMIES];

describe("Expanse vocabulary — registered shelves with total engine mappings (AF-059)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(EXPANSE_LOCATIONS.length).toBe(10);
    expect(EXPANSE_WEATHER.length).toBe(7);
    expect(EXPANSE_HAZARD_KINDS.length).toBe(8);
    expect(EXPANSE_MISSION_TYPES.length).toBe(8);
    expect(EXPANSE_RESOURCES.length).toBe(8);
    expect(EXPANSE_POI_KINDS.length).toBe(8);
    expect(EXPANSE_EVENTS.length).toBe(8);
    expect(EXPANSE_DISCOVERIES.length).toBe(8);
    expect(EXPANSE_BOSS_KINDS.length).toBe(5);
  });

  it("every expanse weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of EXPANSE_WEATHER) expect(WEATHER_KINDS).toContain(EXPANSE_WEATHER_TO_ENGINE[name]);
    for (const name of EXPANSE_EVENTS) expect(BIOME_EVENT_KINDS).toContain(EXPANSE_EVENT_TO_ENGINE[name]);
  });
});

describe("The Crystal Expanse is a plain AF-036 BiomeDef — zero schema changes (AF-059 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout, and its boss id resolves to a real BossDef", () => {
    for (const condition of CRYSTAL_EXPANSE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of CRYSTAL_EXPANSE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of CRYSTAL_EXPANSE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(CRYSTAL_EXPANSE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of CRYSTAL_EXPANSE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(SANDBOX_BOSSES.some((b) => b.id === CRYSTAL_EXPANSE_BIOME.bossId)).toBe(true);
    expect(CRYSTAL_EXPANSE_BIOME.coreBiome).toBe("crystalFields");
  });

  it("its enemy presence follows the spec — Ascendancy primary, Custodians, occasional Void, rare Machines", () => {
    const ids = CRYSTAL_EXPANSE_BIOME.enemyIds;
    for (const id of ids) expect(EXPANSE_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => CRYSTAL_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(5); // primary
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => MACHINE_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("its hazards are real AF-035 hazard zones, and its natives are immune to their own resonance", () => {
    for (const hazard of CRYSTAL_EXPANSE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(CRYSTAL_EXPANSE_BIOME.hazardImmunities).toContain("shock");
    expect(CRYSTAL_EXPANSE_BIOME.enemyBuff?.kind).toBe("shieldCapacity"); // the live AF-036 buff hook
  });

  it("peaceful-looking, not safe: a threat modifier above one", () => {
    expect(CRYSTAL_EXPANSE_BIOME.threatModifier).toBeGreaterThan(1);
  });
});

describe("Galaxy integration — Prismheart carries the Expanse (AF-059 §Lore)", () => {
  it("Prismheart is reachable from the starting system and resolves the Expanse biomeId", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.canTravelTo("sys-prismheart", false)).toBe(true);
    expect(runtime.travelTo("sys-prismheart", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(CRYSTAL_EXPANSE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("crystalDominion");
  });
});

describe("BiomeRuntime integration — the Expanse runs on the unchanged AF-036 engine (AF-059 §Output)", () => {
  it("weather cycles only through the Expanse's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(CRYSTAL_EXPANSE_BIOME, new Rng(4059));
    const weatherKinds = new Set(CRYSTAL_EXPANSE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(CRYSTAL_EXPANSE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the resonance well discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(CRYSTAL_EXPANSE_BIOME, new Rng(2));
    const well = CRYSTAL_EXPANSE_BIOME.interactables.find((i) => i.discoveryId === LORE_CRYSTAL_EXPANSE_ARCHIVE)!;
    expect(runtime.findInteractableInRange(well.x, well.y)?.id).toBe(well.id);
  });
});

describe("Codex — the Crystal Expanse biome entry (AF-059 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the resonance-well discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-crystal-expanse");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_CRYSTAL_EXPANSE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Crystal Expanse — self-review: thousands of missions stay consistent (AF-059 §Self Review Loop)", () => {
  it("survives 1,000 seeded Expanse missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(CRYSTAL_EXPANSE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the ecosystem is never inert
      expect(runtime.snapshot.hazardCount).toBe(CRYSTAL_EXPANSE_BIOME.hazards.length);
    }
  });
});
