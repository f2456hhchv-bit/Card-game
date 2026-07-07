import { describe, expect, it } from "vitest";
import { createEnemyStateMachine, ENEMY_AI_TRANSITIONS } from "../src/game/enemies/EnemyAI";
import { hasDeathEvent } from "../src/game/enemies/DeathEvents";
import { stepEnemyMovement, type EnemyMovementState } from "../src/game/enemies/EnemyMovement";
import { EnemyRuntime } from "../src/game/enemies/EnemyRuntime";
import {
  SANDBOX_ENEMIES,
  applyEliteModifier,
  enemyFingerprint,
  findEnemyOverlap,
  type EnemyDef,
} from "../src/game/enemies/enemyData";

describe("findEnemyOverlap — no-overlap law (AF-033 mirroring AF-030/031/032)", () => {
  it("the sandbox roster has no overlapping signatures", () => {
    for (const enemy of SANDBOX_ENEMIES) {
      const others = SANDBOX_ENEMIES.filter((e) => e.id !== enemy.id);
      expect(findEnemyOverlap(enemy, others)).toBeNull();
    }
  });

  it("detects a near-duplicate signature and names the conflict", () => {
    const original = SANDBOX_ENEMIES[0] as EnemyDef;
    const clone: EnemyDef = { ...original, id: "clone-of-wisp", name: "Clone" };
    expect(findEnemyOverlap(clone, SANDBOX_ENEMIES)).toBe(original.id);
  });

  it("fingerprint depends only on family+roles+movement+mechanism+ability, not flavour text", () => {
    const a = SANDBOX_ENEMIES[0] as EnemyDef;
    const flavourChanged: EnemyDef = { ...a, lore: "Completely different flavour text." };
    expect(enemyFingerprint(a)).toBe(enemyFingerprint(flavourChanged));
  });

  it("role order does not affect the fingerprint", () => {
    const a = SANDBOX_ENEMIES.find((e) => e.id === "flak-orbiter") as EnemyDef;
    const reordered: EnemyDef = { ...a, roles: [...a.roles].reverse() };
    expect(enemyFingerprint(a)).toBe(enemyFingerprint(reordered));
  });
});

describe("applyEliteModifier — a modifier, not a second schema (AF-033 §4)", () => {
  it("scales hull and speed without mutating the base def", () => {
    const base = SANDBOX_ENEMIES[0] as EnemyDef;
    const elite = applyEliteModifier(base);
    expect(elite.hull).toBe(base.hull * base.eliteModifier!.hullMultiplier);
    expect(elite.moveSpeed).toBeCloseTo(base.moveSpeed * base.eliteModifier!.speedMultiplier, 5);
    expect(base.hull).not.toBe(elite.hull); // base untouched
  });

  it("grants the bonus ability when present", () => {
    const base = SANDBOX_ENEMIES[0] as EnemyDef;
    const elite = applyEliteModifier(base);
    expect(elite.specialAbility?.kind).toBe("enrage");
  });

  it("returns the same def unchanged when there is no elite modifier", () => {
    const noElite: EnemyDef = { ...(SANDBOX_ENEMIES[0] as EnemyDef), eliteModifier: null };
    expect(applyEliteModifier(noElite)).toBe(noElite);
  });
});

describe("EnemyAI — deterministic transitions over AF-016's StateMachine (AF-033 §1)", () => {
  it("follows the documented flow as legal forward transitions", () => {
    const machine = createEnemyStateMachine("idle");
    const path: readonly ["patrol", "search", "targetAcquired", "attack", "retreat", "recover"] = [
      "patrol",
      "search",
      "targetAcquired",
      "attack",
      "retreat",
      "recover",
    ];
    for (const state of path) {
      expect(machine.transitionTo(state)).toBe(true);
    }
    expect(machine.current).toBe("recover");
  });

  it("death is reachable from every live state", () => {
    for (const state of Object.keys(ENEMY_AI_TRANSITIONS) as (keyof typeof ENEMY_AI_TRANSITIONS)[]) {
      if (state === "death") continue;
      expect(ENEMY_AI_TRANSITIONS[state]).toContain("death");
    }
  });

  it("rejects an illegal transition rather than silently coercing it", () => {
    const machine = createEnemyStateMachine("idle");
    expect(machine.transitionTo("attack")).toBe(false); // idle cannot jump straight to attack
    expect(machine.current).toBe("idle");
  });

  it("recover can resume the loop instead of dead-ending", () => {
    const machine = createEnemyStateMachine("recover");
    expect(machine.transitionTo("search")).toBe(true);
  });
});

