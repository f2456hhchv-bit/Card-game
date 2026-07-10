import type { GearStat } from "./gearDefs";

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  stat: GearStat | "attacksPerSecond";
  baseCost: number;
  costGrowth: number;
  /** Amount added per purchased level — percentage if `isPercent`, else flat. */
  valuePerLevel: number;
  isPercent: boolean;
  maxLevel?: number;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: "fortifyBlade",
    name: "Overcharge Cannons",
    desc: "Permanently increase Attack.",
    stat: "atk",
    baseCost: 10,
    costGrowth: 1.15,
    valuePerLevel: 0.04,
    isPercent: true,
  },
  {
    id: "ironHide",
    name: "Reinforced Hull",
    desc: "Permanently increase Defense.",
    stat: "def",
    baseCost: 10,
    costGrowth: 1.15,
    valuePerLevel: 0.05,
    isPercent: true,
  },
  {
    id: "vitalBloom",
    name: "Core Capacitor",
    desc: "Permanently increase Max HP.",
    stat: "hp",
    baseCost: 8,
    costGrowth: 1.14,
    valuePerLevel: 0.05,
    isPercent: true,
  },
  {
    id: "keenEdge",
    name: "Targeting Array",
    desc: "Increase Crit Chance.",
    stat: "critChance",
    baseCost: 25,
    costGrowth: 1.2,
    valuePerLevel: 0.01,
    isPercent: false,
    maxLevel: 40,
  },
  {
    id: "brutalStrikes",
    name: "Overload Rounds",
    desc: "Increase Crit Damage.",
    stat: "critMulti",
    baseCost: 30,
    costGrowth: 1.2,
    valuePerLevel: 0.05,
    isPercent: false,
  },
  {
    id: "thrusterTuning",
    name: "Thruster Tuning",
    desc: "Increase Attack Speed.",
    stat: "attacksPerSecond",
    baseCost: 40,
    costGrowth: 1.22,
    valuePerLevel: 0.02,
    isPercent: false,
    maxLevel: 50,
  },
  {
    id: "prospectorsCharm",
    name: "Salvage Drone",
    desc: "Increase Light Motes Find.",
    stat: "goldFind",
    baseCost: 15,
    costGrowth: 1.18,
    valuePerLevel: 0.03,
    isPercent: false,
  },
  {
    id: "essenceAffinity",
    name: "Signal Amplifier",
    desc: "Increase Essence Gain.",
    stat: "essenceFind",
    baseCost: 15,
    costGrowth: 1.18,
    valuePerLevel: 0.03,
    isPercent: false,
  },
];

export function upgradeById(id: string): UpgradeDef | undefined {
  return UPGRADES.find((u) => u.id === id);
}

export function upgradeCost(def: UpgradeDef, currentLevel: number): number {
  return Math.ceil(def.baseCost * Math.pow(def.costGrowth, currentLevel));
}
