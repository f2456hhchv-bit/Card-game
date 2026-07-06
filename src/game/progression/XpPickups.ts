/**
 * Physical XP pickups (AF-022 §2): one pooled system, seven tiers, magnet
 * acceleration, auto/manual collection, and density coalescing — beyond the
 * live cap the oldest gems merge into one, so value is never lost.
 */
import { Pool } from "../../core/pool/Pool";
import type { XpTier, XpTuning } from "./xpTuning";

export interface XpPickup {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  tier: XpTier;
  value: number;
  live: boolean;
}

export interface CollectionRadii {
  pickupRadius: number;
  magnetRadius: number;
}

export class XpPickups {
  private readonly pool = new Pool<XpPickup>({
    create: () => ({ x: 0, y: 0, velocityX: 0, velocityY: 0, tier: "small", value: 0, live: false }),
    reset: (p) => {
      p.live = false;
      p.velocityX = 0;
      p.velocityY = 0;
    },
  });
  private pickups: XpPickup[] = [];

  constructor(
    private readonly tuning: XpTuning,
    private readonly onCollected: (value: number, tier: XpTier) => void,
  ) {}

  spawn(tier: XpTier, x: number, y: number, valueOverride?: number): void {
    const pickup = this.pool.acquire();
    pickup.x = x;
    pickup.y = y;
    pickup.tier = tier;
    pickup.value = valueOverride ?? this.tuning.tierValues[tier];
    pickup.live = true;
    this.pickups.push(pickup);

    // Density coalescing: merge the two oldest into one (value preserved).
    if (this.pickups.length > this.tuning.maxLivePickups) {
      const oldest = this.pickups[0];
      const second = this.pickups[1];
      if (oldest && second) {
        second.value += oldest.value;
        if (second.tier === "small") second.tier = "medium";
        oldest.live = false;
        this.pickups.shift();
        this.pool.release(oldest);
      }
    }
  }

  /** Fixed timestep: magnetism, motion, and collection. Deterministic. */
  update(fixedDtMs: number, playerX: number, playerY: number, radii: CollectionRadii): void {
    const dt = fixedDtMs / 1000;
    let write = 0;
    for (const pickup of this.pickups) {
      if (!pickup.live) continue;
      const dx = playerX - pickup.x;
      const dy = playerY - pickup.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= radii.pickupRadius) {
        this.onCollected(pickup.value, pickup.tier);
        pickup.live = false;
        this.pool.release(pickup);
        continue;
      }

      if (distance <= radii.magnetRadius && distance > 0.001) {
        const acceleration = this.tuning.magnetAccelerationPerSecond * dt;
        pickup.velocityX += (dx / distance) * acceleration;
        pickup.velocityY += (dy / distance) * acceleration;
        const speed = Math.hypot(pickup.velocityX, pickup.velocityY);
        if (speed > this.tuning.magnetMaxSpeed) {
          const clamp = this.tuning.magnetMaxSpeed / speed;
          pickup.velocityX *= clamp;
          pickup.velocityY *= clamp;
        }
      }

      pickup.x += pickup.velocityX * dt;
      pickup.y += pickup.velocityY * dt;
      this.pickups[write] = pickup;
      write += 1;
    }
    this.pickups.length = write;
  }

  get live(): readonly XpPickup[] {
    return this.pickups;
  }

  clear(): void {
    for (const pickup of this.pickups) {
      pickup.live = false;
      this.pool.release(pickup);
    }
    this.pickups.length = 0;
  }
}
