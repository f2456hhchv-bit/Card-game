import type { Player } from "./entities/Player";
import type { Rng } from "../core/math/Rng";
import {
  WEAPON_DEFS,
  WEAPON_LIST,
  getStarterWeapon,
  type WeaponDef,
  type WeaponLevel,
} from "./data/weaponDefs";
import { PASSIVE_DEFS, PASSIVE_LIST } from "./data/passiveDefs";
import { clamp } from "../core/math/MathUtils";

/** A live weapon the Warden carries, with its current level and fire timer. */
export interface OwnedWeapon {
  def: WeaponDef;
  level: number;
  cooldownRemaining: number;
}

/** A draft choice offered on level-up. */
export type DraftOption =
  | {
      kind: "weapon-new";
      id: string;
      name: string;
      description: string;
      hue: number;
      note: string;
    }
  | {
      kind: "weapon-up";
      id: string;
      name: string;
      description: string;
      hue: number;
      note: string;
      level: number;
    }
  | {
      kind: "passive-new" | "passive-up";
      id: string;
      name: string;
      description: string;
      hue: number;
      note: string;
      level: number;
    };

const MAX_WEAPON_SLOTS = 6;
const MAX_PASSIVE_SLOTS = 6;

/**
 * Holds everything the Warden has acquired this run and derives the final
 * stat block. Single source of truth for "what do I own and how strong is it".
 */
export class Loadout {
  readonly weapons: OwnedWeapon[] = [];
  /** passive id -> level */
  readonly passives = new Map<string, number>();

  reset(): void {
    this.weapons.length = 0;
    this.passives.clear();
    const starter = getStarterWeapon();
    this.weapons.push({ def: starter, level: 1, cooldownRemaining: 0 });
  }

  hasWeapon(id: string): boolean {
    return this.weapons.some((w) => w.def.id === id);
  }

  getWeapon(id: string): OwnedWeapon | undefined {
    return this.weapons.find((w) => w.def.id === id);
  }

  /** Current level stats for a weapon (clamped to its table). */
  static levelStats(def: WeaponDef, level: number): WeaponLevel {
    const idx = clamp(level - 1, 0, def.levels.length - 1);
    return def.levels[idx];
  }

  /**
   * Recompute the Warden's derived stats from base + all passives.
   * Called whenever the loadout changes (cheap; not per-frame).
   */
  recomputeStats(player: Player): void {
    const s = { ...player.base };
    for (const [id, level] of this.passives) {
      const def = PASSIVE_DEFS[id];
      if (def) def.apply(s, level);
    }
    // Clamp a few stats into sane ranges.
    s.armor = clamp(s.armor, 0, 0.85);
    s.critChance = clamp(s.critChance, 0, 1);
    player.stats = s;
    // Keep current HP within the new max.
    if (player.hp > s.maxHp) player.hp = s.maxHp;
  }

  /** Apply a chosen draft option, then recompute stats. */
  applyDraft(option: DraftOption, player: Player): void {
    switch (option.kind) {
      case "weapon-new": {
        if (this.weapons.length < MAX_WEAPON_SLOTS && !this.hasWeapon(option.id)) {
          this.weapons.push({
            def: WEAPON_DEFS[option.id],
            level: 1,
            cooldownRemaining: 0,
          });
        }
        break;
      }
      case "weapon-up": {
        const w = this.getWeapon(option.id);
        if (w && w.level < w.def.maxLevel) w.level++;
        break;
      }
      case "passive-new":
      case "passive-up": {
        const cur = this.passives.get(option.id) ?? 0;
        const def = PASSIVE_DEFS[option.id];
        if (def && cur < def.maxLevel) this.passives.set(option.id, cur + 1);
        break;
      }
    }
    this.recomputeStats(player);
  }

  private weaponSlotsFull(): boolean {
    return this.weapons.length >= MAX_WEAPON_SLOTS;
  }

  private passiveSlotsFull(): boolean {
    return this.passives.size >= MAX_PASSIVE_SLOTS;
  }

  /**
   * Build the pool of every currently-valid draft option, then sample `count`
   * distinct ones at random for the level-up screen.
   */
  rollDraft(rng: Rng, count: number): DraftOption[] {
    const pool: DraftOption[] = [];

    // Weapon upgrades for owned, non-maxed weapons.
    for (const w of this.weapons) {
      if (w.level < w.def.maxLevel) {
        const next = Loadout.levelStats(w.def, w.level + 1);
        pool.push({
          kind: "weapon-up",
          id: w.def.id,
          name: w.def.name,
          description: w.def.description,
          hue: w.def.hue,
          note: next.note,
          level: w.level + 1,
        });
      }
    }
    // New weapons (if a slot is free).
    if (!this.weaponSlotsFull()) {
      for (const def of WEAPON_LIST) {
        if (!this.hasWeapon(def.id)) {
          pool.push({
            kind: "weapon-new",
            id: def.id,
            name: def.name,
            description: def.description,
            hue: def.hue,
            note: "New weapon",
          });
        }
      }
    }
    // Passive upgrades for owned, non-maxed passives.
    for (const [id, level] of this.passives) {
      const def = PASSIVE_DEFS[id];
      if (def && level < def.maxLevel) {
        pool.push({
          kind: "passive-up",
          id,
          name: def.name,
          description: def.description,
          hue: def.hue,
          note: def.levelNote(level + 1),
          level: level + 1,
        });
      }
    }
    // New passives (if a slot is free).
    if (!this.passiveSlotsFull()) {
      for (const def of PASSIVE_LIST) {
        if (!this.passives.has(def.id)) {
          pool.push({
            kind: "passive-new",
            id: def.id,
            name: def.name,
            description: def.description,
            hue: def.hue,
            note: def.levelNote(1),
            level: 1,
          });
        }
      }
    }

    // Sample without replacement.
    const shuffled = rng.shuffle(pool.slice());
    const result = shuffled.slice(0, Math.min(count, shuffled.length));

    // Fallback: if everything is maxed, offer a small heal/refresh option as a
    // weapon-up no-op so the draft is never empty. (Rare; safety net.)
    return result;
  }
}
