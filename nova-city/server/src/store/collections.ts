import fs from 'node:fs';
import { Collection } from './db.js';
import type {
  User,
  Character,
  Item,
  Crime,
  Location,
  Faction,
  FactionWar,
  FactionMessage,
  Mail,
  CombatLog,
  SalvageEvent,
} from '../types.js';

function loadJson<T>(relativePath: string): T {
  const url = new URL(relativePath, import.meta.url);
  return JSON.parse(fs.readFileSync(url, 'utf-8')) as T;
}

const itemSeed = loadJson<Item[]>('../data/items.json');
const crimeSeed = loadJson<Crime[]>('../data/crimes.json');
const locationSeed = loadJson<Location[]>('../data/locations.json');

export const users = new Collection<User>('users');
export const characters = new Collection<Character>('characters');
export const items = new Collection<Item>('items', itemSeed);
export const crimes = new Collection<Crime>('crimes', crimeSeed);
export const locations = new Collection<Location>('locations', locationSeed);
export const factions = new Collection<Faction>('factions');
export const factionWars = new Collection<FactionWar>('faction_wars');
export const factionMessages = new Collection<FactionMessage>('faction_messages');
export const mail = new Collection<Mail>('mail');
export const combatLogs = new Collection<CombatLog>('combat_logs');
export const salvageEvents = new Collection<SalvageEvent>('salvage_events');

export const HOME_LOCATION_ID = 'nova-city';
