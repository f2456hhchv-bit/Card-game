/**
 * Particle system — GP-001 §Game Feel. No particle system existed anywhere
 * in the current (post-restart) codebase before this. The pure spawn/step
 * math lives here, fully testable without a DOM or a Pool; the composition
 * root owns the actual `Pool<Particle>` instance and live array, mirroring
 * exactly how popups/projectiles are already pooled and driven in `main.ts`
 * (AF-001 §10: pooling is mandatory for anything spawned repeatedly).
 */
import type { Rng } from "../../core/rng/Rng";
import { PARTICLE_BURSTS, PARTICLE_QUALITY_SCALE, type ParticleBurstKind, type ParticleQualityTier } from "./particleTuning";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttlMs: number;
  maxTtlMs: number;
  size: number;
  colour: string;
  live: boolean;
}

export function createParticle(): Particle {
  return { x: 0, y: 0, vx: 0, vy: 0, ttlMs: 0, maxTtlMs: 0, size: 0, colour: "#f4f7ff", live: false };
}

export function resetParticle(p: Particle): void {
  p.live = false;
}

/** How many particles a burst kind produces at a given quality tier — never zero, so a burst is always visible. */
export function burstCount(kind: ParticleBurstKind, qualityTier: ParticleQualityTier): number {
  return Math.max(1, Math.round(PARTICLE_BURSTS[kind].count * PARTICLE_QUALITY_SCALE[qualityTier]));
}

/** Initialises one pooled particle in place for a burst at (x, y) — deterministic given `rng`. */
export function initParticleForBurst(p: Particle, kind: ParticleBurstKind, x: number, y: number, rng: Rng): void {
  const def = PARTICLE_BURSTS[kind];
  const angle = rng.float(0, Math.PI * 2);
  const speed = rng.float(def.minSpeed, def.maxSpeed);
  p.x = x;
  p.y = y;
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.size = rng.float(def.minSize, def.maxSize);
  p.maxTtlMs = rng.float(def.minTtlMs, def.maxTtlMs);
  p.ttlMs = p.maxTtlMs;
  p.colour = def.colour;
  p.live = true;
}

/** Advances one particle (drag-damped outward drift); returns false once it should be released back to the pool. */
export function stepParticle(p: Particle, dtMs: number): boolean {
  const dt = dtMs / 1000;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.vx *= 0.92;
  p.vy *= 0.92;
  p.ttlMs -= dtMs;
  return p.ttlMs > 0;
}

/** 0–1 alpha fade over the particle's own lifetime — for the composition root's render pass. */
export function particleAlpha(p: Particle): number {
  return p.maxTtlMs <= 0 ? 0 : Math.max(0, Math.min(1, p.ttlMs / p.maxTtlMs));
}
