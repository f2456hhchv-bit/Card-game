import type { ShipDef } from "../types";

/** 5 starting ships, all available from the start. Each begins a run with one
 * weapon upgrade already at stack 1 (its id must exist in upgradeDefs.ts). */
export const SHIP_DEFS: ShipDef[] = [
  {
    id: "vanguard",
    name: "Vanguard",
    tagline: "Balanced all-rounder. A steady hand for any biome.",
    baseHp: 120,
    baseMoveSpeed: 230,
    baseDamageMult: 1,
    baseFireRateMult: 1,
    weaponId: "pulseCannon",
    passiveDescription: "No weaknesses, no specialties — just reliable.",
    passive: {},
    shape: { kind: "triangle", radius: 22, colorPrimary: "#6fd7ff", colorSecondary: "#1c6fa8", glowColor: "#c9f6ff" },
  },
  {
    id: "sparrow",
    name: "Sparrow",
    tagline: "Light scout hull. Fast, fragile, relentless.",
    baseHp: 80,
    baseMoveSpeed: 300,
    baseDamageMult: 0.9,
    baseFireRateMult: 1.15,
    weaponId: "scatterBlast",
    passiveDescription: "+15% fire rate, but a thin hull.",
    passive: { fireRateMult: 0.05 },
    shape: { kind: "triangle", radius: 18, colorPrimary: "#ffe08a", colorSecondary: "#a8791c" },
  },
  {
    id: "warhawk",
    name: "Warhawk",
    tagline: "Heavy tank hull. Slow, but hits like a moon.",
    baseHp: 180,
    baseMoveSpeed: 175,
    baseDamageMult: 1.15,
    baseFireRateMult: 0.9,
    weaponId: "flakBattery",
    passiveDescription: "+2 flat armor, but sluggish thrusters.",
    passive: { armorFlat: 2 },
    shape: { kind: "diamond", radius: 24, colorPrimary: "#ff8fe0", colorSecondary: "#9a2c86" },
  },
  {
    id: "specter",
    name: "Specter",
    tagline: "Stealth interceptor. Evasive, precise, unforgiving.",
    baseHp: 85,
    baseMoveSpeed: 260,
    baseDamageMult: 1,
    baseFireRateMult: 1,
    weaponId: "seekerMissiles",
    passiveDescription: "+10% critical chance from the outset.",
    passive: { critChanceAdd: 0.1 },
    shape: { kind: "diamond", radius: 20, colorPrimary: "#c9c9ff", colorSecondary: "#5a5ac0", glowColor: "#e0e0ff" },
  },
  {
    id: "voltaic",
    name: "Voltaic",
    tagline: "Arc-tech prototype. Chains lightning between the stars.",
    baseHp: 100,
    baseMoveSpeed: 225,
    baseDamageMult: 1,
    baseFireRateMult: 1,
    weaponId: "arcLightning",
    passiveDescription: "Arc weapons hit slightly harder.",
    passive: { damageMult: 0.05 },
    shape: { kind: "star", sides: 6, radius: 22, colorPrimary: "#c9f6ff", colorSecondary: "#3aa6cc", glowColor: "#8fe3ff" },
  },
];

export function getShipDef(id: string): ShipDef {
  const def = SHIP_DEFS.find((s) => s.id === id);
  if (!def) throw new Error(`Unknown ship id: ${id}`);
  return def;
}