describe("stepEnemyMovement — deterministic motion for all ten behaviours (AF-033 §8)", () => {
  function freshState(): EnemyMovementState {
    return { x: 0, y: 0, elapsedMs: 0, strafeDirection: 1, phase: "hidden" };
  }
  const bounds = { minX: -10, minY: -10, maxX: 10, maxY: 10 };
  const context = { targetX: 10, targetY: 0, speed: 5, bounds };

  it("directPursuit moves straight toward the target", () => {
    const state = freshState();
    stepEnemyMovement("directPursuit", state, 1000, context);
    expect(state.x).toBeCloseTo(5, 5);
    expect(state.y).toBeCloseTo(0, 5);
  });

  it("retreat moves straight away from the target", () => {
    const state = freshState();
    stepEnemyMovement("retreat", state, 1000, context);
    expect(state.x).toBeLessThan(0);
  });

  it("kiting backs off when closer than the preferred range", () => {
    const state = { ...freshState(), x: 9 };
    stepEnemyMovement("kiting", state, 1000, { ...context, preferredRange: 6 });
    expect(state.x).toBeLessThan(9);
  });

  it("kiting closes in when farther than the preferred range", () => {
    const state = freshState();
    stepEnemyMovement("kiting", state, 1000, { ...context, targetX: 20, preferredRange: 6 });
    expect(state.x).toBeGreaterThan(0);
  });

  it("orbiting holds approximately a fixed radius around the target", () => {
    const state = { ...freshState(), x: 4 };
    for (let i = 0; i < 60; i += 1) {
      stepEnemyMovement("orbiting", state, 16, { ...context, preferredRange: 4 });
    }
    const distance = Math.hypot(state.x - context.targetX, state.y - context.targetY);
    expect(distance).toBeCloseTo(4, 0);
  });

  it("strafing moves perpendicular to the line toward the target", () => {
    const state = freshState();
    stepEnemyMovement("strafing", state, 100, context);
    expect(Math.abs(state.y)).toBeGreaterThan(0);
    expect(state.x).toBeCloseTo(0, 5); // no forward/back motion for a pure-perpendicular target
  });

  it("ambush stays hidden until the target enters trigger range, then engages", () => {
    const state = freshState();
    stepEnemyMovement("ambush", state, 1000, { ...context, targetX: 100, triggerRange: 4 });
    expect(state.phase).toBe("hidden");
    expect(state.x).toBe(0);
    const closeState = freshState();
    stepEnemyMovement("ambush", closeState, 1000, { ...context, targetX: 2, triggerRange: 4 });
    expect(closeState.phase).toBe("active");
    expect(closeState.x).toBeGreaterThan(0);
  });

  it("burrow toggles between hidden and active on its phase interval", () => {
    const state = freshState();
    stepEnemyMovement("burrow", state, 500, { ...context, phaseIntervalMs: 1000 });
    expect(state.phase).toBe("hidden");
    stepEnemyMovement("burrow", state, 600, { ...context, phaseIntervalMs: 1000 }); // elapsed now 1100
    expect(state.phase).toBe("active");
  });

  it("teleport jumps exactly once per interval, deterministically given a fixed rng", () => {
    const state = freshState();
    stepEnemyMovement("teleport", state, 2999, { ...context, phaseIntervalMs: 3000, rng: () => 0 });
    expect(state.x).toBeCloseTo(0, 5); // no jump yet
    stepEnemyMovement("teleport", state, 2, { ...context, phaseIntervalMs: 3000, preferredRange: 5, rng: () => 0 });
    expect(Math.hypot(state.x - context.targetX, state.y - context.targetY)).toBeCloseTo(5, 5);
  });

  it("wallCrawling snaps to the nearest arena boundary", () => {
    const state = { ...freshState(), x: -9.5, y: 0 };
    stepEnemyMovement("wallCrawling", state, 100, context);
    expect(state.x).toBe(bounds.minX);
  });

  it("formation seeks its anchor+offset goal, not the raw target", () => {
    const state = freshState();
    const formationContext = {
      ...context,
      formationAnchorX: 0,
      formationAnchorY: 0,
      formationOffsetX: 3,
      formationOffsetY: 0,
    };
    for (let i = 0; i < 300; i += 1) stepEnemyMovement("formation", state, 16, formationContext);
    expect(Math.abs(state.x - 3)).toBeLessThan(0.15);
    expect(Math.abs(state.y)).toBeLessThan(0.15);
  });
});

