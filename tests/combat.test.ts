import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  NEUTRAL_MODIFIERS,
  resolveDamage,
  type DamagePacket,
  type OffensiveModifiers,
} from "../src/game/combat/DamagePipeline";
import { StatusEngine } from "../src/game/combat/StatusEngine";
import { DefenceState } from "../src/game/combat/DefenceState";
import {
  TARGET_SELECTORS,
  type TargetCandidate,
} from "../src/game/combat/targetPriority";
import { DEFAULT_COMBAT_TUNING } from "../src/game/combat/combatTuning";

const STEP = 1000 / 60;

const basePacket: DamagePacket = {
  baseDamage: 100,
  kind: "direct",
  school: "energy",
  critChance: 0,
  critMultiplier: 2,
};

describe("DamagePipeline — nine deterministic stages (AF-021 §1)", () => {
  it("records the full stage trail in order", () => {
    const result = resolveDamage(basePacket, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, new Rng(1));
    expect(result.breakdown.map((s) => s.stage)).toEqual([
      "base",
      "weapon",
      "commander",
      "ship",
      "equipment",
      "research",
      "affixes",
      "critical",
      "resistance",
      "final",
    ]);
    expect(result.finalDamage).toBe(100);
  });

  it("is additive within a stage, multiplicative across stages (anti-inflation)", () => {
    // Two +50% equipment bonuses = one stage at ×2.0, not ×2.25.
    const stacked: OffensiveModifiers = { ...NEUTRAL_MODIFIERS, equipment: 1.0 };
    const spread: OffensiveModifiers = { ...NEUTRAL_MODIFIERS, equipment: 0.5, research: 0.5 };
    const a = resolveDamage(basePacket, stacked, { values: {} }, DEFAULT_COMBAT_TUNING, new Rng(1));
    const b = resolveDamage(basePacket, spread, { values: {} }, DEFAULT_COMBAT_TUNING, new Rng(1));
    expect(a.finalDamage).toBe(200); // 100 × 2.0
    expect(b.finalDamage).toBeCloseTo(225, 5); // 100 × 1.5 × 1.5 — synergy across stages wins
  });

  it("caps resistance at the tuned maximum — no immunity by stacking", () => {
    const result = resolveDamage(
      basePacket,
      NEUTRAL_MODIFIERS,
      { values: { energy: 5 } },
      DEFAULT_COMBAT_TUNING,
      new Rng(1),
    );
    expect(result.finalDamage).toBeCloseTo(100 * (1 - DEFAULT_COMBAT_TUNING.resistanceCap), 5);
  });

  it("armour break reduces school resistance", () => {
    const intact = resolveDamage(basePacket, NEUTRAL_MODIFIERS, { values: { energy: 0.5 } }, DEFAULT_COMBAT_TUNING, new Rng(1));
    const broken = resolveDamage(basePacket, NEUTRAL_MODIFIERS, { values: { energy: 0.5 }, armourBroken: true }, DEFAULT_COMBAT_TUNING, new Rng(1));
    expect(broken.finalDamage).toBeGreaterThan(intact.finalDamage);
  });

  it("boss resistance applies to boss-kind damage", () => {
    const packet: DamagePacket = { ...basePacket, kind: "boss" };
    const result = resolveDamage(packet, NEUTRAL_MODIFIERS, { values: { boss: 0.4 } }, DEFAULT_COMBAT_TUNING, new Rng(1));
    expect(result.finalDamage).toBeCloseTo(60, 5);
  });

  it("crit rate converges on the configured chance (seeded, deterministic)", () => {
    const packet: DamagePacket = { ...basePacket, critChance: 0.25 };
    const rng = new Rng(777).fork("crits");
    let crits = 0;
    for (let i = 0; i < 10_000; i += 1) {
      if (resolveDamage(packet, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, rng).critical) crits += 1;
    }
    expect(crits / 10_000).toBeGreaterThan(0.23);
    expect(crits / 10_000).toBeLessThan(0.27);
  });

  it("same seed produces identical results including crits", () => {
    const play = (): string => {
      const rng = new Rng(42).fork("crits");
      const packet: DamagePacket = { ...basePacket, critChance: 0.3 };
      return Array.from({ length: 50 }, () =>
        resolveDamage(packet, NEUTRAL_MODIFIERS, { values: { energy: 0.2 } }, DEFAULT_COMBAT_TUNING, rng).finalDamage.toFixed(3),
      ).join(",");
    };
    expect(play()).toBe(play());
  });
});

