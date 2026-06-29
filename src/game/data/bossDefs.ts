/**
 * Boss definitions. Bosses are marquee, multi-phase encounters that punctuate a
 * run. A boss is realised as a special `Enemy` (with `isBoss = true`) driven by
 * the `BossController` state machine; this def supplies its identity and tuning.
 *
 * The roster cycles by encounter index, so successive bosses alternate for
 * variety. Per-boss tuning (summon type/counts, attack cadence, projectile
 * speed) lets bosses feel distinct without controller changes.
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
  /** Enemy type summoned on phase transitions. */
  addType: string;
  /** Adds summoned entering phase 2 and phase 3 respectively. */
  addCounts: [number, number];
  /** Multiplier on projectile speed (>1 = faster, more dangerous bullets). */
  projectileSpeedMult: number;
  /** Multiplier on attack cadence (<1 = attacks more often). */
  cadenceMult: number;
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
    addType: "husk",
    addCounts: [4, 6],
    projectileSpeedMult: 1,
    cadenceMult: 1,
  },
  theChoir: {
    id: "theChoir",
    name: "The Choir",
    title: "Hollow Chorus",
    baseHp: 1450,
    speed: 60,
    radius: 50,
    contactDamage: 18,
    hue: 196,
    projectileDamage: 11,
    // Summons ranged Casters — a very different, bullet-dense pressure than the
    // Maw's melee Husk swarm. Fewer of them since each one also fires.
    addType: "caster",
    addCounts: [2, 3],
    projectileSpeedMult: 1.3,
    cadenceMult: 0.82,
  },
};

export const BOSS_LIST: BossDef[] = Object.values(BOSS_DEFS);

/** The boss for the Nth encounter (cycles the roster as it grows). */
export function bossForEncounter(index: number): BossDef {
  return BOSS_LIST[index % BOSS_LIST.length];
}
