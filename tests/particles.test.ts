import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  burstCount,
  createParticle,
  initParticleForBurst,
  particleAlpha,
  resetParticle,
  stepParticle,
} from "../src/engine/vfx/Particles";
import { PARTICLE_BURSTS } from "../src/engine/vfx/particleTuning";

describe("GP-001 §Game Feel — Particle system", () => {
  it("burstCount scales down with quality tier but never reaches zero", () => {
    const high = burstCount("eliteDeath", "high");
    const medium = burstCount("eliteDeath", "medium");
    const low = burstCount("eliteDeath", "low");
    expect(high).toBe(PARTICLE_BURSTS.eliteDeath.count);
    expect(medium).toBeLessThan(high);
    expect(low).toBeLessThan(medium);
    expect(low).toBeGreaterThanOrEqual(1);
  });

  it("createParticle starts dead; resetParticle marks a live one dead again", () => {
    const p = createParticle();
    expect(p.live).toBe(false);
    initParticleForBurst(p, "hitImpact", 1, 2, new Rng(1));
    expect(p.live).toBe(true);
    resetParticle(p);
    expect(p.live).toBe(false);
  });

  it("initParticleForBurst places the particle at the burst origin with a real, bounded velocity/size/ttl", () => {
    const p = createParticle();
    initParticleForBurst(p, "explosion", 5, -3, new Rng(42));
    const def = PARTICLE_BURSTS.explosion;
    expect(p.x).toBe(5);
    expect(p.y).toBe(-3);
    const speed = Math.hypot(p.vx, p.vy);
    expect(speed).toBeGreaterThanOrEqual(def.minSpeed - 1e-9);
    expect(speed).toBeLessThanOrEqual(def.maxSpeed + 1e-9);
    expect(p.size).toBeGreaterThanOrEqual(def.minSize);
    expect(p.size).toBeLessThanOrEqual(def.maxSize);
    expect(p.maxTtlMs).toBeGreaterThanOrEqual(def.minTtlMs);
    expect(p.maxTtlMs).toBeLessThanOrEqual(def.maxTtlMs);
    expect(p.colour).toBe(def.colour);
  });

  it("is deterministic given the same seed", () => {
    const a = createParticle();
    const b = createParticle();
    initParticleForBurst(a, "levelUp", 0, 0, new Rng(7));
    initParticleForBurst(b, "levelUp", 0, 0, new Rng(7));
    expect(a).toEqual(b);
  });

  it("stepParticle counts down ttl and reports death exactly once ttl is exhausted", () => {
    const p = createParticle();
    initParticleForBurst(p, "hitImpact", 0, 0, new Rng(3));
    let alive = true;
    let steps = 0;
    while (alive && steps < 10_000) {
      alive = stepParticle(p, 16);
      steps += 1;
    }
    expect(alive).toBe(false);
    expect(p.ttlMs).toBeLessThanOrEqual(0);
  });

  it("stepParticle applies drag, decaying speed over time", () => {
    const p = createParticle();
    initParticleForBurst(p, "explosion", 0, 0, new Rng(9));
    const initialSpeed = Math.hypot(p.vx, p.vy);
    stepParticle(p, 16);
    const laterSpeed = Math.hypot(p.vx, p.vy);
    expect(laterSpeed).toBeLessThan(initialSpeed);
  });

  it("particleAlpha fades from 1 toward 0 over the particle's lifetime", () => {
    const p = createParticle();
    initParticleForBurst(p, "bossPhaseChange", 0, 0, new Rng(4));
    expect(particleAlpha(p)).toBeCloseTo(1);
    stepParticle(p, p.maxTtlMs / 2);
    expect(particleAlpha(p)).toBeCloseTo(0.5, 1);
    stepParticle(p, p.maxTtlMs);
    expect(particleAlpha(p)).toBe(0);
  });
});
