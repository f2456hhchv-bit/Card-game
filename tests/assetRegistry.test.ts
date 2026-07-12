import { describe, expect, it } from "vitest";
import { ASSET_REGISTRY, derivedEntries, entriesByPipeline, sourceEntries } from "../src/game/assets/assetRegistry";
import { ASSET_PIPELINE_KINDS, ASSET_STATUSES, COLOUR_LAW_SUBSTITUTIONS } from "../src/game/assets/assetPipeline";

/**
 * DIRECTIVE — Asset Pipeline & Derivation Rules (binding, 2026-07-12).
 * Guards the registry's own structural laws: every entry belongs to
 * exactly one pipeline, every derived entry's parent actually exists, no
 * id collisions, and the derivation rules (§2) actually removed the
 * entries they were supposed to remove (ship thumbnails, enemy
 * move/attack/death, boss variants) rather than just adding a field.
 */
describe("DIRECTIVE §1 — every entry belongs to exactly one real pipeline", () => {
  it("every registry entry's pipeline is one of the three defined kinds", () => {
    for (const e of ASSET_REGISTRY) expect(ASSET_PIPELINE_KINDS).toContain(e.pipeline);
  });

  it("every registry entry's status is a real status", () => {
    for (const e of ASSET_REGISTRY) expect(ASSET_STATUSES).toContain(e.status);
  });

  it("ids are unique across the whole registry", () => {
    const ids = ASSET_REGISTRY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("DIRECTIVE §2 — derived assets are never separate source files", () => {
  it("every derived entry names a derivedFrom id that actually exists in the registry", () => {
    const ids = new Set(ASSET_REGISTRY.map((e) => e.id));
    for (const e of derivedEntries()) {
      expect(e.derivedFrom).toBeDefined();
      expect(ids.has(e.derivedFrom!)).toBe(true);
    }
  });

  it("no source entry carries a derivedFrom", () => {
    for (const e of sourceEntries()) expect(e.derivedFrom).toBeUndefined();
  });

  it("ship roster thumbnails are derived from the ship's own sprite, not a separate source", () => {
    const thumbnails = ASSET_REGISTRY.filter((e) => e.id.endsWith(":thumbnail") && e.category === "ships");
    expect(thumbnails.length).toBeGreaterThan(0);
    for (const t of thumbnails) {
      expect(t.sourceOrDerived).toBe("derived");
      expect(t.derivedFrom).toBe(t.id.replace(":thumbnail", ":sprite"));
    }
  });

  it("enemy move/attack/death are derived from idle — only idle is a real source asset per enemy", () => {
    const enemyEntries = ASSET_REGISTRY.filter((e) => e.category === "enemies");
    const idleCount = enemyEntries.filter((e) => e.id.endsWith(":idle")).length;
    const derivedStateCount = enemyEntries.filter((e) => /:(move|attack|death)$/.test(e.id)).length;
    expect(derivedStateCount).toBe(idleCount * 3);
    for (const e of enemyEntries) {
      if (/:(move|attack|death)$/.test(e.id)) {
        expect(e.sourceOrDerived).toBe("derived");
        expect(e.derivedFrom).toBe(e.id.replace(/:(move|attack|death)$/, ":idle"));
      } else {
        expect(e.sourceOrDerived).toBe("source");
      }
    }
  });

  it("boss variants (World Boss, Mini Boss) are derived from the base model, not separate models", () => {
    const bossModels = ASSET_REGISTRY.filter((e) => e.category === "boss" && e.id.endsWith(":model"));
    expect(bossModels.length).toBe(3); // base + world boss + mini boss
    const base = bossModels.find((e) => e.sourceOrDerived === "source")!;
    const variants = bossModels.filter((e) => e.sourceOrDerived === "derived");
    expect(variants).toHaveLength(2);
    for (const v of variants) expect(v.derivedFrom).toBe(base.id);
  });
});

describe("DIRECTIVE §4 — colour law", () => {
  it("Crystal Dominion keyed sprites are magenta-keyed; every other keyed entry defaults to green", () => {
    const crystalEnemyIdle = ASSET_REGISTRY.filter((e) => e.category === "enemies" && e.id.startsWith("crystal-") && e.pipeline === "keyed");
    expect(crystalEnemyIdle.length).toBeGreaterThan(0);
    for (const e of crystalEnemyIdle) expect(e.keyColour).toBe("magenta");
    const otherEnemyIdle = ASSET_REGISTRY.filter((e) => e.category === "enemies" && e.id.startsWith("outlaw-") && e.pipeline === "keyed");
    expect(otherEnemyIdle.length).toBeGreaterThan(0);
    for (const e of otherEnemyIdle) expect(e.keyColour).toBe("green");
  });

  it("EVERY keyed entry carries an explicit keyColour — no implicit 'blank means green' default", () => {
    for (const e of ASSET_REGISTRY) {
      if (e.pipeline === "keyed") expect(e.keyColour, `${e.id} has no explicit keyColour`).toBeDefined();
      else expect(e.keyColour, `${e.id} is ${e.pipeline} but carries a keyColour`).toBeUndefined();
    }
  });

  it("crystal-faction COMMANDERS are magenta-keyed like their faction's enemies — keying follows the art, not the category", () => {
    for (const id of ["vane-chord", "ur-sella-chorus", "sol-resonant"]) {
      for (const view of ["portrait", "sprite"]) {
        const entry = ASSET_REGISTRY.find((e) => e.id === `${id}:${view}`);
        expect(entry, `${id}:${view} missing`).toBeDefined();
        expect(entry!.keyColour, `${id}:${view} must be magenta-keyed`).toBe("magenta");
      }
    }
    // A non-crystal commander stays green-keyed.
    expect(ASSET_REGISTRY.find((e) => e.id === "reyes-longlight:sprite")!.keyColour).toBe("green");
  });

  it("other crystal-motif keyed art (crystal-growth entity, Crystal Dominion emblem) is magenta-keyed too", () => {
    expect(ASSET_REGISTRY.find((e) => e.id === "combat-entity:crystal-growth")!.keyColour).toBe("magenta");
    expect(ASSET_REGISTRY.find((e) => e.id === "faction-emblem:crystalDominion")!.keyColour).toBe("magenta");
  });

  it("registers the required green-to-substitution mapping for every named lore-green asset", () => {
    for (const key of ["regeneration", "poison", "toxic", "biomass"]) {
      expect(COLOUR_LAW_SUBSTITUTIONS[key]).toBeTruthy();
    }
  });
});

describe("DIRECTIVE — the true source-file count dropped substantially once derivation was applied", () => {
  it("derived entries are a real, substantial fraction of the registry (not a token few)", () => {
    expect(derivedEntries().length).toBeGreaterThan(150);
    expect(sourceEntries().length).toBeLessThan(ASSET_REGISTRY.length);
    expect(sourceEntries().length + derivedEntries().length).toBe(ASSET_REGISTRY.length);
  });

  it("pipeline totals add up to the whole registry", () => {
    const total = entriesByPipeline("keyed").length + entriesByPipeline("additive").length + entriesByPipeline("fullbleed").length;
    expect(total).toBe(ASSET_REGISTRY.length);
  });
});
