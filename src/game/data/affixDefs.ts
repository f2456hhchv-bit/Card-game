/**
 * Elite Affixes — champions with a twist. Later in a run (and deeper into the
 * campaign) elites stop being merely bigger and start rolling one of these
 * traits, telegraphed by a coloured ring so the player can read the threat at
 * a glance. Affixed elites shed a fatter Mote purse (see World.dropLoot).
 */
export interface EliteAffixDef {
  id: string;
  name: string;
  /** Ring/telegraph colour. */
  color: string;
  hpMult?: number;
  speedMult?: number;
  /** Fraction of incoming damage ignored (warded). */
  damageReduction?: number;
  /** Max-HP fraction healed per second (regenerator). */
  regenFrac?: number;
  /** Detonates on death — stand clear. */
  volatile?: boolean;
  /** Spawns fodder adds every few seconds while alive. */
  summoner?: boolean;
}

export const ELITE_AFFIXES: EliteAffixDef[] = [
  {
    id: "swift",
    name: "Swift",
    color: "#6ee7ff",
    speedMult: 1.55,
    hpMult: 0.85,
  },
  {
    id: "warded",
    name: "Warded",
    color: "#b39bff",
    damageReduction: 0.45,
    speedMult: 0.9,
  },
  {
    id: "volatile",
    name: "Volatile",
    color: "#ff9d45",
    volatile: true,
  },
  {
    id: "regenerator",
    name: "Regenerator",
    color: "#7dffb0",
    regenFrac: 0.025,
  },
  {
    id: "summoner",
    name: "Summoner",
    color: "#ff7de8",
    summoner: true,
  },
];

export function getAffix(id: string | null): EliteAffixDef | null {
  if (!id) return null;
  return ELITE_AFFIXES.find((a) => a.id === id) ?? null;
}

/** Seconds between a Summoner elite's reinforcement calls. */
export const SUMMON_INTERVAL = 6;
