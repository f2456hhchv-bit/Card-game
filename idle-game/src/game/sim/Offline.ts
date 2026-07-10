import type { Rng } from "../../core/math/Rng";
import type { GameState } from "../state/GameState";
import { simulateTick, type TickResult } from "./Combat";
import { BALANCE } from "./Economy";

export interface OfflineResult extends TickResult {
  /** Real-world seconds since the save was last active, uncapped. */
  wallClockSeconds: number;
  /** `wallClockSeconds` clamped to the offline cap. */
  cappedWallClockSeconds: number;
  /** Simulated in-combat seconds actually fast-forwarded (capped time × efficiency). */
  simulatedActiveSeconds: number;
}

/**
 * Fast-forward `state` from `state.lastSeenAt` to `nowMs`, capped and
 * discounted by the offline-efficiency factor — the standard idle-genre
 * trade that rewards being away without making active play pointless.
 */
export function resolveOfflineProgress(state: GameState, nowMs: number, rng: Rng): OfflineResult {
  const wallClockSeconds = Math.max(0, (nowMs - state.lastSeenAt) / 1000);
  const cappedWallClockSeconds = Math.min(wallClockSeconds, BALANCE.offlineCapSeconds);
  const simulatedActiveSeconds = cappedWallClockSeconds * BALANCE.offlineEfficiency;
  const tick = simulateTick(state, simulatedActiveSeconds, rng);
  tick.state.lastSeenAt = nowMs;
  return { ...tick, wallClockSeconds, cappedWallClockSeconds, simulatedActiveSeconds };
}
