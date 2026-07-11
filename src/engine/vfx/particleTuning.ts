/**
 * Particle burst tuning surface — GP-001 §Game Feel. Data edit, never a code
 * edit (AF-011 §7), mirroring cameraTuning.ts/hitStopTuning.ts's own
 * discipline exactly. `PARTICLE_QUALITY_SCALE` is the first real consumer of
 * AF-044's own `performance.particleQuality` field — registered with no
 * producer until now.
 */
export type ParticleBurstKind = "hitImpact" | "eliteDeath" | "bossPhaseChange" | "explosion" | "levelUp";

export interface ParticleBurstDef {
  count: number;
  minSpeed: number;
  maxSpeed: number;
  minSize: number;
  maxSize: number;
  minTtlMs: number;
  maxTtlMs: number;
  colour: string;
}

export const PARTICLE_BURSTS: Readonly<Record<ParticleBurstKind, ParticleBurstDef>> = {
  hitImpact: { count: 6, minSpeed: 1, maxSpeed: 3, minSize: 0.08, maxSize: 0.18, minTtlMs: 150, maxTtlMs: 300, colour: "#f4f7ff" },
  eliteDeath: { count: 18, minSpeed: 2, maxSpeed: 6, minSize: 0.12, maxSize: 0.28, minTtlMs: 300, maxTtlMs: 600, colour: "#ff8c1a" },
  bossPhaseChange: { count: 30, minSpeed: 3, maxSpeed: 8, minSize: 0.15, maxSize: 0.32, minTtlMs: 400, maxTtlMs: 800, colour: "#ffc652" },
  explosion: { count: 22, minSpeed: 2.5, maxSpeed: 7, minSize: 0.14, maxSize: 0.3, minTtlMs: 350, maxTtlMs: 650, colour: "#ff4d4d" },
  levelUp: { count: 24, minSpeed: 1.5, maxSpeed: 4, minSize: 0.1, maxSize: 0.22, minTtlMs: 400, maxTtlMs: 900, colour: "#3fd4f5" },
};

export type ParticleQualityTier = "low" | "medium" | "high";

/** settings.performance.particleQuality → particle-count multiplier. */
export const PARTICLE_QUALITY_SCALE: Readonly<Record<ParticleQualityTier, number>> = {
  low: 0.15,
  medium: 0.5,
  high: 1,
};
