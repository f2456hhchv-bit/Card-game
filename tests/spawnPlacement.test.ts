import { describe, expect, it } from "vitest";
import { cameraViewportRect, isOutsideViewport, pickSpawnOutsideViewport } from "../src/game/director/spawnPlacement";

describe("GP-002 §Spawning — camera-aware placement", () => {
  it("cameraViewportRect pads the half-extent by margin on every side", () => {
    const rect = cameraViewportRect(10, 5, 8, 4, 1);
    expect(rect).toEqual({ minX: 1, maxX: 19, minY: 0, maxY: 10 });
  });

  it("isOutsideViewport is false inside, true outside, in every direction", () => {
    const rect = cameraViewportRect(0, 0, 10, 5, 0);
    expect(isOutsideViewport(0, 0, rect)).toBe(false);
    expect(isOutsideViewport(9, 0, rect)).toBe(false);
    expect(isOutsideViewport(11, 0, rect)).toBe(true);
    expect(isOutsideViewport(0, -6, rect)).toBe(true);
    expect(isOutsideViewport(-11, 0, rect)).toBe(true);
  });

  it("pickSpawnOutsideViewport returns the first candidate that clears the viewport", () => {
    const rect = cameraViewportRect(0, 0, 10, 5, 0);
    const candidates = [
      { x: 0, y: 0, tag: "on-screen" },
      { x: 5, y: 0, tag: "still on-screen" },
      { x: 20, y: 0, tag: "off-screen" },
    ];
    expect(pickSpawnOutsideViewport(candidates, rect).tag).toBe("off-screen");
  });

  it("falls back to the first candidate when none clear the viewport (arena too small)", () => {
    const rect = cameraViewportRect(0, 0, 100, 100, 0);
    const candidates = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    expect(pickSpawnOutsideViewport(candidates, rect)).toEqual(candidates[0]);
  });

  it("never throws on an empty-adjacent single-candidate list", () => {
    const rect = cameraViewportRect(0, 0, 10, 5, 0);
    expect(pickSpawnOutsideViewport([{ x: 0, y: 0 }], rect)).toEqual({ x: 0, y: 0 });
  });
});
