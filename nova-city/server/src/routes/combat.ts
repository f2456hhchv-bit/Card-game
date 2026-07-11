import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView, characterEffectiveStats, publicCharacterView } from './helpers.js';
import { characters, combatLogs } from '../store/collections.js';
import { hospitalMinutesFor, resolveCombat, salvageCredits } from '../domain/combat.js';
import { applyXp } from '../domain/leveling.js';
import { newId } from '../util/ids.js';
import { sendToUser } from '../ws/manager.js';
import { tickCharacter } from '../domain/regen.js';

export const combatRouter = Router();
combatRouter.use(requireAuth);

const ATTACK_RESOLVE_COST = 20;
const ATTACK_XP = 15;

combatRouter.get('/targets', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const now = Date.now();
  const targets = characters
    .filter((c) => c.userId !== character.userId && c.locationId === character.locationId)
    .map((c) => tickCharacter(c, now))
    .filter((c) => c.status === 'ok')
    .map(publicCharacterView);
  res.json({ targets });
});

combatRouter.post('/:characterId/attack', (req: AuthedRequest, res) => {
  const attacker = requireCharacter(req.userId!, res);
  if (!attacker) return;

  if (attacker.status !== 'ok') {
    res.status(409).json({ error: `You can't attack while ${attacker.status}.` });
    return;
  }
  if (attacker.resources.resolve < ATTACK_RESOLVE_COST) {
    res.status(409).json({ error: 'Not enough Resolve' });
    return;
  }
  const rawTarget = characters.get(req.params.characterId);
  if (!rawTarget || rawTarget.userId === attacker.userId) {
    res.status(404).json({ error: 'Target not found' });
    return;
  }
  const defender = tickCharacter(rawTarget, Date.now());
  if (defender.status !== 'ok') {
    res.status(409).json({ error: `That pilot is currently ${defender.status} and cannot be attacked.` });
    return;
  }

  const attackerStats = characterEffectiveStats(attacker);
  const defenderStats = characterEffectiveStats(defender);
  const outcome = resolveCombat(attackerStats, defenderStats, Math.random);

  const winnerIsAttacker = outcome.winner === 'attacker';
  const loser = winnerIsAttacker ? defender : attacker;
  const winner = winnerIsAttacker ? attacker : defender;
  const salvage = salvageCredits(loser.credits);
  const hospitalMinutes = hospitalMinutesFor(outcome);
  const now = Date.now();

  const leveled = applyXp(attacker.level, attacker.xp, ATTACK_XP);

  const updatedAttacker = {
    ...attacker,
    xp: leveled.xp,
    level: leveled.level,
    resources: { ...attacker.resources, resolve: attacker.resources.resolve - ATTACK_RESOLVE_COST },
    credits: winnerIsAttacker ? attacker.credits + salvage : attacker.credits,
    status: winnerIsAttacker ? attacker.status : ('hospital' as const),
    statusUntil: winnerIsAttacker ? attacker.statusUntil : now + hospitalMinutes * 60_000,
  };
  const updatedDefender = {
    ...defender,
    credits: winnerIsAttacker ? Math.max(0, defender.credits - salvage) : defender.credits + salvage,
    status: winnerIsAttacker ? ('hospital' as const) : defender.status,
    statusUntil: winnerIsAttacker ? now + hospitalMinutes * 60_000 : defender.statusUntil,
    resources: winnerIsAttacker ? { ...defender.resources, health: 0 } : defender.resources,
  };
  const finalAttacker = winnerIsAttacker
    ? updatedAttacker
    : { ...updatedAttacker, resources: { ...updatedAttacker.resources, health: 0 } };

  characters.put(finalAttacker);
  characters.put(updatedDefender);

  const log = combatLogs.put({
    id: newId('combat'),
    attackerId: attacker.id,
    defenderId: defender.id,
    winnerId: winner.id,
    log: outcome.log,
    salvage,
    timestamp: now,
  });

  sendToUser(defender.userId, {
    type: 'attacked',
    attackerCallsign: attacker.callsign,
    won: !winnerIsAttacker,
    log: outcome.log,
  });

  res.json({
    character: characterView(finalAttacker),
    outcome,
    won: winnerIsAttacker,
    salvage,
    hospitalMinutes,
    combatLogId: log.id,
  });
});
