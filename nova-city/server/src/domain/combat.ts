import type { Stat } from '../types.js';

export function combatRating(stats: Record<Stat, number>): number {
  return stats.strength * 1.1 + stats.dexterity * 1.2 + stats.speed * 0.8 + stats.defense * 0.9;
}

export interface CombatOutcome {
  winner: 'attacker' | 'defender';
  log: string[];
  attackerRoll: number;
  defenderRoll: number;
}

export function resolveCombat(
  attackerStats: Record<Stat, number>,
  defenderStats: Record<Stat, number>,
  rng: () => number,
): CombatOutcome {
  const attackerRoll = combatRating(attackerStats) * (0.85 + rng() * 0.3);
  const defenderRoll = combatRating(defenderStats) * (0.85 + rng() * 0.3);
  const winner: CombatOutcome['winner'] = attackerRoll >= defenderRoll ? 'attacker' : 'defender';
  const log = [
    `Attacker combat rating rolls to ${attackerRoll.toFixed(1)}.`,
    `Defender combat rating rolls to ${defenderRoll.toFixed(1)}.`,
    winner === 'attacker' ? 'The attacker breaches the defense.' : 'The defender holds the line.',
  ];
  return { winner, log, attackerRoll, defenderRoll };
}

export function hospitalMinutesFor(outcome: CombatOutcome): number {
  const gap = Math.abs(outcome.attackerRoll - outcome.defenderRoll);
  return Math.min(30, 5 + Math.round(gap / 10));
}

export function salvageCredits(loserCredits: number): number {
  return Math.min(500, Math.round(loserCredits * 0.05));
}
