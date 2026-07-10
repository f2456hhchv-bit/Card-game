/**
 * Stage-based combat & reward curve. Every enemy/reward number in the game
 * comes from this one file so balance can be tuned without touching the sim
 * or render code that consumes it.
 */
export const BALANCE = {
  /** Regular kills required before a stage advances (or a boss spawns). */
  killsPerStage: 8,
  /** Per-stage compounding growth applied to enemy HP/ATK and rewards. */
  stageGrowth: 1.135,
  baseEnemyHp: 20,
  baseEnemyAtk: 3,
  baseGold: 4,
  baseEssence: 2,
  bossHpMult: 7,
  bossAtkMult: 2.2,
  bossRewardMult: 9,
  /** How far offline progress can fast-forward, in seconds. */
  offlineCapSeconds: 8 * 3600,
  /** Offline ticks earn at this fraction of the active rate. */
  offlineEfficiency: 0.65,
  /** Stages retreated on hero death (a soft fail, not a hard reset) — small
   * on purpose: HP regen already stalls a hero at their true frontier, so
   * death just trims the very edge of overreach rather than erasing a run. */
  deathRetreatStages: 1,
} as const;

export const KILLS_PER_STAGE = BALANCE.killsPerStage;

function stageMult(stage: number): number {
  return Math.pow(BALANCE.stageGrowth, Math.max(0, stage - 1));
}

export function enemyHpFor(stage: number, boss: boolean): number {
  return BALANCE.baseEnemyHp * stageMult(stage) * (boss ? BALANCE.bossHpMult : 1);
}

export function enemyAtkFor(stage: number, boss: boolean): number {
  return BALANCE.baseEnemyAtk * stageMult(stage) * (boss ? BALANCE.bossAtkMult : 1);
}

export function goldRewardFor(stage: number, boss: boolean): number {
  return BALANCE.baseGold * stageMult(stage) * (boss ? BALANCE.bossRewardMult : 1);
}

export function essenceRewardFor(stage: number, boss: boolean): number {
  return BALANCE.baseEssence * stageMult(stage) * (boss ? BALANCE.bossRewardMult : 1);
}

/** Physical-mitigation formula: 100 defense halves incoming damage. */
export function damageMitigation(def: number): number {
  return 100 / (100 + Math.max(0, def));
}
