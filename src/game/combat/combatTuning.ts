/**
 * Combat tuning surface (AF-021 §11). Balance is a data edit (AF-011 §7).
 * Status colours/icons bind per AF-008 §5 / AF-007 §5.
 */
export type DamageSourceKind =
  | "direct"
  | "area"
  | "overTime"
  | "beam"
  | "orbital"
  | "drone"
  | "environmental"
  | "boss"
  | "self"; // future (AF-021 damage model)

export type DamageSchool = "physical" | "energy";

export type StatusKind =
  | "burn"
  | "shock"
  | "freeze"
  | "corruption"
  | "poison"
  | "slow"
  | "stasis"
  | "shieldBreak"
  | "armourBreak"
  | "overload";

export type ResistanceKind =
  | "burn"
  | "shock"
  | "freeze"
  | "corruption"
  | "poison"
  | "physical"
  | "energy"
  | "boss";

export type StackingRule = "refresh" | "stackIntensity" | "stackDuration";

export interface StatusRule {
  stacking: StackingRule;
  maxStacks: number;
  /** DoT tick interval; omitted = no damage over time. */
  tickIntervalMs?: number;
  /** Damage per tick per stack, as a fraction of applied strength. */
  tickFractionOfStrength?: number;
  /** Bridge into AF-020: movement effect this status requests. */
  movement?: { kind: "speedMultiplier"; multiplier: number } | { kind: "root" };
  /** Which resistance mitigates this status (reduces duration). */
  resistance?: ResistanceKind;
}

export const STATUS_RULES: Readonly<Record<StatusKind, StatusRule>> = {
  burn: { stacking: "stackIntensity", maxStacks: 3, tickIntervalMs: 500, tickFractionOfStrength: 0.2, resistance: "burn" },
  shock: { stacking: "refresh", maxStacks: 1, resistance: "shock" },
  freeze: { stacking: "refresh", maxStacks: 1, movement: { kind: "root" }, resistance: "freeze" },
  corruption: { stacking: "stackIntensity", maxStacks: 5, tickIntervalMs: 1000, tickFractionOfStrength: 0.1, resistance: "corruption" },
  poison: { stacking: "stackDuration", maxStacks: 1, tickIntervalMs: 750, tickFractionOfStrength: 0.15, resistance: "poison" },
  slow: { stacking: "refresh", maxStacks: 1, movement: { kind: "speedMultiplier", multiplier: 0.6 }, resistance: "freeze" },
  stasis: { stacking: "refresh", maxStacks: 1, movement: { kind: "root" } },
  shieldBreak: { stacking: "refresh", maxStacks: 1 },
  armourBreak: { stacking: "refresh", maxStacks: 1 },
  overload: { stacking: "refresh", maxStacks: 1, resistance: "shock" },
};

export interface CombatTuning {
  /** Hard cap on any resistance — immunity by stacking is impossible (AF-021 §3). */
  resistanceCap: number;
  damageReductionCap: number;
  defaultCritChance: number;
  defaultCritMultiplier: number;
  shieldRegenDelayMs: number;
  shieldRegenPerSecond: number;
  /** armourBreak reduces school resistances by this fraction while active. */
  armourBreakResistancePenalty: number;
}

export const DEFAULT_COMBAT_TUNING: CombatTuning = {
  resistanceCap: 0.75,
  damageReductionCap: 0.6,
  defaultCritChance: 0.05,
  defaultCritMultiplier: 2,
  shieldRegenDelayMs: 3000,
  shieldRegenPerSecond: 12,
  armourBreakResistancePenalty: 0.25,
};
