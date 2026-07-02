import type { DerivedStats } from "../entities/Player";

/**
 * Chassis — the **ship you pilot**, a progression axis distinct from the
 * Commander (the pilot) and the gear (the parts). Each chassis reshapes the
 * run's playstyle with a permanent stat identity plus a passive "hull special"
 * resolved by the World. The first is free; the rest unlock with Light Motes.
 *
 * A growable ecosystem: adding a chassis here surfaces it in the Ships screen,
 * the unlock economy and the stat pipeline automatically.
 */

/** Passive hull specials, resolved in World.updateChassisPassive / damagePlayer. */
export type ChassisPassive = "none" | "magnet" | "phase" | "drone" | "thorns" | "shock";

export interface ChassisDef {
  id: string;
  name: string;
  /** One-line class tag for the select card, e.g. "Scout · fast & greedy". */
  identity: string;
  description: string;
  hue: number;
  icon: string;
  /** Ship silhouette shape for the generated card art. */
  silhouette: "dart" | "broad" | "bulky" | "podded" | "winged";
  /** Mote cost to unlock (0 = free by default). */
  unlockCost: number;
  /** Passive hull special + its human-readable summary. */
  passive: ChassisPassive;
  passiveNote: string;
  /** Permanent stat tilt applied in Loadout.recomputeStats. */
  apply?: (s: DerivedStats) => void;
}

export const CHASSIS_DEFS: Record<string, ChassisDef> = {
  skiff: {
    id: "skiff",
    name: "Skiff",
    identity: "Standard · balanced",
    description: "A dependable standard frame with no specialisation — the pilot's own choice carries the run.",
    hue: 210,
    icon: "🛰",
    silhouette: "broad",
    unlockCost: 0,
    passive: "none",
    passiveNote: "No hull special — no weaknesses either.",
  },
  scout: {
    id: "scout",
    name: "Scout Shuttle",
    identity: "Scout · fast & greedy",
    description: "A featherlight courier hull — swift, wide-reaching, but thinly plated.",
    hue: 150,
    icon: "🛸",
    silhouette: "dart",
    unlockCost: 300,
    passive: "magnet",
    passiveNote: "Every 7s, draws in all light on the field.",
    apply: (s) => {
      s.moveSpeed *= 1.12;
      s.pickupRadius += 30;
      s.maxHp -= 15;
    },
  },
  warpstrike: {
    id: "warpstrike",
    name: "Warpstrike",
    identity: "Blinker · phase hull",
    description: "A phase-tuned raider whose hull slips briefly out of reality on a rhythm.",
    hue: 258,
    icon: "🌀",
    silhouette: "dart",
    unlockCost: 400,
    passive: "phase",
    passiveNote: "Every 9s, phases untouchable for 0.7s.",
    apply: (s) => {
      s.projectileSpeedMult *= 1.15;
      s.moveSpeed *= 1.06;
    },
  },
  dreadnought: {
    id: "dreadnought",
    name: "Dreadnought",
    identity: "Battleship · immovable",
    description: "A siege-grade capital hull: overwhelming armour and vitality, ponderous to fly.",
    hue: 20,
    icon: "🛡",
    silhouette: "bulky",
    unlockCost: 450,
    passive: "none",
    passiveNote: "Pure staying power — no hull special.",
    apply: (s) => {
      s.maxHp += 80;
      s.armor += 0.1;
      s.moveSpeed *= 0.88;
      s.attackSpeedMult *= 0.92;
    },
  },
  gunship: {
    // Renamed from "Gunship" — the id stays for save compatibility.
    id: "gunship",
    name: "Infiltrator",
    identity: "Infiltrator · high damage",
    description: "A nimble combat craft built for speed and firepower, trading durability for offensive capability.",
    hue: 12,
    icon: "🚀",
    silhouette: "broad",
    unlockCost: 500,
    passive: "none",
    passiveNote: "All guns, little armour — no hull special.",
    apply: (s) => {
      s.extraProjectiles += 1;
      s.attackSpeedMult *= 1.1;
      s.maxHp -= 25;
    },
  },
  carrier: {
    id: "carrier",
    name: "Carrier",
    identity: "Carrier · summoner",
    description: "A drone tender whose autonomous escort looses seeking fire alongside you.",
    hue: 90,
    icon: "✈",
    silhouette: "podded",
    unlockCost: 550,
    passive: "drone",
    passiveNote: "Every 4s, an escort drone looses a seeking volley.",
    apply: (s) => {
      s.maxHp += 20;
    },
  },
  bulwark: {
    id: "bulwark",
    name: "Bulwark",
    identity: "Defender · thorned",
    description: "A warded defensive hull that punishes anything foolish enough to strike it.",
    hue: 280,
    icon: "🔰",
    silhouette: "winged",
    unlockCost: 500,
    passive: "thorns",
    passiveNote: "Reflects a burst of damage to nearby foes when hit.",
    apply: (s) => {
      s.maxHp += 40;
      s.armor += 0.06;
      s.regen += 0.6;
    },
  },
  corsair: {
    id: "corsair",
    name: "Corsair",
    identity: "Raider · shock hull",
    description: "A nimble raider hull crackling with a charged arc that lashes at any foe that crowds it.",
    hue: 190,
    icon: "⚡",
    silhouette: "dart",
    unlockCost: 450,
    passive: "shock",
    passiveNote: "Every 5s, an arc zaps the nearest few foes.",
    apply: (s) => {
      s.attackSpeedMult *= 1.06;
      s.moveSpeed *= 1.05;
      s.maxHp -= 10;
    },
  },
  monolith: {
    id: "monolith",
    name: "Monolith",
    identity: "Fortress · regenerator",
    description: "A living-metal fortress hull that mends itself faster than the dark can wear it down.",
    hue: 262,
    icon: "🏯",
    silhouette: "bulky",
    unlockCost: 500,
    passive: "none",
    passiveNote: "Relentless self-repair — no active hull special.",
    apply: (s) => {
      s.maxHp += 60;
      s.regen += 1;
      s.armor += 0.04;
      s.moveSpeed *= 0.9;
      s.attackSpeedMult *= 0.95;
    },
  },
};

export const CHASSIS_LIST: ChassisDef[] = Object.values(CHASSIS_DEFS);

export function getChassis(id: string): ChassisDef {
  return CHASSIS_DEFS[id] ?? CHASSIS_DEFS.skiff;
}
