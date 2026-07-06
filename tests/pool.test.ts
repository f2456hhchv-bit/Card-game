import { describe, expect, it } from "vitest";
import { Pool } from "../src/core/pool/Pool";

interface Projectile {
  x: number;
  y: number;
  live: boolean;
}

describe("Pool", () => {
  it("reuses released instances instead of allocating", () => {
    const pool = new Pool<Projectile>({
      create: () => ({ x: 0, y: 0, live: false }),
      reset: (p) => {
        p.x = 0;
        p.y = 0;
        p.live = false;
      },
    });

    const first = pool.acquire();
    first.x = 99;
    first.live = true;
    pool.release(first);

    const second = pool.acquire();
    expect(second).toBe(first); // same instance recycled
    expect(second.x).toBe(0); // reset restored pristine state
    expect(second.live).toBe(false);
    expect(pool.createdCount).toBe(1);
    expect(pool.reusedCount).toBe(1);
  });

  it("pre-allocates initialSize instances", () => {
    const pool = new Pool({ create: () => ({}), initialSize: 8 });
    expect(pool.freeCount).toBe(8);
    expect(pool.createdCount).toBe(8);
  });

  it("drops releases beyond maxSize", () => {
    const pool = new Pool({ create: () => ({}), maxSize: 1 });
    const a = pool.acquire();
    const b = pool.acquire();
    pool.release(a);
    pool.release(b);
    expect(pool.freeCount).toBe(1);
  });
});
