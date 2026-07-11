import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView, publicCharacterView } from './helpers.js';
import { characters } from '../store/collections.js';
import { sendToUser } from '../ws/manager.js';
import { tickCharacter } from '../domain/regen.js';

export const jailRouter = Router();
jailRouter.use(requireAuth);

const SPRING_RESOLVE_COST = 15;
const SPRING_CREDIT_COST = 50;

jailRouter.get('/', (_req, res) => {
  const now = Date.now();
  const inmates = characters
    .filter((c) => c.status === 'jail')
    .map((c) => tickCharacter(c, now))
    .filter((c) => c.status === 'jail')
    .map(publicCharacterView);
  res.json({ inmates });
});

jailRouter.post('/:characterId/spring', (req: AuthedRequest, res) => {
  const springer = requireCharacter(req.userId!, res);
  if (!springer) return;

  if (springer.status !== 'ok') {
    res.status(409).json({ error: `You can't do that while ${springer.status}.` });
    return;
  }
  const target = characters.get(req.params.characterId);
  if (!target) {
    res.status(404).json({ error: 'Character not found' });
    return;
  }
  if (target.id === springer.id) {
    res.status(400).json({ error: "You can't spring yourself." });
    return;
  }
  const settledTarget = tickCharacter(target, Date.now());
  if (settledTarget.status !== 'jail') {
    res.status(409).json({ error: 'That pilot is not in the Brig.' });
    return;
  }
  if (springer.resources.resolve < SPRING_RESOLVE_COST || springer.credits < SPRING_CREDIT_COST) {
    res.status(409).json({ error: 'Not enough Resolve/credits to attempt a spring.' });
    return;
  }

  const updatedSpringer = {
    ...springer,
    credits: springer.credits - SPRING_CREDIT_COST,
    resources: { ...springer.resources, resolve: springer.resources.resolve - SPRING_RESOLVE_COST },
  };
  const updatedTarget = { ...settledTarget, status: 'ok' as const, statusUntil: null };
  characters.put(updatedSpringer);
  characters.put(updatedTarget);

  sendToUser(target.userId, { type: 'jail-sprung', byCallsign: springer.callsign });

  res.json({ character: characterView(updatedSpringer) });
});
