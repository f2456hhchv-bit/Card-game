/**
 * Boss definitions. Bosses are marquee, multi-phase encounters that punctuate a
 * run. A boss is realised as a special `Enemy` (with `isBoss = true`) driven by
 * the `BossController` state machine; this def supplies its identity and tuning.
 *
 * M2 ships one fully-realised boss, "The Maw". The structure is data-driven so
 * additional bosses can be added without controller changes beyond new attack
 * tuning.
 */
export interface BossDef {
  id: string;
  name: string;
  title: string;
  /** Base HP at the first encounter (scaled up for later encounters). */
  baseHp: number;
  /** Chase speed (world units/sec). Bosses are slow but relentless. */
  speed: number;
  radius: number;
  /** Contact damage dealt to the Warden on touch. */
  contactDamage: number;
  hue: number;
  /** Damage of the boss's fired projectiles (scaled with time). */
  projectileDamage: number;
}

export const BOSS_DEFS: Record<string, BossDef> = {
  theMaw: {
    id: "theMaw",
    name: "The Maw",
    title: "Devourer of Light",
    baseHp: 1600,
    speed: 46,
    radius: 54,
    contactDamage: 22,
    hue: 292,
    projectileDamage: 12,
  },
};

export const BOSS_LIST: BossDef[] = Object.values(BOSS_DEFS);

/** The boss for the Nth encounter (cycles the roster as it grows). */
export function bossForEncounter(index: number): BossDef {
  return BOSS_LIST[index % BOSS_LIST.length];
}
