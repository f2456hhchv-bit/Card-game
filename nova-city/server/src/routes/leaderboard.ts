import { Router } from 'express';
import { requireAuth } from '../auth/middleware.js';
import { characters } from '../store/collections.js';
import { netWorth, characterEffectiveStats } from './helpers.js';
import { combatRating } from '../domain/combat.js';

export const leaderboardRouter = Router();
leaderboardRouter.use(requireAuth);

leaderboardRouter.get('/', (req, res) => {
  const by = typeof req.query.by === 'string' ? req.query.by : 'level';
  const all = characters.all();

  const rows = all.map((c) => ({
    id: c.id,
    callsign: c.callsign,
    level: c.level,
    netWorth: netWorth(c),
    combatRating: Math.round(combatRating(characterEffectiveStats(c))),
  }));

  const sorted =
    by === 'netWorth'
      ? rows.sort((a, b) => b.netWorth - a.netWorth)
      : by === 'combatRating'
        ? rows.sort((a, b) => b.combatRating - a.combatRating)
        : rows.sort((a, b) => b.level - a.level);

  res.json({ leaderboard: sorted.slice(0, 50) });
});
