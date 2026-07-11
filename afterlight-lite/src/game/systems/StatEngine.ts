import type {
  AttachmentSlot,
  ShipDef,
  StatModifiers,
  UpgradeDef,
  WeaponBaseStats,
  WeaponPattern,
} from "../types";
import { getUpgradeDef } from "../data/upgradeDefs";
import { ATTACHMENT_DEFS } from "../data/attachmentDefs";
import { clamp } from "../../core/math/MathUtils";

const BASE_MAGNET_RADIUS = 60;
const BASE_SHIELD_REGEN_TIME = 6;
const BASE_MOTES_RETAINED_PCT = 0.2;
const BASE_CRIT_DAMAGE_MULT = 1.5;

const MODIFIER_KEYS: (keyof StatModifiers)[] = [
  "maxHpAdd",
  "maxHpMult",
  "moveSpeedMult",
  "damageMult",
  "fireRateMult",
  "projectileSpeedMult",
  "projectileCountAdd",
  "pierceAdd",
  "critChanceAdd",
  "critDamageMult",
  "regenPerSec",
  "magnetRadiusAdd",
  "xpGainMult",
  "armorFlat",
  "lifestealPct",
  "explosiveOnHitChance",
  "explosiveOnHitRadius",
  "explosiveOnHitDamageMult",
  "chainLightningChance",
  "chainLightningJumps",
  "chainLightningDamageMult",
  "orbitDroneCountAdd",
  "orbitDroneDamageMult",
  "shieldChargeMaxAdd",
  "shieldRegenTimeMult",
  "spreadShotCountAdd",
  "homingStrength",
  "motesRetainedPctAdd",
];

export function sumModifiers(bags: StatModifiers[]): StatModifiers {
  const total: StatModifiers = {};
  for (const bag of bags) {
    for (const key of MODIFIER_KEYS) {
      const v = bag[key];
      if (v === undefined) continue;
      total[key] = (total[key] ?? 0) + v;
    }
  }
  return total;
}

/** Effect an owned upgrade currently grants, folding in the stack-5 "super" jump. */
export function upgradeContribution(def: UpgradeDef, stackCount: number): StatModifiers {
  const s = Math.min(stackCount, 5);
  const fullStacks = Math.min(s, 4);
  const scaled: StatModifiers = {};
  for (const key of MODIFIER_KEYS) {
    const v = def.perStack[key];
    if (v === undefined) continue;
    scaled[key] = v * fullStacks;
  }
  if (s >= 5) {
    for (const key of MODIFIER_KEYS) {
      const v = def.superEffect[key];
      if (v === undefined) continue;
      scaled[key] = (scaled[key] ?? 0) + v;
    }
  }
  return scaled;
}

export function isSuper(stackCount: number): boolean {
  return stackCount >= 5;
}

export function upgradeDisplayName(def: UpgradeDef, stackCount: number): string {
  return isSuper(stackCount) ? def.superName : def.name;
}

export function upgradeDisplayDescription(def: UpgradeDef, stackCount: number): string {
  return isSuper(stackCount) ? def.superDescription : def.description;
}

export interface AggregatedStats {
  maxHp: number;
  moveSpeed: number;
  damageMult: number;
  fireRateMult: number;
  projectileSpeedMult: number;
  critChance: number;
  critDamageMult: number;
  regenPerSec: number;
  magnetRadius: number;
  xpGainMult: number;
  armorFlat: number;
  lifestealPct: number;
  shieldMax: number;
  shieldRegenTime: number;
  motesRetainedPct: number;
  projectileCountBonus: number;
  homingStrength: number;
}

