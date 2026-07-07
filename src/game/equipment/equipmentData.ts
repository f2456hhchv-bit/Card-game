/**
 * Equipment data shapes (AF-028). Slot vocabulary resolves AF-027's
 * deferred loadout shape; bonus kinds route into EXISTING stat surfaces
 * (AF-020/AF-021/AF-022/AF-025) — no new stat pipelines invented.
 */
export const EQUIPMENT_SLOTS = [
  "commander",
  "ship",
  "primaryWeapon",
  "secondaryWeapon",
  "equipment1",
  "equipment2",
  "equipment3",
  "equipment4",
  "equipment5",
  "equipment6",
  "relic1",
  "relic2",
  "relic3",
  "relic4",
  "relic5",
  "relic6",
] as const;

export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

export const EQUIPMENT_CATEGORIES = [
  "primaryWeapon",
  "secondarySystem",
  "defensiveModule",
  "engineModule",
  "targetingSystem",
  "energyModule",
  "utilityModule",
  "droneModule",
  "orbitalModule",
  "relic",
  "prototypeEquipment",
  "ancientTechnology",
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

/** Which slots accept which categories (AF-028 §6 slot-type validation). */
export const SLOT_ACCEPTS: Readonly<Record<EquipmentSlot, readonly EquipmentCategory[]>> = {
  commander: [],
  ship: [],
  primaryWeapon: ["primaryWeapon"],
  secondaryWeapon: ["secondarySystem"],
  equipment1: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  equipment2: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  equipment3: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  equipment4: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  equipment5: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  equipment6: ["defensiveModule", "engineModule", "targetingSystem", "energyModule", "utilityModule", "droneModule", "orbitalModule", "prototypeEquipment", "ancientTechnology"],
  relic1: ["relic"],
  relic2: ["relic"],
  relic3: ["relic"],
  relic4: ["relic"],
  relic5: ["relic"],
  relic6: ["relic"],
};

export type BonusKind =
  | "damage"
  | "criticalChance"
  | "criticalDamage"
  | "shieldCapacity"
  | "shieldRegeneration"
  | "movementSpeed"
  | "boostEfficiency"
  | "cooldownReduction"
  | "statusChance"
  | "statusDuration"
  | "resourceGain"
  | "experienceGain"
  | "pickupRadius"
  | "droneEffectiveness" // registered future — no drone system yet
  | "orbitalPower"; // registered future — no orbital system yet

export interface EquipmentBonus {
  kind: BonusKind;
  value: number;
}

export type PassiveTrigger =
  | "onKill"
  | "onDamageTaken"
  | "onShieldBreak"
  | "onLowHealth"
  | "onCriticalHit"
  | "onBossPresent" // registered future — no boss system yet
  | "onMissionModifier"; // registered future — no mission-type system yet

export interface PassiveEffect {
  trigger: PassiveTrigger;
  bonus: EquipmentBonus;
  /** For onLowHealth — health fraction threshold. */
  threshold?: number;
}

export interface ActiveModule {
  id: string;
  name: string;
  cooldownMs: number;
}

export interface EquipmentItemDef {
  id: string;
  category: EquipmentCategory;
  name: string;
  bonuses: readonly EquipmentBonus[];
  passives: readonly PassiveEffect[];
  active: ActiveModule | null;
  /** Set membership — null if not part of a set. */
  setId: string | null;
  /** Only one instance of a unique-exclusive item may be equipped at once. */
  uniqueExclusive: boolean;
  /** This item requires another category present in the loadout. */
  requiresCategory: EquipmentCategory | null;
}

export interface SetDef {
  id: string;
  name: string;
  pieceIds: readonly string[];
  /** Piece-count threshold → bonus granted (additive, AF-028 §5). */
  thresholds: Readonly<Record<number, readonly EquipmentBonus[]>>;
}

/** Sandbox content — proves the aggregation/validation/set engine. */
export const SANDBOX_EQUIPMENT: readonly EquipmentItemDef[] = [
  { id: "refit-cannon", category: "primaryWeapon", name: "Refit Cannon", bonuses: [{ kind: "damage", value: 0.1 }], passives: [], active: null, setId: null, uniqueExclusive: false, requiresCategory: null },
  { id: "barrier-plate", category: "defensiveModule", name: "Barrier Plate", bonuses: [{ kind: "shieldCapacity", value: 15 }], passives: [{ trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 5 } }], active: null, setId: "vanguard", uniqueExclusive: false, requiresCategory: null },
  { id: "vanguard-thrusters", category: "engineModule", name: "Vanguard Thrusters", bonuses: [{ kind: "movementSpeed", value: 0.08 }], passives: [], active: null, setId: "vanguard", uniqueExclusive: false, requiresCategory: null },
  { id: "vanguard-core", category: "energyModule", name: "Vanguard Core", bonuses: [{ kind: "cooldownReduction", value: 0.1 }], passives: [{ trigger: "onCriticalHit", bonus: { kind: "criticalDamage", value: 0.15 } }], active: null, setId: "vanguard", uniqueExclusive: false, requiresCategory: null },
  { id: "ancient-relay", category: "ancientTechnology", name: "Ancient Relay", bonuses: [{ kind: "experienceGain", value: 0.2 }], passives: [], active: null, setId: null, uniqueExclusive: true, requiresCategory: "primaryWeapon" },
];

export const SANDBOX_SETS: readonly SetDef[] = [
  {
    id: "vanguard",
    name: "Vanguard Set",
    pieceIds: ["barrier-plate", "vanguard-thrusters", "vanguard-core"],
    thresholds: {
      2: [{ kind: "boostEfficiency", value: 0.1 }],
      3: [{ kind: "shieldCapacity", value: 25 }],
    },
  },
];
