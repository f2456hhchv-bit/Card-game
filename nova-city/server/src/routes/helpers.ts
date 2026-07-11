import type { Response } from 'express';
import { characters, items, ships, stations, sectors } from '../store/collections.js';
import { tickCharacter } from '../domain/regen.js';
import { effectiveStats } from '../domain/gear.js';
import { commandRank } from '../domain/commandRank.js';
import { alignmentLabel } from '../domain/alignment.js';
import { tradeRank } from '../domain/trade.js';
import { navigatorRank } from '../domain/scouting.js';
import { canClaimDailyBonus } from '../domain/dailyBonus.js';
import type { Character } from '../types.js';

export function getCharacterByUserId(userId: string): Character | undefined {
  return characters.find((c) => c.userId === userId);
}

/**
 * Backfills fields added after some characters were already saved (the JSON
 * store does raw JSON.parse with no schema validation/migration).
 */
export function hydrateCharacter(character: Character): Character {
  return {
    ...character,
    alignment: character.alignment ?? 0,
    exploredSectorIds: character.exploredSectorIds ?? [],
    tradesCompleted: character.tradesCompleted ?? 0,
    claimedAchievementIds: character.claimedAchievementIds ?? [],
    lastDailyBonusDate: character.lastDailyBonusDate ?? null,
  };
}

/** Settles regen/status and persists the result — the single read path every route should use. */
export function loadAndSettleCharacter(userId: string): Character | undefined {
  const character = getCharacterByUserId(userId);
  if (!character) return undefined;
  const ticked = tickCharacter(hydrateCharacter(character), Date.now());
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

export function characterCommandSummary(character: Character) {
  const ownedShips = ships.filter((s) => s.ownerCharacterId === character.id);
  const ownedStations = stations.filter((s) => s.ownerCharacterId === character.id);
  const plunderedSectors = sectors.filter((s) => s.plunderedByCharacterId === character.id);
  const sectorsControlled = ownedStations.length + plunderedSectors.length;
  return {
    shipCount: ownedShips.length,
    stationCount: ownedStations.length,
    sectorsControlled,
    rank: commandRank({
      shipCount: ownedShips.length,
      stationCount: ownedStations.length,
      sectorsControlled,
      alignment: character.alignment,
    }),
  };
}

export function characterView(character: Character) {
  const command = characterCommandSummary(character);
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
    alignment: character.alignment,
    alignmentLabel: alignmentLabel(character.alignment),
    commandRank: command.rank,
    shipCount: command.shipCount,
    stationCount: command.stationCount,
    sectorsControlled: command.sectorsControlled,
    exploredSectorIds: character.exploredSectorIds,
    tradesCompleted: character.tradesCompleted,
    tradeRank: tradeRank(character.tradesCompleted).name,
    navigatorRank: navigatorRank(character.exploredSectorIds.length).name,
    dailyBonusAvailable: canClaimDailyBonus(character.lastDailyBonusDate, Date.now()),
  };
}

export function achievementInput(character: Character) {
  const command = characterCommandSummary(character);
  return {
    level: character.level,
    totalTrainedStats:
      character.stats.strength + character.stats.defense + character.stats.speed + character.stats.dexterity,
    tradesCompleted: character.tradesCompleted,
    sectorsExplored: character.exploredSectorIds.length,
    shipCount: command.shipCount,
    stationCount: command.stationCount,
    sectorsControlled: command.sectorsControlled,
    alignment: character.alignment,
    credits: character.credits,
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
