import type { Sector } from '../types.js';

/** Lazily grows a sector's Hollow presence toward its cap, same settle-on-read shape as domain/regen.ts. */
export function settleAlienStrength(sector: Sector, now: number): number {
  const elapsedHours = Math.max(0, (now - sector.lastTickAt) / 3_600_000);
  return Math.min(sector.maxAlienStrength, sector.alienStrength + elapsedHours * sector.alienGrowthPerHour);
}

export interface SectorAttackOutcome {
  attackPower: number;
  damageDealt: number;
  remainingStrength: number;
  cleared: boolean;
  outmatched: boolean;
  characterDamage: number;
}

const OUTMATCHED_RATIO = 0.5;
const CHARACTER_DAMAGE_ON_OUTMATCHED = 15;

/**
 * One attack run: fleetPower (plus a small personal-command assist) chips away
 * at the sector's alien strength. Badly outmatched attacks cost the
 * commander Health rather than damaging a ship — full ship damage/repair is a
 * later addition.
 */
export function resolveSectorAttack(
  fleetPower: number,
  characterAssist: number,
  alienStrength: number,
  rng: () => number,
): SectorAttackOutcome {
  const attackPower = (fleetPower + characterAssist * 0.2) * (0.85 + rng() * 0.3);
  const outmatched = attackPower < alienStrength * OUTMATCHED_RATIO;
  const damageDealt = Math.min(alienStrength, Math.round(attackPower * 0.5));
  const remainingStrength = Math.max(0, alienStrength - damageDealt);
  return {
    attackPower,
    damageDealt,
    remainingStrength,
    cleared: remainingStrength <= 0,
    outmatched,
    characterDamage: outmatched ? CHARACTER_DAMAGE_ON_OUTMATCHED : 0,
  };
}
