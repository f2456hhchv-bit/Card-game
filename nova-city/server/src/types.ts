export type Stat = 'strength' | 'defense' | 'speed' | 'dexterity';
export type ResourceKey = 'fuel' | 'resolve' | 'morale' | 'health';
export type CharacterStatus = 'ok' | 'jail' | 'hospital' | 'transit';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'contraband';
export type HullClass = 'scout' | 'frigate' | 'cruiser' | 'dreadnought';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface ResourcePool {
  fuel: number;
  resolve: number;
  morale: number;
  health: number;
  /** epoch ms of the last time regen was settled into the stored values above */
  updatedAt: number;
}

export interface InventoryStack {
  itemId: string;
  qty: number;
  /** epoch ms acquired, used for contraband decay */
  acquiredAt: number;
}

export interface Character {
  id: string;
  userId: string;
  callsign: string;
  level: number;
  xp: number;
  credits: number;
  stats: Record<Stat, number>;
  resources: ResourcePool;
  status: CharacterStatus;
  statusUntil: number | null;
  locationId: string;
  travelDestinationId: string | null;
  equippedWeaponId: string | null;
  equippedArmorId: string | null;
  inventory: InventoryStack[];
  factionId: string | null;
  medicAssistUsedAt: number | null;
  /** -100 (ruthless) .. 100 (benevolent), shifted only by rebuild/plunder choices */
  alignment: number;
  exploredSectorIds: string[];
  createdAt: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  tier: number;
  price: number;
  flavor: string;
  statBonus?: Partial<Record<Stat, number>>;
  healAmount?: number;
  resourceRestore?: { resource: ResourceKey; amount: number };
  decays?: boolean;
}

export interface Crime {
  id: string;
  name: string;
  flavor: string;
  locationId: string | null;
  fuelCost: number;
  difficulty: number;
  primaryStats: Stat[];
  minReward: number;
  maxReward: number;
  jailMinutes: number;
  xp: number;
}

export interface Location {
  id: string;
  name: string;
  flavor: string;
  travelMinutes: number;
}

export interface FactionWar {
  id: string;
  factionAId: string;
  factionBId: string;
  startedAt: number;
  endsAt: number;
  /** factionId -> contribution points */
  contributions: Record<string, number>;
  resolved: boolean;
  winnerFactionId: string | null;
}

export interface Faction {
  id: string;
  name: string;
  tag: string;
  leaderId: string;
  memberIds: string[];
  bank: number;
  createdAt: number;
}

export interface FactionMessage {
  id: string;
  factionId: string;
  authorId: string;
  authorCallsign: string;
  body: string;
  createdAt: number;
}

export interface Mail {
  id: string;
  fromUserId: string;
  fromCallsign: string;
  toUserId: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: number;
}

export interface CombatLog {
  id: string;
  attackerId: string;
  defenderId: string;
  winnerId: string;
  log: string[];
  salvage: number;
  timestamp: number;
}

export interface ShipClass {
  id: string;
  hullClass: HullClass;
  name: string;
  flavor: string;
  price: number;
  firepower: number;
  shieldHP: number;
  cargo: number;
  crewCapacity: number;
}

export interface Ship {
  id: string;
  ownerCharacterId: string;
  shipClassId: string;
  name: string;
  builtAt: number;
}

export interface Sector {
  id: string;
  name: string;
  flavor: string;
  /** current Hollow-touched hostile presence, settled lazily on read */
  alienStrength: number;
  maxAlienStrength: number;
  alienGrowthPerHour: number;
  lastTickAt: number;
  resourceYield: number;
  scoutFuelCost: number;
  stationTier: number;
  stationPrice: number;
  /** set once someone plunders this sector instead of building — blocks a station here forever */
  plunderedByCharacterId: string | null;
}

export interface Station {
  id: string;
  sectorId: string;
  ownerCharacterId: string;
  tier: number;
  outputPerHour: number;
  /** accrued but not yet collected, settled lazily on read */
  credits: number;
  lastCollectedAt: number;
}

export interface SalvageEvent {
  id: string;
  startedAt: number;
  endsAt: number;
  /** characterId -> fuel committed */
  contributions: Record<string, number>;
  resolved: boolean;
}
