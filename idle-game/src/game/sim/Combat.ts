import type { Rng } from "../../core/math/Rng";
import type { GameState } from "../state/GameState";
import { isBossStage } from "../data/stageDefs";
import { xpToNextLevel } from "../data/heroDefs";
import { SALVAGE_ALLOY, type GearItem, type Rarity } from "../data/gearDefs";
import { BALANCE, KILLS_PER_STAGE, damageMitigation, enemyAtkFor, enemyHpFor, essenceRewardFor, goldRewardFor } from "./Economy";
import { effectiveHeroStats, heroDps, type EffectiveStats } from "./HeroStats";
import { isBetterGear, rollGear } from "./GearRoll";

export type CombatEventType =
  | "kill"
  | "bossKill"
  | "stageAdvance"
  | "heroDeath"
  | "levelUp"
  | "gearDrop";

export interface CombatEvent {
  type: CombatEventType;
  stage?: number;
  toLevel?: number;
  rarity?: Rarity;
  equipped?: boolean;
}

export interface TickResult {
  state: GameState;
  events: CombatEvent[];
  kills: number;
  goldGained: number;
  essenceGained: number;
  itemsFound: number;
  itemsEquipped: number;
  simulatedSeconds: number;
}

const EPSILON = 1e-9;
/** Passive HP regen, as a fraction of max HP per second — lets a hero who
 * matches (or outpaces) a stage farm it indefinitely instead of slowly
 * bleeding out mid-wave from chip damage with no recovery between kills. */
const HP_REGEN_FRACTION = 0.03;
/** Safety valve: bounds work per call even for pathological (near-zero TTK,
 * many-hour offline) inputs. Each step resolves at most one wave/boss. */
const MAX_STEPS = 200_000;
const GEAR_DROP_CHANCE = 0.035;
const BOSS_GEAR_DROPS = 2;
/** Past this many rolled items in one call, further drops are settled as
 * expected-value Alloy instead of full item rolls (perf/memory guard for
 * extreme offline fast-forwards; equip-upgrades are negligibly rare by then). */
const MAX_ITEM_ROLLS_PER_TICK = 400;
const EXPECTED_ALLOY_PER_DROP =
  Object.values(SALVAGE_ALLOY).reduce((a, b) => a + b, 0) / Object.values(SALVAGE_ALLOY).length;

function cloneState(state: GameState): GameState {
  return { ...state, upgrades: state.upgrades, gear: { ...state.gear } };
}

/** Grant essence, applying as many level-ups as it covers. Returns true if at
 * least one level-up occurred. */
function grantEssence(s: GameState, amount: number): boolean {
  s.heroXp += amount;
  let leveled = false;
  let need = xpToNextLevel(s.heroLevel);
  while (s.heroXp >= need) {
    s.heroXp -= need;
    s.heroLevel += 1;
    leveled = true;
    need = xpToNextLevel(s.heroLevel);
  }
  return leveled;
}

function bumpHighWaterMark(s: GameState): void {
  if (s.stage > s.highestStageReached) s.highestStageReached = s.stage;
  if (s.stage > s.lifetimeHighestStage) s.lifetimeHighestStage = s.stage;
}

function applyDeath(s: GameState, events: CombatEvent[]): void {
  s.stage = Math.max(1, s.stage - BALANCE.deathRetreatStages);
  s.killsInStage = 0;
  s.enemyHp = enemyHpFor(s.stage, false);
  s.heroHp = effectiveHeroStats(s).hp;
  events.push({ type: "heroDeath", stage: s.stage });
}

function rollAndResolveDrops(
  s: GameState,
  count: number,
  rng: Rng,
  result: { itemsFound: number; itemsEquipped: number },
  events: CombatEvent[],
): void {
  for (let i = 0; i < count; i++) {
    if (result.itemsFound >= MAX_ITEM_ROLLS_PER_TICK) {
      // Expected-value fallback: skip the roll, credit average salvage Alloy.
      s.alloy += EXPECTED_ALLOY_PER_DROP;
      result.itemsFound++;
      continue;
    }
    const item: GearItem = rollGear(s.stage, rng, s.nextGearId);
    s.nextGearId += 1;
    result.itemsFound++;
    const current = s.gear[item.slot];
    if (isBetterGear(item, current)) {
      if (current) s.alloy += SALVAGE_ALLOY[current.rarity];
      s.gear = { ...s.gear, [item.slot]: item };
      result.itemsEquipped++;
      events.push({ type: "gearDrop", rarity: item.rarity, equipped: true });
    } else {
      s.alloy += SALVAGE_ALLOY[item.rarity];
      events.push({ type: "gearDrop", rarity: item.rarity, equipped: false });
    }
  }
}

/**
 * Advance the idle battle by `dtSeconds` of wall-clock time. Deterministic
 * given the same `rng` stream, so it doubles as both the live per-frame tick
 * and the offline catch-up fast-forward (called once with a large dt).
 *
 * Non-boss kills are resolved in per-wave batches (not per-kill) so an
 * arbitrarily large dt — an 8-hour offline return — costs O(waves crossed),
 * not O(enemies killed).
 */
