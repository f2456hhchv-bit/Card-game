import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, factions, factionMessages, factionWars } from '../store/collections.js';
import { newId } from '../util/ids.js';
import { sendToUsers } from '../ws/manager.js';
import { resolveFactionWar, warPayout, WAR_DURATION_MINUTES } from '../domain/factionWar.js';
import type { Faction } from '../types.js';

export const factionRouter = Router();
factionRouter.use(requireAuth);

function memberUserIds(faction: Faction): string[] {
  return faction.memberIds
    .map((id) => characters.get(id)?.userId)
    .filter((id): id is string => Boolean(id));
}

function settleFaction(faction: Faction): Faction {
  const now = Date.now();
  const activeWar = factionWars.find(
    (w) => !w.resolved && (w.factionAId === faction.id || w.factionBId === faction.id),
  );
  if (!activeWar) return faction;
  const resolved = resolveFactionWar(activeWar, now);
  if (resolved.resolved && !activeWar.resolved) {
    factionWars.put(resolved);
    if (resolved.winnerFactionId === faction.id) {
      const payout = warPayout(resolved);
      const updated = { ...faction, bank: faction.bank + payout };
      factions.put(updated);
      sendToUsers(memberUserIds(updated), {
        type: 'faction-war-update',
        factionId: faction.id,
        message: `Your faction won the war and the bank gained ${payout} credits.`,
      });
      return updated;
    }
    sendToUsers(memberUserIds(faction), {
      type: 'faction-war-update',
      factionId: faction.id,
      message: 'Your faction lost the war.',
    });
  }
  return faction;
}

function factionView(faction: Faction, viewerCharacterId: string | null) {
  const isMember = viewerCharacterId !== null && faction.memberIds.includes(viewerCharacterId);
  const war = factionWars.find((w) => !w.resolved && (w.factionAId === faction.id || w.factionBId === faction.id));
  return {
    id: faction.id,
    name: faction.name,
    tag: faction.tag,
    leaderId: faction.leaderId,
    memberCount: faction.memberIds.length,
    memberIds: isMember ? faction.memberIds : undefined,
    bank: isMember ? faction.bank : undefined,
    war: war ? { opponentFactionId: war.factionAId === faction.id ? war.factionBId : war.factionAId, endsAt: war.endsAt } : null,
  };
}

factionRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const all = factions.all().map((f) => settleFaction(f));
  res.json({ factions: all.map((f) => factionView(f, character.factionId)) });
});

factionRouter.post('/create', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  if (character.factionId) {
    res.status(409).json({ error: 'Leave your current faction first' });
    return;
  }
  const { name, tag } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || typeof tag !== 'string' || !tag.trim()) {
    res.status(400).json({ error: 'name and tag are required' });
    return;
  }
  const faction: Faction = {
    id: newId('faction'),
    name: name.trim(),
    tag: tag.trim().toUpperCase().slice(0, 6),
    leaderId: character.id,
    memberIds: [character.id],
    bank: 0,
    createdAt: Date.now(),
  };
  factions.put(faction);
  characters.put({ ...character, factionId: faction.id });
  res.status(201).json({ faction: factionView(faction, character.id) });
});

factionRouter.post('/:factionId/join', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  if (character.factionId) {
    res.status(409).json({ error: 'Leave your current faction first' });
    return;
  }
  const faction = factions.get(req.params.factionId);
  if (!faction) {
    res.status(404).json({ error: 'Faction not found' });
    return;
  }
  const updated = { ...faction, memberIds: [...faction.memberIds, character.id] };
  factions.put(updated);
  characters.put({ ...character, factionId: faction.id });
  res.json({ faction: factionView(updated, character.id) });
});

factionRouter.post('/:factionId/leave', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(409).json({ error: 'You are not in that faction' });
    return;
  }
  const remaining = faction.memberIds.filter((id) => id !== character.id);
  characters.put({ ...character, factionId: null });
  if (remaining.length === 0) {
    factions.delete(faction.id);
  } else {
    const leaderId = faction.leaderId === character.id ? remaining[0] : faction.leaderId;
    factions.put({ ...faction, memberIds: remaining, leaderId });
  }
  res.json({ ok: true });
});

factionRouter.post('/:factionId/bank/deposit', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(409).json({ error: 'You are not in that faction' });
    return;
  }
  const amount = Math.max(1, Math.round(Number(req.body?.amount) || 0));
  if (character.credits < amount) {
    res.status(409).json({ error: 'Not enough credits' });
    return;
  }
  characters.put({ ...character, credits: character.credits - amount });
  const updated = { ...faction, bank: faction.bank + amount };
  factions.put(updated);
  res.json({ faction: factionView(updated, character.id) });
});

