import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, ships, shipClasses } from '../store/collections.js';
import { summarizeFleet } from '../domain/fleet.js';
import { newId } from '../util/ids.js';

export const fleetRouter = Router();
fleetRouter.use(requireAuth);

function shipClassMap() {
  return new Map(shipClasses.all().map((c) => [c.id, c]));
}

fleetRouter.get('/', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;
  const classById = shipClassMap();
  const ownedShips = ships
    .filter((s) => s.ownerCharacterId === character.id)
    .map((s) => ({ ...s, shipClass: classById.get(s.shipClassId) }));
  res.json({ ships: ownedShips, summary: summarizeFleet(ownedShips, classById), catalog: shipClasses.all() });
});

fleetRouter.post('/ships', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { shipClassId } = req.body ?? {};
  const shipClass = typeof shipClassId === 'string' ? shipClasses.get(shipClassId) : undefined;
  if (!shipClass) {
    res.status(404).json({ error: 'Unknown ship class' });
    return;
  }
  if (character.credits < shipClass.price) {
    res.status(409).json({ error: 'Not enough credits' });
    return;
  }
  const ship = ships.put({
    id: newId('ship'),
    ownerCharacterId: character.id,
    shipClassId: shipClass.id,
    name: shipClass.name,
    builtAt: Date.now(),
  });
  const updated = { ...character, credits: character.credits - shipClass.price };
  characters.put(updated);
  res.status(201).json({ ship, character: characterView(updated) });
});
