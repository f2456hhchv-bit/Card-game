import type { World } from "../World";
import { BOSS_DEFS } from "../data/bossDefs";
import { ELITE_DEFS } from "../data/eliteDefs";

const WAVE_DURATION = 24;

export interface SpawnState {
  wave: number;
  waveTimer: number;
  elapsed: number;
  cycleIndex: number;
  gruntTrickleTimer: number;
  gruntBudgetRemaining: number;
}

/**
 * Endless wave progression: every wave escalates enemy stats; elites join in
 * every other wave; a buffed elite headlines every 5th wave as a mini-boss;
 * a full boss (cycling through the 6 biomes) gates every 10th wave until
 * defeated.
 */
export function updateSpawnDirector(dt: number, world: World): void {
  const s = world.spawn;
  s.elapsed += dt;

  if (world.bossActive === null && world.miniBossActive === null) {
    s.waveTimer -= dt;
    if (s.waveTimer <= 0) {
      s.wave += 1;
      s.waveTimer = WAVE_DURATION;
      startWave(world, s.wave);
    }
  }

  if (world.bossActive === null && s.gruntBudgetRemaining > 0) {
    s.gruntTrickleTimer -= dt;
    if (s.gruntTrickleTimer <= 0) {
      const burst = Math.min(2, s.gruntBudgetRemaining);
      world.spawnGruntWave(burst, hpMultForWave(s.wave), dmgMultForWave(s.wave), speedMultForWave(s.wave));
      s.gruntBudgetRemaining -= burst;
      s.gruntTrickleTimer = trickleIntervalForWave(s.wave);
    }
  }
}

function startWave(world: World, wave: number): void {
  const s = world.spawn;
  const isBossWave = wave % 10 === 0;
  const isMiniBossWave = !isBossWave && wave % 5 === 0;
  // Elites join in every other wave, but not before wave 4 — waves 1-3 are a
  // grunts-only on-ramp so the player has at least one upgrade before the
  // added pressure of an elite.
  const isEliteWave = !isBossWave && !isMiniBossWave && wave >= 4 && wave % 2 === 0;

  const label = isBossWave
    ? "Boss Incoming"
    : isMiniBossWave
      ? "Mini-Boss Incoming"
      : isEliteWave
        ? "Elite Wave"
        : `Wave ${wave}`;
  world.events.emit("waveStart", { wave, label });

  if (isBossWave) {
    const cycle = Math.floor((wave - 1) / 10);
    const bossDef = BOSS_DEFS[cycle % BOSS_DEFS.length];
    const hpMult = 1 + cycle * 0.6;
    const dmgMult = 1 + cycle * 0.35;
    world.spawnBoss(bossDef, hpMult, dmgMult);
    s.gruntBudgetRemaining = 0;
    s.cycleIndex = cycle;
    return;
  }

  s.gruntBudgetRemaining = Math.round(5 + wave * 1.3);
  s.gruntTrickleTimer = 0.4;

  if (isMiniBossWave) {
    const eliteDef = world.rng.pick(ELITE_DEFS);
    const miniCycle = Math.floor(wave / 5);
    world.spawnEliteAt(eliteDef, 2.2 + miniCycle * 0.4, 1.3 + miniCycle * 0.15, true);
  } else if (isEliteWave) {
    const eliteCount = 1 + Math.floor(wave / 12);
    for (let i = 0; i < eliteCount; i++) {
      const eliteDef = world.rng.pick(ELITE_DEFS);
      world.spawnEliteAt(eliteDef, 1 + wave * 0.05, 1 + wave * 0.03, false);
    }
  }
}

function hpMultForWave(wave: number): number {
  return 1 + wave * 0.11;
}
function dmgMultForWave(wave: number): number {
  return 1 + wave * 0.05;
}
function speedMultForWave(wave: number): number {
  return Math.min(1.6, 1 + wave * 0.015);
}
function trickleIntervalForWave(wave: number): number {
  return Math.max(0.4, 1.15 - wave * 0.018);
}
