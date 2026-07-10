import { describe, expect, it } from "vitest";
import {
  COMMANDER_EVENT_KINDS,
  COMMUNITY_EVENT_KINDS,
  DISCOVERY_EVENT_KINDS,
  ECONOMIC_EVENT_KINDS,
  EMERGENCY_EVENT_KINDS,
  EVENT_CHAIN_EXAMPLE,
  EVENT_GENERATION_INPUTS,
  EVENT_TIER_EXAMPLES,
  EVENT_TIERS,
  EXPLORATION_EVENT_KINDS,
  HISTORICAL_EVENT_TRIGGER_KINDS,
  PLAYER_EVENT_KINDS,
  SHIP_EVENT_KINDS,
  WORLD_EVENT_KINDS,
  tierWeightsFor,
} from "../src/game/eventEngine/eventEngineData";
import { EventChainRuntime, GalacticEventLog, rollTier } from "../src/game/eventEngine/EventEngineRuntime";

describe("The Galactic Event Engine (AF-137)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EVENT_TIERS.length).toBe(5);
    expect(EVENT_GENERATION_INPUTS.length).toBe(11);
    expect(COMMUNITY_EVENT_KINDS.length).toBe(9);
    expect(COMMANDER_EVENT_KINDS.length).toBe(7);
    expect(WORLD_EVENT_KINDS.length).toBe(9);
    expect(DISCOVERY_EVENT_KINDS.length).toBe(7);
    expect(PLAYER_EVENT_KINDS.length).toBe(8);
    expect(EMERGENCY_EVENT_KINDS.length).toBe(8);
    expect(HISTORICAL_EVENT_TRIGGER_KINDS.length).toBe(6);
    expect(SHIP_EVENT_KINDS.length).toBe(9);
    expect(EXPLORATION_EVENT_KINDS.length).toBe(8);
    expect(ECONOMIC_EVENT_KINDS.length).toBe(8);
    expect(EVENT_CHAIN_EXAMPLE.length).toBe(8);
  });

  it("every tier has its own real example list, including Legendary's five 'never guaranteed' examples", () => {
    for (const tier of EVENT_TIERS) expect(EVENT_TIER_EXAMPLES[tier].length).toBeGreaterThan(0);
    expect(EVENT_TIER_EXAMPLES.Legendary).toContain("The Founder Signal");
    expect(EVENT_TIER_EXAMPLES.Local).toContain("Research breakthrough");
  });

  it("tierWeightsFor never appears random — higher real inputs bias toward larger-scale tiers, and Legendary always stays rarest", () => {
    const quiet = tierWeightsFor({ economyHealth: 0, averagePollution: 20, averageWildlife: 60, reputationTotal: 0, strongestBondLevel: 0, dominantPillarCount: 0 });
    const thriving = tierWeightsFor({ economyHealth: 80, averagePollution: 10, averageWildlife: 90, reputationTotal: 200, strongestBondLevel: 5, dominantPillarCount: 2 });
    expect(thriving.Galactic).toBeGreaterThan(quiet.Galactic);
    expect(thriving.Sector).toBeGreaterThan(quiet.Sector);
    expect(thriving.Legendary).toBe(quiet.Legendary);
    expect(quiet.Legendary).toBeLessThan(quiet.Local);
  });

  it("rollTier always returns a real tier and is weighted, not uniform", () => {
    const inputs = { economyHealth: 50, averagePollution: 20, averageWildlife: 60, reputationTotal: 50, strongestBondLevel: 3, dominantPillarCount: 1 };
    for (const roll of [0, 0.25, 0.5, 0.75, 0.999]) {
      expect(EVENT_TIERS).toContain(rollTier(inputs, roll));
    }
    expect(rollTier(inputs, 0)).toBe("Local");
  });

  it("GalacticEventLog is append-only and filterable by tier", () => {
    const log = new GalacticEventLog();
    log.record("Local", "A small colony celebrates its first harvest.", 1);
    log.record("Legendary", "An ancient AI stirs beneath Prismheart.", 50);
    expect(log.all().length).toBe(2);
    expect(log.countFor("Legendary")).toBe(1);
    expect(log.byTier("Local")[0]!.description).toContain("harvest");
  });

  it("EventChainRuntime advances the spec's own mining-boom chain one real ripple at a time", () => {
    const chain = new EventChainRuntime(EVENT_CHAIN_EXAMPLE);
    expect(chain.currentStep()).toBe("Mining boom");
    expect(chain.isComplete()).toBe(false);
    for (let i = 0; i < EVENT_CHAIN_EXAMPLE.length; i++) chain.advance();
    expect(chain.isComplete()).toBe(true);
    expect(chain.stepsCompleted()).toBe(EVENT_CHAIN_EXAMPLE.length);
    expect(chain.advance()).toBeNull();
  });
});
