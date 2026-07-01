import type { Player } from "./entities/Player";
import type { Rng } from "../core/math/Rng";
import {
  WEAPON_DEFS,
  DRAFTABLE_WEAPONS,
  getStarterWeapon,
  type WeaponDef,
  type WeaponLevel,
} from "./data/weaponDefs";
import { PASSIVE_DEFS, PASSIVE_LIST } from "./data/passiveDefs";
import { applyMeta } from "./data/metaDefs";
import { applyGear, emptyEquip, type EquipMap, type ModuleState } from "./data/gearDefs";
import { applySignature } from "./data/signatureDefs";
import { getWarden, applyWardenLevel } from "./data/wardenDefs";
import { getChassis } from "./data/chassisDefs";
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
    }
  | {
      /** Evolve an owned, mastered weapon into its evolved form. */
      kind: "weapon-evolve";
      /** Id of the base weapon being evolved (the one currently owned). */
      id: string;
      /** Id of the evolved weapon it becomes. */
      into: string;
      name: string;
      description: string;
      hue: number;
      note: string;
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
  /** Permanent meta-upgrade levels (set by World from the save each run). */
  metaLevels: Record<string, number> = {};
  /** Owned gear inventory (set by World from the save each run). */
  gearInventory: Record<string, ModuleState> = {};
  /** Equipped gear per slot (set by World from the save each run). */
  gearEquipped: EquipMap = emptyEquip();
  /** Equipped boss-signature id, or null (set by World from the save each run). */
  signatureId: string | null = null;
  /** Selected Warden id (set by World from the save each run). */
  wardenId = "lumen";
  /** Mastery level of the selected Warden (set by World from the save each run). */
  wardenLevel = 0;
  /** Selected chassis (ship) id (set by World from the save each run). */
  chassisId = "skiff";

  reset(): void {
    this.weapons.length = 0;
    this.passives.clear();
    const starterId = getWarden(this.wardenId).starterWeapon;
    const starter = WEAPON_DEFS[starterId] ?? getStarterWeapon();
    this.weapons.push({ def: starter, level: 1, cooldownRemaining: 0 });
  }

  /** Serialise the run's owned weapons + passives for a resume snapshot. */
  capture(): { weapons: { id: string; level: number; cooldownRemaining: number }[]; passives: [string, number][] } {
    return {
      weapons: this.weapons.map((w) => ({
        id: w.def.id,
        level: w.level,
        cooldownRemaining: w.cooldownRemaining,
      })),
      passives: [...this.passives.entries()],
    };
  }

  /**
   * Rebuild owned weapons + passives from a snapshot (after {@link reset}). Unknown
   * ids are skipped defensively so an old snapshot can't crash a resume.
   */
  restore(
    snap: { weapons: { id: string; level: number; cooldownRemaining: number }[]; passives: [string, number][] },
    player: Player,
  ): void {
    this.weapons.length = 0;
    for (const w of snap.weapons) {
      const def = WEAPON_DEFS[w.id];
      if (def) this.weapons.push({ def, level: w.level, cooldownRemaining: w.cooldownRemaining });
    }
    if (this.weapons.length === 0) this.reset(); // never leave the Warden unarmed
    this.passives.clear();
    for (const [id, level] of snap.passives) {
      if (PASSIVE_DEFS[id]) this.passives.set(id, level);
    }
    this.recomputeStats(player);
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
    // Order: base → Commander perk/mastery → chassis → meta → gear → relics.
    getWarden(this.wardenId).applyPerk?.(s);
    applyWardenLevel(s, this.wardenLevel);
    getChassis(this.chassisId).apply?.(s);
    applyMeta(s, this.metaLevels);
    applyGear(s, this.gearEquipped, this.gearInventory);
    applySignature(s, this.signatureId);
    for (const [id, level] of this.passives) {
      const def = PASSIVE_DEFS[id];
      if (def) def.apply(s, level);
    }
    // Clamp a few stats into sane ranges.
    s.armor = clamp(s.armor, 0, 0.85);
    s.critChance = clamp(s.critChance, 0, 1);
    // Never let trade-off effects (e.g. Glass Cannon) drop Max HP to a lethal 0.
    s.maxHp = Math.max(1, s.maxHp);
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
      case "weapon-evolve": {
        // Replace the base weapon in-place with its evolved form at level 1.
        const w = this.getWeapon(option.id);
        const evolvedDef = WEAPON_DEFS[option.into];
        if (w && evolvedDef && !this.hasWeapon(option.into)) {
          w.def = evolvedDef;
          w.level = 1;
          w.cooldownRemaining = 0;
        }
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

  /**
   * Evolution draft options currently available: for each owned, mastered
   * (max-level) weapon whose paired relic is owned at the required level, and
   * whose evolved form isn't already owned.
   */
  getEvolutions(): DraftOption[] {
    const out: DraftOption[] = [];
    for (const w of this.weapons) {
      const evo = w.def.evolution;
      if (!evo) continue;
      if (w.level < w.def.maxLevel) continue;
      const relicLevel = this.passives.get(evo.relic) ?? 0;
      if (relicLevel < evo.relicLevel) continue;
      if (this.hasWeapon(evo.into)) continue;
      const evolved = WEAPON_DEFS[evo.into];
      if (!evolved) continue;
      out.push({
        kind: "weapon-evolve",
        id: w.def.id,
        into: evo.into,
        name: evolved.name,
        description: evolved.description,
        hue: evolved.hue,
        note: `Evolve ${w.def.name}`,
      });
    }
    return out;
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
    // New weapons (if a slot is free). Evolved forms are excluded — they are
    // only reachable through evolution, not fresh picks.
    if (!this.weaponSlotsFull()) {
      for (const def of DRAFTABLE_WEAPONS) {
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

    // Evolutions are rare, build-defining moments — always surface available
    // ones first so the player never misses the chance, then fill the rest of
    // the draft with a random sample of the normal pool.
    const evolutions = rng.shuffle(this.getEvolutions());
    const result: DraftOption[] = evolutions.slice(0, count);

    if (result.length < count) {
      const shuffled = rng.shuffle(pool.slice());
      for (const opt of shuffled) {
        if (result.length >= count) break;
        result.push(opt);
      }
    }

    // If everything is maxed and nothing remains, the caller (Game) converts the
    // empty draft into a small heal so a level-up is never wasted.
    return result;
  }
}
