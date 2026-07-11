import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BOSS_ARTIFACTS,
  BossArtifactRuntime,
  atlasCoreFireIntervalScale,
  livingReactorHealPerPulse,
  offerBossArtifacts,
  stellarCompassRarityFloor,
} from "../src/game/bosses/bossArtifacts";

describe("GP-001 — Boss Game-Changing Rewards", () => {
  it("registers exactly the five named artifacts", () => {
    expect(BOSS_ARTIFACTS.map((a) => a.id).sort()).toEqual(
      ["atlasCore", "gravitonHeart", "livingReactor", "stellarCompass", "voidEngine"].sort(),
    );
  });

  it("choose() is idempotent and has() reflects only chosen artifacts", () => {
    const runtime = new BossArtifactRuntime();
    expect(runtime.has("atlasCore")).toBe(false);
    expect(runtime.choose("atlasCore")).toBe(true);
    expect(runtime.choose("atlasCore")).toBe(false);
    expect(runtime.has("atlasCore")).toBe(true);
    expect(runtime.has("voidEngine")).toBe(false);
    expect(runtime.heldIds).toEqual(["atlasCore"]);
  });

  it("choose() rejects unknown ids", () => {
    const runtime = new BossArtifactRuntime();
    expect(runtime.choose("not-a-real-artifact" as never)).toBe(false);
  });

  it("atlasCoreFireIntervalScale is 1 (no change) unless held, then 0.75", () => {
    const runtime = new BossArtifactRuntime();
    expect(atlasCoreFireIntervalScale(runtime)).toBe(1);
    runtime.choose("atlasCore");
    expect(atlasCoreFireIntervalScale(runtime)).toBe(0.75);
  });

  it("stellarCompassRarityFloor leaves the floor untouched unless held", () => {
    const runtime = new BossArtifactRuntime();
    expect(stellarCompassRarityFloor(runtime, null)).toBeNull();
    expect(stellarCompassRarityFloor(runtime, "common")).toBe("common");
  });

  it("stellarCompassRarityFloor raises to epic when held, and never lowers an already-higher floor", () => {
    const runtime = new BossArtifactRuntime();
    runtime.choose("stellarCompass");
    expect(stellarCompassRarityFloor(runtime, null)).toBe("epic");
    expect(stellarCompassRarityFloor(runtime, "common")).toBe("epic");
    expect(stellarCompassRarityFloor(runtime, "legendary")).toBe("legendary");
  });

  it("livingReactorHealPerPulse scales with max hull", () => {
    expect(livingReactorHealPerPulse(1000)).toBeCloseTo(20);
    expect(livingReactorHealPerPulse(0)).toBe(0);
  });

  it("offerBossArtifacts returns distinct artifacts, deterministic per seed, excluding already-held ids", () => {
    const rng = new Rng(11);
    const offer = offerBossArtifacts([], 3, rng);
    expect(offer.length).toBe(3);
    expect(new Set(offer.map((a) => a.id)).size).toBe(3);

    const heldIds = ["atlasCore", "voidEngine"] as const;
    const offer2 = offerBossArtifacts(heldIds, 3, new Rng(11));
    expect(offer2.length).toBe(3);
    for (const artifact of offer2) expect(heldIds).not.toContain(artifact.id);
  });
});
