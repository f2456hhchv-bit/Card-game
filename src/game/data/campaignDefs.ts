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
/** The campaign runs to **Galaxy 100** — a finite, defined endgame. */
export const GALAXY_COUNT = 100;
/** Total Sectors in the whole campaign (Galaxy 100 · Sector 10 is the finale). */
export const TOTAL_SECTORS = GALAXY_COUNT * SECTORS_PER_GALAXY;
/** Global index of the final Sector (0-based). */
export const MAX_LEVEL = TOTAL_SECTORS - 1;

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

/**
 * Enemy HP/damage multiplier for a Sector. Tuned for the full 1000-Sector run:
 * player power is **bounded** (meta + gear + Commander + chassis + in-run level),
 * so this must target *achievable* strength rather than run away. It is mostly a
 * gentle linear climb with a modest quadratic tail so the deepest Galaxies stay
 * demanding without becoming an unkillable wall.
 *
 * Rough shape: G1 ≈ 1.0–1.2× · G10 ≈ 3.5× · G50 ≈ 15× · G100 ≈ 33×.
 * (Constants are deliberately easy to retune from playtest feedback.)
 */
export function levelDifficulty(level: number): number {
  const l = Math.max(0, Math.min(level, MAX_LEVEL));
  return 1 + l * 0.025 + l * l * 0.000008;
}

/**
 * Enemy **damage** multiplier for a Sector — deliberately climbs slower than
 * {@link levelDifficulty} (HP). Late Galaxies therefore field bullet-sponge foes
 * you must out-damage, rather than glass cannons that one-shot a maxed hull.
 * Rough shape: G1 ≈ 1.0× · G50 ≈ 9× · G100 ≈ 19×.
 */
export function levelDamageDifficulty(level: number): number {
  const l = Math.max(0, Math.min(level, MAX_LEVEL));
  return 1 + l * 0.015 + l * l * 0.000003;
}

// ---- Waves ------------------------------------------------------------------
// A Sector is fought in {@link WAVES_PER_SECTOR} waves. Waves 1–9 escalate
// (burst + trickle, strength climbing per wave against in-run levelling); the
// final wave is the **Sector boss** — every Sector ends with a boss kill.

export const WAVES_PER_SECTOR = 10;
/** Seconds before the next wave auto-starts. */
export const WAVE_DURATION = 25;
/** Minimum seconds a wave runs before clearing the field advances it early. */
export const WAVE_MIN_TIME = 8;

/** Enemy HP multiplier for a wave (1-based) — climbs against player levelling. */
export function waveHpMult(wave: number): number {
  return 1 + (Math.max(1, wave) - 1) * 0.09;
}
/** Enemy damage multiplier for a wave — milder than HP (sponges, not one-shots). */
export function waveDamageMult(wave: number): number {
  return 1 + (Math.max(1, wave) - 1) * 0.05;
}
/** Spawn-rate multiplier for a wave. */
export function waveRateMult(wave: number): number {
  return 1 + (Math.max(1, wave) - 1) * 0.06;
}
/** Enemies burst-spawned at a wave's start. */
export function waveBurstCount(wave: number): number {
  return 6 + Math.max(1, wave) * 2;
}

/**
 * Milestone Sectors (the 5th and 10th of each Galaxy) — their end-of-Sector
 * bosses are **elite**: the mid-Galaxy boss and the Galaxy finale.
 */
export function isBossSector(level: number): boolean {
  const s = sectorOf(level);
  return s === 4 || s === 9;
}

/** Boss HP multiplier for a Sector's final-wave boss (elite on milestones). */
export function sectorBossMult(level: number): number {
  const s = sectorOf(level);
  return s === 9 ? 1.5 : s === 4 ? 1.2 : 1;
}

/** The final Sector of the campaign (Galaxy 100 · Sector 10). */
export function isFinalLevel(level: number): boolean {
  return level >= MAX_LEVEL;
}

/** Motes awarded for clearing a Sector (first clear pays more — see Game).
 *  Base raised for the wave rework: every Sector is now a ~5-minute, ten-wave
 *  fight ending in a boss. Milestone Sectors still pay a bonus. */
export function levelReward(level: number): number {
  return 60 + level * 6 + (isBossSector(level) ? 60 : 0);
}

// ---- Per-Sector variety ----------------------------------------------------

/**
 * The enemy pool for a specific Sector. Early Sectors of a Galaxy field a subset
 * (so newcomers learn a few foes), widening to the full roster by mid-Galaxy —
 * a gentle "introduce the bestiary" curve rather than the whole pool at once.
 */
export function sectorEnemyPool(level: number): string[] {
  const pool = getGalaxy(galaxyOf(level)).enemyPool;
  const n = Math.min(pool.length, 4 + sectorOf(level));
  return pool.slice(0, n);
}

/**
 * A subtly shifted palette per Sector — the same Galaxy, but each Sector drifts
 * its nebula/fog hues so back-to-back levels feel like different regions of
 * space rather than the identical backdrop.
 */
export function sectorPalette(level: number): StagePalette {
  const base = getGalaxy(galaxyOf(level)).palette;
  const shift = sectorOf(level) * 8;
  return {
    ...base,
    nebulaHues: base.nebulaHues.map((h) => (h + shift) % 360),
    fogHue: (base.fogHue + shift) % 360,
  };
}

/**
 * Star rating (1–3) for clearing a Sector, from the HP fraction remaining at the
 * clear moment — rewards clean, unhurt runs and drives replay for 3★.
 */
export function starsFor(hpFraction: number): number {
  if (hpFraction >= 0.85) return 3;
  if (hpFraction >= 0.5) return 2;
  return 1;
}
