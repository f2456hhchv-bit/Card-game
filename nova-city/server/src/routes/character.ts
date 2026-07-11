import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { characters } from '../store/collections.js';
import { characterView, hydrateCharacter, publicCharacterView, requireCharacter } from './helpers.js';
import { tickCharacter } from '../domain/regen.js';
import { RESOURCE_MAX } from '../domain/regen.js';
import { canClaimDailyBonus, dailyBonusReward, stampDailyBonusDate } from '../domain/dailyBonus.js';

export const characterRouter = Router();
characterRouter.use(requireAuth);

characterRouter.get('/me', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  res.json({ character: characterView(character) });
});

characterRouter.post('/daily-bonus', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const now = Date.now();
  if (!canClaimDailyBonus(character.lastDailyBonusDate, now)) {
    res.status(409).json({ error: 'Already claimed today — come back tomorrow' });
    return;
  }

  const reward = dailyBonusReward(character.level);
  const updated = {
    ...character,
    credits: character.credits + reward.credits,
    resources: {
      ...character.resources,
      fuel: Math.min(RESOURCE_MAX.fuel, character.resources.fuel + reward.fuel),
      resolve: Math.min(RESOURCE_MAX.resolve, character.resources.resolve + reward.resolve),
    },
    lastDailyBonusDate: stampDailyBonusDate(now),
  };
  characters.put(updated);
  res.json({ character: characterView(updated), reward });
});

characterRouter.get('/:id', (req: AuthedRequest, res) => {
  const target = characters.get(req.params.id);
  if (!target) {
    res.status(404).json({ error: 'Character not found' });
    return;
  }
  const ticked = tickCharacter(hydrateCharacter(target), Date.now());
  characters.put(ticked);
  res.json({ character: publicCharacterView(ticked) });
});