describe("EnemyRuntime — telegraph/cooldown gating and condition-gated special ability (AF-033)", () => {
  const melee = SANDBOX_ENEMIES[0] as EnemyDef; // wisp-chaser, telegraphMs 0
  const ranged = SANDBOX_ENEMIES.find((e) => e.id === "flak-orbiter") as EnemyDef; // telegraphMs 450

  it("a zero-telegraph attack resolves on the first engaged tick", () => {
    const runtime = new EnemyRuntime(melee);
    expect(runtime.tryAttack(true)).toBe(true);
    expect(runtime.tryAttack(true)).toBe(false); // now on cooldown
  });

  it("a telegraphed attack does not resolve until the telegraph window elapses", () => {
    const runtime = new EnemyRuntime(ranged);
    expect(runtime.tryAttack(true)).toBe(false);
    expect(runtime.isTelegraphing).toBe(true);
    for (let i = 0; i < 20; i += 1) runtime.update(16); // 320ms < 450ms telegraph
    expect(runtime.tryAttack(true)).toBe(false);
    for (let i = 0; i < 10; i += 1) runtime.update(16); // total 480ms > 450ms
    expect(runtime.tryAttack(true)).toBe(true);
  });

  it("losing engagement cancels an in-progress telegraph", () => {
    const runtime = new EnemyRuntime(ranged);
    runtime.tryAttack(true);
    expect(runtime.isTelegraphing).toBe(true);
    runtime.tryAttack(false);
    expect(runtime.isTelegraphing).toBe(false);
  });

  it("Enrage's bonus is empty above the threshold and present below it", () => {
    const elite = applyEliteModifier(melee);
    const runtime = new EnemyRuntime(elite);
    expect(runtime.specialAbilityBonus(0.8)).toEqual({});
    expect(runtime.specialAbilityBonus(0.2)).toEqual({ movementSpeed: 0.5 });
  });

  it("an enemy with no special ability always returns an empty bonus", () => {
    const runtime = new EnemyRuntime(melee); // base def, no ability of its own
    expect(runtime.specialAbilityBonus(0.01)).toEqual({});
  });
});

describe("hasDeathEvent — death-event configuration over the existing EnemyKilled event (AF-033 §6)", () => {
  it("reads the configured kinds directly", () => {
    const flakOrbiter = SANDBOX_ENEMIES.find((e) => e.id === "flak-orbiter") as EnemyDef;
    expect(hasDeathEvent(flakOrbiter, "statusExplosion")).toBe(true);
    expect(hasDeathEvent(flakOrbiter, "spawnEvent")).toBe(false);
  });
});

describe("Enemies — self-review: every sandbox enemy runs a full encounter without exception", () => {
  it("each enemy (base and elite) cycles AI states and fires at least one attack over a simulated encounter", () => {
    for (const def of SANDBOX_ENEMIES) {
      for (const variant of [def, applyEliteModifier(def)]) {
        const runtime = new EnemyRuntime(variant);
        let attacksResolved = 0;
        for (let tick = 0; tick < 2000; tick += 1) {
          runtime.update(16);
          if (runtime.tryAttack(true)) attacksResolved += 1;
        }
        expect(attacksResolved).toBeGreaterThan(0);
        expect(runtime.snapshot.enemyId).toBe(variant.id);
      }
    }
  });
});
