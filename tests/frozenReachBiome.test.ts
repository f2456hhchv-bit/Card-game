import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  FROZEN_REACH_BIOME,
  LORE_FROZEN_REACH_ARCHIVE,
  REACH_BOSS_KINDS,
  REACH_DISCOVERIES,
  REACH_EVENTS,
  REACH_EVENT_TO_ENGINE,
  REACH_HAZARD_KINDS,
  REACH_LOCATIONS,
  REACH_MISSION_TYPES,
  REACH_POI_KINDS,
  REACH_RESOURCES,
  REACH_WEATHER,
  REACH_WEATHER_TO_ENGINE,
} from "../src/game/biomes/frozenReachBiome";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const REACH_ROSTERS = [...ECLIPSED_ENEMIES, ...ANCIENT_ENEMIES, ...MACHINE_ENEMIES, ...XENO_ENEMIES, ...VOID_ENEMIES];
const PRIOR_BIOMES = [HUMAN_FRONTIER_BIOME, CRYSTAL_EXPANSE_BIOME, MACHINE_EXPANSE_BIOME, VOID_EXPANSE_BIOME, ANCIENT_CORE_BIOME, SOLAR_WASTES_BIOME];

describe("Frozen Reach vocabulary — registered shelves with total engine mappings (AF-064)", () => {
  it("registers ten locations, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(REACH_LOCATIONS.length).toBe(10);
    expect(REACH_WEATHER.length).toBe(7);
    expect(REACH_HAZARD_KINDS.length).toBe(8);
    expect(REACH_MISSION_TYPES.length).toBe(8);
    expect(REACH_RESOURCES.length).toBe(8);
    expect(REACH_POI_KINDS.length).toBe(8);
    expect(REACH_EVENTS.length).toBe(8);
    expect(REACH_DISCOVERIES.length).toBe(8);
    expect(REACH_BOSS_KINDS.length).toBe(5);
  });

  it("every reach weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of REACH_WEATHER) expect(WEATHER_KINDS).toContain(REACH_WEATHER_TO_ENGINE[name]);
    for (const name of REACH_EVENTS) expect(BIOME_EVENT_KINDS).toContain(REACH_EVENT_TO_ENGINE[name]);
  });
});

describe("The Frozen Reach is a plain AF-036 BiomeDef — zero schema changes (AF-064 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout", () => {
    for (const condition of FROZEN_REACH_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of FROZEN_REACH_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of FROZEN_REACH_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(FROZEN_REACH_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of FROZEN_REACH_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(FROZEN_REACH_BIOME.coreBiome).toBe("frozenNebulae");
  });

  it("its enemy presence follows the spec — Eclipsed primary, Custodians, Machines, cryogenic wildlife, rare Void", () => {
    const ids = FROZEN_REACH_BIOME.enemyIds;
    for (const id of ids) expect(REACH_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => ECLIPSED_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(4); // primary — frozen former humans
    expect(ids.some((id) => ANCIENT_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => MACHINE_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => XENO_ENEMIES.some((d) => d.id === id))).toBe(true); // cryogenic wildlife
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("gives freeze and slow their FIRST producers, and the natives are immune to both — the cold has nothing left to take", () => {
    expect(FROZEN_REACH_BIOME.hazards.length).toBe(3);
    for (const hazard of FROZEN_REACH_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(FROZEN_REACH_BIOME.hazards.some((h) => h.statusOnTick?.kind === "freeze")).toBe(true); // Cryogenic Fields
    expect(FROZEN_REACH_BIOME.hazards.some((h) => h.statusOnTick?.kind === "slow")).toBe(true); // Frozen Gas Clouds
    expect(FROZEN_REACH_BIOME.hazardImmunities).toContain("freeze");
    expect(FROZEN_REACH_BIOME.hazardImmunities).toContain("slow");
    expect(FROZEN_REACH_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("stillness is mechanical: the slowest hazards, the sparsest event pool, the lowest elite chance, the gentlest winds of any authored biome", () => {
    for (const hazard of FROZEN_REACH_BIOME.hazards) expect(hazard.tickIntervalMs).toBeGreaterThanOrEqual(1300); // planning, not reflexes
    for (const prior of PRIOR_BIOMES) {
      expect(FROZEN_REACH_BIOME.events.length).toBeLessThanOrEqual(prior.events.length); // silence between events
      expect(FROZEN_REACH_BIOME.eliteChance).toBeLessThan(prior.eliteChance); // deliberate, never overwhelming
    }
    for (const weather of FROZEN_REACH_BIOME.weather) {
      expect(Math.abs(weather.windForceX)).toBeLessThanOrEqual(0.3); // winds never rise above a drift
      expect(Math.abs(weather.windForceY)).toBeLessThanOrEqual(0.3);
    }
    expect(FROZEN_REACH_BIOME.threatModifier).toBeGreaterThan(1.15); // quiet is not safe —
    expect(FROZEN_REACH_BIOME.threatModifier).toBeLessThan(1.25); // mid-ladder, between the Expanse and the Forge
  });
});

describe("Galaxy integration — Winterline carries the Reach (AF-064 §Lore)", () => {
  it("the frozenReach region exists and Winterline is reachable past the Human Frontier, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "frozenReach")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-meridian-rest", false)).toBe(true);
    expect(runtime.canTravelTo("sys-winterline", false)).toBe(true);
    expect(runtime.travelTo("sys-winterline", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(FROZEN_REACH_BIOME.id);
    expect(runtime.currentSystem.region).toBe("frozenReach");
  });
});

describe("BiomeRuntime integration — the Reach runs on the unchanged AF-036 engine (AF-064 §Output)", () => {
  it("weather cycles only through the Reach's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(FROZEN_REACH_BIOME, new Rng(4064));
    const weatherKinds = new Set(FROZEN_REACH_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(FROZEN_REACH_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the cryo vault discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(FROZEN_REACH_BIOME, new Rng(2));
    const vault = FROZEN_REACH_BIOME.interactables.find((i) => i.discoveryId === LORE_FROZEN_REACH_ARCHIVE)!;
    expect(runtime.findInteractableInRange(vault.x, vault.y)?.id).toBe(vault.id);
  });
});

describe("Codex — the Frozen Reach biome entry (AF-064 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the cryo-vault discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-frozen-reach");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_FROZEN_REACH_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Frozen Reach — self-review: thousands of missions stay consistent (AF-064 §Self Review Loop)", () => {
  it("survives 1,000 seeded Reach missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(FROZEN_REACH_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // even the stillness has teeth
      expect(runtime.snapshot.hazardCount).toBe(FROZEN_REACH_BIOME.hazards.length);
    }
  });
});
