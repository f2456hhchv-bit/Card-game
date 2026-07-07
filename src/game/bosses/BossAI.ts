/**
 * Boss states (AF-035 §Boss Structure) — the exact AF-016 StateMachine
 * class the top-level game flow and AF-033's enemy AI already run on.
 * Phase count/index is tracked separately by BossRuntime; "engaging" and
 * "transitioning" are reused across however many phases a Boss has.
 */
import { StateMachine, type StateMachineOptions } from "../../core/state/StateMachine";

export const BOSS_STATES = [
  "introduction",
  "engaging",
  "transitioning",
  "enrage",
  "deathSequence",
  "rewardCeremony",
] as const;
export type BossState = (typeof BOSS_STATES)[number];

export const BOSS_TRANSITIONS: Readonly<Record<BossState, readonly BossState[]>> = {
  introduction: ["engaging", "deathSequence"],
  engaging: ["transitioning", "enrage", "deathSequence"],
  transitioning: ["engaging", "deathSequence"],
  enrage: ["engaging", "transitioning", "deathSequence"],
  deathSequence: ["rewardCeremony"],
  rewardCeremony: [],
};

export function createBossStateMachine(
  initial: BossState = "introduction",
  options: Partial<StateMachineOptions<BossState>> = {},
): StateMachine<BossState> {
  return new StateMachine<BossState>({
    initial,
    transitions: BOSS_TRANSITIONS,
    ...options,
  });
}
