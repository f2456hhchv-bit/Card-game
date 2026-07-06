/**
 * Pooled ground loot (AF-023 §6). Drops sit under rarity beams until
 * collected. Value-preserving cap: overflow banks the oldest lowest-rarity
 * drop to the Results summary (storage, not a decision); Legendary+ never
 * banks — the memorable beam stays on the field until claimed.
 */
import { Pool } from "../../core/pool/Pool";
import { RARITY_LADDER, type LootTuning } from "./lootTuning";
import type { LootDrop } from "./LootGenerator";

export interface GroundDrop {
  x: number;
  y: number;
  drop: LootDrop | null;
  live: boolean;
}

export class GroundLoot {
  private readonly pool = new Pool<GroundDrop>({
    create: () => ({ x: 0, y: 0, drop: null, live: false }),
    reset: (g) => {
      g.live = false;
      g.drop = null;
    },
  });
  private drops: GroundDrop[] = [];

  constructor(
    private readonly tuning: LootTuning,
    private readonly onCollected: (drop: LootDrop) => void,
    private readonly onBanked: (drop: LootDrop) => void,
  ) {}

  place(drop: LootDrop, x: number, y: number): void {
    const ground = this.pool.acquire();
    ground.x = x;
    ground.y = y;
    ground.drop = drop;
    ground.live = true;
    this.drops.push(ground);

    if (this.drops.length > this.tuning.maxGroundLoot) this.bankOne();
  }

  /** Collection by proximity — fixed timestep. */
  update(playerX: number, playerY: number, pickupRadius: number): void {
    let write = 0;
    for (const ground of this.drops) {
      if (!ground.live || !ground.drop) continue;
      if (Math.hypot(playerX - ground.x, playerY - ground.y) <= pickupRadius) {
        this.onCollected(ground.drop);
        ground.live = false;
        this.pool.release(ground);
        continue;
      }
      this.drops[write] = ground;
      write += 1;
    }
    this.drops.length = write;
  }

  get live(): readonly GroundDrop[] {
    return this.drops;
  }

  clear(): void {
    for (const ground of this.drops) {
      ground.live = false;
      this.pool.release(ground);
    }
    this.drops.length = 0;
  }

  private bankOne(): void {
    const bankFloor = RARITY_LADDER.indexOf(this.tuning.neverBankAtOrAbove);
    let bestIndex = -1;
    let bestTier = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.drops.length; i += 1) {
      const drop = this.drops[i]?.drop;
      if (!drop) continue;
      const tier = RARITY_LADDER.indexOf(drop.rarity);
      if (tier >= bankFloor) continue; // Legendary+ never banks
      if (tier < bestTier) {
        bestTier = tier;
        bestIndex = i;
        if (tier === 0) break;
      }
    }
    if (bestIndex < 0) return; // field full of Legendary+ — cap yields to the moment
    const ground = this.drops[bestIndex] as GroundDrop;
    if (ground.drop) this.onBanked(ground.drop);
    ground.live = false;
    this.pool.release(ground);
    this.drops.splice(bestIndex, 1);
  }
}
