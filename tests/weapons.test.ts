import { describe, expect, it } from "vitest";
import { computeShotAngles } from "../src/game/weapons/FirePattern";
import { stepProjectile, type ProjectileState } from "../src/game/weapons/ProjectileBehaviour";
import { WeaponRuntime } from "../src/game/weapons/WeaponRuntime";
import {
  SANDBOX_WEAPONS,
  evaluateWeaponEvolution,
  findWeaponOverlap,
  weaponFingerprint,
  type WeaponDef,
} from "../src/game/weapons/weaponData";

describe("findWeaponOverlap — no-overlap law (AF-032 mirroring AF-030/031)", () => {
  it("the sandbox roster has no overlapping signatures", () => {
    for (const weapon of SANDBOX_WEAPONS) {
      const others = SANDBOX_WEAPONS.filter((w) => w.id !== weapon.id);
      expect(findWeaponOverlap(weapon, others)).toBeNull();
    }
  });

  it("detects a near-duplicate signature and names the conflict", () => {
    const original = SANDBOX_WEAPONS[0] as WeaponDef;
    const clone: WeaponDef = { ...original, id: "clone-of-coil-ripper", name: "Clone" };
    expect(findWeaponOverlap(clone, SANDBOX_WEAPONS)).toBe(original.id);
  });

  it("fingerprint depends only on category+firePattern+behaviour+status, not flavour text", () => {
    const a = SANDBOX_WEAPONS[0] as WeaponDef;
    const flavourChanged: WeaponDef = { ...a, lore: "Completely different flavour text." };
    expect(weaponFingerprint(a)).toBe(weaponFingerprint(flavourChanged));
  });
});

describe("computeShotAngles — geometric fire patterns (AF-032 §2)", () => {
  it("singleShot and burst fire exactly one projectile at the base angle", () => {
    expect(computeShotAngles("singleShot", 1, 0)).toEqual([0]);
    expect(computeShotAngles("burst", 3, 0.5)).toEqual([0.5]);
  });

  it("spread fans out symmetrically around the base angle", () => {
    const angles = computeShotAngles("spread", 3, 0);
    expect(angles).toHaveLength(3);
    expect(angles[1]).toBeCloseTo(0, 5);
    expect(angles[0]).toBeCloseTo(-angles[2]!, 5);
  });

  it("nova distributes projectiles evenly around the full circle", () => {
    const angles = computeShotAngles("nova", 4, 0);
    expect(angles).toHaveLength(4);
    expect(angles).toEqual([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]);
  });

  it("spiral advances by the running offset each call", () => {
    expect(computeShotAngles("spiral", 1, 0, 0)).toEqual([0]);
    expect(computeShotAngles("spiral", 1, 0, Math.PI / 8)).toEqual([Math.PI / 8]);
  });

  it("identity patterns (beam/orbit/homing/chain/wave/chargedShot) spawn a single projectile", () => {
    for (const pattern of ["beam", "orbit", "homing", "chain", "wave", "chargedShot"] as const) {
      expect(computeShotAngles(pattern, 5, 1.2)).toEqual([1.2]);
    }
  });
});

