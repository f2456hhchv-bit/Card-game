import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, bounties } from '../store/collections.js';
import { newId } from '../util/ids.js';

export const bountyRouter = Router();
bountyRouter.use(requireAuth);

const MIN_BOUNTY = 50;

bountyRouter.get('/', (_req, res) => {
  const active = bounties
    .filter((b) => b.claimedByCharacterId === null)
    .sort((a, b) => b.amount - a.amount)
    .map((b) => ({
      id: b.id,
      targetCharacterId: b.targetCharacterId,
      targetCallsign: b.targetCallsign,
      placedByCharacterId: b.placedByCharacterId,
      placedByCallsign: b.placedByCallsign,
      amount: b.amount,
      createdAt: b.createdAt,
    }));
  res.json({ bounties: active });
});

bountyRouter.post('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { targetCharacterId } = req.body ?? {};
  const amount = Math.round(Number(req.body?.amount));
  if (!Number.isFinite(amount) || amount < MIN_BOUNTY) {
    res.status(409).json({ error: `Bounty must be at least ${MIN_BOUNTY} credits` });
    return;
  }
  if (character.credits < amount) {
    res.status(409).json({ error: 'Not enough credits' });
    return;
  }
  if (typeof targetCharacterId !== 'string' || targetCharacterId === character.id) {
    res.status(409).json({ error: 'Choose another pilot to place a bounty on' });
    return;
  }
  const target = characters.get(targetCharacterId);
  if (!target) {
    res.status(404).json({ error: 'Target not found' });
    return;
  }

  characters.put({ ...character, credits: character.credits - amount });
  const bounty = bounties.put({
    id: newId('bounty'),
    targetCharacterId: target.id,
    targetCallsign: target.callsign,
    placedByCharacterId: character.id,
    placedByCallsign: character.callsign,
    amount,
    createdAt: Date.now(),
    claimedByCharacterId: null,
    claimedAt: null,
  });
  res.status(201).json({ bounty, character: characterView(characters.get(character.id)!) });
});
