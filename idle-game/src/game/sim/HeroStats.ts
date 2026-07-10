import { statsAtLevel } from "../data/heroDefs";
import { GEAR_SLOTS, gearEffectiveValue, type GearItem, type GearSlot, type GearStat } from "../data/gearDefs";
import { UPGRADES, upgradeCost, type UpgradeDef } from "../data/upgradeDefs";
import { powerMultiplier } from "../data/prestigeDefs";
import type { GameState } from "../state/GameState";

export interface EffectiveStats {
  hp: number;
  atk: number;
  def: number;
  critChance: number;
  critMulti: number;
  attacksPerSecond: number;
  goldFind: number;
  essenceFind: number;
}

const CRIT_CHANCE_CAP = 0.75;
const ATTACK_SPEED_CAP = 3;

function upgradeLevel(state: GameState, id: string): number {
  return state.upgrades[id] ?? 0;
}

function upgradeBonus(state: GameState, def: UpgradeDef): number {
  return def.valuePerLevel * upgradeLevel(state, def.id);
}

function upgradeFor(stat: UpgradeDef["stat"]): UpgradeDef | undefined {
  return UPGRADES.find((u) => u.stat === stat);
}

function gearBonusFor(gear: Record<GearSlot, GearItem | null>, stat: GearStat): number {
  let total = 0;
  for (const slot of GEAR_SLOTS) {
    const item = gear[slot];
    if (item && item.stat === stat) total += gearEffectiveValue(item);
  }
  return total;
}

/** Combine hero level, shop upgrades, equipped gear and prestige power into
 * the final stat block the combat sim runs on. */
export function effectiveHeroStats(state: GameState): EffectiveStats {
  const base = statsAtLevel(state.heroLevel);
  const power = powerMultiplier(state.afterglow);

  const atkPercent = upgradeFor("atk");
  const defPercent = upgradeFor("def");
  const hpPercent = upgradeFor("hp");
  const critChanceUp = upgradeFor("critChance");
  const critMultiUp = upgradeFor("critMulti");
  const speedUp = upgradeFor("attacksPerSecond");
  const goldUp = upgradeFor("goldFind");
  const essenceUp = upgradeFor("essenceFind");

  const atkWithGear = base.atk + gearBonusFor(state.gear, "atk");
  const defWithGear = base.def + gearBonusFor(state.gear, "def");
  const hpWithGear = base.hp + gearBonusFor(state.gear, "hp");

  const atk = atkWithGear * (1 + (atkPercent ? upgradeBonus(state, atkPercent) : 0)) * power;
  const def = defWithGear * (1 + (defPercent ? upgradeBonus(state, defPercent) : 0)) * power;
  const hp = hpWithGear * (1 + (hpPercent ? upgradeBonus(state, hpPercent) : 0)) * power;

  const critChance = Math.min(
    CRIT_CHANCE_CAP,
    base.critChance + gearBonusFor(state.gear, "critChance") + (critChanceUp ? upgradeBonus(state, critChanceUp) : 0),
  );
  const critMulti =
    base.critMulti + gearBonusFor(state.gear, "critMulti") + (critMultiUp ? upgradeBonus(state, critMultiUp) : 0);
  const attacksPerSecond = Math.min(
    ATTACK_SPEED_CAP,
    base.attacksPerSecond + (speedUp ? upgradeBonus(state, speedUp) : 0),
  );
  const goldFind = gearBonusFor(state.gear, "goldFind") + (goldUp ? upgradeBonus(state, goldUp) : 0);
  const essenceFind = gearBonusFor(state.gear, "essenceFind") + (essenceUp ? upgradeBonus(state, essenceUp) : 0);

  return { hp, atk, def, critChance, critMulti, attacksPerSecond, goldFind, essenceFind };
}

/** Expected damage per second, folding crit chance/damage into one average. */
export function heroDps(eff: EffectiveStats): number {
  return eff.atk * eff.attacksPerSecond * (1 + eff.critChance * (eff.critMulti - 1));
}

export { upgradeCost };
