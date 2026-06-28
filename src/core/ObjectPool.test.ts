import { describe, it, expect } from "vitest";
import { ObjectPool } from "./ObjectPool";

interface Box {
  value: number;
}

describe("ObjectPool", () => {
  it("prewarms the requested number of instances", () => {
    const pool = new ObjectPool<Box>(() => ({ value: 0 }), undefined, 5);
    expect(pool.freeCount).toBe(5);
    expect(pool.totalCreated).toBe(5);
  });

  it("reuses released instances instead of allocating", () => {
    const pool = new ObjectPool<Box>(() => ({ value: 0 }), undefined, 1);
    const a = pool.obtain();
    expect(pool.totalCreated).toBe(1);
    pool.release(a);
    const b = pool.obtain();
    expect(b).toBe(a); // same instance reused
    expect(pool.totalCreated).toBe(1);
  });

  it("allocates a new instance when the pool is empty", () => {
    const pool = new ObjectPool<Box>(() => ({ value: 0 }));
    const a = pool.obtain();
    const b = pool.obtain();
    expect(a).not.toBe(b);
    expect(pool.totalCreated).toBe(2);
  });

  it("runs the reset hook on release", () => {
    const pool = new ObjectPool<Box>(
      () => ({ value: 1 }),
      (b) => (b.value = 0),
    );
    const a = pool.obtain();
    a.value = 99;
    pool.release(a);
    expect(a.value).toBe(0);
  });
});
