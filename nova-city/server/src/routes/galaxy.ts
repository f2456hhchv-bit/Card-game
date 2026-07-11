import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView, characterEffectiveStats } from './helpers.js';
import { characters, sectors, stations, ships, shipClasses } from '../store/collections.js';
import { settleAlienStrength, resolveSectorAttack } from '../domain/sector.js';
import { summarizeFleet } from '../domain/fleet.js';
import { combatRating } from '../domain/combat.js';
import { shiftAlignment } from '../domain/alignment.js';
import { requiredFleetPowerForStationTier, commandLicenseForStationTier } from '../domain/station.js';
import { discountedScoutCost } from '../domain/scouting.js';
import { newId } from '../util/ids.js';
import type { Character, Sector } from '../types.js';

export const galaxyRouter = Router();
galaxyRouter.use(requireAuth);

const ATTACK_FUEL_COST = 15;
const PLUNDER_RATIO = 0.4;

// Alien strength is a continuously-growing float (see settleAlienStrength), so a
// sector cleared to exactly 0 starts drifting fractionally above 0 again within
// milliseconds of real time passing. Treat it as cleared at integer granularity
// (matching how the UI displays it) so "cleared" has a real grace window instead
// of lasting a single instant.
function isSectorCleared(alienStrength: number): boolean {
  return Math.round(alienStrength) <= 0;
}

function settleSector(sector: Sector, now: number): Sector {
  const alienStrength = settleAlienStrength(sector, now);
  if (alienStrength !== sector.alienStrength) {
    const updated = { ...sector, alienStrength, lastTickAt: now };
    sectors.put(updated);
    return updated;
  }
  return sector;
}

function sectorView(sector: Sector, character: Character) {
  const explored = character.exploredSectorIds.includes(sector.id);
  const station = stations.find((s) => s.sectorId === sector.id);
  return {
    id: sector.id,
    name: sector.name,
    flavor: sector.flavor,
    scoutFuelCost: discountedScoutCost(sector.scoutFuelCost, character.exploredSectorIds.length),
    stationTier: sector.stationTier,
    stationPrice: sector.stationPrice,
    requiredFleetPower: requiredFleetPowerForStationTier(sector.stationTier),
    commandLicense: commandLicenseForStationTier(sector.stationTier),
    explored,
    alienStrength: explored ? sector.alienStrength : null,
    maxAlienStrength: explored ? sector.maxAlienStrength : null,
    resourceYield: explored ? sector.resourceYield : null,
    cleared: explored ? isSectorCleared(sector.alienStrength) : null,
    plundered: sector.plunderedByCharacterId !== null,
    hasStation: Boolean(station),
    controlledByMe: station?.ownerCharacterId === character.id || sector.plunderedByCharacterId === character.id,
  };
}

galaxyRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const now = Date.now();
  const view = sectors.all().map((sector) => sectorView(settleSector(sector, now), character));
  res.json({ sectors: view });
});

galaxyRouter.post('/:sectorId/scout', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const sector = sectors.get(req.params.sectorId);
  if (!sector) {
    res.status(404).json({ error: 'Unknown sector' });
    return;
  }
  const cost = discountedScoutCost(sector.scoutFuelCost, character.exploredSectorIds.length);
  if (character.resources.fuel < cost) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }
  const alreadyExplored = character.exploredSectorIds.includes(sector.id);
  const updated = {
    ...character,
    resources: { ...character.resources, fuel: character.resources.fuel - cost },
    exploredSectorIds: alreadyExplored ? character.exploredSectorIds : [...character.exploredSectorIds, sector.id],
  };
  characters.put(updated);
  res.json({ character: characterView(updated), sector: sectorView(settleSector(sector, Date.now()), updated) });
});

