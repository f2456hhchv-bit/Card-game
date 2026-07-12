import { describe, expect, it } from "vitest";
import {
  blendModeFor,
  bossVisualScale,
  COLOUR_LAW_SUBSTITUTIONS,
  deriveEnemyAttackOverlay,
  deriveEnemyDeathFrame,
  deriveEnemyMoveLean,
  deriveThumbnailTransform,
} from "../src/game/assets/assetPipeline";

/**
 * DIRECTIVE — Asset Pipeline & Derivation Rules (binding, 2026-07-12).
 * Kept pure (no CanvasRenderingContext2D) to match this codebase's own
 * Particles.ts split — simulation/derivation logic is unit-tested here,
 * the raw ctx calls stay in main.ts and are verified live.
 */
describe("DIRECTIVE §1 — pipeline blend-mode selection", () => {
  it("additive resolves to lighter; keyed and fullbleed resolve to source-over", () => {
    expect(blendModeFor("additive")).toBe("lighter");
    expect(blendModeFor("keyed")).toBe("source-over");
    expect(blendModeFor("fullbleed")).toBe("source-over");
  });
});

describe("DIRECTIVE §2 — ship thumbnail derivation (downscale of in-run sprite)", () => {
  it("scales to fit the target size on the longer axis, preserving aspect ratio", () => {
    const t = deriveThumbnailTransform(200, 100, 50);
    expect(t.scale).toBeCloseTo(0.25);
    expect(t.width).toBeCloseTo(50);
    expect(t.height).toBeCloseTo(25);
  });

  it("a square source scales uniformly", () => {
    const t = deriveThumbnailTransform(80, 80, 32);
    expect(t.width).toBeCloseTo(32);
    expect(t.height).toBeCloseTo(32);
  });
});

describe("DIRECTIVE §2 — enemy move/attack/death derived from idle, never a separate sprite", () => {
  it("move lean oscillates around the facing angle, bounded by the amplitude", () => {
    const facing = Math.PI / 4;
    const samples = Array.from({ length: 20 }, (_, i) => deriveEnemyMoveLean(facing, i * 20).rotationRadians);
    for (const r of samples) expect(Math.abs(r - facing)).toBeLessThanOrEqual(0.12 + 1e-9);
    // it actually oscillates, not a constant lean
    expect(new Set(samples.map((r) => r.toFixed(4))).size).toBeGreaterThan(1);
  });

  it("attack overlay recoils then snaps back, and the flash fires only at the very start", () => {
    const early = deriveEnemyAttackOverlay(0, 400);
    const mid = deriveEnemyAttackOverlay(200, 400);
    const late = deriveEnemyAttackOverlay(400, 400);
    expect(early.flashAlpha).toBe(1);
    expect(late.flashAlpha).toBe(0);
    expect(mid.recoilOffset).toBeLessThan(0); // pulled back mid-telegraph
    expect(late.recoilOffset).toBeCloseTo(0, 1); // snapped back by the end
  });

  it("attack overlay is well-defined even for an instant (zero-telegraph) attack", () => {
    expect(() => deriveEnemyAttackOverlay(0, 0)).not.toThrow();
  });

  it("death frame fragments drift outward and fade to zero alpha as it completes", () => {
    const start = deriveEnemyDeathFrame(0, 500);
    const end = deriveEnemyDeathFrame(500, 500);
    expect(start.alpha).toBeCloseTo(1);
    expect(end.alpha).toBeCloseTo(0);
    const startSpread = Math.hypot(start.fragments[0]!.dx, start.fragments[0]!.dy);
    const endSpread = Math.hypot(end.fragments[0]!.dx, end.fragments[0]!.dy);
    expect(endSpread).toBeGreaterThan(startSpread);
  });

  it("death frame is deterministic for the same inputs (same seed reproduces the same layout)", () => {
    const a = deriveEnemyDeathFrame(250, 500, 5, 7);
    const b = deriveEnemyDeathFrame(250, 500, 5, 7);
    expect(a).toEqual(b);
  });
});

describe("DIRECTIVE §2 — boss variants are the base model at a different scale", () => {
  it("World Boss (1.75x hull) and Mini Boss (0.35x hull) resolve to a believable linear scale, not a literal hull ratio", () => {
    const worldScale = bossVisualScale(1.75);
    const miniScale = bossVisualScale(0.35);
    expect(worldScale).toBeGreaterThan(1);
    expect(miniScale).toBeLessThan(1);
    expect(miniScale).toBeGreaterThan(0.35); // cube-root, never the literal (absurdly tiny) hull ratio
    expect(bossVisualScale(1)).toBeCloseTo(1);
  });
});

describe("DIRECTIVE §4 — colour law substitutions", () => {
  it("names every substitution the directive requires", () => {
    expect(COLOUR_LAW_SUBSTITUTIONS.regeneration).toBe("gold");
    expect(COLOUR_LAW_SUBSTITUTIONS.poison).toBe("amber");
    expect(COLOUR_LAW_SUBSTITUTIONS.toxic).toBe("amber");
    expect(COLOUR_LAW_SUBSTITUTIONS.biomass).toBe("amber-yellow");
  });
});
