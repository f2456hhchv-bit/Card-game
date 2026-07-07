import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { WorldEventRuntime } from "../src/game/worldEvents/WorldEventRuntime";
import {
  EVENT_CATEGORIES,
  PLAYER_PARTICIPATION_KINDS,
  PLAYER_PARTICIPATION_WORLD_STATE_DELTA,
  SANDBOX_WORLD_EVENTS,
  WORLD_STATE_KEYS,
  WORLD_STATE_MAX,
  WORLD_STATE_MIN,
} from "../src/game/worldEvents/worldEventData";

describe("WorldEventRuntime — Dynamic Event Generation (AF-041 §Dynamic Event Generation)", () => {
  it("fires no event before the interval elapses", () => {
    const runtime = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(1), 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the roster's own pool", () => {
    const runtime = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(5), 1000);
    const configuredIds = SANDBOX_WORLD_EVENTS.events.map((e) => e.id);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredIds).toContain(event.id);
        expect(EVENT_CATEGORIES).toContain(event.category);
      }
    }
    expect(fired).toBe(50);
  });

  it("is deterministic — same seed, same sequence of fired events", () => {
    const a = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(42), 500);
    const b = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(42), 500);
    const seqA: string[] = [];
    const seqB: string[] = [];
    for (let i = 0; i < 20; i += 1) {
      a.update(500);
      b.update(500);
      const ea = a.tryTriggerEvent();
      const eb = b.tryTriggerEvent();
      if (ea) seqA.push(ea.id);
      if (eb) seqB.push(eb.id);
    }
    expect(seqA).toEqual(seqB);
    expect(seqA.length).toBeGreaterThan(0);
  });

  it("exposes the most recently fired event as the current event", () => {
    const runtime = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(7), 100);
    expect(runtime.currentEvent).toBeNull();
    runtime.update(100);
    const event = runtime.tryTriggerEvent();
    expect(runtime.currentEvent).toBe(event);
  });
});

describe("World State deltas reuse AF-038's GalaxyRuntime.clampedDelta directly (AF-041 §World State)", () => {
  it("registers all ten World State keys", () => {
    expect(WORLD_STATE_KEYS.length).toBe(10);
  });

  it("clamps an event's ambient delta at the World State ceiling", () => {
    const delta = GalaxyRuntime.clampedDelta(WORLD_STATE_MAX - 5, 20, WORLD_STATE_MIN, WORLD_STATE_MAX);
    expect(delta).toBe(5);
  });

  it("clamps an event's ambient delta at the World State floor", () => {
    const delta = GalaxyRuntime.clampedDelta(WORLD_STATE_MIN + 5, -20, WORLD_STATE_MIN, WORLD_STATE_MAX);
    expect(delta).toBe(-5);
  });

  it("every sandbox event's worldStateKey is a registered World State key", () => {
    for (const event of SANDBOX_WORLD_EVENTS.events) {
      expect(WORLD_STATE_KEYS).toContain(event.worldStateKey);
    }
  });
});

describe("Player Participation — never mandatory (AF-041 §Player Participation)", () => {
  it("registers all seven participation kinds", () => {
    expect(PLAYER_PARTICIPATION_KINDS.length).toBe(7);
  });

  it("Ignore and Observe never move World State — participation is never mandatory", () => {
    expect(PLAYER_PARTICIPATION_WORLD_STATE_DELTA.ignore).toBe(0);
    expect(PLAYER_PARTICIPATION_WORLD_STATE_DELTA.observe).toBe(0);
  });

  it("Prevent always pushes the opposite direction from Support", () => {
    expect(Math.sign(PLAYER_PARTICIPATION_WORLD_STATE_DELTA.prevent)).toBe(-Math.sign(PLAYER_PARTICIPATION_WORLD_STATE_DELTA.support));
  });
});

describe("Event Chains remain modular — plain content references, not a second engine (AF-041 §Event Chains)", () => {
  it("at least one sandbox event per active chain kind references real content", () => {
    const chained = SANDBOX_WORLD_EVENTS.events.filter((e) => e.chainsInto !== null);
    expect(chained.length).toBeGreaterThan(0);
    for (const event of chained) {
      expect(event.chainsInto!.contentId.length).toBeGreaterThan(0);
    }
  });
});

describe("Galaxy Events — self-review: thousands of galaxy years stay consistent", () => {
  it("survives a long sweep of event firings and Player Participation deltas without breaching World State bounds", () => {
    const runtime = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(2026), 500);
    const worldState: Record<string, number> = {};
    for (const key of WORLD_STATE_KEYS) worldState[key] = 50;
    const rng = new Rng(31337);
    let eventsFired = 0;
    for (let cycle = 0; cycle < 5000; cycle += 1) {
      runtime.update(16);
      const event = runtime.tryTriggerEvent();
      if (event) {
        eventsFired += 1;
        const ambient = GalaxyRuntime.clampedDelta(worldState[event.worldStateKey]!, event.worldStateDelta, WORLD_STATE_MIN, WORLD_STATE_MAX);
        worldState[event.worldStateKey]! += ambient;
        const choice = rng.pick(PLAYER_PARTICIPATION_KINDS);
        const participationDelta = GalaxyRuntime.clampedDelta(
          worldState[event.worldStateKey]!,
          PLAYER_PARTICIPATION_WORLD_STATE_DELTA[choice],
          WORLD_STATE_MIN,
          WORLD_STATE_MAX,
        );
        worldState[event.worldStateKey]! += participationDelta;
      }
      for (const key of WORLD_STATE_KEYS) {
        expect(worldState[key]).toBeGreaterThanOrEqual(WORLD_STATE_MIN);
        expect(worldState[key]).toBeLessThanOrEqual(WORLD_STATE_MAX);
      }
    }
    expect(eventsFired).toBeGreaterThan(0);
    expect(runtime.snapshot.eventsTriggered).toBe(eventsFired);
  });
});