describe("stepProjectile — deterministic motion for all twelve behaviours (AF-032 §2)", () => {
  function freshState(): ProjectileState {
    return {
      x: 0,
      y: 0,
      velocityX: 10,
      velocityY: 0,
      originX: 0,
      originY: 0,
      elapsedMs: 0,
      bouncesRemaining: 2,
      reversed: false,
    };
  }
  const bounds = { minX: -5, minY: -5, maxX: 5, maxY: 5 };

  it("straight, piercing, explosive, splitting, and chainLightning share identical trajectory", () => {
    const trajectoryBehaviours = ["straight", "piercing", "explosive", "splitting", "chainLightning"] as const;
    const results = trajectoryBehaviours.map((behaviour) => {
      const state = freshState();
      stepProjectile(behaviour, state, 100, { bounds });
      return { x: state.x, y: state.y };
    });
    for (const result of results) {
      expect(result).toEqual(results[0]);
    }
    expect(results[0]!.x).toBeCloseTo(1, 5);
  });

  it("persistentBeam does not move", () => {
    const state = freshState();
    stepProjectile("persistentBeam", state, 100, { bounds });
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
    expect(state.elapsedMs).toBe(100);
  });

  it("seeking turns velocity toward the target, bounded by turn rate", () => {
    const state = freshState();
    stepProjectile("seeking", state, 100, {
      bounds,
      seekTargetX: 0,
      seekTargetY: 10,
      turnRatePerSecond: Math.PI, // 180deg/s -> 18deg over 100ms
    });
    const angle = Math.atan2(state.velocityY, state.velocityX);
    expect(angle).toBeGreaterThan(0);
    expect(angle).toBeLessThan(Math.PI / 2);
  });

  it("bouncing reflects off arena bounds and consumes a bounce", () => {
    const state: ProjectileState = { ...freshState(), x: 4.9, velocityX: 20 };
    stepProjectile("bouncing", state, 100, { bounds });
    expect(state.velocityX).toBeLessThan(0);
    expect(state.bouncesRemaining).toBe(1);
  });

  it("returning reverses direction once max range is reached", () => {
    const state = freshState();
    for (let i = 0; i < 200; i += 1) {
      stepProjectile("returning", state, 16, { bounds, maxRange: 5 });
    }
    expect(state.reversed).toBe(true);
    expect(state.velocityX).toBeLessThan(0);
  });

  it("accelerating increases speed over time", () => {
    const state = freshState();
    const initialSpeed = Math.hypot(state.velocityX, state.velocityY);
    for (let i = 0; i < 10; i += 1) {
      stepProjectile("accelerating", state, 100, { bounds, accelerationPerSecond: 20 });
    }
    const finalSpeed = Math.hypot(state.velocityX, state.velocityY);
    expect(finalSpeed).toBeGreaterThan(initialSpeed);
  });

  it("orbiting holds a fixed radius around its anchor", () => {
    const state: ProjectileState = { ...freshState(), x: 3, y: 0 };
    for (let i = 0; i < 50; i += 1) {
      stepProjectile("orbiting", state, 16, {
        bounds,
        anchorX: 0,
        anchorY: 0,
        orbitRadius: 3,
        orbitAngularSpeedPerSecond: Math.PI,
      });
      expect(Math.hypot(state.x, state.y)).toBeCloseTo(3, 5);
    }
  });

  it("gravityAffected accumulates velocity from the gravity vector", () => {
    const state = freshState();
    stepProjectile("gravityAffected", state, 1000, { bounds, gravityX: 0, gravityY: -10 });
    expect(state.velocityY).toBeCloseTo(-10, 5);
  });
});

describe("evaluateWeaponEvolution — all six heterogeneous triggers (AF-032 §5)", () => {
  const baseContext = {
    level: 1,
    activeRelicIds: [] as string[],
    equippedItemIds: [] as string[],
    unlockedResearchIds: [] as string[],
    bossMaterialCount: 0,
    hasAncientTechnology: false,
  };

  it("minLevel gates correctly", () => {
    expect(evaluateWeaponEvolution({ minLevel: 5 }, baseContext)).toBe(false);
    expect(evaluateWeaponEvolution({ minLevel: 5 }, { ...baseContext, level: 5 })).toBe(true);
  });

  it("requiresRelicIds requires every listed relic active", () => {
    const req = { requiresRelicIds: ["ember-core", "frost-shard"] };
    expect(evaluateWeaponEvolution(req, baseContext)).toBe(false);
    expect(evaluateWeaponEvolution(req, { ...baseContext, activeRelicIds: ["ember-core"] })).toBe(false);
    expect(
      evaluateWeaponEvolution(req, { ...baseContext, activeRelicIds: ["ember-core", "frost-shard"] }),
    ).toBe(true);
  });

  it("requiresEquipmentIds requires every listed item equipped", () => {
    const req = { requiresEquipmentIds: ["vanguard-plating"] };
    expect(evaluateWeaponEvolution(req, baseContext)).toBe(false);
    expect(
      evaluateWeaponEvolution(req, { ...baseContext, equippedItemIds: ["vanguard-plating"] }),
    ).toBe(true);
  });

  it("requiresResearchIds requires every listed node unlocked", () => {
    const req = { requiresResearchIds: ["unified-theory"] };
    expect(evaluateWeaponEvolution(req, baseContext)).toBe(false);
    expect(
      evaluateWeaponEvolution(req, { ...baseContext, unlockedResearchIds: ["unified-theory"] }),
    ).toBe(true);
  });

  it("minBossMaterials gates on count", () => {
    const req = { minBossMaterials: 3 };
    expect(evaluateWeaponEvolution(req, { ...baseContext, bossMaterialCount: 2 })).toBe(false);
    expect(evaluateWeaponEvolution(req, { ...baseContext, bossMaterialCount: 3 })).toBe(true);
  });

  it("requiresAncientTechnology gates on the boolean flag", () => {
    const req = { requiresAncientTechnology: true };
    expect(evaluateWeaponEvolution(req, baseContext)).toBe(false);
    expect(evaluateWeaponEvolution(req, { ...baseContext, hasAncientTechnology: true })).toBe(true);
  });

  it("combined requirements all must hold", () => {
    const voidlance = SANDBOX_WEAPONS.find((w) => w.id === "voidlance") as WeaponDef;
    const requirement = voidlance.evolution!.requirement;
    expect(evaluateWeaponEvolution(requirement, baseContext)).toBe(false);
    expect(
      evaluateWeaponEvolution(requirement, { ...baseContext, hasAncientTechnology: true, bossMaterialCount: 3 }),
    ).toBe(true);
  });
});

