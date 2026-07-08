import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BIOME_EVENT_KINDS,
  ENVIRONMENTAL_CONDITIONS,
  INTERACTION_KINDS,
  WEATHER_KINDS,
} from "../src/game/biomes/biomeData";
import {
  ACORE_BOSS_KINDS,
  ACORE_DISCOVERIES,
  ACORE_EVENTS,
  ACORE_EVENT_TO_ENGINE,
  ACORE_HAZARD_KINDS,
  ACORE_LOCATIONS,
  ACORE_MISSION_TYPES,
  ACORE_POI_KINDS,
  ACORE_RESOURCES,
  ACORE_WEATHER,
  ACORE_WEATHER_TO_ENGINE,
  ANCIENT_CORE_BIOME,
  LORE_ANCIENT_CORE_ARCHIVE,
} from "../src/game/biomes/ancientCoreBiome";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { LOOT_CATEGORIES } from "../src/game/loot/lootTuning";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

const ACORE_ROSTERS = [...ANCIENT_ENEMIES, ...CELESTIAL_ENEMIES, ...VOID_ENEMIES, ...PARAGON_ENEMIES, ...ECLIPSED_ENEMIES];

describe("Ancient Core vocabulary — registered shelves with total engine mappings (AF-062)", () => {
  it("registers ten structures, seven weather, eight hazards, eight missions, eight resources, eight POIs, eight events, eight discoveries, five bosses", () => {
    expect(ACORE_LOCATIONS.length).toBe(10);
    expect(ACORE_WEATHER.length).toBe(7);
    expect(ACORE_HAZARD_KINDS.length).toBe(8);
    expect(ACORE_MISSION_TYPES.length).toBe(8);
    expect(ACORE_RESOURCES.length).toBe(8);
    expect(ACORE_POI_KINDS.length).toBe(8);
    expect(ACORE_EVENTS.length).toBe(8);
    expect(ACORE_DISCOVERIES.length).toBe(8);
    expect(ACORE_BOSS_KINDS.length).toBe(5);
  });

  it("every core weather and event name maps onto AF-036's locked shelves — naming layers, never new engines", () => {
    for (const name of ACORE_WEATHER) expect(WEATHER_KINDS).toContain(ACORE_WEATHER_TO_ENGINE[name]);
    for (const name of ACORE_EVENTS) expect(BIOME_EVENT_KINDS).toContain(ACORE_EVENT_TO_ENGINE[name]);
  });
});

describe("The Ancient Core is a plain AF-036 BiomeDef — zero schema changes (AF-062 §Biome Identity)", () => {
  it("uses only locked engine vocabulary throughout, and its boss is a REAL authored BossDef", () => {
    for (const condition of ANCIENT_CORE_BIOME.conditions) expect(ENVIRONMENTAL_CONDITIONS).toContain(condition);
    for (const weather of ANCIENT_CORE_BIOME.weather) expect(WEATHER_KINDS).toContain(weather.kind);
    for (const event of ANCIENT_CORE_BIOME.events) expect(BIOME_EVENT_KINDS).toContain(event.kind);
    for (const category of Object.keys(ANCIENT_CORE_BIOME.resourceWeights)) expect(LOOT_CATEGORIES).toContain(category);
    for (const interactable of ANCIENT_CORE_BIOME.interactables) expect(INTERACTION_KINDS).toContain(interactable.kind);
    expect(ANCIENT_CORE_BIOME.coreBiome).toBe("ancientRuins");
    expect(SANDBOX_BOSSES.some((b) => b.id === ANCIENT_CORE_BIOME.bossId)).toBe(true); // the guardian defends its makers' home
  });

  it("its enemy presence follows the spec — Custodians primary, Conclave, rare Void, Paragon, occasional Eclipsed", () => {
    const ids = ANCIENT_CORE_BIOME.enemyIds;
    for (const id of ids) expect(ACORE_ROSTERS.some((d) => d.id === id)).toBe(true);
    expect(ids.filter((id) => ANCIENT_ENEMIES.some((d) => d.id === id)).length).toBeGreaterThanOrEqual(6); // primary — every battle protects knowledge
    expect(ids.some((id) => CELESTIAL_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => VOID_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => PARAGON_ENEMIES.some((d) => d.id === id))).toBe(true);
    expect(ids.some((id) => ECLIPSED_ENEMIES.some((d) => d.id === id))).toBe(true);
  });

  it("its three hazards are real AF-035 zones that feel intentional — security, precision, stolen time — and the keepers are recognised", () => {
    expect(ANCIENT_CORE_BIOME.hazards.length).toBe(3);
    for (const hazard of ANCIENT_CORE_BIOME.hazards) {
      const state: HazardZoneState = { tickClockMs: 0 };
      expect(stepHazardZone(hazard, state, hazard.tickIntervalMs)).toBe(true);
    }
    expect(ANCIENT_CORE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "shieldBreak")).toBe(true); // Security Fields
    expect(ANCIENT_CORE_BIOME.hazards.some((h) => h.statusOnTick?.kind === "stasis")).toBe(true); // Temporal Locks
    expect(ANCIENT_CORE_BIOME.hazardImmunities).toContain("shieldBreak");
    expect(ANCIENT_CORE_BIOME.hazardImmunities).toContain("stasis");
    expect(ANCIENT_CORE_BIOME.enemyBuff?.kind).toBe("shieldCapacity");
  });

  it("civilisation at its absolute peak: the deepest threat modifier, and perfection never obscures", () => {
    expect(ANCIENT_CORE_BIOME.threatModifier).toBeGreaterThan(1.35);
    for (const weather of ANCIENT_CORE_BIOME.weather) expect(weather.reducedVisibility).toBe(false); // readability is a precursor value too
  });
});

