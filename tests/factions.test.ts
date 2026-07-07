import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { GalaxyRuntime } from "../src/game/galaxy/GalaxyRuntime";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import {
  FACTION_EVENT_KINDS,
  PLAYER_CHOICE_KINDS,
  PLAYER_CHOICE_REPUTATION_DELTA,
  REPUTATION_LEVELS,
  REPUTATION_MAX,
  REPUTATION_MIN,
  SANDBOX_FACTION_ROSTER,
} from "../src/game/factions/factionData";

describe("FactionRuntime — faction profiles (AF-039 §Faction Structure)", () => {
  it("finds a faction by id", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.findFaction("crystalDominion")?.name).toBe("Crystal Dominion");
  });

  it("finds a faction by its display name (StarSystemDef.dominantFaction is a plain string)", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.findFactionByName("Machine Collective")?.id).toBe("machineCollective");
  });

  it("returns null for an unknown faction", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.findFaction("doesNotExist")).toBeNull();
  });

  it("every sandbox faction carries a full AF-010 nine-attribute-equivalent profile", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    for (const id of ["crystalDominion", "machineCollective", "humanAlliance"] as const) {
      const faction = runtime.findFaction(id);
      expect(faction).not.toBeNull();
      expect(faction!.history.length).toBeGreaterThan(0);
      expect(faction!.technology.length).toBeGreaterThan(0);
      expect(faction!.military.length).toBeGreaterThan(0);
      expect(faction!.culture.length).toBeGreaterThan(0);
      expect(faction!.territory.length).toBeGreaterThan(0);
    }
  });

  it("lists Faction Missions scoped to their issuing faction", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    const missions = runtime.missionsFor("crystalDominion");
    expect(missions.length).toBeGreaterThan(0);
    expect(missions.every((m) => m.factionId === "crystalDominion")).toBe(true);
  });
});

describe("FactionRuntime — relationships / Conflict System (AF-039 §Faction Relationships)", () => {
  it("a faction is always in alliance with itself", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.relationshipBetween("crystalDominion", "crystalDominion")).toBe("alliance");
  });

  it("reads an explicit initial relationship regardless of argument order", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.relationshipBetween("crystalDominion", "machineCollective")).toBe("coldWar");
    expect(runtime.relationshipBetween("machineCollective", "crystalDominion")).toBe("coldWar");
  });

  it("falls back to the roster default for an unlisted pair", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    expect(runtime.relationshipBetween("solarEmpire", "voidLegion")).toBe(SANDBOX_FACTION_ROSTER.defaultRelationship);
  });

  it("player choices (Support/Oppose/Negotiate) can evolve a relationship independently", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    runtime.setRelationship("crystalDominion", "machineCollective", "ceasefire");
    expect(runtime.relationshipBetween("crystalDominion", "machineCollective")).toBe("ceasefire");
    expect(runtime.relationshipBetween("machineCollective", "crystalDominion")).toBe("ceasefire");
  });
});

describe("FactionRuntime — weighted Faction Events (AF-039 §Faction Events)", () => {
  it("fires no event before the interval elapses", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1), 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the roster's own pool", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(5), 1000);
    const configuredKinds = SANDBOX_FACTION_ROSTER.events.map((e) => e.kind);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredKinds).toContain(event);
        expect(FACTION_EVENT_KINDS).toContain(event);
      }
    }
    expect(fired).toBe(50);
  });
});

describe("FactionRuntime.reputationLevel — pure threshold lookup (AF-039 §Reputation Levels)", () => {
  it("returns hostile at the reputation floor", () => {
    expect(FactionRuntime.reputationLevel(REPUTATION_MIN)).toBe("hostile");
  });

  it("returns legendaryAlly at the reputation ceiling", () => {
    expect(FactionRuntime.reputationLevel(REPUTATION_MAX)).toBe("legendaryAlly");
  });

  it("returns neutral at exactly zero", () => {
    expect(FactionRuntime.reputationLevel(0)).toBe("neutral");
  });

  it("is monotonic — reputation levels never regress as reputation rises", () => {
    let lastIndex = -1;
    for (let value = REPUTATION_MIN; value <= REPUTATION_MAX; value += 17) {
      const level = FactionRuntime.reputationLevel(value);
      const index = REPUTATION_LEVELS.indexOf(level);
      expect(index).toBeGreaterThanOrEqual(lastIndex);
      lastIndex = index;
    }
  });
});

describe("Faction reputation clamping reuses AF-038's GalaxyRuntime.clampedDelta directly (AF-039)", () => {
  it("clamps a Support choice that would exceed the reputation ceiling", () => {
    const delta = GalaxyRuntime.clampedDelta(REPUTATION_MAX - 5, PLAYER_CHOICE_REPUTATION_DELTA.support, REPUTATION_MIN, REPUTATION_MAX);
    expect(delta).toBe(5);
  });

  it("clamps an Oppose choice that would exceed the reputation floor", () => {
    const delta = GalaxyRuntime.clampedDelta(REPUTATION_MIN + 5, PLAYER_CHOICE_REPUTATION_DELTA.oppose, REPUTATION_MIN, REPUTATION_MAX);
    expect(delta).toBe(-5);
  });

  it("Ignore and Explore Independently never move reputation — player choice is never mandatory", () => {
    expect(PLAYER_CHOICE_REPUTATION_DELTA.ignore).toBe(0);
    expect(PLAYER_CHOICE_REPUTATION_DELTA.exploreIndependently).toBe(0);
  });
});

describe("Factions — self-review: thousands of galaxy cycles of choices and events stay consistent", () => {
  it("survives a long sweep of every player choice against every faction without breaching bounds", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(123), 500);
    let reputation = 0;
    let eventsFired = 0;
    const rng = new Rng(777);
    for (let cycle = 0; cycle < 5000; cycle += 1) {
      runtime.update(16);
      if (runtime.tryTriggerEvent()) eventsFired += 1;
      const choice = rng.pick(PLAYER_CHOICE_KINDS);
      const delta = GalaxyRuntime.clampedDelta(reputation, PLAYER_CHOICE_REPUTATION_DELTA[choice], REPUTATION_MIN, REPUTATION_MAX);
      reputation += delta;
      expect(reputation).toBeGreaterThanOrEqual(REPUTATION_MIN);
      expect(reputation).toBeLessThanOrEqual(REPUTATION_MAX);
      expect(REPUTATION_LEVELS).toContain(FactionRuntime.reputationLevel(reputation));
    }
    expect(eventsFired).toBeGreaterThan(0);
    expect(runtime.snapshot.eventsTriggered).toBe(eventsFired);
  });
});
