import { describe, it, expect } from "vitest";
import { SpatialHashGrid, type SpatialEntity } from "./SpatialHashGrid";

function ent(x: number, y: number, radius = 5): SpatialEntity {
  return { x, y, radius, active: true };
}

describe("SpatialHashGrid", () => {
  it("returns entities within the query radius", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(50);
    const near = ent(10, 10);
    const far = ent(500, 500);
    grid.insert(near);
    grid.insert(far);
    const results = grid.query(0, 0, 60);
    expect(results).toContain(near);
    expect(results).not.toContain(far);
  });

  it("ignores inactive entities on insert", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(50);
    const dead = ent(10, 10);
    dead.active = false;
    grid.insert(dead);
    expect(grid.query(0, 0, 100)).not.toContain(dead);
  });

  it("findNearest picks the closest entity", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(40);
    const a = ent(30, 0);
    const b = ent(100, 0);
    const c = ent(10, 0);
    [a, b, c].forEach((e) => grid.insert(e));
    expect(grid.findNearest(0, 0, 200)).toBe(c);
  });

  it("findNearest returns null when nothing is in range", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(40);
    grid.insert(ent(1000, 1000));
    expect(grid.findNearest(0, 0, 50)).toBeNull();
  });

  it("clear empties the grid", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(40);
    grid.insert(ent(5, 5));
    grid.clear();
    expect(grid.query(0, 0, 100).length).toBe(0);
  });

  it("handles negative coordinates", () => {
    const grid = new SpatialHashGrid<SpatialEntity>(32);
    const e = ent(-120, -80);
    grid.insert(e);
    expect(grid.query(-120, -80, 10)).toContain(e);
  });
});
