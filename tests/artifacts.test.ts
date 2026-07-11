import { describe, expect, it } from "vitest";
import { ARTIFACT_EFFECT_KINDS, ArtifactRuntime, SANDBOX_ARTIFACTS } from "../src/game/artifacts/artifactData";

/**
 * GP-004 §Content Engine — the audit found no generic ArtifactDef array as
 * its own top-level content category (only bossArtifacts.ts's five
 * hand-authored, boss-kill-gated entries, and lore/ancient loot categories).
 * These tests guard the new standalone registry and its ArtifactRuntime.
 */
describe("GP-004 §Content Engine — standalone Artifact registry", () => {
  it("every sandbox entry uses a registered effect kind", () => {
    for (const artifact of SANDBOX_ARTIFACTS) {
      expect(ARTIFACT_EFFECT_KINDS).toContain(artifact.effect.kind);
    }
  });

  it("every entry carries a positive price and effect magnitude — never a placeholder", () => {
    for (const artifact of SANDBOX_ARTIFACTS) {
      expect(artifact.price).toBeGreaterThan(0);
      expect(artifact.effect.value).toBeGreaterThan(0);
    }
  });

  it("every id is unique", () => {
    const ids = SANDBOX_ARTIFACTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no two sandbox Artifacts share the same effect kind — each is mechanically distinct", () => {
    const kinds = SANDBOX_ARTIFACTS.map((a) => a.effect.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });
});

describe("ArtifactRuntime — held state (mirrors BossArtifactRuntime's own no-duplicate law)", () => {
  it("choosing an unknown id fails", () => {
    const runtime = new ArtifactRuntime();
    expect(runtime.choose("not-a-real-artifact")).toBe(false);
  });

  it("choosing a real id succeeds once, then refuses a duplicate", () => {
    const runtime = new ArtifactRuntime();
    const id = SANDBOX_ARTIFACTS[0]!.id;
    expect(runtime.choose(id)).toBe(true);
    expect(runtime.has(id)).toBe(true);
    expect(runtime.choose(id)).toBe(false);
  });

  it("heldIds reflects every distinct Artifact chosen", () => {
    const runtime = new ArtifactRuntime();
    for (const artifact of SANDBOX_ARTIFACTS) runtime.choose(artifact.id);
    expect(runtime.heldIds).toHaveLength(SANDBOX_ARTIFACTS.length);
  });
});
