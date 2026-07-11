import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView, achievementInput } from './helpers.js';
import { characters } from '../store/collections.js';
import { ACHIEVEMENTS, unlockedAchievementIds } from '../domain/achievements.js';

export const achievementsRouter = Router();
achievementsRouter.use(requireAuth);

achievementsRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const unlocked = new Set(unlockedAchievementIds(achievementInput(character)));
  const claimed = new Set(character.claimedAchievementIds);
  const view = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlocked.has(a.id),
    claimed: claimed.has(a.id),
  }));
  res.json({ achievements: view });
});

achievementsRouter.post('/:id/claim', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const def = ACHIEVEMENTS.find((a) => a.id === req.params.id);
  if (!def) {
    res.status(404).json({ error: 'Unknown achievement' });
    return;
  }
  if (character.claimedAchievementIds.includes(def.id)) {
    res.status(409).json({ error: 'Already claimed' });
    return;
  }
  const unlocked = unlockedAchievementIds(achievementInput(character));
  if (!unlocked.includes(def.id)) {
    res.status(409).json({ error: 'Not unlocked yet' });
    return;
  }

  const updated = {
    ...character,
    credits: character.credits + def.reward,
    claimedAchievementIds: [...character.claimedAchievementIds, def.id],
  };
  characters.put(updated);
  res.json({ character: characterView(updated), reward: def.reward });
});
