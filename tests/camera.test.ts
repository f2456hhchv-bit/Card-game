import { describe, expect, it } from "vitest";
import { Camera } from "../src/engine/camera/Camera";
import { DEFAULT_CAMERA_TUNING } from "../src/engine/camera/cameraTuning";

const STEP = 1000 / 60;

function makeCamera(): Camera {
  const camera = new Camera(DEFAULT_CAMERA_TUNING, 32, 18);
  camera.setMode("Gameplay");
  return camera;
}

describe("Camera — follow system (AF-018 §3)", () => {
  it("converges smoothly onto a stationary target", () => {
    const camera = makeCamera();
    camera.snapTo(0, 0);
    for (let i = 0; i < 300; i += 1) camera.update(STEP, 10, 5);
    expect(camera.snapshot.x).toBeCloseTo(10, 1);
    expect(camera.snapshot.y).toBeCloseTo(5, 1);
  });

  it("never lets the player outrun the camera (lag clamp)", () => {
    const camera = makeCamera();
    camera.snapTo(0, 0);
    // Target teleports far away every frame — worst case sprint.
    let targetX = 0;
    for (let i = 0; i < 60; i += 1) {
      targetX += 5;
      camera.update(STEP, targetX, 0);
      const distance = Math.abs(camera.snapshot.x - targetX);
      expect(distance).toBeLessThanOrEqual(DEFAULT_CAMERA_TUNING.maxLagDistance + 1e-9);
    }
  });

  it("looks ahead in the direction of travel", () => {
    const camera = makeCamera();
    camera.snapTo(0, 0);
    for (let i = 0; i < 300; i += 1) camera.update(STEP, 0, 0, 10, 0); // moving right
    expect(camera.snapshot.x).toBeGreaterThan(0.5); // settled ahead of the player
    expect(camera.snapshot.x).toBeLessThanOrEqual(DEFAULT_CAMERA_TUNING.maxLagDistance);
  });

  it("does not follow in non-follow modes", () => {
    const camera = makeCamera();
    camera.setMode("Menu");
    camera.snapTo(0, 0);
    for (let i = 0; i < 60; i += 1) camera.update(STEP, 100, 100);
    expect(camera.snapshot.x).toBe(0);
    expect(camera.snapshot.y).toBe(0);
  });
});

describe("Camera — zoom system (AF-018 §4)", () => {
  it("boss intro zooms out and returns smoothly to the locked gameplay zoom", () => {
    const camera = makeCamera();
    for (let i = 0; i < 120; i += 1) camera.update(STEP, 0, 0);
    expect(camera.snapshot.zoom).toBeCloseTo(1, 2);

    camera.setMode("BossIntro");
    for (let i = 0; i < 300; i += 1) camera.update(STEP, 0, 0);
    expect(camera.snapshot.zoom).toBeCloseTo(DEFAULT_CAMERA_TUNING.modes.BossIntro.zoom, 2);

    camera.setMode("BossCombat"); // boss combat always uses standard camera
    for (let i = 0; i < 300; i += 1) camera.update(STEP, 0, 0);
    expect(camera.snapshot.zoom).toBeCloseTo(1, 2);
  });

  it("zoom moves smoothly, never snapping", () => {
    const camera = makeCamera();
    for (let i = 0; i < 120; i += 1) camera.update(STEP, 0, 0);
    camera.setMode("BossIntro");
    camera.update(STEP, 0, 0);
    // After one frame the zoom has moved only fractionally toward the target.
    expect(camera.snapshot.zoom).toBeGreaterThan(0.95);
    expect(camera.snapshot.zoom).toBeLessThan(1);
  });
});

describe("Camera — shake (AF-018 §5)", () => {
  it("decays to zero", () => {
    const camera = makeCamera();
    camera.shake("BossSlam");
    expect(camera.snapshot.shakeAmplitude).toBeGreaterThan(0);
    for (let i = 0; i < 600; i += 1) camera.update(STEP, 0, 0);
    expect(camera.snapshot.shakeAmplitude).toBe(0);
    expect(camera.snapshot.shakeOffsetX).toBe(0);
  });

  it("clarity cap: stacked impulses never exceed the tuned maximum", () => {
    const camera = makeCamera();
    for (let i = 0; i < 50; i += 1) camera.shake("BossSlam");
    expect(camera.snapshot.shakeAmplitude).toBeLessThanOrEqual(
      DEFAULT_CAMERA_TUNING.maxShakeAmplitude,
    );
  });

  it("accessibility scale zero disables shake entirely", () => {
    const camera = makeCamera();
    camera.shakeScale = 0;
    camera.shake("BossSlam");
    camera.shake("LargeExplosion");
    expect(camera.snapshot.shakeAmplitude).toBe(0);
  });
});

describe("Camera — boundaries (AF-018 §6)", () => {
  it("never exposes space outside world bounds", () => {
    const camera = makeCamera();
    camera.setBounds({ minX: 0, minY: 0, maxX: 100, maxY: 100 });
    camera.snapTo(0, 0); // snap requests the corner; clamp pulls the view inside
    const halfWidth = 32 / camera.snapshot.zoom / 2;
    expect(camera.snapshot.x).toBeGreaterThanOrEqual(halfWidth - 1e-9);

    for (let i = 0; i < 600; i += 1) camera.update(STEP, 200, 200); // chase beyond the far corner
    const snap = camera.snapshot;
    expect(snap.x + 32 / snap.zoom / 2).toBeLessThanOrEqual(100 + 1e-9);
    expect(snap.y + 18 / snap.zoom / 2).toBeLessThanOrEqual(100 + 1e-9);
  });

  it("centres on an axis smaller than the viewport", () => {
    const camera = makeCamera();
    camera.setBounds({ minX: 0, minY: 0, maxX: 10, maxY: 100 }); // narrower than the view
    camera.update(STEP, 500, 50);
    expect(camera.snapshot.x).toBe(5);
  });
});

describe("Camera — determinism", () => {
  it("identical input sequences produce identical camera state", () => {
    const play = (): string => {
      const camera = makeCamera();
      camera.snapTo(0, 0);
      camera.shake("ShieldBreak");
      for (let i = 0; i < 200; i += 1) camera.update(STEP, i * 0.1, Math.sin(i * 0.05), 6, 0);
      const s = camera.snapshot;
      return `${s.x},${s.y},${s.zoom},${s.shakeAmplitude},${s.shakeOffsetX}`;
    };
    expect(play()).toBe(play());
  });
});
