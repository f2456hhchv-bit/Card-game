import type { FactionWar } from '../types.js';

export const WAR_DURATION_MINUTES = 60;
export const WAR_BASE_PAYOUT = 1000;

/** Lazily resolves a war once its countdown has ended, deciding a winner by total contribution. */
export function resolveFactionWar(war: FactionWar, now: number): FactionWar {
  if (war.resolved || now < war.endsAt) return war;
  const a = war.contributions[war.factionAId] ?? 0;
  const b = war.contributions[war.factionBId] ?? 0;
  const winnerFactionId = a >= b ? war.factionAId : war.factionBId;
  return { ...war, resolved: true, winnerFactionId };
}

export function warPayout(war: FactionWar): number {
  const total = Object.values(war.contributions).reduce((sum, v) => sum + v, 0);
  return WAR_BASE_PAYOUT + Math.round(total * 2);
}
