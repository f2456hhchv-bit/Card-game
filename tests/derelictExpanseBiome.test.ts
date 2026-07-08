import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  DERELICT_EXPANSE_BIOME,
  LORE_DERELICT_EXPANSE_ARCHIVE,
  WRECK_BOSS_KINDS,
  WRECK_DISCOVERIES,
  WRECK_EVENTS,
  WRECK_EVENT_TO_ENGINE,
  WRECK_HAZARD_KINDS,
  WRECK_LOCATIONS,
  WRECK_MISSION_TYPES,
  WRECK_POI_KINDS,
  WRECK_RESOURCES,
  WRECK_WEATHER,
  WRECK_WEATHER_TO_ENGINE,
} from "../src/game/biomes/derelictExpanseBiome";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const WRECK_ROSTERS = [...ECLIPSED_ENEMIES, ...OUTLAW_ENEMIES, ...NOMAD_ENEMIES, ...MACHINE_ENEMIES, ...VOID_ENEMIES];
const PRIOR_BIOMES = [HUMAN_FRONTIER_BIOME, CRYSTAL_EXPANSE_BIOME, MACHINE_EXPANSE_BIOME, VOID_EXPANSE_BIOME, ANCIENT_CORE_BIOME, SOLAR_WASTES_BIOME, FROZEN_REACH_BIOME];

describe("Derelict Expanse vocabulary — registered shelves with total engine mappings (AF-065)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(WRECK_LOCATIONS.length).toBe(10);
    expect(WRECK_WEATHER.length).toBe(7);
    expect(WRECK_HAZARD_KINDS.length).toBe(8);
    expect(WRECK_MISSION_TYPES.length).toBe(8);
    expect(WRECK_RESOURCES.length).toBe(8);
    expect(WRECK_POI_KINDS.length).toBe(8);
    expect(WRECK_EVENTS.length).toBe(8);
    expect(WRECK_DISCOVERIES.length).toBe(8);
    expect(WRECK_BOSS_KINDS.length).toBe(5);
  });

  it("every wreck weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of WRECK_WEATHER) expect(WEATHER_KINDS).toContain(WRECK_WEATHER_TO_ENGINE[name]);
    for (const name of WRECK_EVENTS) expect(BIOME_EVENT_KINDS).toContain(WRECK_EVENT_TO_ENGINE[name]);
  });
});

describe("The Derelict Expanse is a plain AF-036 BiomeDef — zero schema changes (AF-065 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of DERELICT_EXPANSE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of DERELICT_EXPANSE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of DERELICT_EXPANSE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(DERELICT_EXPANSE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of DERELICT_EXPANSE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(DERELICT_EXPANSE_BIOME.coreBiome).toBe("derelictFleets");
  });

  it("its enemy presence follows the spec — Eclipsed primary, Outlaws and Nomads working the salvage, Machines, rare Void", () => {
    const ids = DERELICT_EXPANSE_BIOME.enemyIds;
    for (const id of ids) expect(WRECK_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => ECLIPSED_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(3); // primary — these may be their own fleets
    expect(ids.filter((id) => OUTLAW_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2); // salvage crews
    expect(ids.filter((id) => NOMAD_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(2); // salvage rivals
    expect(ids.some((id) => MACHINE_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("hazards emerge from destruction: the heaviest statusless tick yet, a reactor burn, and armourBreak's FIRST biome-hazard producer", () => {
    expect(DERELICT_EXPANSE_BIOME.hazards.length).toBe(3);
    for (const hazard of DERELICT_EXPANSE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(DERELICT_EXPANSE_BIOME.hazards.some((h) => h.statusOnTick === null && h.damagePerTick >= 11)).toBe(true); // Hull Explosions
    expect(DERELICT_EXPANSE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "burn")).toBe(true); // Reactor Leaks
    expect(DERELICT_EXPANSE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "armourBreak")).toBe(true); // Unstable Wreckage
    expect(DERELICT_EXPANSE_BIOME.hazardImmunities).toContain("armourBreak");
    expect(DERELICT_EXPANSE_BIOME.hazardImmunities).toContain("burn");
    expect(DERELICT_EXPANSE_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("exploration over combat, structurally: the most interactables of any biome, shipComponent's first loot weight, two visibility-reducing weathers", () => {
    for (const prior of PRIOR_BIOMES) {
      expect(DERELICT_EXPANSE_BIOME.interactables.length).toBeGreaterThan(prior.interactables.length); // every wreck tells a story you can touch
      expect(prior.resourceWeights.shipComponent).toBeUndefined(); // salvage is THIS biome's reward
    }
    expect(DERELICT_EXPANSE_BIOME.resourceWeights.shipComponent).toBeGreaterThan(2);
    expect(DERELICT_EXPANSE_BIOME.weather.filter((w) => w.reducedVisibility).length).toBe(2); // radio interference and sensor ghosts
    const distress = DERELICT_EXPANSE_BIOME.events.find((e) => e.kind === "distressSignal")!;
    for (const event of DERELICT_EXPANSE_BIOME.events) expect(distress.weight).toBeGreaterThanOrEqual(event.weight); // some ships still transmit
    expect(DERELICT_EXPANSE_BIOME.threatModifier).toBeGreaterThan(0.9); // quiet, not safe —
    expect(DERELICT_EXPANSE_BIOME.threatModifier).toBeLessThan(1.15); // between the Frontier and the Crystal Expanse
  });
});

describe("Galaxy integration — Gravewake carries the Expanse (AF-065 §Lore)", () => {
  it("the brokenSystems region exists and Gravewake is reachable off the Human Frontier, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "brokenSystems")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-meridian-rest", false)).toBe(true);
    expect(runtime.canTravelTo("sys-gravewake", false)).toBe(true);
    expect(runtime.travelTo("sys-gravewake", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(DERELICT_EXPANSE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("brokenSystems");
  });
});

describe("BiomeRuntime integration — the Expanse runs on the unchanged AF-036 engine (AF-065 §Output)", () => {
  it("weather cycles only through the Expanse's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(DERELICT_EXPANSE_BIOME, new Rng(4065));
    const weatherKinds = new Set(DERELICT_EXPANSE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(DERELICT_EXPANSE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the black box archive discovers the biome's lore in range, and all four interactables are findable", () => {
    const runtime = new BiomeRuntime(DERELICT_EXPANSE_BIOME, new Rng(2));
    for (const interactable of DERELICT_EXPANSE_BIOME.interactables) {
      expect(runtime.findInteractableInRange(interactable.x, interactable.y)?.id).toBe(interactable.id);
    }
    const archive = DERELICT_EXPANSE_BIOME.interactables.find((i) => i.discoveryId === LORE_DERELICT_EXPANSE_ARCHIVE);
    expect(archive).toBeDefined();
  });
});

describe("Codex — the Derelict Expanse biome entry (AF-065 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the black-box discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-derelict-expanse");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_DERELICT_EXPANSE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Derelict Expanse — self-review: thousands of missions stay consistent (AF-065 §Self Review Loop)", () => {
  it("survives 1,000 seeded Expanse missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(DERELICT_EXPANSE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the wrecks are still dying
      expect(runtime.snapshot.hazardCount).toBe(DERELICT_EXPANSE_BIOME.hazards.length);
    }
  });
});