galaxyRouter.post('/:sectorId/attack', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  if (character.status !== 'ok') {
    res.status(409).json({ error: `You can't launch an attack while ${character.status}.` });
    return;
  }
  const rawSector = sectors.get(req.params.sectorId);
  if (!rawSector) {
    res.status(404).json({ error: 'Unknown sector' });
    return;
  }
  if (!character.exploredSectorIds.includes(rawSector.id)) {
    res.status(409).json({ error: 'Scout this sector before attacking it' });
    return;
  }
  const sector = settleSector(rawSector, Date.now());
  if (isSectorCleared(sector.alienStrength)) {
    res.status(409).json({ error: 'This sector is already cleared' });
    return;
  }
  if (character.resources.fuel < ATTACK_FUEL_COST) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }

  const classById = new Map(shipClasses.all().map((c) => [c.id, c]));
  const ownedShips = ships.filter((s) => s.ownerCharacterId === character.id);
  const { firepower } = summarizeFleet(ownedShips, classById);
  const characterAssist = combatRating(characterEffectiveStats(character));

  const outcome = resolveSectorAttack(firepower, characterAssist, sector.alienStrength, Math.random);
  const now = Date.now();
  sectors.put({ ...sector, alienStrength: outcome.remainingStrength, lastTickAt: now });

  const updatedCharacter = {
    ...character,
    resources: {
      ...character.resources,
      fuel: character.resources.fuel - ATTACK_FUEL_COST,
      health: Math.max(0, character.resources.health - outcome.characterDamage),
    },
  };
  characters.put(updatedCharacter);

  res.json({
    outcome,
    character: characterView(updatedCharacter),
    sector: sectorView({ ...sector, alienStrength: outcome.remainingStrength }, updatedCharacter),
  });
});

galaxyRouter.post('/:sectorId/build-station', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const rawSector = sectors.get(req.params.sectorId);
  if (!rawSector) {
    res.status(404).json({ error: 'Unknown sector' });
    return;
  }
  const sector = settleSector(rawSector, Date.now());
  if (!isSectorCleared(sector.alienStrength)) {
    res.status(409).json({ error: 'Clear the Hollow presence here first' });
    return;
  }
  if (sector.plunderedByCharacterId !== null) {
    res.status(409).json({ error: 'This sector was plundered — it can no longer host a station' });
    return;
  }
  if (stations.find((s) => s.sectorId === sector.id)) {
    res.status(409).json({ error: 'Someone has already built a station here' });
    return;
  }
  const requiredPower = requiredFleetPowerForStationTier(sector.stationTier);
  if (requiredPower > 0) {
    const classById = new Map(shipClasses.all().map((c) => [c.id, c]));
    const ownedShips = ships.filter((s) => s.ownerCharacterId === character.id);
    const { firepower } = summarizeFleet(ownedShips, classById);
    if (firepower < requiredPower) {
      const license = commandLicenseForStationTier(sector.stationTier);
      res.status(409).json({
        error: `Requires the ${license} (${requiredPower} fleet firepower to garrison a tier ${sector.stationTier} station)`,
      });
      return;
    }
  }
  if (character.credits < sector.stationPrice) {
    res.status(409).json({ error: 'Not enough credits' });
    return;
  }

  const station = stations.put({
    id: newId('station'),
    sectorId: sector.id,
    ownerCharacterId: character.id,
    tier: sector.stationTier,
    outputPerHour: sector.resourceYield,
    credits: 0,
    lastCollectedAt: Date.now(),
  });
  const updated = {
    ...character,
    credits: character.credits - sector.stationPrice,
    alignment: shiftAlignment(character.alignment, 5),
  };
  characters.put(updated);
  res.status(201).json({ station, character: characterView(updated) });
});

galaxyRouter.post('/:sectorId/plunder', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const rawSector = sectors.get(req.params.sectorId);
  if (!rawSector) {
    res.status(404).json({ error: 'Unknown sector' });
    return;
  }
  const sector = settleSector(rawSector, Date.now());
  if (!isSectorCleared(sector.alienStrength)) {
    res.status(409).json({ error: 'Clear the Hollow presence here first' });
    return;
  }
  if (sector.plunderedByCharacterId !== null || stations.find((s) => s.sectorId === sector.id)) {
    res.status(409).json({ error: 'This sector has already been claimed' });
    return;
  }

  const payout = Math.round(sector.stationPrice * PLUNDER_RATIO);
  sectors.put({ ...sector, plunderedByCharacterId: character.id });
  const updated = {
    ...character,
    credits: character.credits + payout,
    alignment: shiftAlignment(character.alignment, -8),
  };
  characters.put(updated);
  res.json({ payout, character: characterView(updated) });
});