describe("StatusEngine (AF-021 §2)", () => {
  it("burn stacks intensity up to the cap and ticks DoT per stack", () => {
    const ticks: number[] = [];
    const engine = new StatusEngine({ onTickDamage: (_k, amount) => ticks.push(amount) });
    for (let i = 0; i < 5; i += 1) engine.apply({ kind: "burn", strength: 10, durationMs: 2000 });
    expect(engine.snapshot[0]?.stacks).toBe(3); // maxStacks cap

    for (let i = 0; i < 31; i += 1) engine.update(STEP); // ~517ms → one 500ms tick
    expect(ticks).toHaveLength(1);
    expect(ticks[0]).toBeCloseTo(10 * 0.2 * 3, 5); // strength × fraction × stacks
  });

  it("poison stacks duration; slow refreshes", () => {
    const engine = new StatusEngine();
    engine.apply({ kind: "poison", strength: 5, durationMs: 1000 });
    engine.apply({ kind: "poison", strength: 5, durationMs: 1000 });
    expect(engine.snapshot.find((s) => s.kind === "poison")?.remainingMs).toBe(2000);

    engine.apply({ kind: "slow", strength: 1, durationMs: 500 });
    engine.apply({ kind: "slow", strength: 1, durationMs: 300 });
    expect(engine.snapshot.find((s) => s.kind === "slow")?.remainingMs).toBe(500); // refresh keeps the longer
  });

  it("resistance shortens duration; immunity blocks outright", () => {
    const engine = new StatusEngine();
    engine.apply({ kind: "burn", strength: 10, durationMs: 1000 }, { burn: 0.5 });
    expect(engine.snapshot[0]?.remainingMs).toBe(500);

    engine.setImmunity("freeze", true);
    expect(engine.apply({ kind: "freeze", strength: 1, durationMs: 1000 })).toBe(false);
  });

  it("bridges slow and freeze into AF-020 movement modifiers", () => {
    const engine = new StatusEngine();
    engine.apply({ kind: "slow", strength: 1, durationMs: 1000 });
    engine.apply({ kind: "freeze", strength: 1, durationMs: 500 });
    const modifiers = engine.movementModifiers;
    expect(modifiers).toContainEqual(
      expect.objectContaining({ id: "status-slow", kind: "speedMultiplier", multiplier: 0.6 }),
    );
    expect(modifiers).toContainEqual(expect.objectContaining({ id: "status-freeze", kind: "root" }));
  });

  it("expires and is cleansable", () => {
    let expired = "";
    const engine = new StatusEngine({ onExpired: (kind) => (expired = kind) });
    engine.apply({ kind: "shock", strength: 1, durationMs: 100 });
    for (let i = 0; i < 10; i += 1) engine.update(STEP);
    expect(engine.has("shock")).toBe(false);
    expect(expired).toBe("shock");

    engine.apply({ kind: "corruption", strength: 1, durationMs: 10_000 });
    expect(engine.remove("corruption")).toBe(true);
    expect(engine.has("corruption")).toBe(false);
  });
});

describe("DefenceState (AF-021 §4)", () => {
  it("allocates damage barrier → shield → hull, in order", () => {
    const defence = new DefenceState(50, 100, DEFAULT_COMBAT_TUNING);
    defence.addBarrier(20);
    const intake = defence.takeDamage(100);
    expect(intake.barrierAbsorbed).toBe(20);
    expect(intake.shieldDamage).toBe(50);
    expect(intake.hullDamage).toBe(30);
    expect(intake.shieldBroken).toBe(true);
    expect(defence.snapshot.hull).toBe(70);
  });

  it("damage reduction is capped", () => {
    const defence = new DefenceState(0, 100, DEFAULT_COMBAT_TUNING, 5); // absurd DR request
    const intake = defence.takeDamage(100);
    expect(intake.hullDamage).toBeCloseTo(100 * (1 - DEFAULT_COMBAT_TUNING.damageReductionCap), 5);
  });

  it("shield regenerates after the delay, and Shield Break halts regen", () => {
    const defence = new DefenceState(50, 100, DEFAULT_COMBAT_TUNING);
    defence.takeDamage(30);
    expect(defence.snapshot.shield).toBe(20);

    const delayTicks = Math.ceil(DEFAULT_COMBAT_TUNING.shieldRegenDelayMs / STEP);
    for (let i = 0; i < delayTicks + 60; i += 1) defence.update(STEP); // delay + 1s regen
    expect(defence.snapshot.shield).toBeGreaterThan(20);

    defence.setShieldRegenHalted(true);
    const before = defence.snapshot.shield;
    for (let i = 0; i < 60; i += 1) defence.update(STEP);
    expect(defence.snapshot.shield).toBe(before);
  });

  it("defeat triggers at zero hull", () => {
    const defence = new DefenceState(0, 40, DEFAULT_COMBAT_TUNING);
    const intake = defence.takeDamage(45);
    expect(intake.defeated).toBe(true);
    expect(defence.isDefeated).toBe(true);
    expect(defence.snapshot.hull).toBe(0); // never negative
  });
});

