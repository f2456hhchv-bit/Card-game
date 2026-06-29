import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";
import { GEAR_DEFS } from "../data/gearDefs";

describe("SaveManager — ship modules", () => {
  it("first drop of a module owns it at grade 1; further drops bank duplicates", () => {
    const sm = new SaveManager();
    // Force a deterministic module id by pre-seeding one as owned-but-fresh.
    // grantModuleDrop picks at random, so loop until both branches are hit.
    const first = sm.grantModuleDrop();
    expect(first.isNew).toBe(true);
    const m = sm.data.modules[first.id];
    expect(m.grade).toBe(1);
    expect(m.dupes).toBe(0);

    // Drops of the same id bank duplicates rather than re-granting.
    let dupeId: string | null = null;
    for (let i = 0; i < 200 && !dupeId; i++) {
      const d = sm.grantModuleDrop();
      if (!d.isNew && d.id === first.id) dupeId = d.id;
    }
    expect(dupeId).toBe(first.id);
    expect(sm.data.modules[first.id].dupes).toBeGreaterThan(0);
  });

  it("merging consumes the right number of dupes and raises the grade", () => {
    const sm = new SaveManager();
    const id = "plating";
    sm.data.modules[id] = { grade: 1, dupes: 0 };

    // Not enough dupes to merge (grade 1 costs 1).
    expect(sm.mergeModule(id)).toBeNull();

    sm.data.modules[id].dupes = 1;
    expect(sm.mergeModule(id)).toBe(2);
    expect(sm.data.modules[id].dupes).toBe(0);

    // Grade 2 → 3 costs 2.
    sm.data.modules[id].dupes = 5;
    expect(sm.mergeModule(id)).toBe(3);
    expect(sm.data.modules[id].dupes).toBe(3);
  });

  it("cannot merge past max grade", () => {
    const sm = new SaveManager();
    const id = "reactor";
    const max = GEAR_DEFS[id].maxGrade;
    sm.data.modules[id] = { grade: max, dupes: 99 };
    expect(sm.mergeModule(id)).toBeNull();
    expect(sm.data.modules[id].grade).toBe(max);
  });

  it("merging an unknown or unowned module is a no-op", () => {
    const sm = new SaveManager();
    expect(sm.mergeModule("nonexistent")).toBeNull();
    expect(sm.mergeModule("plating")).toBeNull(); // never dropped
  });
});