export function simulateTick(state: GameState, dtSeconds: number, rng: Rng): TickResult {
  const s = cloneState(state);
  const events: CombatEvent[] = [];
  const dropTally = { itemsFound: 0, itemsEquipped: 0 };
  let remaining = Math.max(0, dtSeconds);
  let goldGained = 0;
  let essenceGained = 0;
  let kills = 0;
  let steps = 0;

  let eff: EffectiveStats = effectiveHeroStats(s);
  if (s.enemyHp <= 0) s.enemyHp = enemyHpFor(s.stage, false);
  if (s.heroHp <= 0) s.heroHp = eff.hp;
  if (s.heroHp > eff.hp) s.heroHp = eff.hp;

  while (remaining > EPSILON && steps < MAX_STEPS) {
    steps++;
    const bossEncounter = isBossStage(s.stage) && s.killsInStage >= KILLS_PER_STAGE;
    const dps = heroDps(eff);
    if (dps <= 0) break; // Should never happen (base attack is always > 0).
    const rawIncoming = enemyAtkFor(s.stage, bossEncounter) * damageMitigation(eff.def);
    const incoming = Math.max(0, rawIncoming - eff.hp * HP_REGEN_FRACTION);
    const survivalTime = incoming > 0 ? s.heroHp / incoming : Infinity;

    if (bossEncounter) {
      const ttk = s.enemyHp / dps;
      const step = Math.min(remaining, ttk, survivalTime);
      s.enemyHp -= dps * step;
      s.heroHp -= incoming * step;
      remaining -= step;
      if (s.heroHp <= EPSILON) {
        applyDeath(s, events);
        eff = effectiveHeroStats(s);
        continue;
      }
      if (s.enemyHp <= EPSILON) {
        const gold = goldRewardFor(s.stage, true) * (1 + eff.goldFind);
        const essence = essenceRewardFor(s.stage, true) * (1 + eff.essenceFind);
        goldGained += gold;
        essenceGained += essence;
        s.gold += gold;
        kills += 1;
        s.totalKills += 1;
        events.push({ type: "bossKill", stage: s.stage });
        rollAndResolveDrops(s, BOSS_GEAR_DROPS, rng, dropTally, events);
        s.stage += 1;
        s.killsInStage = 0;
        s.enemyHp = enemyHpFor(s.stage, false);
        bumpHighWaterMark(s);
        events.push({ type: "stageAdvance", stage: s.stage });
        if (grantEssence(s, essence)) {
          events.push({ type: "levelUp", toLevel: s.heroLevel });
          eff = effectiveHeroStats(s);
        }
        s.heroHp = Math.min(s.heroHp, eff.hp);
      }
      continue;
    }

    // Regular wave: batch as many identical kills as remaining time / hero
    // survival / the wave itself allow, in one arithmetic step.
    const freshHp = enemyHpFor(s.stage, false);
    const ttkCurrent = s.enemyHp / dps;
    const ttkFresh = freshHp / dps;
    const killsLeftInWave = KILLS_PER_STAGE - s.killsInStage;

    let n = 0;
    if (remaining >= ttkCurrent) {
      n = 1 + Math.max(0, Math.floor((remaining - ttkCurrent) / ttkFresh));
      n = Math.min(n, killsLeftInWave);
    }
    if (n > 0 && survivalTime < remaining) {
      if (survivalTime < ttkCurrent) {
        n = 0;
      } else {
        n = Math.min(n, 1 + Math.floor((survivalTime - ttkCurrent) / ttkFresh));
      }
    }

    if (n <= 0) {
      // Neither a kill nor the wave clears within what's left: consume the
      // shorter of "time runs out" or "hero dies" and stop (or loop again
      // after a death, which heals and may change the maths).
      const step = Math.min(remaining, survivalTime);
      s.enemyHp -= dps * step;
      s.heroHp -= incoming * step;
      remaining -= step;
      if (s.heroHp <= EPSILON) {
        applyDeath(s, events);
        eff = effectiveHeroStats(s);
        continue;
      }
      break;
    }

    const batchTime = ttkCurrent + Math.max(0, n - 1) * ttkFresh;
    remaining -= batchTime;
    s.heroHp -= incoming * batchTime;
    const gold = goldRewardFor(s.stage, false) * (1 + eff.goldFind) * n;
    const essence = essenceRewardFor(s.stage, false) * (1 + eff.essenceFind) * n;
    goldGained += gold;
    essenceGained += essence;
    s.gold += gold;
    kills += n;
    s.totalKills += n;
    events.push({ type: "kill", stage: s.stage });

    const dropChanceTotal = n * GEAR_DROP_CHANCE;
    const dropCount = Math.max(0, Math.round(dropChanceTotal + rng.range(-0.5, 0.5)));
    if (dropCount > 0) rollAndResolveDrops(s, dropCount, rng, dropTally, events);

    s.killsInStage += n;
    if (s.killsInStage >= KILLS_PER_STAGE) {
      if (isBossStage(s.stage)) {
        s.enemyHp = enemyHpFor(s.stage, true);
      } else {
        s.stage += 1;
        s.killsInStage = 0;
        s.enemyHp = enemyHpFor(s.stage, false);
        bumpHighWaterMark(s);
        events.push({ type: "stageAdvance", stage: s.stage });
      }
    } else {
      s.enemyHp = freshHp;
    }

    if (grantEssence(s, essence)) {
      events.push({ type: "levelUp", toLevel: s.heroLevel });
      eff = effectiveHeroStats(s);
    }
    s.heroHp = Math.min(s.heroHp, eff.hp);

    if (s.heroHp <= EPSILON) {
      applyDeath(s, events);
      eff = effectiveHeroStats(s);
    }
  }

  return {
    state: s,
    events,
    kills,
    goldGained,
    essenceGained,
    itemsFound: dropTally.itemsFound,
    itemsEquipped: dropTally.itemsEquipped,
    simulatedSeconds: dtSeconds - Math.max(0, remaining),
  };
}