export function computePlayerStats(
  ship: ShipDef,
  passiveStacks: Record<string, number>,
  weaponStacks: Record<string, number>,
  attachmentLevels: Record<AttachmentSlot, number>,
): AggregatedStats {
  const bags: StatModifiers[] = [ship.passive];

  for (const [id, count] of Object.entries(passiveStacks)) {
    bags.push(upgradeContribution(getUpgradeDef(id), count));
  }
  for (const [id, count] of Object.entries(weaponStacks)) {
    // Weapon upgrades' perStack/superEffect are usually empty but may carry a
    // small global side-effect (e.g. Arc Storm Surge's fire-rate bonus).
    bags.push(upgradeContribution(getUpgradeDef(id), count));
  }
  for (const attachment of ATTACHMENT_DEFS) {
    const level = attachmentLevels[attachment.slot] ?? 0;
    for (let i = 0; i < level; i++) {
      bags.push(attachment.tiers[i].effect);
    }
  }

  const total = sumModifiers(bags);

  return {
    maxHp: ship.baseHp * (1 + (total.maxHpMult ?? 0)) + (total.maxHpAdd ?? 0),
    moveSpeed: ship.baseMoveSpeed * (1 + (total.moveSpeedMult ?? 0)),
    damageMult: ship.baseDamageMult * (1 + (total.damageMult ?? 0)),
    fireRateMult: ship.baseFireRateMult * (1 + (total.fireRateMult ?? 0)),
    projectileSpeedMult: 1 + (total.projectileSpeedMult ?? 0),
    critChance: clamp(total.critChanceAdd ?? 0, 0, 0.95),
    critDamageMult: BASE_CRIT_DAMAGE_MULT + (total.critDamageMult ?? 0),
    regenPerSec: total.regenPerSec ?? 0,
    magnetRadius: BASE_MAGNET_RADIUS + (total.magnetRadiusAdd ?? 0),
    xpGainMult: 1 + (total.xpGainMult ?? 0),
    armorFlat: total.armorFlat ?? 0,
    lifestealPct: total.lifestealPct ?? 0,
    shieldMax: total.shieldChargeMaxAdd ?? 0,
    shieldRegenTime: Math.max(1, BASE_SHIELD_REGEN_TIME * (1 - (total.shieldRegenTimeMult ?? 0))),
    motesRetainedPct: clamp(BASE_MOTES_RETAINED_PCT + (total.motesRetainedPctAdd ?? 0), 0, 1),
    projectileCountBonus: Math.round(total.projectileCountAdd ?? 0),
    homingStrength: total.homingStrength ?? 0,
  };
}

export interface ResolvedWeapon {
  damage: number;
  interval: number;
  projectileSpeed: number;
  count: number;
  pierce: number;
  radius: number;
  pattern: WeaponPattern;
}

function scaleDelta(delta: Partial<WeaponBaseStats> | undefined, n: number): Partial<WeaponBaseStats> {
  if (!delta || n <= 0) return {};
  const out: Partial<WeaponBaseStats> = {};
  if (delta.damage) out.damage = delta.damage * n;
  if (delta.interval) out.interval = delta.interval * n;
  if (delta.projectileSpeed) out.projectileSpeed = delta.projectileSpeed * n;
  if (delta.count) out.count = delta.count * n;
  if (delta.pierce) out.pierce = delta.pierce * n;
  if (delta.radius) out.radius = delta.radius * n;
  return out;
}

export function resolveWeapon(def: UpgradeDef, stackCount: number, agg: AggregatedStats): ResolvedWeapon {
  const base = def.weaponBase;
  if (!base) throw new Error(`${def.id} is not a weapon upgrade`);
  const s = Math.min(stackCount, 5);
  const extra = Math.max(0, Math.min(s, 4) - 1);
  const perStack = scaleDelta(def.weaponPerStack, extra);

  let damage = base.damage + (perStack.damage ?? 0);
  let interval = base.interval + (perStack.interval ?? 0);
  let projectileSpeed = base.projectileSpeed + (perStack.projectileSpeed ?? 0);
  let count = base.count + (perStack.count ?? 0);
  let pierce = base.pierce + (perStack.pierce ?? 0);
  let radius = base.radius + (perStack.radius ?? 0);

  if (s >= 5 && def.superWeaponDelta) {
    const d = def.superWeaponDelta;
    damage += d.damage ?? 0;
    interval += d.interval ?? 0;
    projectileSpeed += d.projectileSpeed ?? 0;
    count += d.count ?? 0;
    pierce += d.pierce ?? 0;
    radius += d.radius ?? 0;
  }

  damage *= agg.damageMult;
  interval = Math.max(0.12, interval / Math.max(0.1, agg.fireRateMult));
  projectileSpeed *= agg.projectileSpeedMult;
  count = Math.max(1, Math.round(count + agg.projectileCountBonus));

  return { damage, interval, projectileSpeed, count, pierce: Math.round(pierce), radius, pattern: base.pattern };
}
