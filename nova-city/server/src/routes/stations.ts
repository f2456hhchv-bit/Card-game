import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, stations, sectors } from '../store/collections.js';
import { settleStationCredits } from '../domain/station.js';

export const stationsRouter = Router();
stationsRouter.use(requireAuth);

stationsRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const now = Date.now();
  const owned = stations
    .filter((s) => s.ownerCharacterId === character.id)
    .map((s) => ({ ...s, credits: settleStationCredits(s, now), sector: sectors.get(s.sectorId) }));
  res.json({ stations: owned });
});

stationsRouter.post('/:id/collect', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const station = stations.get(req.params.id);
  if (!station || station.ownerCharacterId !== character.id) {
    res.status(404).json({ error: 'Station not found' });
    return;
  }
  const now = Date.now();
  const accrued = settleStationCredits(station, now);
  stations.put({ ...station, credits: 0, lastCollectedAt: now });
  const updated = { ...character, credits: character.credits + Math.round(accrued) };
  characters.put(updated);
  res.json({ collected: Math.round(accrued), character: characterView(updated) });
});
