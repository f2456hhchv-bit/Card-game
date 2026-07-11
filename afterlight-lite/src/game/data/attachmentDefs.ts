import type { AttachmentDef, AttachmentSlot } from "../types";

/** Ship Workshop: permanent, cross-run upgrades bought with retained light
 * motes. Each of the 6 attachment slots has escalating tiers; owned tiers
 * apply their effect to every future run automatically. */
export const ATTACHMENT_DEFS: AttachmentDef[] = [
  {
    slot: "weapon",
    name: "Weapon Core",
    description: "Overclocks your weapon systems for permanently higher damage.",
    tiers: [
      { level: 1, cost: 80, description: "+8% weapon damage", effect: { damageMult: 0.08 } },
      { level: 2, cost: 180, description: "+8% weapon damage", effect: { damageMult: 0.08 } },
      { level: 3, cost: 340, description: "+10% weapon damage", effect: { damageMult: 0.1 } },
      { level: 4, cost: 560, description: "+12% weapon damage", effect: { damageMult: 0.12 } },
    ],
  },
  {
    slot: "shield",
    name: "Shield Generator",
    description: "Adds hardpoints for extra deflector shield charges.",
    tiers: [
      { level: 1, cost: 100, description: "+1 shield charge", effect: { shieldChargeMaxAdd: 1 } },
      { level: 2, cost: 220, description: "+1 shield charge", effect: { shieldChargeMaxAdd: 1 } },
      { level: 3, cost: 400, description: "Shields recharge 20% faster", effect: { shieldRegenTimeMult: 0.2 } },
      { level: 4, cost: 640, description: "+1 shield charge", effect: { shieldChargeMaxAdd: 1 } },
    ],
  },
  {
    slot: "wings",
    name: "Wing Array",
    description: "Extra hardpoints mean extra projectiles from every weapon.",
    tiers: [
      { level: 1, cost: 120, description: "+5% projectile speed", effect: { projectileSpeedMult: 0.05 } },
      { level: 2, cost: 260, description: "+1 projectile from spread weapons", effect: { projectileCountAdd: 1 } },
      { level: 3, cost: 460, description: "+5% projectile speed", effect: { projectileSpeedMult: 0.05 } },
      { level: 4, cost: 720, description: "+1 projectile from spread weapons", effect: { projectileCountAdd: 1 } },
    ],
  },
  {
    slot: "thrusters",
    name: "Thruster Array",
    description: "More responsive engines for tighter dodges.",
    tiers: [
      { level: 1, cost: 80, description: "+6% move speed", effect: { moveSpeedMult: 0.06 } },
      { level: 2, cost: 180, description: "+6% move speed", effect: { moveSpeedMult: 0.06 } },
      { level: 3, cost: 340, description: "+8% move speed", effect: { moveSpeedMult: 0.08 } },
      { level: 4, cost: 560, description: "+10% move speed", effect: { moveSpeedMult: 0.1 } },
    ],
  },
  {
    slot: "hull",
    name: "Hull Plating",
    description: "Thicker plating and better damage control.",
    tiers: [
      { level: 1, cost: 100, description: "+25 max hull", effect: { maxHpAdd: 25 } },
      { level: 2, cost: 220, description: "+25 max hull", effect: { maxHpAdd: 25 } },
      { level: 3, cost: 400, description: "+1 flat armor", effect: { armorFlat: 1 } },
      { level: 4, cost: 640, description: "+40 max hull", effect: { maxHpAdd: 40 } },
    ],
  },
  {
    slot: "cockpit",
    name: "Cockpit Systems",
    description: "Better sensors, targeting, and salvage recovery.",
    tiers: [
      { level: 1, cost: 90, description: "+30 mote magnet radius", effect: { magnetRadiusAdd: 30 } },
      { level: 2, cost: 200, description: "+8% XP gain", effect: { xpGainMult: 0.08 } },
      { level: 3, cost: 380, description: "+5% critical chance", effect: { critChanceAdd: 0.05 } },
      { level: 4, cost: 600, description: "+5% retained motes on death", effect: { motesRetainedPctAdd: 0.05 } },
    ],
  },
];

export function getAttachmentDef(slot: AttachmentSlot): AttachmentDef {
  const def = ATTACHMENT_DEFS.find((a) => a.slot === slot);
  if (!def) throw new Error(`Unknown attachment slot: ${slot}`);
  return def;
}
