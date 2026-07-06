/**
 * The nine-stage deterministic damage pipeline (AF-021 §1).
 * Bonuses are additive WITHIN a stage and multiplicative ACROSS stages —
 * synergy scales power, stacking one source cannot inflate exponentially.
 * Every resolution returns its per-stage breakdown (debug + tooltip data).
 */
import type { Rng } from "../../core/rng/Rng";
import type {
  CombatTuning,
  DamageSchool,
  DamageSourceKind,
  ResistanceKind,
} from "./combatTuning";

export interface DamagePacket {
  baseDamage: number;
  kind: DamageSourceKind;
  school: DamageSchool;
  critChance: number;
  critMultiplier: number;
}

/**
 * Stage bonuses as summed additive fractions per stage (e.g. two +10%
 * equipment bonuses arrive as 0.2). Stage multiplier = 1 + sum.
 */
export interface OffensiveModifiers {
  weapon: number;
  commander: number;
  ship: number;
  equipment: number;
  research: number;
  affixes: number;
}

export const NEUTRAL_MODIFIERS: OffensiveModifiers = {
  weapon: 0,
  commander: 0,
  ship: 0,
  equipment: 0,
  research: 0,
  affixes: 0,
};

export interface TargetResistances {
  values: Partial<Record<ResistanceKind, number>>;
  /** armourBreak active on the target (reduces school resistance). */
  armourBroken?: boolean;
}

export interface DamageStage {
  stage: string;
  value: number;
}

export interface DamageResult {
  finalDamage: number;
  critical: boolean;
  kind: DamageSourceKind;
  /** Per-stage value trail — the AF-021 debug damage breakdown. */
  breakdown: readonly DamageStage[];
}

export function resolveDamage(
  packet: DamagePacket,
  modifiers: OffensiveModifiers,
  target: TargetResistances,
  tuning: CombatTuning,
  /** Forked seeded stream (e.g. missionRng.fork("crits")) — determinism. */
  rng: Rng,
): DamageResult {
  const breakdown: DamageStage[] = [];
  let value = packet.baseDamage;
  breakdown.push({ stage: "base", value });

  const stages: ReadonlyArray<[keyof OffensiveModifiers, string]> = [
    ["weapon", "weapon"],
    ["commander", "commander"],
    ["ship", "ship"],
    ["equipment", "equipment"],
    ["research", "research"],
    ["affixes", "affixes"],
  ];
  for (const [key, label] of stages) {
    value *= 1 + modifiers[key];
    breakdown.push({ stage: label, value });
  }

  const critical = rng.next() < packet.critChance;
  if (critical) value *= packet.critMultiplier;
  breakdown.push({ stage: "critical", value });

  let resistance = target.values[packet.school] ?? 0;
  if (target.armourBroken) {
    resistance = Math.max(0, resistance - tuning.armourBreakResistancePenalty);
  }
  if (packet.kind === "boss") {
    resistance = Math.max(resistance, target.values.boss ?? 0);
  }
  resistance = Math.min(tuning.resistanceCap, Math.max(0, resistance));
  value *= 1 - resistance;
  breakdown.push({ stage: "resistance", value });

  const finalDamage = Math.max(0, value);
  breakdown.push({ stage: "final", value: finalDamage });

  return { finalDamage, critical, kind: packet.kind, breakdown };
}
