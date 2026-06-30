import type { DerivedStats } from "../entities/Player";

/**
 * Boss Signatures — a marquee trophy from each boss. Defeating a boss for the
 * first time unlocks its **signature relic**; the Warden may equip **one** at a
 * time (a dedicated slot that doesn't touch the ship-set bonuses). Each grants a
 * strong, themed passive package — several light up real procs (the Overdrive
 * pulse, the Aegis revive, an extra projectile) so they play distinctly.
 *
 * Owned/equipped state lives in `save.signatures`.
 */
export interface SignatureDef {
  id: string;
  /** Boss whose defeat unlocks this signature (enemy/boss type id). */
  bossId: string;
  name: string;
  title: string;
  icon: string;
  hue: number;
  description: string;
  apply: (s: DerivedStats) => void;
}

export const SIGNATURE_DEFS: Record<string, SignatureDef> = {
  devourer: {
    id: "devourer",
    bossId: "theMaw",
    name: "Devourer's Heart",
    title: "from The Maw",
    icon: "♥",
    hue: 292,
    description: "+18% damage and +30 Max HP — the hunger turned outward.",
    apply: (s) => {
      s.damageMult *= 1.18;
      s.maxHp += 30;
    },
  },
  chorus: {
    id: "chorus",
    bossId: "theChoir",
    name: "Chorus Core",
    title: "from The Choir",
    icon: "♫",
    hue: 196,
    description: "Every weapon fires +1 projectile and +10% attack speed.",
    apply: (s) => {
      s.extraProjectiles += 1;
      s.attackSpeedMult *= 1.1;
    },
  },
  cinderbrand: {
    id: "cinderbrand",
    bossId: "thePyre",
    name: "Cinderbrand",
    title: "from The Pyre",
    icon: "🔥",
    hue: 18,
    description: "+22% damage and a periodic Overdrive light pulse.",
    apply: (s) => {
      s.damageMult *= 1.22;
      s.pulseDamage = Math.max(s.pulseDamage, 24);
    },
  },
  anvil: {
    id: "anvil",
    bossId: "theForge",
    name: "Anvil Plate",
    title: "from The Forge",
    icon: "🛡",
    hue: 6,
    description: "+60 Max HP, +8% armour, and an Aegis revive once per run.",
    apply: (s) => {
      s.maxHp += 60;
      s.armor += 0.08;
      s.revive += 1;
    },
  },
  glacial: {
    id: "glacial",
    bossId: "theRime",
    name: "Glacial Lens",
    title: "from The Rime",
    icon: "❄",
    hue: 195,
    description: "+12% area, +15% crit chance and +30% crit damage.",
    apply: (s) => {
      s.areaMult *= 1.12;
      s.critChance += 0.15;
      s.critMult += 0.3;
    },
  },
  abyssal: {
    id: "abyssal",
    bossId: "theNadir",
    name: "Abyssal Core",
    title: "from The Nadir",
    icon: "🌀",
    hue: 210,
    description: "+45 Max HP, +0.8 regen/s and a stronger Overdrive pulse.",
    apply: (s) => {
      s.maxHp += 45;
      s.regen += 0.8;
      s.pulseDamage = Math.max(s.pulseDamage, 30);
    },
  },
};

export const SIGNATURE_LIST: SignatureDef[] = Object.values(SIGNATURE_DEFS);

/** The signature a boss unlocks, if any. */
export function signatureForBoss(bossId: string): SignatureDef | undefined {
  return SIGNATURE_LIST.find((s) => s.bossId === bossId);
}

/** Apply an equipped signature (by id) onto a stat block. */
export function applySignature(stats: DerivedStats, id: string | null): void {
  if (!id) return;
  SIGNATURE_DEFS[id]?.apply(stats);
}
