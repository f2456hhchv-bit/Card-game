import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter, characterView } from './helpers.js';
import { characters, items } from '../store/collections.js';
import { sellPrice } from '../domain/market.js';
import { RESOURCE_MAX } from '../domain/regen.js';
import { totalStatPoints } from '../domain/training.js';
import { tradeRank } from '../domain/trade.js';
import type { InventoryStack } from '../types.js';

export const marketRouter = Router();
marketRouter.use(requireAuth);

marketRouter.get('/items', (_req, res) => {
  res.json({ items: items.all() });
});

marketRouter.post('/buy', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { itemId, qty } = req.body ?? {};
  const item = typeof itemId === 'string' ? items.get(itemId) : undefined;
  const quantity = Math.max(1, Math.round(Number(qty) || 1));
  if (!item) {
    res.status(404).json({ error: 'Unknown item' });
    return;
  }
  if (item.requiredTotalStats && totalStatPoints(character.stats) < item.requiredTotalStats) {
    res.status(409).json({
      error: `Requires the ${item.certification} (${item.requiredTotalStats} total trained stats)`,
    });
    return;
  }
  if (item.type === 'contraband' && !tradeRank(character.tradesCompleted).unlocksContraband) {
    res.status(409).json({ error: 'Requires Black Market Contact trade rank' });
    return;
  }
  const cost = item.price * quantity;
  if (character.credits < cost) {
    res.status(409).json({ error: 'Not enough credits' });
    return;
  }

  const now = Date.now();
  let inventory: InventoryStack[];
  if (item.decays) {
    inventory = [...character.inventory, { itemId: item.id, qty: quantity, acquiredAt: now }];
  } else {
    const existing = character.inventory.find((stack) => stack.itemId === item.id);
    inventory = existing
      ? character.inventory.map((s) => (s === existing ? { ...s, qty: s.qty + quantity } : s))
      : [...character.inventory, { itemId: item.id, qty: quantity, acquiredAt: now }];
  }

  const updated = {
    ...character,
    credits: character.credits - cost,
    inventory,
    tradesCompleted: character.tradesCompleted + 1,
  };
  characters.put(updated);
  res.json({ character: characterView(updated) });
});

/** Removes `quantity` of `itemId` from inventory, oldest stacks first (FIFO), without mutating the input. */
function removeFromInventory(
  inventory: InventoryStack[],
  itemId: string,
  quantity: number,
): { remaining: InventoryStack[]; consumed: InventoryStack[] } | null {
  const stacks = inventory
    .filter((s) => s.itemId === itemId)
    .sort((a, b) => a.acquiredAt - b.acquiredAt);
  const totalAvailable = stacks.reduce((sum, s) => sum + s.qty, 0);
  if (totalAvailable < quantity) return null;

  let toRemove = quantity;
  const consumed: InventoryStack[] = [];
  const newQtyByStack = new Map<InventoryStack, number>();
  for (const stack of stacks) {
    if (toRemove <= 0) break;
    const take = Math.min(stack.qty, toRemove);
    consumed.push({ ...stack, qty: take });
    newQtyByStack.set(stack, stack.qty - take);
    toRemove -= take;
  }
  const remaining = inventory
    .map((s) => (newQtyByStack.has(s) ? { ...s, qty: newQtyByStack.get(s)! } : s))
    .filter((s) => s.qty > 0);
  return { remaining, consumed };
}

marketRouter.post('/sell', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { itemId, qty } = req.body ?? {};
  const item = typeof itemId === 'string' ? items.get(itemId) : undefined;
  const quantity = Math.max(1, Math.round(Number(qty) || 1));
  if (!item) {
    res.status(404).json({ error: 'Unknown item' });
    return;
  }

  const now = Date.now();
  const result = removeFromInventory(character.inventory, item.id, quantity);
  if (!result) {
    res.status(409).json({ error: "You don't have that many to sell" });
    return;
  }
  const basePrice = result.consumed.reduce((sum, stack) => sum + sellPrice(item, stack.acquiredAt, now) * stack.qty, 0);
  const proceeds = Math.round(basePrice * (1 + tradeRank(character.tradesCompleted).sellBonusPct));

  const updated = {
    ...character,
    credits: character.credits + proceeds,
    inventory: result.remaining,
    equippedWeaponId: character.equippedWeaponId === item.id ? null : character.equippedWeaponId,
    equippedArmorId: character.equippedArmorId === item.id ? null : character.equippedArmorId,
    tradesCompleted: character.tradesCompleted + 1,
  };
  characters.put(updated);
  res.json({ character: characterView(updated), proceeds });
});

marketRouter.post('/equip', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { itemId } = req.body ?? {};
  const item = typeof itemId === 'string' ? items.get(itemId) : undefined;
  if (!item) {
    res.status(404).json({ error: 'Unknown item' });
    return;
  }
  const owns = character.inventory.some((s) => s.itemId === item.id && s.qty > 0);
  if (!owns) {
    res.status(409).json({ error: "You don't own that item" });
    return;
  }
  if (item.type !== 'weapon' && item.type !== 'armor') {
    res.status(400).json({ error: 'Only weapons and armor can be equipped' });
    return;
  }
  const updated = {
    ...character,
    equippedWeaponId: item.type === 'weapon' ? item.id : character.equippedWeaponId,
    equippedArmorId: item.type === 'armor' ? item.id : character.equippedArmorId,
  };
  characters.put(updated);
  res.json({ character: characterView(updated) });
});

marketRouter.post('/use', (req: AuthedRequest, res) => {
  const character = requireCharacter(req.userId!, res);
  if (!character) return;

  const { itemId } = req.body ?? {};
  const item = typeof itemId === 'string' ? items.get(itemId) : undefined;
  if (!item || item.type !== 'consumable') {
    res.status(400).json({ error: 'That item cannot be used' });
    return;
  }
  const result = removeFromInventory(character.inventory, item.id, 1);
  if (!result) {
    res.status(409).json({ error: "You don't have that item" });
    return;
  }
  const resources = { ...character.resources };
  if (item.healAmount) {
    resources.health = Math.min(RESOURCE_MAX.health, resources.health + item.healAmount);
  }
  if (item.resourceRestore) {
    const key = item.resourceRestore.resource;
    resources[key] = Math.min(RESOURCE_MAX[key], resources[key] + item.resourceRestore.amount);
  }
  const updated = { ...character, resources, inventory: result.remaining };
  characters.put(updated);
  res.json({ character: characterView(updated) });
});
