import { describe, it, expect } from "vitest";
import { Rng } from "../../core/math/Rng";
import { simulateTick } from "./Combat";
import { createDefaultState } from "../state/GameState";
import { KILLS_PER_STAGE } from "./Economy";
import { effectiveHeroStats } from "./HeroStats";

describe("simulateTick", () => {
  it("does nothing for zero elapsed time", () => {
    const state = createDefaultState();
    const result = simulateTick(state, 0, new Rng(1));
    expect(result.kills).toBe(0);
    expect(result.goldGained).toBe(0);
    expect(result.state.stage).toBe(1);
  });

  it("kills enemies, earns gold/essence, and initializes hero/enemy HP", () => {
    const state = createDefaultState();
    const result = simulateTick(state, 10, new Rng(1));
    expect(result.kills).toBeGreaterThan(0);
    expect(result.goldGained).toBeGreaterThan(0);
    expect(result.essenceGained).toBeGreaterThan(0);
    expect(result.state.gold).toBeGreaterThan(0);
    expect(result.state.heroHp).toBeGreaterThan(0);
  });

  it("advances the stage after clearing a full wave", () => {
    const state = createDefaultState();
    // Generous dt so a stage 1 wave (base stats vs. base enemies) fully clears.
    const result = simulateTick(state, 120, new Rng(2));
    expect(result.state.stage).toBeGreaterThan(1);
    // highestStageReached is a high-water mark; a death retreat can leave the
    // current stage behind it, so it must never be *behind* current stage.
    expect(result.state.highestStageReached).toBeGreaterThanOrEqual(result.state.stage);
  });

  it("is deterministic given the same rng seed", () => {
    // Snapshot one base state so createdAt/lastSeenAt (wall-clock at
    // creation) can't drift between the two calls and mask a real mismatch.
    const base: ReturnType<typeof createDefaultState> = JSON.parse(JSON.stringify(createDefaultState()));
    const a = simulateTick(JSON.parse(JSON.stringify(base)), 500, new Rng(99));
    const b = simulateTick(JSON.parse(JSON.stringify(base)), 500, new Rng(99));
    expect(a.state).toEqual(b.state);
    expect(a.kills).toBe(b.kills);
  });

  it("levels the hero up once enough essence has been earned", () => {
    const state = createDefaultState();
    const result = simulateTick(state, 300, new Rng(3));
    expect(result.state.heroLevel).toBeGreaterThan(1);
  });

  it("never leaves the hero above their effective max HP", () => {
    const state = createDefaultState();
    const result = simulateTick(state, 1000, new Rng(4));
    const maxHp = effectiveHeroStats(result.state).hp;
    expect(result.state.heroHp).toBeGreaterThanOrEqual(0);
    expect(result.state.heroHp).toBeLessThanOrEqual(maxHp + 1e-6);
  });

  it("retreats and heals the hero on death instead of getting stuck", () => {
    // A hero with near-zero attack can't out-pace enemy damage and must die
    // and retreat rather than looping forever.
    const state = createDefaultState();
    state.heroLevel = 1;
    // Push the frontier stage far ahead of the hero's power so death is certain.
    state.stage = 80;
    state.highestStageReached = 80;
    const result = simulateTick(state, 600, new Rng(5));
    const died = result.events.some((e) => e.type === "heroDeath");
    expect(died).toBe(true);
    expect(result.state.stage).toBeLessThan(80);
    expect(result.state.heroHp).toBeGreaterThan(0);
  });

  it("handles a very large (offline-scale) dt without hanging and stays internally consistent", () => {
    const state = createDefaultState();
    const start = Date.now();
    const result = simulateTick(state, 8 * 3600, new Rng(6));
    const elapsedMs = Date.now() - start;
    expect(elapsedMs).toBeLessThan(2000);
    expect(result.state.stage).toBeGreaterThanOrEqual(1);
    expect(result.state.gold).toBeGreaterThan(0);
    expect(Number.isFinite(result.state.gold)).toBe(true);
    expect(Number.isFinite(result.state.heroHp)).toBe(true);
  });

  it("respects KILLS_PER_STAGE when tallying wave progress", () => {
    const state = createDefaultState();
    const result = simulateTick(state, 3, new Rng(8));
    expect(result.state.killsInStage).toBeLessThanOrEqual(KILLS_PER_STAGE);
  });
});
