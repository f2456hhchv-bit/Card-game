import { describe, expect, it } from "vitest";
import { PlayerMovement } from "../src/game/movement/PlayerMovement";
import { DEFAULT_MOVEMENT_PROFILE } from "../src/game/movement/movementTuning";

const STEP = 1000 / 60;

function makeMovement(): PlayerMovement {
  const movement = new PlayerMovement(DEFAULT_MOVEMENT_PROFILE);
  movement.setPosition(0, 0);
  return movement;
}

function run(movement: PlayerMovement, ticks: number, inputX = 0, inputY = 0): void {
  for (let i = 0; i < ticks; i += 1) movement.update(STEP, inputX, inputY);
}

describe("PlayerMovement — arcade contract (AF-020 §1)", () => {
  it("accelerates predictably to max speed and decelerates to zero", () => {
    const movement = makeMovement();
    run(movement, 60, 1, 0);
    expect(movement.snapshot.speed).toBeCloseTo(DEFAULT_MOVEMENT_PROFILE.maxSpeed, 1);
    expect(movement.state).toBe("Moving");

    run(movement, 60, 0, 0);
    expect(movement.snapshot.speed).toBe(0);
    expect(movement.state).toBe("Idle");
  });

  it("changes direction instantly — no drift", () => {
    const movement = makeMovement();
    run(movement, 60, 1, 0); // full speed right
    movement.update(STEP, -1, 0); // reverse input
    const snap = movement.snapshot;
    expect(snap.velocityX).toBeLessThan(0); // velocity points left immediately
    expect(snap.velocityY).toBe(0);
  });

  it("is deterministic: identical input sequences produce identical positions", () => {
    const play = (): string => {
      const movement = makeMovement();
      run(movement, 30, 1, 0);
      movement.tryBoost();
      run(movement, 30, 0.5, -0.5);
      const s = movement.snapshot;
      return `${s.x},${s.y},${s.speed}`;
    };
    expect(play()).toBe(play());
  });
});

describe("PlayerMovement — boost (AF-020 §4)", () => {
  it("bursts to boost speed, expires, and enforces the cooldown", () => {
    const movement = makeMovement();
    run(movement, 30, 1, 0);
    expect(movement.tryBoost()).toBe(true);
    run(movement, 5, 1, 0);
    expect(movement.state).toBe("Boosting");
    expect(movement.snapshot.speed).toBeGreaterThan(DEFAULT_MOVEMENT_PROFILE.maxSpeed);
    expect(movement.snapshot.invulnerable).toBe(true);

    run(movement, 30, 1, 0); // boost duration elapses
    expect(movement.state).toBe("Moving");
    expect(movement.tryBoost()).toBe(false); // cooldown

    run(movement, 120, 1, 0); // cooldown elapses (1400ms < 2s)
    expect(movement.tryBoost()).toBe(true);
  });

  it("cannot boost while rooted", () => {
    const movement = makeMovement();
    movement.addModifier({ id: "stasis", kind: "root", durationMs: 1000 });
    expect(movement.tryBoost()).toBe(false);
  });

  /**
   * GP-FINAL §Level Ups: boostCooldownScale is the additive hook Tuned
   * Thrusters' new boostEfficiency bonus (main.ts) scales — defaults to 1
   * (every test above, which never sets it, proves the unscaled behaviour
   * is untouched).
   */
  it("boostCooldownScale shortens the real cooldown, defaults to unscaled", () => {
    const movement = makeMovement();
    expect(movement.boostCooldownScale).toBe(1);
    movement.boostCooldownScale = 0.5;
    expect(movement.tryBoost()).toBe(true);
    run(movement, 30, 1, 0); // boost duration (220ms) elapses
    expect(movement.tryBoost()).toBe(false); // still on the (halved) cooldown
    run(movement, 42, 1, 0); // 700ms — the halved 700ms cooldown elapses
    expect(movement.tryBoost()).toBe(true);
  });
});

