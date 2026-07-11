import type { BossDef } from "../types";
import { BIOMES } from "./biomes";

/** 6 main bosses, one per biome, headlining every 10th wave (cycling through
 * biome order as the run goes on). Each has a small phase script keyed by
 * remaining-hp fraction so the fight visibly escalates. */
export const BOSS_DEFS: BossDef[] = [
  {
    id: "fractureKing",
    name: "The Fracture King",
    biome: "asteroidBelt",
    hp: 2000,
    contactDamage: 32,
    moveSpeed: 70,
    xpValue: 280,
    radius: 60,
    shape: {
      kind: "star",
      sides: 7,
      radius: 60,
      colorPrimary: BIOMES.asteroidBelt.colorPrimary,
      colorSecondary: BIOMES.asteroidBelt.colorSecondary,
      glowColor: BIOMES.asteroidBelt.glowColor,
    },
    phases: [
      { hpThreshold: 1, behavior: "summon", behaviorParams: { summonInterval: 5, summonDefId: "rockSkitterer", summonCount: 2 } },
      { hpThreshold: 0.6, behavior: "dashCharge", behaviorParams: { dashInterval: 2.6, dashSpeedMult: 3.2, dashTelegraph: 0.5 } },
      { hpThreshold: 0.25, behavior: "erraticChase", behaviorParams: { jitter: 0.5 } },
    ],
  },
  {
    id: "hollowBloom",
    name: "The Hollow Bloom",
    biome: "nebulaDrift",
    hp: 1900,
    contactDamage: 26,
    moveSpeed: 55,
    xpValue: 270,
    radius: 56,
    shape: {
      kind: "polygon",
      sides: 8,
      radius: 56,
      colorPrimary: BIOMES.nebulaDrift.colorPrimary,
      colorSecondary: BIOMES.nebulaDrift.colorSecondary,
      glowColor: BIOMES.nebulaDrift.glowColor,
    },
    phases: [
      { hpThreshold: 1, behavior: "summon", behaviorParams: { summonInterval: 4.5, summonDefId: "sporeDrifter", summonCount: 2 } },
      { hpThreshold: 0.55, behavior: "auraPulse", behaviorParams: { auraRadius: 140, auraInterval: 1.2, auraDamage: 10 } },
    ],
  },
  {
    id: "cryoLeviathan",
    name: "Cryo Leviathan",
    biome: "iceField",
    hp: 2200,
    contactDamage: 34,
    moveSpeed: 65,
    xpValue: 300,
    radius: 64,
    shape: {
      kind: "diamond",
      radius: 64,
      colorPrimary: BIOMES.iceField.colorPrimary,
      colorSecondary: BIOMES.iceField.colorSecondary,
      glowColor: BIOMES.iceField.glowColor,
    },
    phases: [
      {
        hpThreshold: 1,
        behavior: "orbitRanged",
        behaviorParams: { preferredRange: 300, fireInterval: 0.8, projectileSpeed: 300, projectileDamage: 9, spreadCount: 6 },
      },
      { hpThreshold: 0.6, behavior: "dashCharge", behaviorParams: { dashInterval: 2.2, dashSpeedMult: 3.6, dashTelegraph: 0.5 } },
      {
        hpThreshold: 0.25,
        behavior: "shieldBurst",
        behaviorParams: { shieldInterval: 3, shieldDuration: 1.2, fireInterval: 0.6, projectileSpeed: 320, projectileDamage: 8, spreadCount: 8 },
      },
    ],
  },
  {
    id: "pyroclast",
    name: "Pyroclast",
    biome: "volcanicMoon",
    hp: 2100,
    contactDamage: 36,
    moveSpeed: 60,
    xpValue: 290,
    radius: 62,
    shape: {
      kind: "triangle",
      radius: 62,
      colorPrimary: BIOMES.volcanicMoon.colorPrimary,
      colorSecondary: BIOMES.volcanicMoon.colorSecondary,
      glowColor: BIOMES.volcanicMoon.glowColor,
    },
    phases: [
      {
        hpThreshold: 1,
        behavior: "chaseRanged",
        behaviorParams: { preferredRange: 320, fireInterval: 1.0, projectileSpeed: 220, projectileDamage: 14 },
      },
      { hpThreshold: 0.5, behavior: "dashCharge", behaviorParams: { dashInterval: 2.0, dashSpeedMult: 4, dashTelegraph: 0.45 } },
    ],
  },
  {
    id: "theHusk",
    name: "The Husk",
    biome: "derelictStation",
    hp: 2300,
    contactDamage: 30,
    moveSpeed: 50,
    xpValue: 310,
    radius: 60,
    shape: {
      kind: "polygon",
      sides: 5,
      radius: 60,
      colorPrimary: BIOMES.derelictStation.colorPrimary,
      colorSecondary: BIOMES.derelictStation.colorSecondary,
      glowColor: BIOMES.derelictStation.glowColor,
    },
    phases: [
      { hpThreshold: 1, behavior: "summon", behaviorParams: { summonInterval: 5, summonDefId: "rustDrone", summonCount: 3 } },
      {
        hpThreshold: 0.55,
        behavior: "orbitRanged",
        behaviorParams: { preferredRange: 260, fireInterval: 0.6, projectileSpeed: 340, projectileDamage: 9, spreadCount: 5 },
      },
    ],
  },
  {
    id: "theUnmaker",
    name: "The Unmaker",
    biome: "voidRift",
    hp: 2600,
    contactDamage: 38,
    moveSpeed: 70,
    xpValue: 380,
    radius: 66,
    shape: {
      kind: "star",
      sides: 9,
      radius: 66,
      colorPrimary: BIOMES.voidRift.colorPrimary,
      colorSecondary: BIOMES.voidRift.colorSecondary,
      glowColor: BIOMES.voidRift.glowColor,
    },
    phases: [
      { hpThreshold: 1, behavior: "summon", behaviorParams: { summonInterval: 4, summonDefId: "nullWraith", summonCount: 3 } },
      { hpThreshold: 0.6, behavior: "auraPulse", behaviorParams: { auraRadius: 160, auraInterval: 1.0, auraDamage: 12 } },
      { hpThreshold: 0.25, behavior: "dashCharge", behaviorParams: { dashInterval: 1.8, dashSpeedMult: 4.4, dashTelegraph: 0.4 } },
    ],
  },
];

export function getBossDef(id: string): BossDef {
  const def = BOSS_DEFS.find((b) => b.id === id);
  if (!def) throw new Error(`Unknown boss id: ${id}`);
  return def;
}

export const BOSS_ORDER = BOSS_DEFS.map((b) => b.id);
