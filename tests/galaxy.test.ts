import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { SANDBOX_GALAXY, GALAXY_EVENT_KINDS, campaignDifficultyFor } from "../src/game/galaxy/galaxyData";

// sys-lucent-gate <-> sys-hollow-drift <-> sys-ember-reach (fast-travel-gated)

describe("GalaxyRuntime — route traversal (AF-038 §Galaxy Map)", () => {
  it("starts at the given system", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.currentSystem.id).toBe("sys-lucent-gate");
  });

  it("allows travel to a directly connected system", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.canTravelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.travelTo("sys-hollow-drift", false)).toBe(true);
    expect(runtime.currentSystem.id).toBe("sys-hollow-drift");
  });

  it("blocks travel to a non-adjacent system without Fast Travel", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.canTravelTo("sys-ember-reach", false)).toBe(false);
    expect(runtime.travelTo("sys-ember-reach", false)).toBe(false);
    expect(runtime.currentSystem.id).toBe("sys-lucent-gate"); // unchanged
  });

  it("a Fast-Travel-gated system stays blocked even when adjacent, until unlocked", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-hollow-drift");
    expect(runtime.canTravelTo("sys-ember-reach", false)).toBe(false);
    expect(runtime.canTravelTo("sys-ember-reach", true)).toBe(true);
    expect(runtime.travelTo("sys-ember-reach", true)).toBe(true);
    expect(runtime.currentSystem.id).toBe("sys-ember-reach");
  });

  it("Fast Travel unlocked bypasses adjacency for any system", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-ember-reach", true)).toBe(true);
  });

  it("rejects travel to an unknown system", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate");
    expect(runtime.travelTo("sys-does-not-exist", true)).toBe(false);
  });
});

describe("GalaxyRuntime — weighted Galaxy Events (AF-038 §Galaxy Events)", () => {
  it("fires no event before the interval elapses", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(1), "sys-lucent-gate", 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the galaxy's own pool", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(5), "sys-lucent-gate", 1000);
    const configuredKinds = SANDBOX_GALAXY.events.map((e) => e.kind);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredKinds).toContain(event);
        expect(GALAXY_EVENT_KINDS).toContain(event);
      }
    }
    expect(fired).toBe(50);
  });
});

describe("GalaxyRuntime.clampedDelta — pure, no persistence of its own (AF-038)", () => {
  it("passes a delta through unchanged when it stays within bounds", () => {
    expect(GalaxyRuntime.clampedDelta(50, 10, 0, 100)).toBe(10);
  });

  it("clamps a delta that would exceed the max", () => {
    expect(GalaxyRuntime.clampedDelta(95, 10, 0, 100)).toBe(5);
  });

  it("clamps a delta that would go below the min", () => {
    expect(GalaxyRuntime.clampedDelta(5, -10, 0, 100)).toBe(-5);
  });

  it("returns zero once already at the bound", () => {
    expect(GalaxyRuntime.clampedDelta(100, 10, 0, 100)).toBe(0);
  });
});

describe("GP-003 §Enemy Scaling — campaignDifficultyFor: real campaign-depth difficulty from StarSystemDef.threatLevel", () => {
  it("threatLevel 1 (the easiest system) is the baseline — exactly 1", () => {
    expect(campaignDifficultyFor(1)).toBe(1);
  });

  it("every level above 1 raises difficulty monotonically", () => {
    let previous = campaignDifficultyFor(1);
    for (let level = 2; level <= 7; level += 1) {
      const next = campaignDifficultyFor(level);
      expect(next).toBeGreaterThan(previous);
      previous = next;
    }
  });

  it("real systems produce real, distinct difficulty values", () => {
    const meridianRest = SANDBOX_GALAXY.systems.find((s) => s.id === "sys-meridian-rest")!; // threatLevel 1
    const axiom = SANDBOX_GALAXY.systems.find((s) => s.id === "sys-axiom")!; // threatLevel 7, the deepest system
    expect(campaignDifficultyFor(meridianRest.threatLevel)).toBe(1);
    expect(campaignDifficultyFor(axiom.threatLevel)).toBeGreaterThan(campaignDifficultyFor(meridianRest.threatLevel));
  });
});

describe("GP-003 §Star Systems — biome-matched missions, not one shared default (no two systems feel identical)", () => {
  it("Winterline, First Light, and Forge Primus each reference their own biome-matched mission, not the Crystal Fields default", () => {
    const winterline = SANDBOX_GALAXY.systems.find((s) => s.id === "sys-winterline")!;
    const firstLight = SANDBOX_GALAXY.systems.find((s) => s.id === "sys-first-light")!;
    const forgePrimus = SANDBOX_GALAXY.systems.find((s) => s.id === "sys-forge-primus")!;
    expect(winterline.missionIds).toEqual(["winterline-rescue"]);
    expect(firstLight.missionIds).toEqual(["first-light-excavation"]);
    expect(forgePrimus.missionIds).toEqual(["forge-primus-uprising"]);
    // Each system's assigned mission's own biomeId matches the system's biome.
    expect(winterline.biomeId).toBe("frozen-reach");
    expect(firstLight.biomeId).toBe("ancient-core");
    expect(forgePrimus.biomeId).toBe("machine-expanse");
  });
});

describe("Galaxy — self-review: a long session traverses routes and fires events without exception", () => {
  it("survives thousands of ticks with events firing and the snapshot staying consistent", () => {
    const runtime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(123), "sys-lucent-gate", 2000);
    let eventsFired = 0;
    for (let tick = 0; tick < 5000; tick += 1) {
      runtime.update(16);
      if (runtime.tryTriggerEvent()) eventsFired += 1;
    }
    expect(eventsFired).toBeGreaterThan(0);
    expect(runtime.snapshot.currentSystemId).toBe("sys-lucent-gate");
    expect(runtime.snapshot.eventsTriggered).toBe(eventsFired);
  });
});
