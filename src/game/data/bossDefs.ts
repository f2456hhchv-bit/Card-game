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
  // ---- Ember Wastes (stage 2) bosses ------------------------------------
  thePyre: {
    id: "thePyre",
    name: "The Pyre",
    title: "Heart of Cinders",
    baseHp: 1750,
    speed: 64,
    radius: 52,
    contactDamage: 22,
    hue: 18,
    projectileDamage: 13,
    // Fast, aggressive: floods the field with quick Cinders and rapid bullets.
    addType: "cinder",
    addCounts: [5, 8],
    projectileSpeedMult: 1.45,
    cadenceMult: 0.8,
  },
  theForge: {
    id: "theForge",
    name: "The Forge",
    title: "Anvil of the Dark",
    baseHp: 2150,
    speed: 42,
    radius: 58,
    contactDamage: 26,
    hue: 6,
    projectileDamage: 12,
    // Slow, hulking, and summons tanky ranged Revenants — a grinding siege.
    addType: "revenant",
    addCounts: [2, 3],
    projectileSpeedMult: 1.15,
    cadenceMult: 0.9,
  },
  theSovereign: {
    id: "theSovereign",
    name: "The Sovereign",
    title: "Crown of Hollows",
    baseHp: 1900,
    speed: 50,
    radius: 56,
    contactDamage: 24,
    hue: 270,
    projectileDamage: 13,
    // A regent who commands the void — summons watching Seers and looses
    // imperious volleys.
    addType: "seer",
    addCounts: [3, 5],
    projectileSpeedMult: 1.25,
    cadenceMult: 0.82,
  },
  // ---- Hollow Deep (stage 3) bosses -------------------------------------
  theRime: {
    id: "theRime",
    name: "The Rime",
    title: "Glacier Heart",
    baseHp: 2600,
    speed: 56,
    radius: 54,
    contactDamage: 26,
    hue: 195,
    projectileDamage: 15,
    // A relentless cold front: dense, fast Shard swarms and quick ice bolts.
    addType: "shard",
    addCounts: [6, 9],
    projectileSpeedMult: 1.5,
    cadenceMult: 0.78,
  },
  theNadir: {
    id: "theNadir",
    name: "The Nadir",
    title: "The Frozen Depth",
    baseHp: 3100,
    speed: 38,
    radius: 60,
    contactDamage: 30,
    hue: 210,
    projectileDamage: 14,
    // The deepest dread: hulking, slow, and calves tanky Colossus titans.
    addType: "colossus",
    addCounts: [2, 3],
    projectileSpeedMult: 1.2,
    cadenceMult: 0.88,
  },
};

export const BOSS_LIST: BossDef[] = Object.values(BOSS_DEFS);

export function getBoss(id: string): BossDef {
  return BOSS_DEFS[id] ?? BOSS_DEFS.theMaw;
}

/**
 * The boss for the Nth encounter, drawn from a stage's boss pool (cycles the
 * pool as encounters grow). Falls back to the whole roster if no pool is given.
 */
export function bossForEncounter(index: number, pool?: readonly string[]): BossDef {
  if (pool && pool.length > 0) return getBoss(pool[index % pool.length]);
  return BOSS_LIST[index % BOSS_LIST.length];
}
