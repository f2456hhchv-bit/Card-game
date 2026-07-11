import type { Response } from 'express';
import { characters, items } from '../store/collections.js';
import { tickCharacter } from '../domain/regen.js';
import { effectiveStats } from '../domain/gear.js';
import type { Character } from '../types.js';

export function getCharacterByUserId(userId: string): Character | undefined {
  return characters.find((c) => c.userId === userId);
}

/** Settles regen/status and persists the result — the single read path every route should use. */
export function loadAndSettleCharacter(userId: string): Character | undefined {
  const character = getCharacterByUserId(userId);
  if (!character) return undefined;
  const ticked = tickCharacter(character, Date.now());
  characters.put(ticked);
  return ticked;
}

export function requireCharacter(userId: string, res: Response): Character | undefined {
  const character = loadAndSettleCharacter(userId);
  if (!character) {
    res.status(404).json({ error: 'No character for this account' });
    return undefined;
  }
  return character;
}

export function characterEffectiveStats(character: Character) {
  const weapon = character.equippedWeaponId ? items.get(character.equippedWeaponId) : undefined;
  const armor = character.equippedArmorId ? items.get(character.equippedArmorId) : undefined;
  return effectiveStats(character.stats, weapon, armor);
}

export function netWorth(character: Character): number {
  const inventoryValue = character.inventory.reduce((sum, stack) => {
    const item = items.get(stack.itemId);
    return sum + (item ? item.price * stack.qty : 0);
  }, 0);
  return character.credits + inventoryValue;
}

export function characterView(character: Character) {
  return {
    id: character.id,
    callsign: character.callsign,
    level: character.level,
    xp: character.xp,
    credits: character.credits,
    stats: character.stats,
    effectiveStats: characterEffectiveStats(character),
    resources: character.resources,
    status: character.status,
    statusUntil: character.statusUntil,
    locationId: character.locationId,
    equippedWeaponId: character.equippedWeaponId,
    equippedArmorId: character.equippedArmorId,
    inventory: character.inventory,
    factionId: character.factionId,
  };
}

export function publicCharacterView(character: Character) {
  return {
    id: character.id,
    callsign: character.callsign,
    level: character.level,
    status: character.status,
    statusUntil: character.statusUntil,
    locationId: character.locationId,
    factionId: character.factionId,
  };
}
