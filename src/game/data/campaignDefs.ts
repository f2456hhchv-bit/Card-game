import { STAGE_DEFS, type StagePalette } from "./stageDefs";

/**
 * Campaign — the structured "clear it, warp onward" progression. Space is
 * traversed as **Galaxies** (themed regions), each split into
 * {@link SECTORS_PER_GALAXY} **Sectors** (the discrete levels). Enemy strength
 * ramps slowly per Sector and steps up between Galaxies. Progress is linear:
 * clear a Sector to unlock the next; clear a Galaxy's final Sector to warp to the
 * next Galaxy. The roster of Galaxies is hand-authored for the early game and
 * **procedurally generated beyond** it, so the campaign expands without end.
 */
export const SECTORS_PER_GALAXY = 10;

export interface GalaxyDef {
  name: string;
  title: string;
  palette: StagePalette;
  /** Enemy ids that may spawn in this Galaxy. */
  enemyPool: string[];
  /** Boss ids that headline this Galaxy's boss Sectors. */
  bossPool: string[];
}

/** Every boss id (used by procedurally-generated late Galaxies). */
const ALL_BOSSES = [
  "theMaw",
  "theChoir",
  "theSovereign",
  "thePyre",
  "theForge",
  "theRime",
  "theNadir",
];
/** Every directly-spawnable enemy id (procedural Galaxies draw from these). */
const ALL_ENEMIES = [
  "drifter",
  "mote",
  "husk",
  "lunger",
  "wisp",
  "caster",
  "spore",
  "seer",
  "lancer",
  "cinder",
  "revenant",
  "shard",
  "colossus",
];

/** A palette built by rotating a base hue — for endless procedural Galaxies. */
function proceduralPalette(hue: number): StagePalette {
  return {
    baseTop: `hsl(${hue} 45% 11%)`,
    baseMid: `hsl(${hue} 50% 7%)`,
    baseBottom: `hsl(${hue} 55% 4%)`,
    nebulaHues: [hue, (hue + 30) % 360, (hue + 330) % 360, (hue + 60) % 360, (hue + 300) % 360],
    fogHue: hue,
    starTint: "210,220,255",
  };
}

/** Hand-authored Galaxies. Beyond these, Galaxies are generated (see getGalaxy). */
export const GALAXIES: GalaxyDef[] = [
  {
    name: "Veil Reaches",
    title: "Where the first light failed",
    palette: STAGE_DEFS.fade.palette,
    enemyPool: ["drifter", "mote", "husk", "lunger", "wisp", "caster", "spore", "seer", "lancer"],
    bossPool: ["theMaw", "theChoir", "theSovereign"],
  },
  {
    name: "Ember Expanse",
    title: "The scorched tide",
    palette: STAGE_DEFS.ember.palette,
    enemyPool: ["cinder", "husk", "lunger", "revenant", "spore", "caster", "mote", "lancer"],
    bossPool: ["thePyre", "theForge"],
  },
  {
    name: "Frozen Abyss",
    title: "The deep, cold dark",
    palette: STAGE_DEFS.deep.palette,
    enemyPool: ["shard", "colossus", "wisp", "drifter", "caster", "husk", "seer"],
    bossPool: ["theRime", "theNadir"],
  },
  {
    name: "Verdant Bloom",
    title: "A garden grown wrong",
    palette: proceduralPalette(120),
    enemyPool: ["spore", "wisp", "drifter", "mote", "caster", "seer", "lunger"],
    bossPool: ["theChoir", "theSovereign", "theRime"],
  },
  {
    name: "Crimson Rift",
    title: "The wound in the sky",
    palette: proceduralPalette(350),
    enemyPool: ["revenant", "cinder", "lunger", "lancer", "husk", "colossus", "caster"],
    bossPool: ["theForge", "thePyre", "theMaw"],
  },
];

/** The Galaxy at `index` — hand-authored if defined, else procedurally grown. */
export function getGalaxy(index: number): GalaxyDef {
  if (index >= 0 && index < GALAXIES.length) return GALAXIES[index];
  // Endless procedural Galaxies: rotate the palette hue and widen the rosters.
  const hue = (200 + index * 47) % 360;
  return {
    name: `Deep Expanse ${index + 1}`,
    title: "Beyond the charted dark",
    palette: proceduralPalette(hue),
    enemyPool: ALL_ENEMIES,
    bossPool: ALL_BOSSES,
  };
}

// ---- Level math (a "level" = one Sector, indexed globally from 0) ----------

export function galaxyOf(level: number): number {
  return Math.floor(level / SECTORS_PER_GALAXY);
}
export function sectorOf(level: number): number {
  return level % SECTORS_PER_GALAXY;
}

/** Human label, e.g. "Galaxy 2 · Sector 7". */
export function levelLabel(level: number): string {
  return `Galaxy ${galaxyOf(level) + 1} · Sector ${sectorOf(level) + 1}`;
}

/** Enemy HP/damage multiplier — a slow, steady climb per Sector. */
export function levelDifficulty(level: number): number {
  return 1 + level * 0.06;
}

/** Survival target (seconds) for a non-boss Sector — grows slowly, then caps. */
export function levelDuration(level: number): number {
  return 60 + Math.min(level, 25) * 3;
}

/** Boss Sectors: the 5th (mini-boss) and the 10th (Galaxy boss). */
export function isBossSector(level: number): boolean {
  const s = sectorOf(level);
  return s === 4 || s === 9;
}

/** Motes awarded for clearing a Sector (first clear pays more — see Game). */
export function levelReward(level: number): number {
  return 30 + level * 6 + (isBossSector(level) ? 60 : 0);
}
