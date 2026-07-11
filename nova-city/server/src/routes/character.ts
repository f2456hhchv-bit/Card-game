import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { characters } from '../store/collections.js';
import { characterView, hydrateCharacter, publicCharacterView, requireCharacter } from './helpers.js';
import { tickCharacter } from '../domain/regen.js';

export const characterRouter = Router();
characterRouter.use(requireAuth);

characterRouter.get('/me', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  res.json({ character: characterView(character) });
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
