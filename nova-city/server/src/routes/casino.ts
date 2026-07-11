import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters } from '../store/collections.js';
import { flipCoin, spinSlots } from '../domain/casino.js';

export const casinoRouter = Router();
casinoRouter.use(requireAuth);

const MIN_BET = 10;
const MAX_BET = 5000;

function parseBet(raw: unknown, credits: number): number | null {
  const bet = Math.round(Number(raw));
  if (!Number.isFinite(bet) || bet < MIN_BET || bet > MAX_BET || bet > credits) return null;
  return bet;
}

casinoRouter.post('/slots', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const bet = parseBet(req.body?.bet, character.credits);
  if (bet === null) {
    res.status(409).json({ error: `Bet must be between ${MIN_BET} and ${Math.min(MAX_BET, character.credits)} credits` });
    return;
  }

  const result = spinSlots(bet, Math.random);
  const updated = { ...character, credits: character.credits - bet + result.payout };
  characters.put(updated);
  res.json({ character: characterView(updated), result });
});

casinoRouter.post('/coinflip', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const bet = parseBet(req.body?.bet, character.credits);
  const choice = req.body?.choice === 'tails' ? 'tails' : req.body?.choice === 'heads' ? 'heads' : null;
  if (bet === null || choice === null) {
    res.status(409).json({ error: `Bet must be between ${MIN_BET} and ${Math.min(MAX_BET, character.credits)} credits, and choice must be heads or tails` });
    return;
  }

  const result = flipCoin(bet, choice, Math.random);
  const updated = { ...character, credits: character.credits - bet + result.payout };
  characters.put(updated);
  res.json({ character: characterView(updated), result });
});
