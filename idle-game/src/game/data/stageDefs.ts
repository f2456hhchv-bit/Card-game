/**
 * Sectors the Vanguard patrols. Each spans `STAGES_PER_BIOME` stages and
 * lends its palette to the space backdrop and its hue range to Hollow
 * sprites. Names and palettes are drawn straight from the AFTERLIGHT
 * universe (The Fade, Ember Wastes, Hollow Deep) so this idle game reads as
 * the same setting. The list loops forever — past the last sector we cycle
 * back to the first with a hue drift so long runs still feel like they're
 * going somewhere new.
 */
export interface Biome {
  id: string;
  name: string;
  /** Base hue for Hollow creatures native to this sector. */
  enemyHue: number;
  /** Platform / terrain hue for the backdrop. */
  groundHue: number;
  /** Distant nebula/fog hue for the backdrop. */
  fogHue: number;
  bossName: string;
}

export const BIOMES: Biome[] = [
  { id: "fade", name: "The Fade", enemyHue: 265, groundHue: 230, fogHue: 240, bossName: "The Maw" },
  { id: "ember", name: "Ember Wastes", enemyHue: 18, groundHue: 14, fogHue: 24, bossName: "The Pyre" },
  { id: "deep", name: "Hollow Deep", enemyHue: 200, groundHue: 195, fogHue: 210, bossName: "The Rime" },
  { id: "sovereign", name: "The Sovereign's Reach", enemyHue: 280, groundHue: 270, fogHue: 285, bossName: "The Sovereign" },
];

export const STAGES_PER_BIOME = 15;
/** Every Nth stage within a sector cycle is a boss stage. */
export const BOSS_INTERVAL = 15;

export function biomeIndexForStage(stage: number): number {
  return Math.floor((stage - 1) / STAGES_PER_BIOME) % BIOMES.length;
}

export function biomeForStage(stage: number): Biome {
  return BIOMES[biomeIndexForStage(stage)];
}

/** How many full loops through every sector have completed by this stage —
 * used to drift the hue on repeat visits so the palette keeps evolving. */
export function loopsForStage(stage: number): number {
  return Math.floor((stage - 1) / (STAGES_PER_BIOME * BIOMES.length));
}

export function isBossStage(stage: number): boolean {
  return stage % BOSS_INTERVAL === 0;
}