describe("WeaponRuntime — fire-interval and energy-cost gating (AF-032)", () => {
  const energyFree = SANDBOX_WEAPONS[0] as WeaponDef; // coil-ripper, energyCost 0
  const energyWeapon = SANDBOX_WEAPONS.find((w) => w.id === "voidlance") as WeaponDef; // energyCost 8

  it("fires immediately, then gates on cooldown", () => {
    const runtime = new WeaponRuntime(energyFree);
    expect(runtime.tryFire(0)).not.toBeNull();
    expect(runtime.tryFire(0)).toBeNull();
    for (let i = 0; i < 30; i += 1) runtime.update(16); // ~480ms > 320ms interval
    expect(runtime.tryFire(0)).not.toBeNull();
  });

  it("produces one ShotDescriptor per projectile in the pattern", () => {
    const novasplitter = SANDBOX_WEAPONS.find((w) => w.id === "novasplitter") as WeaponDef;
    const runtime = new WeaponRuntime(novasplitter);
    const shots = runtime.tryFire(0);
    expect(shots).toHaveLength(novasplitter.projectilesPerShot);
  });

  it("a zero-energy-cost weapon never touches the spend callback", () => {
    let called = false;
    const runtime = new WeaponRuntime(energyFree, () => {
      called = true;
      return true;
    });
    runtime.tryFire(0);
    expect(called).toBe(false);
  });

  it("an energy-costing weapon is gated by the ship's shared pool via the injected callback", () => {
    const runtime = new WeaponRuntime(energyWeapon, (amount) => amount <= 5); // pretend only 5 available
    expect(runtime.tryFire(0)).toBeNull(); // needs 8, only 5 "available"
    const generous = new WeaponRuntime(energyWeapon, (amount) => amount <= 100);
    expect(generous.tryFire(0)).not.toBeNull();
  });

  it("intervalScale shortens the cooldown a fire-rate upgrade sets (AF-022 build bonus)", () => {
    const runtime = new WeaponRuntime(energyFree);
    runtime.intervalScale = 0.5;
    runtime.tryFire(0);
    for (let i = 0; i < 11; i += 1) runtime.update(16); // ~176ms: half of 320ms interval
    expect(runtime.tryFire(0)).not.toBeNull();
  });
});

describe("Weapons — self-review: every sandbox weapon fires a full magazine deterministically", () => {
  it("every weapon in the roster fires repeatedly without exception across a simulated campaign", () => {
    for (const weapon of SANDBOX_WEAPONS) {
      const runtime = new WeaponRuntime(weapon, () => true);
      let totalShotsFired = 0;
      for (let tick = 0; tick < 2000; tick += 1) {
        runtime.update(16);
        const shots = runtime.tryFire(0);
        if (shots) totalShotsFired += shots.length;
      }
      expect(totalShotsFired).toBeGreaterThan(0);
      expect(runtime.snapshot.weaponId).toBe(weapon.id);
    }
  });
});
