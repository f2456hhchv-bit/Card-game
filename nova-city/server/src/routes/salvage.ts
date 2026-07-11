import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, salvageEvents } from '../store/collections.js';
import { newId } from '../util/ids.js';
import { broadcastAll } from '../ws/manager.js';
import { salvagePayoutPerFuel, SALVAGE_DURATION_MINUTES } from '../domain/salvage.js';

export const salvageRouter = Router();
salvageRouter.use(requireAuth);

function currentEvent() {
  return salvageEvents.find((e) => !e.resolved);
}

function resolveIfDue() {
  const event = currentEvent();
  if (!event || Date.now() < event.endsAt) return event;
  const totalFuel = Object.values(event.contributions).reduce((sum, v) => sum + v, 0);
  const payoutPerFuel = salvagePayoutPerFuel(totalFuel);
  for (const [characterId, fuel] of Object.entries(event.contributions)) {
    const character = characters.get(characterId);
    if (!character) continue;
    characters.put({ ...character, credits: character.credits + Math.round(fuel * payoutPerFuel) });
  }
  const resolved = { ...event, resolved: true };
  salvageEvents.put(resolved);
  broadcastAll({ type: 'salvage-event-resolved', totalFuel, payoutPerFuel });
  return resolved;
}

salvageRouter.get('/current', (_req, res) => {
  const event = resolveIfDue();
  if (!event || event.resolved) {
    res.json({ event: null });
    return;
  }
  const totalFuel = Object.values(event.contributions).reduce((sum, v) => sum + v, 0);
  res.json({ event: { id: event.id, endsAt: event.endsAt, totalFuel } });
});

salvageRouter.post('/start', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  if (currentEvent()) {
    res.status(409).json({ error: 'A derelict is already being salvaged' });
    return;
  }
  const now = Date.now();
  const event = salvageEvents.put({
    id: newId('salvage'),
    startedAt: now,
    endsAt: now + SALVAGE_DURATION_MINUTES * 60_000,
    contributions: {},
    resolved: false,
  });
  broadcastAll({ type: 'salvage-event-started', endsAt: event.endsAt });
  res.status(201).json({ event: { id: event.id, endsAt: event.endsAt, totalFuel: 0 } });
});

salvageRouter.post('/:eventId/contribute', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const event = resolveIfDue();
  if (!event || event.resolved || event.id !== req.params.eventId) {
    res.status(409).json({ error: 'That salvage event is no longer active' });
    return;
  }
  const amount = Math.max(1, Math.min(character.resources.fuel, Math.round(Number(req.body?.amount) || 10)));
  if (character.resources.fuel < amount) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }
  characters.put({ ...character, resources: { ...character.resources, fuel: character.resources.fuel - amount } });
  const contributions = { ...event.contributions, [character.id]: (event.contributions[character.id] ?? 0) + amount };
  salvageEvents.put({ ...event, contributions });
  res.json({ contributed: amount, character: characterView(characters.get(character.id)!) });
});
