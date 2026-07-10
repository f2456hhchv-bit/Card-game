import { createDefaultState, SAVE_VERSION, type GameState } from "../state/GameState";
import { GEAR_SLOTS, RARITIES, SLOT_STAT_POOL, type GearItem } from "../data/gearDefs";

const SAVE_KEY = "vanguard.save.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Defensive load: anything short of "parses to an object with the fields we
 * need" falls back to a fresh save rather than throwing and stranding the
 * player on a blank screen. Unknown/future fields are dropped; missing ones
 * are filled from defaults, so old saves keep working across small schema
 * additions without an explicit migration step.
 */
export function loadState(): GameState {
  let raw: string | null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch {
    return createDefaultState();
  }
  if (!raw) return createDefaultState();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return createDefaultState();
    return migrate(parsed);
  } catch {
    return createDefaultState();
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private browsing, quota) — losing the
    // save is better than crashing the tab.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore.
  }
}

/** Fold a loosely-typed parsed blob onto a fresh default state, field by
 * field, so partial/corrupt saves degrade gracefully instead of failing. */
function migrate(parsed: Record<string, unknown>): GameState {
  const base = createDefaultState();
  const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

  base.version = SAVE_VERSION;
  base.createdAt = num(parsed.createdAt, base.createdAt);
  base.lastSeenAt = num(parsed.lastSeenAt, base.lastSeenAt);
  base.stage = Math.max(1, num(parsed.stage, base.stage));
  base.killsInStage = Math.max(0, num(parsed.killsInStage, base.killsInStage));
  base.enemyHp = Math.max(0, num(parsed.enemyHp, base.enemyHp));
  base.heroHp = Math.max(0, num(parsed.heroHp, base.heroHp));
  base.heroLevel = Math.max(1, num(parsed.heroLevel, base.heroLevel));
  base.heroXp = Math.max(0, num(parsed.heroXp, base.heroXp));
  base.gold = Math.max(0, num(parsed.gold, base.gold));
  base.alloy = Math.max(0, num(parsed.alloy, base.alloy));
  base.afterglow = Math.max(0, num(parsed.afterglow, base.afterglow));
  base.highestStageReached = Math.max(base.stage, num(parsed.highestStageReached, base.highestStageReached));
  base.lifetimeHighestStage = Math.max(
    base.highestStageReached,
    num(parsed.lifetimeHighestStage, base.lifetimeHighestStage),
  );
  base.totalKills = Math.max(0, num(parsed.totalKills, base.totalKills));
  base.rebirths = Math.max(0, num(parsed.rebirths, base.rebirths));
  base.nextGearId = Math.max(1, num(parsed.nextGearId, base.nextGearId));

  if (isRecord(parsed.upgrades)) {
    const upgrades: Record<string, number> = {};
    for (const [id, level] of Object.entries(parsed.upgrades)) {
      if (typeof level === "number" && Number.isFinite(level) && level > 0) upgrades[id] = level;
    }
    base.upgrades = upgrades;
  }

  if (isRecord(parsed.gear)) {
    for (const slot of GEAR_SLOTS) {
      const item = parsed.gear[slot];
      const validStats: readonly string[] = SLOT_STAT_POOL[slot];
      if (
        isRecord(item) &&
        item.slot === slot &&
        typeof item.id === "string" &&
        typeof item.rarity === "string" &&
        (RARITIES as readonly string[]).includes(item.rarity) &&
        typeof item.stat === "string" &&
        validStats.includes(item.stat)
      ) {
        const parsedItem: GearItem = {
          id: item.id,
          slot,
          rarity: item.rarity as GearItem["rarity"],
          stat: item.stat as GearItem["stat"],
          name: typeof item.name === "string" ? item.name : "",
          baseValue: num(item.baseValue, 0),
          enhanceLevel: Math.max(0, num(item.enhanceLevel, 0)),
          foundAtStage: Math.max(1, num(item.foundAtStage, 1)),
        };
        base.gear[slot] = parsedItem;
      }
    }
  }

  if (isRecord(parsed.settings)) {
    base.settings.reducedMotion = parsed.settings.reducedMotion === true;
  }

  return base;
}
