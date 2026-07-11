import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, crimes } from '../store/collections.js';
import { crimeSuccessChance, resolveCrime } from '../domain/crimes.js';
import { applyXp } from '../domain/leveling.js';

export const crimesRouter = Router();
crimesRouter.use(requireAuth);

crimesRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const available = crimes
    .filter((c) => c.locationId === null || c.locationId === character.locationId)
    .map((c) => ({ ...c, chance: crimeSuccessChance(character.stats, character.resources.morale, c) }));
  res.json({ crimes: available });
});

crimesRouter.post('/:crimeId/attempt', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  if (character.status !== 'ok') {
    res.status(409).json({ error: `You can't run a crime while ${character.status}.` });
    return;
  }

  const crime = crimes.get(req.params.crimeId);
  if (!crime) {
    res.status(404).json({ error: 'Unknown crime' });
    return;
  }
  if (crime.locationId !== null && crime.locationId !== character.locationId) {
    res.status(409).json({ error: 'This crime is not available at your current location' });
    return;
  }
  if (character.resources.fuel < crime.fuelCost) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }

  const result = resolveCrime(character.stats, character.resources.morale, crime, Math.random);
  const leveled = applyXp(character.level, character.xp, result.xp);

  const updated = {
    ...character,
    credits: character.credits + result.reward,
    xp: leveled.xp,
    level: leveled.level,
    resources: { ...character.resources, fuel: character.resources.fuel - crime.fuelCost },
    status: result.success ? character.status : ('jail' as const),
    statusUntil: result.success ? character.statusUntil : Date.now() + result.jailMinutes * 60_000,
  };
  characters.put(updated);
  res.json({ character: characterView(updated), result, leveledUp: leveled.leveledUp });
});