factionRouter.post('/:factionId/bank/withdraw', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(409).json({ error: 'You are not in that faction' });
    return;
  }
  if (faction.leaderId !== character.id) {
    res.status(403).json({ error: 'Only the faction leader can withdraw' });
    return;
  }
  const amount = Math.max(1, Math.round(Number(req.body?.amount) || 0));
  if (faction.bank < amount) {
    res.status(409).json({ error: 'The faction bank is short on credits' });
    return;
  }
  const updatedFaction = { ...faction, bank: faction.bank - amount };
  factions.put(updatedFaction);
  const updatedCharacter = { ...character, credits: character.credits + amount };
  characters.put(updatedCharacter);
  res.json({ faction: factionView(updatedFaction, character.id), character: characterView(updatedCharacter) });
});

factionRouter.get('/:factionId/messages', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  if (character.factionId !== req.params.factionId) {
    res.status(403).json({ error: 'You are not in that faction' });
    return;
  }
  const messages = factionMessages
    .filter((m) => m.factionId === req.params.factionId)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(-100);
  res.json({ messages });
});

factionRouter.post('/:factionId/messages', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(403).json({ error: 'You are not in that faction' });
    return;
  }
  const body = typeof req.body?.body === 'string' ? req.body.body.trim().slice(0, 500) : '';
  if (!body) {
    res.status(400).json({ error: 'Message body is required' });
    return;
  }
  const message = factionMessages.put({
    id: newId('fmsg'),
    factionId: faction.id,
    authorId: character.id,
    authorCallsign: character.callsign,
    body,
    createdAt: Date.now(),
  });
  sendToUsers(memberUserIds(faction), {
    type: 'faction-message',
    factionId: faction.id,
    authorCallsign: character.callsign,
    body,
  });
  res.status(201).json({ message });
});

factionRouter.post('/:factionId/war/declare', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(403).json({ error: 'You are not in that faction' });
    return;
  }
  if (faction.leaderId !== character.id) {
    res.status(403).json({ error: 'Only the faction leader can declare war' });
    return;
  }
  const targetFactionId = req.body?.targetFactionId;
  const target = typeof targetFactionId === 'string' ? factions.get(targetFactionId) : undefined;
  if (!target || target.id === faction.id) {
    res.status(404).json({ error: 'Target faction not found' });
    return;
  }
  const existing = factionWars.find(
    (w) => !w.resolved && (w.factionAId === faction.id || w.factionBId === faction.id),
  );
  if (existing) {
    res.status(409).json({ error: 'Your faction is already at war' });
    return;
  }
  const now = Date.now();
  const war = factionWars.put({
    id: newId('war'),
    factionAId: faction.id,
    factionBId: target.id,
    startedAt: now,
    endsAt: now + WAR_DURATION_MINUTES * 60_000,
    contributions: { [faction.id]: 0, [target.id]: 0 },
    resolved: false,
    winnerFactionId: null,
  });
  sendToUsers([...memberUserIds(faction), ...memberUserIds(target)], {
    type: 'faction-war-update',
    factionId: faction.id,
    message: `${faction.name} has declared war on ${target.name}!`,
  });
  res.status(201).json({ war });
});

factionRouter.post('/:factionId/war/contribute', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const faction = factions.get(req.params.factionId);
  if (!faction || character.factionId !== faction.id) {
    res.status(403).json({ error: 'You are not in that faction' });
    return;
  }
  const war = factionWars.find((w) => !w.resolved && (w.factionAId === faction.id || w.factionBId === faction.id));
  if (!war) {
    res.status(409).json({ error: 'Your faction is not at war' });
    return;
  }
  const amount = Math.max(1, Math.min(character.resources.fuel, Math.round(Number(req.body?.amount) || 10)));
  if (character.resources.fuel < amount) {
    res.status(409).json({ error: 'Not enough Fuel' });
    return;
  }
  characters.put({ ...character, resources: { ...character.resources, fuel: character.resources.fuel - amount } });
  const contributions = { ...war.contributions, [faction.id]: (war.contributions[faction.id] ?? 0) + amount };
  factionWars.put({ ...war, contributions });
  res.json({ contributed: amount, totalContribution: contributions[faction.id] });
});
