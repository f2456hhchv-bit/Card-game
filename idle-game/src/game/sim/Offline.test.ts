import { describe, it, expect } from "vitest";
import { Rng } from "../../core/math/Rng";
import { resolveOfflineProgress } from "./Offline";
import { createDefaultState } from "../state/GameState";
import { BALANCE } from "./Economy";

describe("resolveOfflineProgress", () => {
  it("simulates nothing when no time has passed", () => {
    const state = createDefaultState();
    const now = state.lastSeenAt;
    const result = resolveOfflineProgress(state, now, new Rng(1));
    expect(result.wallClockSeconds).toBe(0);
    expect(result.simulatedActiveSeconds).toBe(0);
    expect(result.kills).toBe(0);
  });

  it("caps very long absences at the offline cap", () => {
    const state = createDefaultState();
    const oneWeekMs = 7 * 24 * 3600 * 1000;
    const result = resolveOfflineProgress(state, state.lastSeenAt + oneWeekMs, new Rng(2));
    expect(result.wallClockSeconds).toBeCloseTo(oneWeekMs / 1000, 0);
    expect(result.cappedWallClockSeconds).toBe(BALANCE.offlineCapSeconds);
    expect(result.simulatedActiveSeconds).toBeCloseTo(
      BALANCE.offlineCapSeconds * BALANCE.offlineEfficiency,
      5,
    );
  });

  it("grants progress for a short realistic absence and advances lastSeenAt", () => {
    const state = createDefaultState();
    const tenMinutesMs = 10 * 60 * 1000;
    const now = state.lastSeenAt + tenMinutesMs;
    const result = resolveOfflineProgress(state, now, new Rng(3));
    expect(result.kills).toBeGreaterThan(0);
    expect(result.state.gold).toBeGreaterThan(0);
    expect(result.state.lastSeenAt).toBe(now);
  });
});