describe("PlayerMovement — modifiers (AF-020 §5)", () => {
  it("speed multipliers stack multiplicatively within the clamp", () => {
    const movement = makeMovement();
    movement.addModifier({ id: "slow-a", kind: "speedMultiplier", multiplier: 0.5, durationMs: 10_000 });
    movement.addModifier({ id: "slow-b", kind: "speedMultiplier", multiplier: 0.5, durationMs: 10_000 });
    run(movement, 120, 1, 0);
    expect(movement.snapshot.speed).toBeCloseTo(DEFAULT_MOVEMENT_PROFILE.maxSpeed * 0.25, 1);
    expect(movement.state).toBe("TemporarySlow");

    // A third heavy slow hits the clamp floor instead of freezing movement.
    movement.addModifier({ id: "slow-c", kind: "speedMultiplier", multiplier: 0.1, durationMs: 10_000 });
    run(movement, 120, 1, 0);
    expect(movement.snapshot.speed).toBeCloseTo(
      DEFAULT_MOVEMENT_PROFILE.maxSpeed * DEFAULT_MOVEMENT_PROFILE.speedMultiplierClamp.min,
      1,
    );
  });

  it("same-id reapplication refreshes duration instead of stacking", () => {
    const movement = makeMovement();
    movement.addModifier({ id: "slow", kind: "speedMultiplier", multiplier: 0.5, durationMs: 200 });
    run(movement, 6, 1, 0); // ~100ms
    movement.addModifier({ id: "slow", kind: "speedMultiplier", multiplier: 0.5, durationMs: 200 });
    run(movement, 9, 1, 0); // ~150ms — original would have expired
    expect(movement.snapshot.modifierCount).toBe(1);
    run(movement, 6, 1, 0); // refresh expires
    expect(movement.snapshot.modifierCount).toBe(0);
  });

  it("root zeroes input movement but external forces still apply", () => {
    const movement = makeMovement();
    movement.addModifier({ id: "immobilise", kind: "root", durationMs: 10_000 });
    movement.addModifier({ id: "gravity", kind: "force", forceX: 3, forceY: 0, durationMs: 10_000 });
    run(movement, 60, 0, -1); // player pushes up, rooted
    const snap = movement.snapshot;
    expect(movement.state).toBe("TemporaryRoot");
    expect(snap.speed).toBe(0);
    expect(snap.x).toBeCloseTo(3, 1); // dragged 3 units/s for 1s
    expect(snap.y).toBeCloseTo(0, 5); // input had no effect
  });

  it("constant environmental force displaces predictably", () => {
    const movement = makeMovement();
    movement.addModifier({ id: "solar-wind", kind: "force", forceX: 0, forceY: 2, durationMs: 10_000 });
    run(movement, 120, 0, 0); // 2 seconds
    expect(movement.snapshot.y).toBeCloseTo(4, 1);
  });
});

describe("PlayerMovement — knockback (AF-020 §2)", () => {
  it("shield impact displaces, staggers, and decays back to control", () => {
    const movement = makeMovement();
    movement.applyImpulse(10, 0, 150);
    movement.update(STEP, 0, 0);
    expect(movement.state).toBe("ShieldImpact");
    expect(movement.snapshot.x).toBeGreaterThan(0);

    run(movement, 120, 0, 0);
    expect(movement.state).toBe("Idle"); // impulse decayed, stagger over
  });
});

describe("PlayerMovement — collision (AF-020 §6)", () => {
  it("blocks penetration into walls", () => {
    const movement = makeMovement();
    movement.setObstacles([{ minX: 2, minY: -5, maxX: 3, maxY: 5 }]);
    run(movement, 180, 1, 0); // drive right into the wall for 3s
    const snap = movement.snapshot;
    expect(snap.x).toBeLessThanOrEqual(2 - DEFAULT_MOVEMENT_PROFILE.collisionRadius + 1e-6);
    expect(snap.collisionContacts).toBeGreaterThan(0);
  });

  it("slides along walls without stickiness (tangent speed preserved)", () => {
    const movement = makeMovement();
    movement.setObstacles([{ minX: 2, minY: -50, maxX: 3, maxY: 50 }]);
    movement.setPosition(2 - DEFAULT_MOVEMENT_PROFILE.collisionRadius, 0);
    const startY = movement.snapshot.y;
    run(movement, 60, 0.7, 0.7); // push diagonally into the wall for 1s
    const snap = movement.snapshot;
    // X stays pinned at the wall; Y advances at full tangent speed.
    expect(snap.x).toBeLessThanOrEqual(2 - DEFAULT_MOVEMENT_PROFILE.collisionRadius + 1e-6);
    const expectedTangent = DEFAULT_MOVEMENT_PROFILE.maxSpeed * Math.SQRT1_2;
    expect(snap.y - startY).toBeGreaterThan(expectedTangent * 0.8);
  });

  it("clamps to arena bounds", () => {
    const movement = makeMovement();
    movement.setBounds({ minX: 0, minY: 0, maxX: 10, maxY: 10 });
    movement.setPosition(5, 5);
    run(movement, 300, 1, 0);
    expect(movement.snapshot.x).toBeCloseTo(10 - DEFAULT_MOVEMENT_PROFILE.collisionRadius, 5);
  });
});

describe("PlayerMovement — control locks (AF-020 §2)", () => {
  it("defeat and mission complete lock input", () => {
    const movement = makeMovement();
    movement.setControlLocked("Defeat");
    run(movement, 60, 1, 0);
    expect(movement.state).toBe("Defeat");
    expect(movement.snapshot.x).toBe(0);

    movement.setControlLocked(null);
    run(movement, 10, 1, 0);
    expect(movement.state).toBe("Moving");
  });
});
