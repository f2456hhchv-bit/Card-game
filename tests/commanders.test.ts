import { describe, expect, it } from "vitest";
import { CommanderRuntime } from "../src/game/commanders/CommanderRuntime";
import {
  COMMANDER_ULTIMATE_EFFECT_KINDS,
  SANDBOX_COMMANDERS,
  findOverlap,
  fingerprint,
  type CommanderDef,
} from "../src/game/commanders/commanderData";

describe("findOverlap — no-overlap law (AF-030 §2)", () => {
  it("the sandbox roster has no overlapping signatures", () => {
    for (const commander of SANDBOX_COMMANDERS) {
      const others = SANDBOX_COMMANDERS.filter((c) => c.id !== commander.id);
      expect(findOverlap(commander, others)).toBeNull();
    }
  });

  it("detects a near-duplicate signature and names the conflict", () => {
    const original = SANDBOX_COMMANDERS[0] as CommanderDef;
    const clone: CommanderDef = { ...original, id: "clone-of-longlight", name: "Clone" };
    expect(findOverlap(clone, SANDBOX_COMMANDERS)).toBe(original.id);
  });

  it("fingerprint depends only on trigger+bonus+tag+ultimate, not flavour text", () => {
    const a = SANDBOX_COMMANDERS[0] as CommanderDef;
    const flavourChanged: CommanderDef = { ...a, biography: "Completely different flavour text." };
    expect(fingerprint(a)).toBe(fingerprint(flavourChanged));
  });
});

describe("CommanderRuntime — abilities (AF-030 §1)", () => {
  const commander = SANDBOX_COMMANDERS[0] as CommanderDef; // Longlight

  it("gates the active ability behind its cooldown", () => {
    const runtime = new CommanderRuntime(commander);
    expect(runtime.tryActivateAbility()).toBe(true);
    expect(runtime.tryActivateAbility()).toBe(false); // still on cooldown
    for (let i = 0; i < 500; i += 1) runtime.update(16); // ~8s
    expect(runtime.tryActivateAbility()).toBe(true);
  });

  it("charges the ultimate from kills and damage, firing the ready callback once", () => {
    let readyCount = 0;
    const runtime = new CommanderRuntime(commander, () => (readyCount += 1));
    for (let i = 0; i < 24; i += 1) runtime.notifyKill(); // 24 × 4 = 96
    expect(runtime.snapshot.ultimateReady).toBe(false);
    runtime.notifyDamageDealt(100); // +5 → 101, clamped to 100 → ready
    expect(runtime.snapshot.ultimateReady).toBe(true);
    expect(readyCount).toBe(1);

    runtime.notifyKill(); // already ready — callback must not refire
    expect(readyCount).toBe(1);
  });

  it("activating the ultimate consumes all charge", () => {
    const runtime = new CommanderRuntime(commander);
    for (let i = 0; i < 30; i += 1) runtime.notifyKill();
    expect(runtime.tryActivateUltimate()).toBe(true);
    expect(runtime.snapshot.ultimateCharge).toBe(0);
    expect(runtime.tryActivateUltimate()).toBe(false); // nothing left
  });

  it("exposes passive + signature bonuses in the shared BonusTotals shape", () => {
    const runtime = new CommanderRuntime(commander);
    const bonuses = runtime.bonuses;
    expect(bonuses.criticalDamage).toBeCloseTo(0.1, 5); // passive
    expect(bonuses.cooldownReduction).toBeCloseTo(0.02, 5); // signature
  });
});

describe("GP-004 §Content Engine — Commander Ultimates carry a real, generic, mechanically-distinct effect", () => {
  it("registers the interpreter's real effect-kind vocabulary", () => {
    expect(COMMANDER_ULTIMATE_EFFECT_KINDS).toEqual(["novaDamage", "barrierBurst", "healBurst"]);
  });

  it("the two playable sandbox commanders have real, DIFFERENT effect kinds — not identical presentation-only activation", () => {
    const [longlight, ironhull] = SANDBOX_COMMANDERS;
    expect(longlight!.ultimate.effect?.kind).toBe("novaDamage");
    expect(ironhull!.ultimate.effect?.kind).toBe("barrierBurst");
    expect(longlight!.ultimate.effect?.kind).not.toBe(ironhull!.ultimate.effect?.kind);
  });

  it("every effect carries a real, positive magnitude — never a zero-value placeholder", () => {
    for (const commander of SANDBOX_COMMANDERS) {
      const effect = commander.ultimate.effect;
      expect(effect).toBeDefined();
      expect(effect!.value).toBeGreaterThan(0);
    }
  });

  it("effect is additive-only on CommanderUltimate — omitting it entirely is still legal (the generic default applies at activation)", () => {
    const withoutEffect: CommanderDef = {
      ...SANDBOX_COMMANDERS[0]!,
      id: "no-effect-test-commander",
      ultimate: { id: "placeholder-ultimate", name: "Placeholder", chargeRequired: 100, chargePerKill: 1, chargePerDamage: 0.01 },
    };
    expect(withoutEffect.ultimate.effect).toBeUndefined();
  });
});

describe("Commanders — sandbox roster proves the engine end-to-end", () => {
  it("both sandbox Commanders run a full ability/ultimate cycle without collision", () => {
    for (const commander of SANDBOX_COMMANDERS) {
      const runtime = new CommanderRuntime(commander);
      expect(runtime.tryActivateAbility()).toBe(true);
      for (let i = 0; i < 60; i += 1) runtime.notifyKill();
      expect(runtime.snapshot.ultimateReady).toBe(true);
      expect(Object.keys(runtime.bonuses).length).toBeGreaterThan(0);
    }
  });
});
