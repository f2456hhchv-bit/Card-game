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

export interface StageDef {
  id: string;
  name: string;
  title: string;
  description: string;
  /** Accent hue for menu chips / UI. */
  accentHue: number;
  palette: StagePalette;
  /** Enemy ids eligible to spawn here (summon-only types excluded as usual). */
  enemyPool: string[];
  /** Boss ids that headline this stage (cycled by encounter index). */
  bossPool: string[];
  /** Lifetime bosses the player must have felled to unlock this stage. */
  unlockBosses: number;
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
    enemyPool: ["drifter", "mote", "husk", "lunger", "wisp", "caster", "spore"],
    bossPool: ["theMaw", "theChoir"],
    unlockBosses: 0,
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
