/**
 * Enemy AI states (AF-033 §1) — the exact AF-016 StateMachine class the
 * top-level game flow already runs on. This module supplies only the
 * transition table; illegal transitions are refused by the existing class,
 * not reimplemented here.
 */
import { StateMachine, type StateMachineOptions } from "../../core/state/StateMachine";

export const AI_STATES = [
  "idle",
  "patrol",
  "search",
  "targetAcquired",
  "attack",
  "retreat",
  "reposition",
  "specialAbility",
  "recover",
  "death",
] as const;
export type AiState = (typeof AI_STATES)[number];

/**
 * Encodes the spec's documented flow (Idle → Patrol → Search →
 * TargetAcquired → Attack → Retreat → Reposition → SpecialAbility →
 * Recover → Death) as the primary edges, plus the minimal back-edges a
 * working combat loop needs (an enemy that reaches Recover must be able to
 * re-engage, not dead-end). Death is reachable from every live state.
 */
export const ENEMY_AI_TRANSITIONS: Readonly<Record<AiState, readonly AiState[]>> = {
  idle: ["patrol", "death"],
  patrol: ["search", "idle", "death"],
  search: ["targetAcquired", "patrol", "death"],
  targetAcquired: ["attack", "retreat", "search", "death"],
  attack: ["retreat", "reposition", "specialAbility", "targetAcquired", "death"],
  retreat: ["recover", "reposition", "death"],
  reposition: ["attack", "targetAcquired", "death"],
  specialAbility: ["attack", "recover", "death"],
  recover: ["search", "patrol", "targetAcquired", "death"],
  death: [],
};

export function createEnemyStateMachine(
  initial: AiState = "idle",
  options: Partial<StateMachineOptions<AiState>> = {},
): StateMachine<AiState> {
  return new StateMachine<AiState>({
    initial,
    transitions: ENEMY_AI_TRANSITIONS,
    ...options,
  });
}
