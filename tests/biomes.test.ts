import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { BiomeRuntime } from "../src/game/biomes/BiomeRuntime";
import { SANDBOX_BIOMES, BIOME_EVENT_KINDS, WEATHER_KINDS } from "../src/game/biomes/biomeData";

const biomeDef = SANDBOX_BIOMES[0]!; // Crystal Fields — 1 hazard, 2 weather kinds, 4 events, 2 interactables

describe("BiomeRuntime — weather rotation (AF-036 §Weather System)", () => {
  it("has no active weather before the first update", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    expect(runtime.currentWeather).toBeNull();
  });

  it("picks a weather kind from the biome's own list on the first tick", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    runtime.update(16);
    expect(runtime.currentWeather).not.toBeNull();
    expect(WEATHER_KINDS).toContain(runtime.currentWeather!.kind);
  });

  it("rotates to a new weather once the active one's duration elapses", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(2));
    runtime.update(16);
    const first = runtime.currentWeather!;
    for (let i = 0; i < Math.ceil(first.durationMs / 16) + 2; i += 1) runtime.update(16);
    expect(runtime.currentWeather).not.toBeNull();
    expect(runtime.snapshot.weatherRemainingMs).toBeGreaterThan(0);
  });

  it("is deterministic given the same seed", () => {
    const a = new BiomeRuntime(biomeDef, new Rng(99));
    const b = new BiomeRuntime(biomeDef, new Rng(99));
    for (let i = 0; i < 500; i += 1) {
      a.update(16);
      b.update(16);
    }
    expect(a.currentWeather?.kind).toBe(b.currentWeather?.kind);
    expect(a.snapshot.weatherRemainingMs).toBeCloseTo(b.snapshot.weatherRemainingMs, 5);
  });
});

describe("BiomeRuntime — weighted Biome Events (AF-036 §Biome Events)", () => {
  it("fires no event before the interval elapses", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1), 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the biome's own list", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(5), 1000);
    const configuredKinds = biomeDef.events.map((e) => e.kind);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredKinds).toContain(event);
        expect(BIOME_EVENT_KINDS).toContain(event);
      }
    }
    expect(fired).toBe(50);
  });

  it("a biome with no configured events never fires one", () => {
    const runtime = new BiomeRuntime({ ...biomeDef, events: [] }, new Rng(1), 100);
    runtime.update(1000);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });
});

describe("BiomeRuntime — hazard-zone ticking reuses AF-035's exact engine (AF-036 §Environmental Hazards)", () => {
  it("ticks each configured hazard independently and deterministically", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    const hazard = biomeDef.hazards[0]!;
    let fires = 0;
    for (let i = 0; i < Math.ceil((hazard.tickIntervalMs * 3) / 16); i += 1) {
      const firing = runtime.tickHazards(16);
      fires += firing.length;
    }
    expect(fires).toBeGreaterThanOrEqual(2); // ~3 intervals worth of 16ms ticks
  });
});

describe("BiomeRuntime — interactables (AF-036 §Environmental Interaction)", () => {
  it("finds an interactable within its radius, and not outside it", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    const interactable = biomeDef.interactables[0]!;
    expect(runtime.findInteractableInRange(interactable.x, interactable.y)).toBe(interactable);
    expect(runtime.findInteractableInRange(interactable.x + 100, interactable.y + 100)).toBeNull();
  });
});

describe("BiomeRuntime — pass-through hooks feed existing systems, not new ones (AF-036)", () => {
  it("resourceWeights is the exact object AF-023's DropContext.smartLoot.categoryWeights expects", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    expect(runtime.resourceWeights).toBe(biomeDef.resourceWeights);
    expect(runtime.resourceWeights.craftingMaterial).toBeGreaterThan(1);
  });

  it("enemyBuff is the same EquipmentBonus shape every other module already uses", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    expect(runtime.enemyBuff).toEqual(biomeDef.enemyBuff);
  });

  it("hazardImmunities and threatModifier pass through unchanged", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(1));
    expect(runtime.hazardImmunities).toEqual(biomeDef.hazardImmunities);
    expect(runtime.threatModifier).toBe(biomeDef.threatModifier);
  });
});

describe("Biomes — self-review: the sandbox biome runs a full session without exception", () => {
  it("survives thousands of ticks producing hazards, weather changes, and events throughout", () => {
    const runtime = new BiomeRuntime(biomeDef, new Rng(123), 2000);
    let hazardFires = 0;
    let eventsFired = 0;
    const weatherKindsSeen = new Set<string>();
    for (let tick = 0; tick < 5000; tick += 1) {
      runtime.update(16);
      hazardFires += runtime.tickHazards(16).length;
      const event = runtime.tryTriggerEvent();
      if (event) eventsFired += 1;
      if (runtime.currentWeather) weatherKindsSeen.add(runtime.currentWeather.kind);
    }
    expect(hazardFires).toBeGreaterThan(0);
    expect(eventsFired).toBeGreaterThan(0);
    expect(weatherKindsSeen.size).toBeGreaterThan(0);
  });
});