describe("Galaxy integration — First Light carries the Core (AF-062 §Lore)", () => {
  it("the ancientCore region exists and First Light is reachable past the Void, resolving the biomeId", () => {
    expect(SANDBOX_GALAXY.regions.some((r) => r.id === "ancientCore")).toBe(true);
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.travelTo("sys-forge-primus", false)).toBe(true);
    expect(runtime.travelTo("sys-hollow-crown", false)).toBe(true);
    expect(runtime.canTravelTo("sys-first-light", false)).toBe(true);
    expect(runtime.travelTo("sys-first-light", false)).toBe(true);
    expect(runtime.currentSystem.biomeId).toBe(ANCIENT_CORE_BIOME.id);
    expect(runtime.currentSystem.region).toBe("ancientCore");
    expect(runtime.currentSystem.threatLevel).toBe(6);
  });
});

describe("BiomeRuntime integration — the Core runs on the unchanged AF-036 engine (AF-062 §Output)", () => {
  it("weather cycles only through the Core's own defs and events fire only from its own pool", () => {
    const runtime = new BiomeRuntime(ANCIENT_CORE_BIOME, new Rng(4062));
    const weatherKinds = new Set(ANCIENT_CORE_BIOME.weather.map((w) => w.kind));
    const eventKinds = new Set(ANCIENT_CORE_BIOME.events.map((e) => e.kind));
    for (let i = 0; i < 4000; i += 1) {
      runtime.update(500);
      const snap = runtime.snapshot;
      if (snap.activeWeather) expect(weatherKinds.has(snap.activeWeather)).toBe(true);
      const event = runtime.tryTriggerEvent();
      if (event) expect(eventKinds.has(event)).toBe(true);
    }
  });

  it("the knowledge vault discovers the biome's lore in range", () => {
    const runtime = new BiomeRuntime(ANCIENT_CORE_BIOME, new Rng(2));
    const vault = ANCIENT_CORE_BIOME.interactables.find((i) => i.discoveryId === LORE_ANCIENT_CORE_ARCHIVE)!;
    expect(runtime.findInteractableInRange(vault.x, vault.y)?.id).toBe(vault.id);
  });
});

describe("Codex — the Ancient Core biome entry (AF-062 §Lore)", () => {
  it("adds an additive biome Codex entry gated on the knowledge-vault discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-biome-ancient-core");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: LORE_ANCIENT_CORE_ARCHIVE });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Ancient Core — self-review: thousands of missions stay consistent (AF-062 §Self Review Loop)", () => {
  it("survives 1,000 seeded Core missions without breaching any biome invariant", () => {
    for (let mission = 0; mission < 1000; mission += 1) {
      const runtime = new BiomeRuntime(ANCIENT_CORE_BIOME, new Rng(mission));
      let hazardFires = 0;
      for (let step = 0; step < 40; step += 1) {
        runtime.update(1000);
        hazardFires += runtime.tickHazards(1000).length;
        runtime.tryTriggerEvent();
      }
      expect(hazardFires).toBeGreaterThan(0); // the vigil never lapses
      expect(runtime.snapshot.hazardCount).toBe(ANCIENT_CORE_BIOME.hazards.length);
    }
  });
});
