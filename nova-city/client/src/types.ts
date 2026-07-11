export type Stat = 'strength' | 'defense' | 'speed' | 'dexterity';
export type ResourceKey = 'fuel' | 'resolve' | 'morale' | 'health';
export type CharacterStatus = 'ok' | 'jail' | 'hospital' | 'transit';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'contraband';
export type HullClass = 'scout' | 'frigate' | 'cruiser' | 'dreadnought';

export interface ResourcePool {
  fuel: number;
  resolve: number;
  morale: number;
  health: number;
  updatedAt: number;
}

export interface InventoryStack {
  itemId: string;
  qty: number;
  acquiredAt: number;
}

export interface Character {
  id: string;
  callsign: string;
  level: number;
  xp: number;
  credits: number;
  stats: Record<Stat, number>;
  effectiveStats: Record<Stat, number>;
  resources: ResourcePool;
  status: CharacterStatus;
  statusUntil: number | null;
  locationId: string;
  equippedWeaponId: string | null;
  equippedArmorId: string | null;
  inventory: InventoryStack[];
  factionId: string | null;
  alignment: number;
  alignmentLabel: string;
  commandRank: string;
  shipCount: number;
  stationCount: number;
  sectorsControlled: number;
  exploredSectorIds: string[];
}

export interface PublicCharacter {
  id: string;
  callsign: string;
  level: number;
  status: CharacterStatus;
  statusUntil: number | null;
  locationId: string;
  factionId: string | null;
}

export interface PlayerTarget extends PublicCharacter {
  kind: 'player';
}

export interface NpcTarget {
  id: string;
  name: string;
  flavor: string;
  tier: number;
  kind: 'npc';
  defeated: boolean;
  respawnsAt: number | null;
}

export type CombatTarget = PlayerTarget | NpcTarget;

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
  chance: number;
}

export interface Location {
  id: string;
  name: string;
  flavor: string;
  travelMinutes: number;
}

export interface FactionSummary {
  id: string;
  name: string;
  tag: string;
  leaderId: string;
  memberCount: number;
  memberIds?: string[];
  bank?: number;
  war: { opponentFactionId: string; endsAt: number } | null;
}

export interface FactionMessage {
  id: string;
  factionId: string;
  authorId: string;
  authorCallsign: string;
  body: string;
  createdAt: number;
}

export interface MailMessage {
  id: string;
  fromUserId: string;
  fromCallsign: string;
  toUserId: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: number;
}

export interface LeaderboardRow {
  id: string;
  callsign: string;
  level: number;
  netWorth: number;
  combatRating: number;
}

export interface SalvageEventSummary {
  id: string;
  endsAt: number;
  totalFuel: number;
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
  requiredTotalStats: number;
  certification: string | null;
}

export interface Ship {
  id: string;
  ownerCharacterId: string;
  shipClassId: string;
  name: string;
  builtAt: number;
  shipClass?: ShipClass;
}

export interface FleetSummary {
  shipCount: number;
  firepower: number;
  shieldHP: number;
  cargo: number;
  crewCapacity: number;
}

export interface SectorView {
  id: string;
  name: string;
  flavor: string;
  scoutFuelCost: number;
  stationTier: number;
  stationPrice: number;
  explored: boolean;
  alienStrength: number | null;
  maxAlienStrength: number | null;
  resourceYield: number | null;
  cleared: boolean | null;
  plundered: boolean;
  hasStation: boolean;
  controlledByMe: boolean;
}

export interface SectorAttackOutcome {
  attackPower: number;
  damageDealt: number;
  remainingStrength: number;
  cleared: boolean;
  outmatched: boolean;
  characterDamage: number;
}

export interface OwnedStation {
  id: string;
  sectorId: string;
  ownerCharacterId: string;
  tier: number;
  outputPerHour: number;
  credits: number;
  lastCollectedAt: number;
  sector?: SectorView;
}

export type WsEvent =
  | { type: 'connected' }
  | { type: 'attacked'; attackerCallsign: string; won: boolean; log: string[] }
  | { type: 'jail-released' }
  | { type: 'jail-sprung'; byCallsign: string }
  | { type: 'hospital-released' }
  | { type: 'medic-assist'; byCallsign: string; minutesRemoved: number }
  | { type: 'mail'; fromCallsign: string; subject: string }
  | { type: 'faction-message'; factionId: string; authorCallsign: string; body: string }
  | { type: 'faction-war-update'; factionId: string; message: string }
  | { type: 'salvage-event-started'; endsAt: number }
  | { type: 'salvage-event-resolved'; totalFuel: number; payoutPerFuel: number };
