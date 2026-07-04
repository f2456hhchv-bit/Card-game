/**
 * Stages — distinct battlegrounds the Vigil can be fought on. Each stage has its
 * own **palette** (sky colours + nebula/fog hues) and its own **enemy pool**, so
 * runs feel visually and mechanically different. Stages beyond the first unlock
 * through play (lifetime boss kills), keeping everything earnable offline.
 */
export interface StagePalette {
  /** Vertical base gradient stops (top → middle → bottom). */
  baseTop: string;
  baseMid: string;
  baseBottom: string;
  /** Nebula cloud hues sampled across the baked sky tile. */
  nebulaHues: number[];
  /** Drifting fog hue base. */
  fogHue: number;
  /** Star tint as an `r,g,b` prefix (alpha appended by the baker). */
  starTint: string;
}

/**
 * A biome's environmental identity — the hazards + rule that make it *play*
 * differently, layered on top of the palette and roster it already has. Optional
 * so calm stages (The Fade) can stay hazard-free.
 */
export interface BiomeDef {
  /** Which hazard the field spawns (see Hazard). */
  hazard: "lavaVent" | "iceRift" | "voidWell";
  /** Seconds between hazard spawns [min, max]. */
  hazardEvery: [number, number];
  /** Damage each hazard deals when active. */
  hazardDamage: number;
  /** Hazard footprint radius (world units). */
  hazardRadius: number;
  /** Hue for the hazard's glow (defaults to the palette fog hue). */
  hazardHue: number;
}

export interface StageDef {
  id: string;
  name: string;
  title: string;
  description: string;
  /** Accent hue for menu chips / UI. */
  accentHue: number;
  palette: StagePalette;
  /** Environmental biome layer (hazards). Absent = a calm field. */
  biome?: BiomeDef;
  /** Enemy ids eligible to spawn here (summon-only types excluded as usual). */
  enemyPool: string[];
  /** Boss ids that headline this stage (cycled by encounter index). */
  bossPool: string[];
  /** Lifetime bosses the player must have felled to unlock this stage. */
  unlockBosses: number;
  /**
   * Difficulty multiplier on enemy HP, damage and boss strength (1 = base). A
   * higher value makes the stage tougher — and, paired with the same rewards,
   * a denser source of gear/motes for players who can survive it.
   */
  difficulty: number;
}

export const STAGE_DEFS: Record<string, StageDef> = {
  fade: {
    id: "fade",
    name: "The Fade",
    title: "Where the light first failed",
    description: "The familiar indigo void. The full Hollow bestiary roams here.",
    accentHue: 220,
    palette: {
      baseTop: "#0a0e24",
      baseMid: "#070a18",
      baseBottom: "#04050d",
      nebulaHues: [230, 265, 200, 290, 180],
      fogHue: 240,
      starTint: "210,220,255",
    },
    enemyPool: ["drifter", "mote", "husk", "lunger", "wisp", "caster", "spore", "seer", "lancer"],
    bossPool: ["theMaw", "theChoir", "theSovereign"],
    unlockBosses: 0,
    difficulty: 1,
  },
  ember: {
    id: "ember",
    name: "Ember Wastes",
    title: "The scorched edge of the dark",
    description:
      "A burning red expanse. Faster, fiercer Hollow — Cinders and Revenants — hunt here.",
    accentHue: 18,
    palette: {
      baseTop: "#28100a",
      baseMid: "#180806",
      baseBottom: "#0a0403",
      nebulaHues: [16, 32, 6, 45, 350],
      fogHue: 18,
      starTint: "255,225,200",
    },
    enemyPool: ["cinder", "husk", "lunger", "revenant", "spore", "caster", "mote"],
    bossPool: ["thePyre", "theForge"],
    unlockBosses: 1,
    difficulty: 1.35,
    // The scorched field erupts: lava vents telegraph, then burst — dodge the ring.
    biome: { hazard: "lavaVent", hazardEvery: [3.5, 6], hazardDamage: 16, hazardRadius: 96, hazardHue: 20 },
  },
  deep: {
    id: "deep",
    name: "Hollow Deep",
    title: "The frozen heart of the void",
    description:
      "A glacial abyss where the dark runs deepest. Shards and Colossi close in — only the well-equipped endure.",
    accentHue: 195,
    palette: {
      baseTop: "#06182a",
      baseMid: "#04101d",
      baseBottom: "#020810",
      nebulaHues: [195, 210, 230, 185, 160],
      fogHue: 200,
      starTint: "200,240,255",
    },
    enemyPool: ["shard", "colossus", "wisp", "drifter", "caster", "husk"],
    bossPool: ["theRime", "theNadir"],
    unlockBosses: 4,
    difficulty: 1.8,
  },
};

export const STAGE_LIST: StageDef[] = Object.values(STAGE_DEFS);

export function getStage(id: string): StageDef {
  return STAGE_DEFS[id] ?? STAGE_DEFS.fade;
}

/** Whether a stage is unlocked given the player's lifetime boss kills. */
export function isStageUnlocked(stage: StageDef, lifetimeBosses: number): boolean {
  return lifetimeBosses >= stage.unlockBosses;
}
