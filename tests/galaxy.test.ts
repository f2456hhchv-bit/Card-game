import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { SANDBOX_GALAXY, GALAXY_EVENT_KINDS } from "../src/game/galaxy/galaxyData";

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
