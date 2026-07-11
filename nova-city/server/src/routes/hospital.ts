import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, publicCharacterView } from './helpers.js';
import { characters } from '../store/collections.js';
import { sendToUser } from '../ws/manager.js';
import { tickCharacter, RESOURCE_MAX } from '../domain/regen.js';

export const hospitalRouter = Router();
hospitalRouter.use(requireAuth);

const MEDIC_ASSIST_REDUCTION_MINUTES = 10;
const MEDIC_ASSIST_COOLDOWN_MINUTES = 15;

hospitalRouter.get('/', (_req, res) => {
  const now = Date.now();
  const patients = characters
    .filter((c) => c.status === 'hospital')
    .map((c) => tickCharacter(c, now))
    .filter((c) => c.status === 'hospital')
    .map(publicCharacterView);
  res.json({ patients });
});

hospitalRouter.post('/:characterId/medic-assist', (req: AuthedRequest, res) => {
  const assister = requireCharacter(req.userId!, res);
  if (!assister) return;

  const target = characters.get(req.params.characterId);
  if (!target) {
    res.status(404).json({ error: 'Character not found' });
    return;
  }
  if (!assister.factionId || assister.factionId !== target.factionId) {
    res.status(403).json({ error: 'Only fleet-mates can render medical assistance.' });
    return;
  }
  const now = Date.now();
  if (assister.medicAssistUsedAt && now - assister.medicAssistUsedAt < MEDIC_ASSIST_COOLDOWN_MINUTES * 60_000) {
    res.status(429).json({ error: 'Medic assist is on cooldown.' });
    return;
  }
  const settledTarget = tickCharacter(target, now);
  if (settledTarget.status !== 'hospital' || settledTarget.statusUntil === null) {
    res.status(409).json({ error: 'That pilot is not in the Medbay.' });
    return;
  }

  const reducedUntil = settledTarget.statusUntil - MEDIC_ASSIST_REDUCTION_MINUTES * 60_000;
  const released = reducedUntil <= now;
  const updatedTarget = released
    ? { ...settledTarget, status: 'ok' as const, statusUntil: null, resources: { ...settledTarget.resources, health: RESOURCE_MAX.health } }
    : { ...settledTarget, statusUntil: reducedUntil };
  const updatedAssister = { ...assister, medicAssistUsedAt: now };

  characters.put(updatedTarget);
  characters.put(updatedAssister);

  sendToUser(target.userId, {
    type: 'medic-assist',
    byCallsign: assister.callsign,
    minutesRemoved: MEDIC_ASSIST_REDUCTION_MINUTES,
  });
  if (released) {
    sendToUser(target.userId, { type: 'hospital-released' });
  }

  res.json({ released, statusUntil: updatedTarget.statusUntil });
});
