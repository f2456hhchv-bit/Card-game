import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, locations, HOME_LOCATION_ID } from '../store/collections.js';

export const travelRouter = Router();
travelRouter.use(requireAuth);

function tripMinutes(fromId: string, toId: string): number {
  const from = locations.get(fromId);
  const to = locations.get(toId);
  if (!from || !to) return 3;
  if (toId === HOME_LOCATION_ID) return from.travelMinutes;
  if (fromId === HOME_LOCATION_ID) return to.travelMinutes;
  return Math.round((from.travelMinutes + to.travelMinutes) / 2) + 1;
}

travelRouter.get('/', (_req, res) => {
  res.json({ locations: locations.all() });
});

travelRouter.post('/:locationId/travel', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  if (character.status !== 'ok') {
    res.status(409).json({ error: `You can't travel while ${character.status}.` });
    return;
  }
  const destination = locations.get(req.params.locationId);
  if (!destination) {
    res.status(404).json({ error: 'Unknown destination' });
    return;
  }
  if (destination.id === character.locationId) {
    res.status(409).json({ error: "You're already there." });
    return;
  }
  const minutes = tripMinutes(character.locationId, destination.id);
  const updated = {
    ...character,
    status: 'transit' as const,
    statusUntil: Date.now() + minutes * 60_000,
    travelDestinationId: destination.id,
  };
  characters.put(updated);
  res.json({ character: characterView(updated), travelMinutes: minutes });
});