describe("Target priority selectors (AF-021 §5)", () => {
  const candidates: TargetCandidate[] = [
    { id: "near", x: 1, y: 0, health: 50, maxHealth: 50, isBoss: false, isElite: false },
    { id: "elite", x: 5, y: 0, health: 80, maxHealth: 80, isBoss: false, isElite: true },
    { id: "boss", x: 10, y: 0, health: 500, maxHealth: 500, isBoss: true, isElite: false },
    { id: "weak", x: 7, y: 0, health: 5, maxHealth: 60, isBoss: false, isElite: false },
  ];

  it("selects per policy", () => {
    expect(TARGET_SELECTORS.nearest(candidates, 0, 0)?.id).toBe("near");
    expect(TARGET_SELECTORS.boss(candidates, 0, 0)?.id).toBe("boss");
    expect(TARGET_SELECTORS.elite(candidates, 0, 0)?.id).toBe("elite");
    expect(TARGET_SELECTORS.lowestHealth(candidates, 0, 0)?.id).toBe("weak");
    expect(TARGET_SELECTORS.highestHealth(candidates, 0, 0)?.id).toBe("boss");
  });

  it("falls back gracefully when the preferred class is absent", () => {
    const noBosses = candidates.filter((c) => !c.isBoss);
    expect(TARGET_SELECTORS.boss(noBosses, 0, 0)?.id).toBe("near");
    expect(TARGET_SELECTORS.nearest([], 0, 0)).toBeNull();
  });
});

describe("Encounter simulation — 200 seeded fights (AF-021 self-review)", () => {
  it("holds every invariant across simulated encounters", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const rng = new Rng(seed).fork("encounter");
      const defence = new DefenceState(40, 120, DEFAULT_COMBAT_TUNING, rng.float(0, 0.3));
      const statuses = new StatusEngine({
        onTickDamage: (_kind, amount) => {
          const intake = defence.takeDamage(amount);
          expect(intake.hullDamage).toBeGreaterThanOrEqual(0);
        },
      });

      for (let step = 0; step < 600 && !defence.isDefeated; step += 1) {
        if (rng.next() < 0.05) {
          const packet: DamagePacket = {
            baseDamage: rng.float(2, 20),
            kind: rng.pick(["direct", "area", "beam", "boss"] as const),
            school: rng.pick(["physical", "energy"] as const),
            critChance: rng.float(0, 0.5),
            critMultiplier: 2,
          };
          const result = resolveDamage(
            packet,
            { ...NEUTRAL_MODIFIERS, weapon: rng.float(0, 1) },
            { values: { physical: rng.float(0, 1), energy: rng.float(0, 1), boss: rng.float(0, 1) } },
            DEFAULT_COMBAT_TUNING,
            rng,
          );
          expect(Number.isFinite(result.finalDamage)).toBe(true);
          expect(result.finalDamage).toBeGreaterThanOrEqual(0);
          defence.takeDamage(result.finalDamage);
        }
        if (rng.next() < 0.02) {
          statuses.apply(
            { kind: rng.pick(["burn", "poison", "corruption", "slow"] as const), strength: rng.float(1, 8), durationMs: rng.float(500, 3000) },
            { burn: rng.float(0, 1) },
          );
        }
        statuses.update(STEP);
        defence.update(STEP);

        const snap = defence.snapshot;
        expect(snap.hull).toBeGreaterThanOrEqual(0);
        expect(snap.shield).toBeGreaterThanOrEqual(0);
        expect(snap.shield).toBeLessThanOrEqual(snap.maxShield);
      }
    }
  });
});
