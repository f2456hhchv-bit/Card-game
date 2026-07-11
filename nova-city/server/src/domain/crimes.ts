import type { Crime, Stat } from '../types.js';

export function crimeSuccessChance(stats: Record<Stat, number>, morale: number, crime: Crime): number {
  const relevantTotal = crime.primaryStats.reduce((sum, stat) => sum + stats[stat], 0);
  const statFactor = relevantTotal / (relevantTotal + 100 * crime.primaryStats.length);
  const moraleFactor = (morale - 50) / 500;
  const base = 0.85 - crime.difficulty;
  const chance = base * 0.5 + statFactor * 0.5 + moraleFactor;
  return Math.min(0.95, Math.max(0.05, chance));
}

export interface CrimeResult {
  success: boolean;
  chance: number;
  reward: number;
  xp: number;
  jailMinutes: number;
}

export function resolveCrime(
  stats: Record<Stat, number>,
  morale: number,
  crime: Crime,
  rng: () => number,
): CrimeResult {
  const chance = crimeSuccessChance(stats, morale, crime);
  const success = rng() < chance;
  if (success) {
    const reward = Math.round(crime.minReward + rng() * (crime.maxReward - crime.minReward));
    return { success: true, chance, reward, xp: crime.xp, jailMinutes: 0 };
  }
  return { success: false, chance, reward: 0, xp: Math.round(crime.xp * 0.2), jailMinutes: crime.jailMinutes };
}
