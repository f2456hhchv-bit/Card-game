import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters } from '../store/collections.js';
import { trainingGain } from '../domain/training.js';
import type { Stat } from '../types.js';

export const gymRouter = Router();
gymRouter.use(requireAuth);

const VALID_STATS: Stat[] = ['strength', 'defense', 'speed', 'dexterity'];
const MAX_TRAIN_FUEL = 50;

gymRouter.post('/train', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  if (character.status !== 'ok') {
    res.status(409).json({ error: `You can't train while ${character.status}.` });
    return;
  }

  const { stat, fuel } = req.body ?? {};
  if (typeof stat !== 'string' || !VALID_STATS.includes(stat as Stat)) {
    res.status(400).json({ error: `stat must be one of ${VALID_STATS.join(', ')}` });
    return;
  }
  const fuelSpent = Math.min(MAX_TRAIN_FUEL, Math.max(1, Math.round(Number(fuel) || 10)));
  if (character.resources.fuel < fuelSpent) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }

  const statKey = stat as Stat;
  const gain = trainingGain(character.stats[statKey], fuelSpent);
  const updated = {
    ...character,
    stats: { ...character.stats, [statKey]: character.stats[statKey] + gain },
    resources: { ...character.resources, fuel: character.resources.fuel - fuelSpent },
  };
  characters.put(updated);
  res.json({ character: characterView(updated), gain, stat: statKey, fuelSpent });
});
